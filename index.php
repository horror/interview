<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
setlocale(LC_ALL, 'ru_RU.UTF-8');

spl_autoload_register(function ($class) {
    $base = "server-side/";

    if (
            file_exists($filename = $base . 'classes/controllers/' . $class . '.php') ||
            file_exists($filename = $base . 'classes/models/' . $class . '.php') ||
            file_exists($filename = $base . 'classes/utils/' . $class . '.php') ||
            file_exists($filename = $base . 'classes/' . $class . '.php')
    )
        include_once $filename;
});

session_start();
if (isset($_GET['controller']) && isset($_GET['action'])) {
    if (!isset($_SESSION['loggined']) && $_GET['controller'] != "users")
        header('Location: /interview.html#!login/');

    if (isset($_SESSION['loggined']) && $_GET['action'] == "login")
        header('Location: /interview.html');

    $controller = $_GET['controller'] . "_controller";
    $action = $_GET['action'] . "_action";
    try {
        (new $controller())->$action($_POST);
    } catch (Exception $e) {
        echo "Controller or action are not exists";
        echo var_dump($e);
    }
} else
    header('Location: /interview.html#!login/');