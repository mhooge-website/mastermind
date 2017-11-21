<?php
header("Content-Type: application/json; charset=UTF-8");
include('../../scripts/connect_db.php');

$id = $_GET["id"];
$conn = connect_db("mhso_grpro");

if (!($stmt = $conn->prepare("SELECT guess FROM mastermind_guesses WHERE game_id=?"))) {
    http_response_code(500);
    echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
    die;
}

if (!$stmt->bind_param("i", $id)) {
    http_response_code(500);
    echo "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
    die;
}

if (!$stmt->execute()) {
    http_response_code(500);
    echo "Execute failed: (" . $stmt->errno . ") " . $stmt->error;
    die;
}

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
?>