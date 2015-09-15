<?php
class view {

    public function render($view, $params = array()) {
        include('server-side/views/' . $view . '.php');
    }
}