const Joi = require("joi");
const express = require('express');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');

app.use(cors());
app.use(express.json());

let rssiVals = [0, 0, 0, 0];

app.get('/', function (req, res) {
  res.send('Choose endpoint /locs, /loc/0, /loc/1, loc/2, or /loc/3 for readings.');
});

app.get('/loc/:id', function (req, res) {
  res.send(rssiVals[parseInt(req.params.id)].toString());
});

app.get('/locs', function (req, res) {
  res.send("[" + rssiVals + "]");
});

app.post('/loc/:id', function (req, res) {
  // validation schema
  const schema = Joi.object().keys({
    rssi: Joi.string().required()
  });
  // validate and send 400 (if invalid) or post (if valid)
  Joi.validate(req.body, schema, (err, value) => {
    if (err) {
      res.status(400).send("invalid request schema");
    } else {
      const rssi = req.body.rssi;
      res.send('Got a POST request at /loc with rssi: ' + rssi);
      rssiVals[parseInt(req.params.id)] = rssi;
    }
  });
});

app.get('/predicted-location', function(req, res, next) {
  // define body of POST request to azure ml endpoint
  const data = 
  {
    "data": 
    [
      {
        "BLE_0": rssiVals[0],
        "BLE_1": rssiVals[1],
        "BLE_2": rssiVals[2],
        "BLE_3": rssiVals[3],
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

module.exports = app;
