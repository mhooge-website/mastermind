<?php
header("Content-Type: application/json; charset=UTF-8");
include('../../scripts/connect_db.php');

$search = $_GET["search"];

$conn = connect_db("mhso_grpro");

$results = getResultsFromID($search);
if($results != "empty") {
    echo $results;
}
else {
    echo getResultsFromName($search);
}

function getResultsFromID($search) {
    global $stmt, $conn;
    if (!($stmt = $conn->prepare("SELECT id, name, turn, status, round, repeat_pins, empty_pins FROM mastermind_games WHERE id=?"))) {
        http_response_code(500);
        echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
        die;
    }

    bindValues($stmt, $search);
    execute($stmt);
    
    if(!($res = $stmt->get_result())) {
        http_response_code(500);
        echo "Could not get results: (" . $stmt->errno . ") " . $stmt->error;
        die;
    }
    if($res->num_rows == 0) {
        return "empty";
    }
    else {
        $val = $res->fetch_all();
        return json_encode($val);
    }
}

function getResultsFromName($search) {
    global $stmt, $conn;
    if (!($stmt = $conn->prepare("SELECT id, name, turn, status, round, repeat_pins, empty_pins FROM mastermind_games WHERE name LIKE '.$search.'"))) {
        http_response_code(500);
        echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
        die;
    }

    bindValues($stmt, $search);
    execute($stmt);
    
    if(!($res = $stmt->get_result())) {
        http_response_code(500);
        echo "Could not get results: (" . $stmt->errno . ") " . $stmt->error;
        die;
    }
    if($res->num_rows == 0) {
        return "empty";
    }
    else {
        $val = $res->fetch_all();
        return json_encode($val);
    }
}

function bindValues($stmt, $search) {
    if (!$stmt->bind_param("s", $search)) {
        http_response_code(500);
        echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
        die;
    }
}

function execute($stmt) {
    if (!$stmt->execute()) {
        http_response_code(500);
        echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
        die;
    }
}

?>