# Indoor-BLE-Positioning-System
Indoor positioning system using a network of 4 [ESP32](https://www.amazon.com/ESP32-WROOM-32-Development-ESP-32S-Bluetooth-Arduino/dp/B084KWNMM4) Bluetooth Low-Energy (BLE) microcontrollers, a [Tile](https://www.thetileapp.com/en-us/) BLE Beacon, and machine learning to identify which room the Tile is in. Each BLE Scanner posts the RSSI signal strength between the beacon and scanner to an API [here](https://ble-network-api.azurewebsites.net/). ML algorithm reads these values to get and post location [here](https://ble-network-location.azurewebsites.net/).

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
