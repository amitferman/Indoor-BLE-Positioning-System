var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/location', function(req, res, next) {
  fetch("https://ble-network-api.azurewebsites.net/locs")
  .then(response => response.text())
  .then(locs => {
    locs = JSON.parse(locs);
    const data = 
    {
      "data": 
      [
        {
          "BLE_0": locs[0],
          "BLE_1": locs[1],
          "BLE_2": locs[2],
          "BLE_3": locs[3],
          "Column16": "example_value"
        }
      ]
    };
    fetch('http://c4585a85-96a8-4645-8b50-d557a27538df.centralus.azurecontainer.io/score', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(mlRes => {
      const mlResObj = JSON.parse(mlRes);
      res.send(mlResObj.result[0]);
    });
  });
});

module.exports = router;
