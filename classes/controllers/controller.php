<?php
class controller
{
    protected $view = null;
    protected $db = null;

    private function db_handle($host, $name, $user, $pass)
    {
        $db = new PDO('mysql:host='.$host.';dbname='.$name, $user, $pass);
        $db->query('SET character_set_connection = utf8');
        $db->query('SET character_set_client = utf8');
        $db->query('SET character_set_results = utf8');
        return $db;
    }

    public function __construct()
    {
        $this->db = $this->db_handle('localhost', 'interview', 'root', 'c2h5oh');
        $this->view = new view();
    }
}