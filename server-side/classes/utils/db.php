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

    public static function exec_row($handler, $query, $params) {
        $row = $handler->prepare($query);
        $row->execute($params);
        return $row->fetch(PDO::FETCH_ASSOC);
    }

    public static function last_id($handler) {
        return $handler->lastInsertId();
    }

    public static function begin_transaction($handler) {
        $handler->beginTransaction();
    }
    
    public static function commit($handler) {
        $handler->commit();
    }
}
