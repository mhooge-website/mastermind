<?php
header("Content-Type: application/json; charset=UTF-8");
include('../../scripts/connect_db.php');

$jsonGuesses = json_decode($_POST["guess"], false);
$conn = connect_db("mhso_grpro");

if (!($stmt = $conn->prepare("INSERT INTO mastermind_guesses(game_id, guess) VALUES (?, ?)"))) {
    http_response_code(500);
    echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
}

if (!$stmt->bind_param("si", $jsonGuesses->id, $jsonGuesses->guess)) {
    http_response_code(500);
    echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
}

if (!$stmt->execute()) {
    http_response_code(500);
    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
}
?>