/*
 * Combined ESP32 Soil & Environment Monitoring System (Final Version)
 *
 * This sketch reads data from multiple sensors:
 * 1. NPK Sensor: Reads Nitrogen, Phosphorus, Potassium.
 * 2. JXBS-3001-TR Sensor: Reads Soil pH, EC, and Soil Temperature.
 * 3. DHT22 Sensor: Reads Air Temperature and Air Humidity.
 * 4. Capacitive Soil Moisture Sensor: Reads soil moisture percentage.
 *
 * All data is displayed on a local OLED screen and uploaded to a ThingSpeak channel.
 *
 * --- FINAL WIRING CONFIGURATION ---
 *
 * -- NPK Sensor (uses HardwareSerial(1) with custom pins) --
 * ESP32 Pin D2  (GPIO2)  -> MAX485 #1 DI
 * ESP32 Pin D4  (GPIO4)  -> MAX485 #1 RO
 * ESP32 Pin D5  (GPIO5)  -> MAX485 #1 DE & RE
 *
 * -- JXBS-3001-TR Sensor (uses Serial2) --
 * ESP32 Pin D17 (GPIO17) -> MAX485 #2 DI (TX2)
 * ESP32 Pin D16 (GPIO16) -> MAX485 #2 RO (RX2)
 * ESP32 Pin D15 (GPIO15) -> MAX485 #2 DE & RE
 *
 * -- Capacitive Soil Moisture Sensor (NEW) --
 * ESP32 Pin D34 (GPIO34) -> Sensor AOUT (Analog Output)
 * ESP32 3.3V             -> Sensor VCC
 * ESP32 GND              -> Sensor GND
 *
 * -- DHT22 Sensor --
 * ESP32 Pin D23 (GPIO23) -> DHT22 Data Pin
 *
 * -- OLED Display (I2C) --
 * ESP32 Pin D21 (SDA)    -> OLED SDA
 * ESP32 Pin D22 (SCL)    -> OLED SCL
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
String apiKey = "BHLGLXU4FPDWJ9IW"; // Use your correct Write API Key
const char* host = "api.thingspeak.com";
const int httpsPort = 443;

// --- Pin & Sensor Definitions ---
// NPK Sensor
#define NPK_RX_PIN 4
#define NPK_TX_PIN 2
#define NPK_DE_RE_PIN 5
HardwareSerial NPK_SensorSerial(1);

// JXBS-3001-TR Soil Sensor
#define SOIL_RX_PIN 16
#define SOIL_TX_PIN 17
#define SOIL_DE_RE_PIN 15

// DHT22 Air Sensor
#define DHT_PIN 23
#define DHT_TYPE DHT22
DHT dht(DHT_PIN, DHT_TYPE);

// Capacitive Soil Moisture Sensor
#define CAPACITIVE_SOIL_MOISTURE_PIN 34
// *** IMPORTANT: YOU MUST CALIBRATE YOUR SENSOR ***
// 1. Upload code and see what value Serial Monitor shows when sensor is in dry air. This is your DRY value.
// 2. See what value it shows when sensor is fully submerged in water. This is your WET value.
// 3. Replace the example values below with your measured values.
const int SOIL_MOISTURE_DRY = 2800; // Example value, replace with your own
const int SOIL_MOISTURE_WET = 1300; // Example value, replace with your own

// OLED Display
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// --- Modbus Commands ---
const byte nitrogen_request[]   = {0x01, 0x03, 0x00, 0x1e, 0x00, 0x01, 0xe4, 0x0c};
const byte phosphorus_request[] = {0x01, 0x03, 0x00, 0x1f, 0x00, 0x01, 0xb5, 0xcc};
const byte potassium_request[]  = {0x01, 0x03, 0x00, 0x20, 0x00, 0x01, 0x85, 0xc0};
const byte soil_temp_humidity_inquiry[] = {0x01, 0x03, 0x00, 0x12, 0x00, 0x02, 0x64, 0x0E};
const byte soil_ph_inquiry[] = {0x01, 0x03, 0x00, 0x06, 0x00, 0x01, 0x64, 0x0B};
const byte soil_ec_inquiry[] = {0x01, 0x03, 0x00, 0x15, 0x00, 0x01, 0x95, 0xCE};

// --- Global Variables to store sensor data ---
float air_temp = 0.0, air_humidity = 0.0;
float soil_temp = 0.0, soil_ph = 0.0, soil_ec = 0.0, soil_moisture = 0.0;
byte nitrogen = 0, phosphorus = 0, potassium = 0;
bool oled_screen_toggle = true;

void setup() {
  Serial.begin(9600);
  Serial.println("Combined Soil & Environment Monitoring System Initializing...");
  pinMode(NPK_DE_RE_PIN, OUTPUT);
  pinMode(SOIL_DE_RE_PIN, OUTPUT);
  digitalWrite(NPK_DE_RE_PIN, LOW);
  digitalWrite(SOIL_DE_RE_PIN, LOW);
  
  // Set the resolution of the ADC (Analog to Digital Converter)
  analogReadResolution(12); // ESP32 default is 12-bit (0-4095)
  pinMode(CAPACITIVE_SOIL_MOISTURE_PIN, INPUT);
  
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("OLED allocation failed")); for(;;);
  }
  display.clearDisplay(); display.setTextSize(1); display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0); display.println("System Initializing...");
  display.println("Connecting to WiFi..."); display.display();
  
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println("\nWiFi connected!");

  dht.begin();
  NPK_SensorSerial.begin(9600, SERIAL_8N1, NPK_RX_PIN, NPK_TX_PIN);
  Serial2.begin(9600, SERIAL_8N1, SOIL_RX_PIN, SOIL_TX_PIN);
  delay(500); 
}

void loop() {
  readNPK();
  readSoilSensor();
  soil_moisture = readCapacitiveMoisture();
  air_humidity = dht.readHumidity();
  air_temp = dht.readTemperature();

  printAllToSerial();
  updateOLED();
  oled_screen_toggle = !oled_screen_toggle;
  sendAllToCloud();

  delay(20000); 
}

float readCapacitiveMoisture() {
  int rawValue = analogRead(CAPACITIVE_SOIL_MOISTURE_PIN);
  // Use the map function to convert the raw value to a percentage
  // Note: For these sensors, wet value is lower than dry value, so we map from HIGH to LOW.
  int percentage = map(rawValue, SOIL_MOISTURE_DRY, SOIL_MOISTURE_WET, 0, 100);
  
  // Constrain the value to ensure it stays within 0-100%
  if(percentage > 100) {
    percentage = 100;
  }
  if(percentage < 0) {
    percentage = 0;
  }
  return percentage;
}

void readNPK() { /* ... function is unchanged ... */
  byte npk_response[7];
  nitrogen   = readSpecificNutrient(nitrogen_request, sizeof(nitrogen_request), npk_response);
  delay(250);
  phosphorus = readSpecificNutrient(phosphorus_request, sizeof(phosphorus_request), npk_response);
  delay(250);
  potassium  = readSpecificNutrient(potassium_request, sizeof(potassium_request), npk_response);
}

