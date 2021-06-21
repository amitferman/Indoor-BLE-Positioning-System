var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

const loc = await fetch("https://ble-network-api.azurewebsites.net/locs")
.then(res => res.json());

const data = 
{
  "data": [
    {
      "BLE_0": loc[0],
      "BLE_1": loc[1],
      "BLE_2": loc[2],
      "BLE_3": loc[3],
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
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('main', { loc: mlResObj.result[0]});
    
  });

 });



module.exports = router;
