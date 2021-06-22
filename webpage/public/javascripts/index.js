console.log("works");

const rssi0text = document.getElementById("rssi0");
const rssi1text = document.getElementById("rssi1");
const rssi2text = document.getElementById("rssi2");
const rssi3text = document.getElementById("rssi3");
const skelLoc = document.getElementById("loc-skeleton");
const skel0 = document.getElementById("0-skeleton");
const skel1 = document.getElementById("1-skeleton");
const skel2 = document.getElementById("2-skeleton");
const skel3 = document.getElementById("3-skeleton");
const loctext = document.getElementById("loc-text");
const toggle = document.getElementById("toggle");
const contentDiv = document.getElementById("content-div");

toggle.addEventListener('click', () => {
    if (toggle.style.transform != "rotate3d(1, 0, 0, 180deg)") {
        toggle.style.transform = "rotate3d(1, 0, 0, 180deg)";
        contentDiv.style.height = "50px";
    } else {
        toggle.style.transform = "rotate3d(1, 0, 0, 0deg)";
        contentDiv.style.height = "500px";
    }
    
});

setTimeout( ()=> {
    skelLoc.style.display = "none";
    fetch("https://ble-network-api.azurewebsites.net/predicted-location")
    .then(res => res.text())
    .then(loc => loctext.innerText = loc);
}, 
1000);


setTimeout( ()=> {
    skel0.style.display = "none";
    skel1.style.display = "none";
    skel2.style.display = "none";
    skel3.style.display = "none";
    fetch("https://ble-network-api.azurewebsites.net/locs")
    .then(res => res.json())
    .then(locs => {
        rssi0text.innerText = locs[0];
        rssi1text.innerText = locs[1];
        rssi2text.innerText = locs[2];
        rssi3text.innerText = locs[3];
    });
}, 
1500);