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
    startWaitAnimation();
}

function startWaitAnimation() {
    let statusLabel = document.getElementById("status-text");
    var dots = 0;
    setInterval(() => {
        statusLabel.innerText = statusLabel.innerText + ".";
        dots++;
        if(dots == 3) {
            statusLabel.innerText = "Status: Waiting for opponent.";
            dots = 0;
        }
    }, 1000);
}

function showLogin() {
    
}

function showGameWindow(mastermind) {
    isMastermind = mastermind;
}

