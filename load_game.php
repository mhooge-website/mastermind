<?php
header("Content-Type: application/json; charset=UTF-8");
include('../../scripts/connect_db.php');

$search = $_GET["search"];

$conn = connect_db("mhso_grpro");

if($search == "all") {
    echo getAllGames();
    die;
}

$results = getResults($search, "WHERE id=?");
if($results != "empty") {
    echo $results;
}
else {
    echo getResults($search, "WHERE name LIKE CONCAT('%',?,'%')");
}

function getAllGames() {
    global $conn;
    
    $res = $conn->query("SELECT id, name, round, status, repeat_pins, empty_pins FROM mastermind_games");
    
    if($res->num_rows == 0) {
        return "empty";
    }
    else {
        $val = $res->fetch_all();
        return json_encode($val);
    }
}

function getResults($search, $where) {
    global $stmt, $conn;
    if (!($stmt = $conn->prepare("SELECT id, name, turn, status, round, repeat_pins, empty_pins, creator_mastermind, code FROM mastermind_games " . $where))) {
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