# Indoor-BLE-Positioning-System
Indoor positioning system using a network of 4 ESP32 Bluetooth Low-Energy (BLE) scanners, a [Tile](https://www.thetileapp.com/en-us/) BLE Beacon, and machine learning to identify which room the Tile is in. Each BLE Scanner posts the RSSI signal strength between the beacon and scanner to an [API](https://ble-network-api.azurewebsites.net/). ML algorithm reads these values to get location.
