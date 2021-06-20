const dataTable = document.getElementById("data-table");
const newRegionBtn = document.getElementById("new-region-btn");
const newRegionName = document.getElementById("new-region-text");
const collectFiveBtn = document.getElementById("collect-five");
const collectFifteenBtn = document.getElementById("collect-fifteen");
const collectThirtyBtn = document.getElementById("collect-thirty");
const collectFiftyBtn = document.getElementById("collect-fifty");
const queueVal = document.getElementById("queue-val");
let intervalId;
let countLogs = 0;

collectFiveBtn.addEventListener('click', () => {
    collect(5);
})

collectFifteenBtn.addEventListener('click', () => {
    collect(15);
})
collectThirtyBtn.addEventListener('click', () => {
    collect(30);
})

collectFiftyBtn.addEventListener('click', () => {
    collect(50);
})

function collect(n) {
    countLogs += n;
    queueVal.innerText = countLogs;
    startInterval();
}

newRegionName.onkeyup = (e) => {
    if (e.code == "Enter") {
        newRegionName.value = (newRegionName.value.slice(0,-1) + '');
        newRegionBtn.click();
    }
}

window.setInterval(function(){
    queueVal.innerText = countLogs;
    const date = new Date();
    var logDiv = document.getElementById('log-div');
    if (countLogs > 0) {
        logDiv.scrollTop = logDiv.scrollHeight;
    }
    if (countLogs > 0 && date.getSeconds() % 30 == 0) {
        log();
    }
}, 1000);


newRegionBtn.addEventListener('click', () => {
    const row = dataTable.insertRow();
    const rowHeader = row.insertCell();
    rowHeader.innerHTML = newRegionName.value;
    rowHeader.style.fontStyle = "italic";
    rowHeader.colSpan = 5;
    rowHeader.style.lineHeight = "50px";
    rowHeader.style.textAlign = "center";
    rowHeader.style.backgroundColor = "gray";

})


function log() {
    const row = dataTable.insertRow();
    const time = row.insertCell();

    const date = new Date();
    time.innerHTML = date.getSeconds() % 30;
    
    console.log("logging...");
    fetch("https://ble-network-api.azurewebsites.net/locs")
    .then(res => res.json())                                    // asynchroonsly reads and parses response
    .then(res => {
        for (let i = 0; i < 4; i++) {                                                
                console.log(res[i]);
                const c = row.insertCell();
                c.innerHTML = res[i];
            }
    });
    countLogs--;
}