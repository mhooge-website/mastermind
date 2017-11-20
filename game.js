const MASTERMIND_TURN = true;

function createGame() {
    document.getElementById("game-div-mastermind").style.height = (window.innerHeight*0.7) + "px";
    document.getElementById("game-div-guesser").style.height = (window.innerHeight*0.7) + "px";
    if(isMastermind) createMastermindWindow();
    else createGuesserDiv();
    createColorDiv();
    createBWColorDiv();
}

function createMastermindWindow() {
    createRows("m-guesses");
    createRows("m-results");
    createCodeArea();

    swapWindow("pvp-setup-div", "game-div-mastermind");
}

function createGuesserDiv() {
    createRows("g-guesses");
    createRows("g-results");

    swapWindow("pvp-setup-div", "game-div-guesser");
}

function createCodeArea() {
    let row = document.getElementById("m-code-div");
    let button = document.getElementById("code-button");

    for(let i = 0; i < 4; i++) {
        let buttonClone = button.cloneNode();
        row.appendChild(buttonClone);
    }
    row.removeChild(button);
}

function createRows(id) {
    let div = document.getElementById(id+"-div");
    let row = document.getElementById(id+"-row");
    let button = document.getElementById(id+"-button");

    for(let i = 0; i < 10; i++) {
        let rowClone = row.cloneNode();
        for(let j = 0; j < 4; j++) {
            let buttonClone = button.cloneNode();
            rowClone.appendChild(buttonClone);
        }
        div.appendChild(rowClone);
    }
    row.removeChild(button);
    div.removeChild(row);
}

function createColorDiv() {
    let div = document.getElementById("color-all-div");
    var colors = ["black", "white", "red", "green", "blue", "yellow"];

    for(let i = 0; i < 6; i++) {
        let button = document.createElement("button");
        button.style.backgroundColor = colors[i];

        div.appendChild(button);
    }
}

function createBWColorDiv() {
    let div = document.getElementById("color-bw-div");
    var colors = ["black", "white"];

    for(let i = 0; i < 2; i++) {
        let button = document.createElement("button");
        button.style.backgroundColor = colors[i];

        div.appendChild(button);
    }
}

function showColorSelection() {
    let animation = "color-popup-left";
    if(!isMastermind) animation = "color-popup-right";

    document.getElementById("color-all-div").style.animationName = animation;
}

function showBWColorSelection() {
    let animation = "color-popup-right";
    if(!isMastermind) animation = "color-popup-left";

    document.getElementById("color-bw-div") = animation;
}

function hideColorSelection() {
    let animation = "color-popup-right";
    if(!isMastermind) animation = "color-popup-left";

    document.getElementById("color-all-div").style.animationName = animation;
}

function hideBWColorSelection() {
    let animation = "color-popup-left";
    if(!isMastermind) animation = "color-popup-right";

    document.getElementById("color-bw-div") = animation;
}