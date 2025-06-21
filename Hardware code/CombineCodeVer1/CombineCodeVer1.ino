/*
 * Combined ESP32 Soil & Environment Monitoring System (Final Version)
 *
 * This sketch reads data from two separate soil sensors and one air sensor:
 * 1. NPK Sensor: Reads Nitrogen, Phosphorus, Potassium.
 * 2. JXBS-3001-TR Sensor: Reads Soil pH, EC, Soil Temperature, and Soil Humidity.
 * 3. DHT22 Sensor: Reads Air Temperature and Air Humidity.
 *
 * All data is displayed on a local OLED screen and uploaded to a ThingSpeak channel.
 *
 * --- FINAL WIRING CONFIGURATION (NPK Pins Unchanged) ---
 *
 * -- NPK Sensor (uses HardwareSerial(1) with custom pins) --
 * ESP32 Pin D2  (GPIO2)  -> MAX485 #1 DI
 * ESP32 Pin D4  (GPIO4)  -> MAX485 #1 RO
 * ESP32 Pin D5  (GPIO5)  -> MAX485 #1 DE & RE
 *
 * -- JXBS-3001-TR Sensor (uses Serial2, DE/RE pin moved) --
 * ESP32 Pin D17 (GPIO17) -> MAX485 #2 DI (TX2)
 * ESP32 Pin D16 (GPIO16) -> MAX485 #2 RO (RX2)
 * ESP32 Pin D15 (GPIO15) -> MAX485 #2 DE & RE  <-- MOVED from D4
 *
 * -- DHT22 Sensor --
 * ESP32 Pin D23 (GPIO23) -> DHT22 Data Pin
 *
 * -- OLED Display (I2C) --
 * ESP32 Pin D21 (SDA)    -> OLED SDA
 * ESP32 Pin D22 (SCL)    -> OLED SCL
 *
 * NOTE: Ensure the grounds of the ESP32, both MAX485 modules, and all sensor
 * power supplies are connected together.
*/

// --- Include Libraries ---
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>

// --- WiFi & ThingSpeak Configuration ---
const char* ssid = "OPPO Reno8 5G";
const char* password = "subhabilash";
String apiKey = "HJ82G5A6AIF0FJLM"; // Use your correct Write API Key
const char* host = "api.thingspeak.com";
const int httpsPort = 443;

// --- Pin & Sensor Definitions ---
// NPK Sensor (on HardwareSerial(1))
#define NPK_RX_PIN 4  // Kept original pin
#define NPK_TX_PIN 2  // Kept original pin
#define NPK_DE_RE_PIN 5 // Kept original pin
HardwareSerial NPK_SensorSerial(1);

// JXBS-3001-TR Soil Sensor (on Serial2)
#define SOIL_RX_PIN 16
#define SOIL_TX_PIN 17
#define SOIL_DE_RE_PIN 15 // Moved to a free pin to resolve conflict
// Serial2 is used by default for this sensor

// DHT22 Air Sensor
#define DHT_PIN 23
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

// OLED Display
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// --- Modbus Command Definitions ---
// For NPK Sensor
const byte nitrogen_request[]   = {0x01, 0x03, 0x00, 0x1e, 0x00, 0x01, 0xe4, 0x0c};
const byte phosphorus_request[] = {0x01, 0x03, 0x00, 0x1f, 0x00, 0x01, 0xb5, 0xcc};
const byte potassium_request[]  = {0x01, 0x03, 0x00, 0x20, 0x00, 0x01, 0x85, 0xc0};

// For JXBS-3001-TR Soil Sensor
const byte soil_temp_humidity_inquiry[] = {0x01, 0x03, 0x00, 0x12, 0x00, 0x02, 0x64, 0x0E};
const byte soil_ph_inquiry[] = {0x01, 0x03, 0x00, 0x06, 0x00, 0x01, 0x64, 0x0B};
const byte soil_ec_inquiry[] = {0x01, 0x03, 0x00, 0x15, 0x00, 0x01, 0x95, 0xCE};

// --- Global Variables to store sensor data ---
float air_temp = 0.0, air_humidity = 0.0;
float soil_temp = 0.0, soil_humidity = 0.0, soil_ph = 0.0, soil_ec = 0.0;
byte nitrogen = 0, phosphorus = 0, potassium = 0;
bool oled_screen_toggle = true; // Used to switch OLED screen

