<?php
session_start();
$user = htmlspecialchars($_POST["input_pass"]);
$pass = htmlspecialchars($_POST["input_user"]);



if($_POST["check_rmbr"]) {

}
elseif(count($_COOKIE) > 0) {
    setcookie("user", "", time() - 3600);
}

$_SESSION["user"] = $user;
$_SESSION["pass"] = $pass;

function checkIfUserExists() {

}
?>