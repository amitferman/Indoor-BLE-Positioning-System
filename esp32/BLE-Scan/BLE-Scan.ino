#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "Utilities.h"

#define LED_BUILTIN   2

// ble scan config
const char* TILE_MAC = "d0:8d:47:4f:49:76"; // mac address of ble beacon (Tile)
const int scanTime = 10; // BLE Scan Time (seconds)
int cursecond;
int rssi; // signal strength
int numDevices; // devices found in scan
int rssiReadings[1000]; // RSSI Readings, set length to 1000 to reserve enough memory
// wifi config
const char* WIFI_SSID = "Dlink";
const char* WIFI_PASSWORD = "gomanltd";
const char* BLE_NETWORK_API = "https://ble-network-api.azurewebsites.net/loc/2"; // endpoint ble-network-api
const char* WORLD_TIME_API = "https://worldtimeapi.org/api/timezone/America/Vancouver.txt"; // endpoint worldtimeapi
// declare BLE scan pointer
BLEScan* pBLEScan;

extern Utilities utils; // initialize utils object with external linkage
                        // external linkage (extern) specifies that this is defined elsewhere

// BLE Scanning Callbacks
class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
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

void BLEScan() {
  numDevices = 0;
  rssi = 0;
  // initialize BLE device, scan object, and config
  // on each found device, callback onResult() called
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
      rssi += rssiReadings[i];
    }
    rssi /= numDevices;
  } else {
    rssi = -110;
  }
  Serial.printf("%i \n", rssi);
}

void setup() {
  Serial.begin(115200);
  
  utils.test();
  
  pinMode(LED_BUILTIN, OUTPUT);
  

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void post() {
  //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      Serial.println("posting...");
      
      // initialize httpclient
      HTTPClient http;
      
      // specify server endpoint for httpclient
      http.begin(BLE_NETWORK_API);

      // specify content-type header
      http.addHeader("Content-Type", "application/json");

      // scan to update rssi
      BLEScan();
      
      // data to send with HTTP POST
      String httpRequestData = "{\"rssi\":\"" +  String(rssi) +  "\"}";     
            
      // send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);

      // log response code (200 = OK)
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
        
      // free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
}


// makes API request for current time
// TODO (?): add RTC module to esp32 instead of http request
void updateCurSecond() {
  if(WiFi.status()== WL_CONNECTED){
      // initialize httpclient
      HTTPClient http;
      // specify endpoint
      http.begin(WORLD_TIME_API);  
      // send HTTP GET request
      int httpResponseCode = http.GET();
      // get payload from get request
      String payload = http.getString();
      // update global cursecond
      Serial.println(payload);
      if(payload != "") {
        cursecond = utils.parsePayload(payload);
      }
      // log response code (200 = OK)
      Serial.println("CURRENT SECOND: " + String(cursecond));
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
        
      // free resources
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    
}



void loop() {
  // update current second of clock
  updateCurSecond();
  Serial.println("update cur second");
  Serial.println("modulo is " + String(cursecond % 10));

  // at start and middle of every minute, post
  if (cursecond % 30 <= 5) { 
    utils.flashLots();
    post();
  }
}
