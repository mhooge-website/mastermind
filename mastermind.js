var isMastermind = false;
var isOnline = false;
var id = null;
var name = null;

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

function editGameName() {
    document.getElementById("game-name").readOnly = false;
    let button = document.getElementById("edit-game-name");
    button.textContent = "OK";
    button.addEventListener("click", function(e) {
        button.textContent = "Edit";
        button.removeEventListener(this);
    });
}

function createPVPGame() {

}

function showLogin() {
    
}

function showGameWindow(mastermind) {
    isMastermind = mastermind;
}

