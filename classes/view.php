<?php
class view {

    public function render($view, $params = array(), $with_header = false) {
        if ($with_header) {
            include('views/header.php');
        }
        include('views/' . $view . '.php');
    }
}