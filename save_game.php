<?php
header("Content-Type: application/json; charset=UTF-8");
include('../../scripts/connect_db.php');

$jsonGame = json_decode($_GET["game"], false);
$conn = connect_db("mhso_grpro");

if($jsonGame->status == "dead") deleteGame();
else if($jsonGame->id == null) insertValues();
else updateValues();

function insertValues() {
    global $conn, $jsonGame;
    if (!($stmt = $conn->prepare("INSERT INTO mastermind_games(id, name, turn, status, round, repeat_pins, empty_pins) VALUES (?, ?, ?, ?, ?, ?, ?)"))) {
        http_response_code(500);
        echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
    }

    $time = time();
    $id = hash("md5", $time . $jsonGame->name);

    if (!$stmt->bind_param("ssisiii", $id, $jsonGame->name, $jsonGame->turn, $jsonGame->status, $jsonGame->round, $jsonGame->repeat, $jsonGame->empty)) {
        http_response_code(500);
        echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
    }
    
    if (!$stmt->execute()) {
        http_response_code(500);
        echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    }

    echo $id;
}

function updateValues() {
    
}

function deleteGame() {
    
}

?>