var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

const data = 
{
  "data": [
    {
      "BLE_0": 0,
      "BLE_1": 0,
      "BLE_2": 0,
      "BLE_3": 0,
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
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('main', { loc: String(mlRes) });
    
  });

 });



module.exports = router;
