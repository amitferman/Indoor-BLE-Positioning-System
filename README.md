# Indoor-BLE-Positioning-System
Indoor positioning system using a network of 4 [ESP32](https://www.amazon.com/ESP32-WROOM-32-Development-ESP-32S-Bluetooth-Arduino/dp/B084KWNMM4) Bluetooth Low-Energy (BLE) microcontrollers, a [Tile](https://www.thetileapp.com/en-us/) BLE Beacon, and machine learning to identify which room the Tile is in. Each BLE Scanner posts the RSSI signal strength between the beacon and scanner to an API [here](https://ble-network-api.azurewebsites.net/). ML algorithm reads these values to get and post location [here](https://ble-network-location.azurewebsites.net/). 

# Components
- 4 ESP32 microcontrollers (supporting BLE) connected directly to outlets around home. They run /esp32/BLE-Scan/BLE-Scan.ino from Arduino IDE plus esp32/BLE-Scan/Utilities.cpp. They scan every half-minute for 10 seconds according to a real-time API so that they are roughly synchronized. In each BLE Scan, the ESP32 searches for the MAC address of the Tile and POSTs the Received Signal Strength Indicator (RSSI) to the REST API in /api folder. 
- 1 Tile is used to advertise signal periodically. The Tile I used advertised via BLE about every 2 seconds. This required no configuration on my end.
- REST API in /api folder accepts POST requests to update RSSI readings, accepts GET requests to get readings, and accepts GET request to query the Azure ML HTTP endpoint for the predicted location with the POSTed RSSI readings.
- Azure Machine Learning to train model on remote cluster and deploy HTTP endpoint. Note that since BLE is susceptible to interference and obstables, trilateration algorithms for determining the location of a BLE Beacon would likely be unsuitable, so an ML algorithm is the best choice for this scenario.
- API logging webpage (not hosted) to gather data in /api-logging folder. Folder stores webpage code and CSV data files.
- Webpage to display location (hosted on Azure) in /webpage

# ML Algorithm: Voting Ensemble
The algorithm with the highest accuracy (77.6%) was a Voting Ensemble of 7 classification algorithms. 

<ins>Metrics:</ins>
| Accuracy | Macro AUC | Weighted Precision | Weighted Recall | 
|----------|-----------|-----------------|--------------|
| 0.776    | 0.961     | 0.809           | 0.766        | 

In general, 78% of inferences will be correct according to the Accuracy. The dataset was largely balanced, so this metric is quite useful. The high AUC (roughly) suggests the model distinguishes between classes well.

<ins>Confusion Matrix:</ins>
![image](https://user-images.githubusercontent.com/23445218/123035006-761ffa00-d39f-11eb-9ca4-461388f0333c.png)

For every class but "hallway", the model was quite accurate. The precision score for the hallway was 0.6969 - relatively low. The hallway borders several other rooms and is less defined, so it makes sense to have poor performance when the Tile is in the hallways.

# References
This project was inspired by [filipsPL](https://github.com/filipsPL)'s project [Cat-Localizer](https://github.com/filipsPL/cat-localizer) in terms of hardware used and the general idea, but is otherwise entirely my work and code.
, 
