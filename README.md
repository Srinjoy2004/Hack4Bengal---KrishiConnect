# 🌾 KrishiConnect - Smart Agriculture IoT Platform

**Built with ❤️ by Team The_Debuggers**

KrishiConnect is a full-stack, modular smart farming ecosystem that integrates **IoT hardware**, **machine learning models**, and a **responsive web dashboard** to enable precision agriculture. From soil nutrient detection to real-time climate monitoring and ML-based crop recommendations — it's all-in-one.

---

![image](https://github.com/user-attachments/assets/edd1c068-ebd2-4a7c-912f-b8b671a755bb)


## 📌 Key Highlights

- 🌱 Real-time **Soil & Environmental Monitoring**
- 📊 Live data visualization via a modern web interface
- 🧠 **ML-driven insights** for smart farming
- ☁️ Seamless **cloud connectivity** via MongoDB Atlas
- 🧩 Modular hardware for plug-and-play sensors

---

## 🧑‍💻 Tech Stack

### 🔷 Frontend

| Technology   | Description                              |
|--------------|------------------------------------------|
| **React.js** | Component-based frontend library         |
| **TypeScript** | Strongly typed JavaScript              |
| **Tailwind CSS** | Utility-first CSS for design         |

---

### 🟩 Backend

| Technology     | Role / Usage                                      |
|----------------|---------------------------------------------------|
| **Node.js**    | Server-side runtime                               |
| **Express.js** | REST API creation                                 |
| **MongoDB**    | NoSQL Database                                    |
| **MongoDB Atlas** | Cloud-hosted database                         |
| **Flask**      | Python-based ML endpoints                         |
| **FastAPI**    | High-performance async Python backend for ML APIs |

---

### 🤖 Machine Learning

| Library / Framework   | Usage                                          |
|------------------------|-----------------------------------------------|
| **TensorFlow**         | Deep learning models                          |
| **Scikit-learn**       | Classification, regression, preprocessing     |
| **Python**             | Core ML scripting and API integration         |

---

### 🔗 API Integration

| API         | Purpose                          |
|-------------|----------------------------------|
| **Gemini**  | AI-based knowledge/insight generation (optional feature) |

---

## 🔧 Hardware Tech Stack

### 🧠 Central Processing & Connectivity

| Component          | Details                                                                 |
|--------------------|-------------------------------------------------------------------------|
| **Microcontroller** | ESP32-WROOM-32 Dev Kit V1                                               |
| **Processor**       | Dual-core Xtensa LX6 32-bit                                             |
| **Connectivity**    | Integrated 2.4 GHz Wi-Fi (802.11 b/g/n)                                 |
| **Language**        | Programmed in **C++**                                                   |

---

### 🌱 Sensor Suite & Protocols

| Sensor Type                | Sensor Name                            | Parameters                              | Interface           |
|----------------------------|----------------------------------------|------------------------------------------|---------------------|
| **Soil Multiparameter**    | JXBS-3001-TR                           | Soil pH, EC, Temperature                 | RS485 (Modbus via MAX485) |
| **Macronutrient Sensor**   | RS485 NPK Sensor (3-Prong)             | Nitrogen, Phosphorus, Potassium (NPK)   | RS485 Modbus        |
| **Air Conditions**         | DHT22 / AM2302                         | Air Temperature, Humidity               | 1-Wire Digital       |
| **Soil Moisture Sensor**   | Capacitive Soil Moisture Sensor v1.2   | Volumetric Water Content                | Analog              |

---

### 📟 Local Display & Interface

| Component             | Description                                      |
|------------------------|--------------------------------------------------|
| **OLED Display**       | SSD1306 - 0.96 inch, 128x64 pixels, I2C Interface |

---

### ⚡ Power Management

| Component                     | Description                                             |
|-------------------------------|---------------------------------------------------------|
| **Power Architecture**        | Dual 12V DC input with dedicated voltage regulators     |
| **Voltage Regulators**        | LM2596 (5V), AMS1117 (3.3V)                             |
| **Distribution Board**        | Custom-built board for clean, isolated power delivery   |

---

### 🔩 Assembly & Structure

| Component         | Description                                   |
|-------------------|-----------------------------------------------|
| **Main Board**     | Perfboard with soldered connections           |
| **Connectors**     | Screw terminals, Dupont connectors            |
| **Enclosure**      | Custom protective case for field deployment  |

---

## 📷 Screenshots & Diagrams


![image](https://github.com/user-attachments/assets/99b52b1d-ec06-43f1-a2b7-9a6d1b2e8f33)


---

## 🚀 Features in Development

- 📡 LoRa/Long-range Communication
- 🌐 Offline Data Logging via SD card
- 📱 Mobile App Integration
- 🤖 Crop Disease Prediction using image data

---

## 👥 Team The_Debuggers

| Name           | Role                        |
|----------------|-----------------------------|
| SubhaBilash Das  | Hardware Integration Lead   |
| Arpan Chowdhury  | Front End Developer        |
| Syed Md. Musharraf  | ML/AI Developer             |
| Srinjoy Pramanik  | Cloud & API Integrations    |

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use and build upon it with proper attribution to **Team The_Debuggers**.

---

## 📬 Contact

📧 For collaborations or queries, reach out at:  
[📨 team.the_debuggers@email.com] *(Replace with actual email)*

---
