/*
  EEG_Sensor.ino
  Reads Analog Pin A0 at 250Hz and sends binary packets (Chords Protocol).
  Upload this to the SENSOR Arduino (COM7).
*/

// Protocol Definitions
#define SYNC_BYTE_1 0xC7
#define SYNC_BYTE_2 0x7C
#define END_BYTE 0x01
#define PACKET_LEN                                                             \
  14 // Counter(1) + Data(12) + End(1) = 14 (+2 Sync = 16 total)

// Setup
const int ANALOG_PIN = A0;
unsigned long lastSampleTime = 0;
const unsigned long SAMPLE_INTERVAL_MICROS = 4000; // 250Hz = 4000us

uint8_t packetCounter = 0;

void setup() {
  Serial.begin(230400); // High speed for raw data
  pinMode(ANALOG_PIN, INPUT);
}

void loop() {
  unsigned long now = micros();

  if (now - lastSampleTime >= SAMPLE_INTERVAL_MICROS) {
    lastSampleTime = now;

    // Read Value (0-1023)
    int val = analogRead(ANALOG_PIN);

    // Build Packet
    // [SYNC1, SYNC2, COUNTER, CH1_H, CH1_L, ... zeroes ..., END]

    Serial.write(SYNC_BYTE_1);
    Serial.write(SYNC_BYTE_2);
    Serial.write(packetCounter++);

    // Channel 1 Data (Big Endian or Little Endian? Python parser expects High
    // then Low)
    Serial.write((val >> 8) & 0xFF); // High Byte
    Serial.write(val & 0xFF);        // Low Byte

    // Channels 2-6 (Zeroes)
    for (int i = 0; i < 10; i++) {
      Serial.write(0x00);
    }

    Serial.write(END_BYTE);
  }
}