byte readSpecificNutrient(const byte* request, byte req_len, byte* response) { /* ... function is unchanged ... */
  digitalWrite(NPK_DE_RE_PIN, HIGH); delay(20);
  NPK_SensorSerial.write(request, req_len); NPK_SensorSerial.flush();
  digitalWrite(NPK_DE_RE_PIN, LOW); delay(20);
  long start_time = millis();
  while (NPK_SensorSerial.available() < 7) {
    if (millis() - start_time > 1000) { Serial.println("NPK Sensor timeout!"); return 0; }
  }
  for (int i = 0; i < 7; i++) { response[i] = NPK_SensorSerial.read(); }
  return response[4];
}

void readSoilSensor() {
    byte response[9];
    sendSoilRequest(soil_temp_humidity_inquiry, sizeof(soil_temp_humidity_inquiry));
    if (readSoilResponse(response, 9)) {
        // We only care about soil temperature from this reading now
        soil_temp = ((int16_t)((response[5] << 8) | response[6])) / 10.0f;
    }
    delay(1000);
    sendSoilRequest(soil_ph_inquiry, sizeof(soil_ph_inquiry));
    if (readSoilResponse(response, 7)) {
        soil_ph = ((response[3] << 8) | response[4]) / 100.0f;
    }
    delay(1000);
    sendSoilRequest(soil_ec_inquiry, sizeof(soil_ec_inquiry));
    if (readSoilResponse(response, 7)) {
        soil_ec = (response[3] << 8) | response[4];
    }
}

