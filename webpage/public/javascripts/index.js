console.log("works");

const rssi0text = document.getElementById("rssi0");
const rssi1text = document.getElementById("rssi1");
const rssi2text = document.getElementById("rssi2");
const rssi3text = document.getElementById("rssi3");
const loctext = document.getElementById("loc-text");
const toggle = document.getElementById("toggle");

toggle.addEventListener('click', () => {
    toggle.style.transform = "rotate3d(1, 0, 0, 180deg)";
});

fetch("https://ble-network-api.azurewebsites.net/predicted-location")
.then(res => res.text())
.then(loc => loctext.innerText = loc);

fetch("https://ble-network-api.azurewebsites.net/locs")
.then(res => res.json())
.then(locs => {
    rssi0text.innerText = locs[0];
    rssi1text.innerText = locs[1];
    rssi2text.innerText = locs[2];
    rssi3text.innerText = locs[3];
});