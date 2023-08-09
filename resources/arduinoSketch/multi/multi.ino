#include <ArduinoJson.h>
StaticJsonDocument<128> doc;

String input;

float temperature = 25.0;
int light = 400;
int humid = 36;

void setup()
{
  Serial.begin(9600);
  doc["device"] = "lab_arduino_2";
  serializeJson(doc, Serial);
  Serial.println();
}

void loop()
{
  if (Serial.available())
  {
    temperature++;
    humid++;
    light++;
    input = Serial.readStringUntil('\n');
    doc["device"] = "lab_arduino_2";
    doc["temperature_c"] = temperature;
    doc["temperature_f"] = (temperature * 9.0) / 5.0 + 32.0;
    doc["humidity"] = humid;
    doc["photo_resistor"] = light;
    serializeJson(doc, Serial);
    Serial.println();
  }
}
