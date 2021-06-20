const Joi = require("joi"); // class (uppercase)
const express = require('express'); // object
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let rssiVals = [0, 0, 0, 0];

app.get('/', function (req, res) {
  res.send('Choose endpoint /loc/0, /loc/1, loc/2, or /loc/3 for readings.');
});

app.get('/loc/:id', function (req, res) {
  res.send(rssiVals[parseInt(req.params.id)].toString());
  // res.send(rssiVals[parseInt(req.params.id)]);
  // res.send('loc [' + req.params.id + '] is ' + rssiVals[parseInt(req.params.id)]);
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

module.exports = app;
