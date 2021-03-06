<?php
header("Content-Type: application/json; charset=UTF-8");
include('../../scripts/connect_db.php');

$id = $_POST["id"];
$conn = connect_db("mhso_grpro");

if (!($stmt = $conn->prepare("SELECT result FROM mastermind_results WHERE game_id=? ORDER BY id ASC"))) {
    http_response_code(500);
    echo "Prepare failed: (" . $conn->errno . ") " . $conn->error;
    die;
}

if (!$stmt->bind_param("s", $id)) {
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
    echo "empty";
}
else {
    $val = $res->fetch_all();
    echo json_encode($val);
}
?>