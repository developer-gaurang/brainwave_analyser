/*
 * Yoga AI - Bio Analytics Sensor
 * MAX30100 Heart Rate & SpO2 Monitor
 *
 * This code reads data from the MAX30100 sensor and sends
 * calculated BPM and SpO2 values to the web application
 * via Serial in the format: BPM:75,SpO2:98
 */

#include "MAX30100_PulseOximeter.h"
#include <Wire.h>

#define REPORTING_PERIOD_MS 1000 // Report every 1 second

// Create PulseOximeter object
PulseOximeter pox;

// Timestamp for reporting
uint32_t tsLastReport = 0;

// Callback for beat detection
void onBeatDetected() { Serial.println("BEAT:1"); }

void setup() {
  Serial.begin(115200);
  Serial.println("Initializing MAX30100 Pulse Oximeter...");

  // Initialize the PulseOximeter with default settings
  if (!pox.begin()) {
    Serial.println("FAILED to find MAX30100 sensor");
    Serial.println("Please check wiring and restart");
    while (1)
      ; // Halt execution
  }

  Serial.println("SUCCESS: MAX30100 sensor found");

  // Set IR LED current (higher = better signal, but more power)
  // Options: MAX30100_LED_CURR_7_6MA to MAX30100_LED_CURR_50MA
  pox.setIRLedCurrent(MAX30100_LED_CURR_50MA);

  // Register callback for beat detection
  pox.setOnBeatDetectedCallback(onBeatDetected);

  Serial.println("Place your finger on the sensor...");
}

void loop() {
  // Update sensor readings
  pox.update();

  // Report values every REPORTING_PERIOD_MS
  if (millis() - tsLastReport > REPORTING_PERIOD_MS) {
    // Get calculated values
    float heartRate = pox.getHeartRate();
    uint8_t spo2 = pox.getSpO2();

    // Only send data if we have valid readings
    if (heartRate >= 40 && heartRate <= 200 && spo2 >= 70 && spo2 <= 100) {
      // Send data in the format expected by web app: BPM:75,SpO2:98,IBI:800
      // Note: We'll also calculate a rough IBI based on HR if the library
      // doesn't expose raw peak time
      int ibi = (int)(60000.0 / heartRate);

      Serial.print("BPM:");
      Serial.print(heartRate, 0);
      Serial.print(",SpO2:");
      Serial.print(spo2);
      Serial.print(",IBI:");
      Serial.println(ibi);
    } else {
      Serial.println("BPM:0,SpO2:0,IBI:0");
    }

    tsLastReport = millis();
  }
}
