var isMastermind;
var isOnline = false;
var gameId;
var name;
var turn;
var status;
var round;
var repeatPins;
var emptyPins;
var creatorMastermind;
var masterCode;
var autoResults;

const debug = false;

function hideWindow(id) {
    document.getElementById(id).style.display = "none";
}

function showWindow(id) {
    document.getElementById(id).style.display = "block";
}

function swapWindow(oldId, newId) {
    hideWindow(oldId);
    showWindow(newId);
}

function unpackFromJSON(json) {
    let arr = JSON.parse(json);

    gameId = arr[0][0];
    name = arr[0][1];
    status = arr[0][2];
    round = arr[0][3];
    repeatPins = arr[0][4] == 1;
    emptyPins = arr[0][5] == 1;
    autoResults = arr[0][6] == 1;
    creatorMastermind = arr[0][7] == 1;
    masterCode = arr[0][8];
}

function packToJSON() {
    let gameInfo = { "id":gameId, "name":name, "status":status, "round": round, "repeat":repeatPins ? 1 : 0, "empty":emptyPins ? 1 : 0, 
    "autoresults":autoResults ? 1 : 0, "creator":creatorMastermind, "code":masterCode };
    
    return JSON.stringify(gameInfo);
}

function saveGameToDB() {
    let http = prepareSave();
    http.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 500) {
                console.log(this.responseText);
            }
        }
    };
    http.send();
}

function prepareSave() {
    let jsonMsg = packToJSON();

    var http = new XMLHttpRequest();
    http.open("GET", "/projects/mastermind/save_game.php?game=" + jsonMsg, true);

    return http;
}

function prepareLoad(id) {
    var http = new XMLHttpRequest();
    http.open("GET", "/projects/mastermind/load_game.php?search=" + id, true);

    return http;
}

function loadGameFromDB(id) {
    let http = prepareLoad(id);
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error!");
            return;
        }
        else if(this.responseText == "empty") {
            return "empty";
        }

        unpackFromJSON(this.responseText);
    };
    http.send();
}

function checkValidity(http) {
    if(http.readyState != 4) return "wait";
    if(http.status != 200) return "error";
    return null;
}