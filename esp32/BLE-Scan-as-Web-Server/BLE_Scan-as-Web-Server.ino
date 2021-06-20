/*
   Based on Neil Kolban example for IDF: https://github.com/nkolban/esp32-snippets/blob/master/cpp_utils/tests/BLE%20Tests/SampleScan.cpp
   Ported to Arduino ESP32 by Evandro Copercini
*/

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <WiFi.h>

// --------------------------------------------------------------------- //

#define LED_BUILTIN   2

// MAC Address of BLE Beacon ("BLE Beacon") as char array
const char* BEACON_MAC = "c4:4f:33:6f:20:3b";
const char* TILE_MAC = "d0:8d:47:4f:49:76";

// RSSI values are initialized to -110 in case no "BLE Beacon" device found
int rssi = 0;

// BLE Scan Time (seconds)
int scanTime = 10;

// Found devices
int numDevices = 0;

// RSSI Readings, set length to 1000 to reserve enough memory
int rssiReadings[1000];

// Wifi configuration
const char* ssid     = "Dlink";
const char* password = "gomanltd";

// Set web server port number to 80
WiFiServer server(80);

// Variable to store the HTTP request
String header;

// Current time
unsigned long currentTime = millis();
// Previous time
unsigned long previousTime = 0;
// Define timeout time in milliseconds (example: 2000ms = 2s)
const long timeoutTime = 2000;



// --------------------------------------------------------------------- //

// Declare BLE Scan Object Pointer
BLEScan* pBLEScan;

// Class for BLE Scanning Callbacks
class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      //Serial.printf("Advertised Device: %s \n", advertisedDevice.toString().c_str());
      if (advertisedDevice.getAddress().toString() == TILE_MAC) {
        rssiReadings[numDevices] = advertisedDevice.getRSSI();
        numDevices++;
        Serial.println("x");
        digitalWrite(LED_BUILTIN, HIGH);
        delay(250);
        digitalWrite(LED_BUILTIN, LOW);
      }
    }
};

// -------------------------------------------------------------------- //

void setup() {
  // set pinmode for built in led
  pinMode(LED_BUILTIN, OUTPUT);
  // set baud rate
  Serial.begin(115200);
  // Initialize web server
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.begin();


}

// ------------------------------------------------------------------- //

// Scans for beacon and sets rssi
void BLEScan() {
  // initialize BLE device and configure callback class, active scan (?), interval, and window
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(100);  // less or equal setInterval value
  pBLEScan->start(scanTime, false);
  pBLEScan->clearResults(); // delete results fromBLEScan buffer to release memory
  BLEDevice::deinit(false); // to improve wifi performance

  // get average of all rssi readings, set to -110 if no readings
  if (numDevices != 0) {
    for (int i = 0; i < numDevices; i++) {
      Serial.printf("cur reading  is %i \n", rssiReadings[i]);
      //Serial.printf("cur rssi  is %i \n", rssi);
      rssi += rssiReadings[i];
    }
    rssi /= numDevices;
  } else {
    rssi = -110;
  }

  Serial.printf("%i \n", rssi);
}

// --------------------------------------------------------------------------- //

void listenForClients() {
  WiFiClient client = server.available();   // Listen for incoming clients

  if (client) {                             // If a new client connects,
    currentTime = millis();
    previousTime = currentTime;
    Serial.println("New Client.");          // print a message out in the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected() && currentTime - previousTime <= timeoutTime) {  // loop while the client's connected
      currentTime = millis();
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        header += c;
        if (c == '\n') {                    // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/plain");
            client.println("Access-Control-Allow-Origin: http://127.0.0.1:5500");
            client.println("Connection: close");
            client.println();

            /*
            // Display the HTML web page
            client.println("<!DOCTYPE html><html>");
            client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
            client.println("<link rel=\"icon\" href=\"data:,\">");
            // CSS to style the on/off buttons
            // Feel free to change the background-color and font-size attributes to fit your preferences
            client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
            client.println(".button { background-color: #4CAF50; border: none; color: white; padding: 16px 40px;");
            client.println("text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}");
            client.println(".button2 {background-color: #555555;}</style></head>");
            */
            BLEScan();
            client.println(String(rssi));
            /*
            // Web Page Heading
            client.println("<body><h1>ESP32 LOC 2 RSSI: " + String(rssi) + "</h1>");
            client.println("</body></html>");
            */
            // The HTTP response ends with another blank line
            client.println();
            // Break out of the while loop
            break;
          } else { // if you got a newline, then clear currentLine
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }
    // Clear the header variable
    header = "";
    // Close the connection
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
}

// --------------------------------------------------------------------------- //
// runs
void loop() {
  numDevices = 0;
  rssi = 0;
  listenForClients();
  delay(100);
}