void sendSoilRequest(const byte* request, byte len) { /* ... function is unchanged ... */
  digitalWrite(SOIL_DE_RE_PIN, HIGH); delay(10);
  Serial2.write(request, len); Serial2.flush();
  digitalWrite(SOIL_DE_RE_PIN, LOW);
}

bool readSoilResponse(byte* buffer, byte len) { /* ... function is unchanged ... */
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

uint16_t calculateCRC(const byte* buf, int len) { /* ... function is unchanged ... */
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

void printAllToSerial() {
  Serial.println("\n--- All Sensor Readings ---");
  Serial.printf("Air Temperature:   %.1f *C\n", air_temp);
  Serial.printf("Air Humidity:      %.1f %%\n", air_humidity);
  Serial.printf("Soil Temperature:  %.1f *C\n", soil_temp);
  Serial.printf("Soil Moisture:     %.0f %%\n", soil_moisture);
  Serial.printf("Soil pH:           %.2f\n", soil_ph);
  Serial.printf("Soil EC:           %.0f us/cm\n", soil_ec);
  Serial.printf("Nitrogen (N):      %d mg/kg\n", nitrogen);
  Serial.printf("Phosphorus (P):    %d mg/kg\n", phosphorus);
  Serial.printf("Potassium (K):     %d mg/kg\n", potassium);
  Serial.println("---------------------------");
}

void updateOLED() {
  display.clearDisplay();
  if (oled_screen_toggle) {
    display.setTextSize(2); display.setCursor(0, 0);
    display.printf("N:%d P:%d K:%d", nitrogen, phosphorus, potassium);
    display.drawFastHLine(0, 18, display.width(), SSD1306_WHITE); 
    display.setTextSize(1); display.setCursor(0, 25);
    display.printf("Air Temp: %.1f%cC", air_temp, (char)247);
    display.setCursor(0, 40);
    display.printf("Air Hum:  %.1f%%", air_humidity);
  } else {
    display.setTextSize(2); display.setCursor(0, 0);
    display.printf("pH: %.2f", soil_ph);
    display.setCursor(0, 20);
    display.printf("EC: %.0f", soil_ec);
    display.drawFastHLine(0, 38, display.width(), SSD1306_WHITE);
    display.setTextSize(1); display.setCursor(0, 42);
    display.printf("Soil T: %.1f%cC", soil_temp, (char)247);
    display.setCursor(0, 52);
    display.printf("Moisture: %.0f%%", soil_moisture);
  }
  display.display();
}

void sendAllToCloud() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client; client.setInsecure();
    if (!client.connect(host, httpsPort)) {
      Serial.println("Connection to ThingSpeak failed!"); return;
    }
    String url = "/update?api_key=" + apiKey;
    url += "&field1=" + String(air_temp, 1);
    url += "&field2=" + String(air_humidity, 1);
    url += "&field3=" + String(soil_temp, 1);
    url += "&field4=" + String(soil_moisture, 0); // Replaced soil humidity with moisture
    url += "&field5=" + String(nitrogen);
    url += "&field6=" + String(phosphorus);
    url += "&field7=" + String(potassium);
    url += "&field8=" + String(soil_ph, 2);
    client.print(String("GET ") + url + " HTTP/1.1\r\n" + "Host: " + host + "\r\n" + "Connection: close\r\n\r\n");
    delay(250);
    while (client.available()) { Serial.print(client.readStringUntil('\r')); }
    Serial.println("\nThingSpeak update complete.");
    client.stop();
  } else {
    Serial.println("WiFi Disconnected. Cannot send to cloud.");
  }
}
