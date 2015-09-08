<?php
class arr {

    public static function extract($array, array $paths, $default = NULL) {
        $found = array();
        foreach ($paths as $path) {
            $found[$path] = isset($array[$path]) ? $array[$path] : $default;
        }
        return $found;
    }

    public static function is_all_values_not_null($array) {
        foreach ($array as $k => $v) {
            if ($v == NULL)
                return false;
        }
        return true;
    }
}