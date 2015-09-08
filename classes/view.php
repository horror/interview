<?php
class view {

    public function render($view, $params = array()) {
        include('views/' . $view . '.php');
    }
}