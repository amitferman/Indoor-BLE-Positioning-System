const { text } = require("express");

console.log("works");

const rssi0text = document.getElementById("rssi0");
const rssi1text = document.getElementById("rssi1");
const rssi2text = document.getElementById("rssi2");
const rssi3text = document.getElementById("rssi3");
const loctext = document.getElementById("loc-text");

fetch("https://ble-network-api.azurewebsites.net/predicted-location")
.then(res => res.text())
.then(loc => loctext.innerText = loc);