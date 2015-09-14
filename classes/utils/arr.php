<?php
class arr {

    public static function extract($array, array $paths, $default = NULL) {
        $found = [];
        foreach ($paths as $path) {
            $found[$path] = isset($array[$path]) ? $array[$path] : $default;
        }
        return $found;
    }
    
    public static function array_to_hash_id($array) {
        $r = [];
        foreach ($array as $i) {
            $r[$i['id']] = $i;
        }
        return $r;
    }

    public static function is_all_values_not_null($array) {
        foreach ($array as $k => $v) {
            if ($v == NULL)
                return false;
        }
        return true;
    }
}