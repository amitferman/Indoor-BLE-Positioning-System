var express = require('express');
var router = express.Router();

const data = "{\r\n  \"data\": [\r\n    {\r\n      \"BLE_0\": 0,\r\n      \"BLE_1\": 0,\r\n      \"BLE_2\": 0,\r\n      \"BLE_3\": 0,\r\n      \"Column16\": \"example_value\"\r\n    }\r\n  ]\r\n}";

fetch('http://c4585a85-96a8-4645-8b50-d557a27538df.centralus.azurecontainer.io/score', {
  method: 'POST', // or 'PUT'
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data),
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('main', { loc: data });
    
  });

});



module.exports = router;