void setup() {
  Serial.begin(9600);
  Serial.println("Combined Soil & Environment Monitoring System Initializing...");

  // --- Initialize Pins ---
  pinMode(NPK_DE_RE_PIN, OUTPUT);
  pinMode(SOIL_DE_RE_PIN, OUTPUT);
  digitalWrite(NPK_DE_RE_PIN, LOW);
  digitalWrite(SOIL_DE_RE_PIN, LOW);

  // --- Initialize OLED ---
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("OLED allocation failed")); for(;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("System Initializing...");
  display.println("Connecting to WiFi...");
  display.display();
  
  // --- Connect to WiFi ---
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  // --- Initialize Sensors ---
  dht.begin();
  NPK_SensorSerial.begin(9600, SERIAL_8N1, NPK_RX_PIN, NPK_TX_PIN);
  Serial2.begin(9600, SERIAL_8N1, SOIL_RX_PIN, SOIL_TX_PIN);
  delay(500); 
}

void loop() {
  // --- Read Data From All Sensors ---
  readNPK();
  readSoilSensor();
  air_humidity = dht.readHumidity();
  air_temp = dht.readTemperature();

  // --- Print All Data to Serial Monitor ---
  printAllToSerial();

  // --- Display Data on OLED (switches screens) ---
  updateOLED();
  oled_screen_toggle = !oled_screen_toggle; // Flip the screen for next loop

  // --- Send Data to ThingSpeak Cloud ---
  sendAllToCloud();

  // Wait 20 seconds for the next cycle
  delay(20000); 
}

// --- Sensor Reading Functions ---

void readNPK() {
  byte npk_response[7];
  nitrogen   = readSpecificNutrient(nitrogen_request, sizeof(nitrogen_request), npk_response);
  delay(250);
  phosphorus = readSpecificNutrient(phosphorus_request, sizeof(phosphorus_request), npk_response);
  delay(250);
  potassium  = readSpecificNutrient(potassium_request, sizeof(potassium_request), npk_response);
}

byte readSpecificNutrient(const byte* request, byte req_len, byte* response) {
  digitalWrite(NPK_DE_RE_PIN, HIGH);
  delay(20);
  NPK_SensorSerial.write(request, req_len);
  NPK_SensorSerial.flush();
  digitalWrite(NPK_DE_RE_PIN, LOW);
  delay(20);

  long start_time = millis();
  while (NPK_SensorSerial.available() < 7) {
    if (millis() - start_time > 1000) { Serial.println("NPK Sensor timeout!"); return 0; }
  }
  for (int i = 0; i < 7; i++) { response[i] = NPK_SensorSerial.read(); }
  return response[4];
}

void readSoilSensor() {
    byte response[9]; // Use larger buffer for temp/humidity response
    
    // Read Temp & Humidity
    sendSoilRequest(soil_temp_humidity_inquiry, sizeof(soil_temp_humidity_inquiry));
    if (readSoilResponse(response, 9)) {
        soil_humidity = ((response[3] << 8) | response[4]) / 10.0f;
        soil_temp = ((int16_t)((response[5] << 8) | response[6])) / 10.0f;
    }
    delay(1000);

    // Read pH
    sendSoilRequest(soil_ph_inquiry, sizeof(soil_ph_inquiry));
    if (readSoilResponse(response, 7)) {
        soil_ph = ((response[3] << 8) | response[4]) / 100.0f;
    }
    delay(1000);

    // Read EC
    sendSoilRequest(soil_ec_inquiry, sizeof(soil_ec_inquiry));
    if (readSoilResponse(response, 7)) {
        soil_ec = (response[3] << 8) | response[4];
    }
}

// --- JXBS-3001-TR Communication Functions ---

void sendSoilRequest(const byte* request, byte len) {
  digitalWrite(SOIL_DE_RE_PIN, HIGH);
  delay(10);
  Serial2.write(request, len);
  Serial2.flush();
  digitalWrite(SOIL_DE_RE_PIN, LOW);
}

