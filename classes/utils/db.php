<?php
class db {
    public static function exec($handler, $query, $params) {
        $row = $handler->prepare($query);
        $row->execute($params);
        return $row->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public static function exec_count($handler, $query, $params) {
        $row = $handler->prepare($query);
        $row->execute($params);
        return $row->fetch()[0];
    }
}