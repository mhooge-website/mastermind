function refreshGameList() {
    let searchWindow = document.getElementById("search-game-div");
    var interval = setInterval(() => {
        if(searchWindow.style.display == "none") clearInterval(interval);
        let search = document.getElementById("search-name-input").value;
        if(search == "") search = "all";

    }, 1000);
}

function populateList(search) {
    if(search != "all") {
        search = document.getElementById(search).value;
    }
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        let valid = checkValidity(this);
        if(valid == "wait") return;
        else if(valid == "error") {
            console.log("Error!");
            return;
        }
        else if(this.responseText == "empty") {
            gameListEmpty();
        }
        else createLists(JSON.parse(this.responseText));
    };
    http.open("GET", "/projects/mastermind/load_game.php?search=" + search, true);
    http.send();
}

function gameListEmpty() {
    let listParent = document.getElementById("game-list");
    clearGameList(listParent);

    let emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No active games found :(";

    listParent.appendChild(emptyMessage);
}

function clearGameList(list) {
    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function createLists(results) {
    let listParent = document.getElementById("game-list");
    clearGameList(listParent);

    let headerDiv = document.createElement("div");
    headerDiv.style.borderBottom = "solid";
    headerDiv.className = "search-result-div";

    let labels = ["ID", "Name", "Status", "Round", "Repeat Pins", "Empty Pins", "You Are Mastermind"];

    for(s = 0; s < labels.length; s++) {
        let p = document.createElement("p");
        p.textContent = labels[s];
        headerDiv.appendChild(p);
    }

    listParent.appendChild(headerDiv);

    for(let i = 0; i < results.length; i++) {
        (function() {
            let listDiv = document.createElement("div");
            listDiv.className = "search-result-div";
            
            for(j = 0; j < 7; j++) {
                let p = document.createElement("p");
                if(j != 3 && results[i][j] == 0) {
                    results[i][j] = "No";
                }
                else if(j != 3 && results[i][j] == 1) {
                    results[i][j] = "Yes";
                }
                p.textContent = ""+results[i][j];
                listDiv.appendChild(p);
            }
    
            let joinButton = document.createElement("button");
            joinButton.textContent = "Join";
            joinButton.className = "btn btn-primary";
            joinButton.addEventListener("click", () => { 
                joinLobby(results[i][0]);
            });
            listDiv.appendChild(joinButton);
    
            listParent.appendChild(listDiv);
        })();
    }
}