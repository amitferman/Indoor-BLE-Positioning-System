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

const predictedLocationNames = {
  dining_room_1: "Dining Room 1",
  dining_room_2: "Dining Room 2",
  front_door: "Front Door",
  living_room_1: "Living Room 1",
  living_room_2: "Living Room 2",
  kitchen: "Kitchen"
}

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
  fetch('http://336db732-4020-4a73-9be0-acbed15d4e6f.centralus.azurecontainer.io/score', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(mlRes => {
    const mlResObj = JSON.parse(mlRes);
    res.send(predictedLocationNames[mlResObj.result[0]]);
  });
});

module.exports = app;
