<?php
session_start();
$_SESSION["user"] = $_POST["input_user"];
$_SESSION["pass"] = $_POST["input_pass"];
?>