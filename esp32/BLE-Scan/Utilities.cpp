#include <Arduino.h> //needed for Serial.println
#include "Utilities.h"
#define LED_BUILTIN   2

// define network class constructor
Utilities::Utilities() {
}

// define network class member
void Utilities::test() {
  Serial.println("TEST SUCCESSFUL");
}

// 2 seconds of flashing built-in led
void Utilities::flashLots() {
  for (int i = 0; i < 10; i++) {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(100);
    digitalWrite(LED_BUILTIN, LOW);
    delay(100);
  }
}

// parse string data from wordtimeapi for current time's seconds
// TODO: replace with json parsing
int Utilities::parsePayload (String p) {
  String res = "";
  int i = 4;
  while (p.substring(i - 4, i) != "time") {
    ++i;
  }
  i += 19;
  res = res + p.charAt(i);
  res = res + p.charAt(i + 1);
  return res.toInt();
}

// define network object global variable
Utilities utils = Utilities();
