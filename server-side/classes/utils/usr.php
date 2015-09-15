<?php
class usr {
    public static function id() {
        return isset($_SESSION['loggined']) ? json_decode($_SESSION['loggined'], true)['id'] : exit(1);
    }
    
    public static function name() {
        return isset($_SESSION['loggined']) ? json_decode($_SESSION['loggined'], true)['name'] : exit(1);
    }
    
    public static function init($params) {
        session_start();
        $_SESSION['loggined'] = json_encode($params);
    }
    
    public static function destroy() {
        session_destroy();
        unset($_SESSION["loggined"]);
    }
}