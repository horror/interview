<?php
class usr {
    public static function id() {
        return json_decode($_SESSION['loggined'], true)['id'];
    }
    
    public static function name() {
        return json_decode($_SESSION['loggined'], true)['name'];
    }
    
    public static function save($params) {
        session_start();
        $_SESSION['loggined'] = json_encode($params);
    }
    
    public static function destroy() {
        session_destroy();
        unset($_SESSION["loggined"]);
    }
}