bool readSoilResponse(byte* buffer, byte len) {
  long startTime = millis(); byte index = 0;
  while ((millis() - startTime) < 1500) {
    if (Serial2.available()) {
      buffer[index++] = Serial2.read();
      if (index >= len) break;
    }
  }
  if (index < len) { Serial.println("JXBS Sensor timeout."); return false; }
  
  uint16_t calculated_crc = calculateCRC(buffer, len - 2);
  uint16_t received_crc = (buffer[len - 1] << 8) | buffer[len - 2];
  if (calculated_crc == received_crc) return true;
  
  Serial.println("JXBS CRC check failed.");
  return false;
}

uint16_t calculateCRC(const byte* buf, int len) {
  uint16_t crc = 0xFFFF;
  for (int pos = 0; pos < len; pos++) {
    crc ^= (uint16_t)buf[pos];
    for (int i = 8; i != 0; i--) {
      if ((crc & 0x0001) != 0) { crc >>= 1; crc ^= 0xA001; } 
      else { crc >>= 1; }
    }
  }
  return crc;
}

// --- Data Output Functions ---

void printAllToSerial() {
  Serial.println("\n--- All Sensor Readings ---");
  Serial.printf("Air Temperature: %.1f *C\n", air_temp);
  Serial.printf("Air Humidity:    %.1f %%\n", air_humidity);
  Serial.printf("Soil Temperature:%.1f *C\n", soil_temp);
  Serial.printf("Soil Humidity:   %.1f %%\n", soil_humidity);
  Serial.printf("Soil pH:         %.2f\n", soil_ph);
  Serial.printf("Soil EC:         %.0f us/cm\n", soil_ec);
  Serial.printf("Nitrogen (N):    %d mg/kg\n", nitrogen);
  Serial.printf("Phosphorus (P):  %d mg/kg\n", phosphorus);
  Serial.printf("Potassium (K):   %d mg/kg\n", potassium);
  Serial.println("---------------------------");
}

void updateOLED() {
  display.clearDisplay();
  
  if (oled_screen_toggle) {
    // Screen 1: NPK and Air Data
    display.setTextSize(2); 
    display.setCursor(0, 0);
    display.printf("N:%d P:%d K:%d", nitrogen, phosphorus, potassium);
    display.drawFastHLine(0, 18, display.width(), SSD1306_WHITE); 
    display.setTextSize(1);
    display.setCursor(0, 25);
    display.printf("Air Temp: %.1f%cC", air_temp, (char)247);
    display.setCursor(0, 40);
    display.printf("Air Hum:  %.1f%%", air_humidity);
  } else {
    // Screen 2: Soil Conditions
    display.setTextSize(2);
    display.setCursor(0, 0);
    display.printf("pH: %.2f", soil_ph);
    display.setCursor(0, 20);
    display.printf("EC: %.0f", soil_ec);
    display.drawFastHLine(0, 38, display.width(), SSD1306_WHITE);
    display.setTextSize(1);
    display.setCursor(0, 42);
    display.printf("Soil T: %.1f%cC", soil_temp, (char)247);
    display.setCursor(0, 52);
    display.printf("Soil H: %.1f%%", soil_humidity);
  }
  
  display.display();
}

void sendAllToCloud() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure();

    if (!client.connect(host, httpsPort)) {
      Serial.println("Connection to ThingSpeak failed!"); return;
    }
    
    // Construct the URL. Note: ThingSpeak has 8 fields. EC is not sent.
    String url = "/update?api_key=" + apiKey;
    url += "&field1=" + String(air_temp, 1);
    url += "&field2=" + String(air_humidity, 1);
    url += "&field3=" + String(soil_temp, 1);
    url += "&field4=" + String(soil_humidity, 1);
    url += "&field5=" + String(nitrogen);
    url += "&field6=" + String(phosphorus);
    url += "&field7=" + String(potassium);
    url += "&field8=" + String(soil_ph, 2);
    // &fieldX=... for soil_ec is excluded due to the 8-field limit.

    client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: close\r\n\r\n");

    delay(250);
    while (client.available()) {
      String line = client.readStringUntil('\r');
      Serial.print(line);
    }
    Serial.println("\nThingSpeak update complete.");
    client.stop();
  } else {
    Serial.println("WiFi Disconnected. Cannot send to cloud.");
  }
}
