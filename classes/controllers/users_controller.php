<?php
class users_controller extends controller
{
    private $salt = "dffsfsrare2135";

    public function registration_action($params)
    {
        $params = arr::extract($params, ['name', 'password']);
        $params['msg'] = "please, sign up";

        if (arr::is_all_values_not_null($params)) {
            $count = db::exec_count($this->db, "SELECT COUNT(*) FROM i_users WHERE name = :name", [':name' => $params['name']]);
            if ($count > 0)
                $params['msg'] = "this name exists";
            else {
                db::exec($this->db, "INSERT INTO i_users (name, password) VALUES(:name, :password)", [
                    ':name' => $params['name'],
                    ':password' => md5($params['password'] . $this->salt)
                ]);
                $params['msg'] = "complete";
            }
        }

        $this->view->render('registration', $params);
    }

    public function login_action($params)
    {
        $params = arr::extract($params, ['name', 'password']);
        $params['msg'] = "please, sign in";

        if (arr::is_all_values_not_null($params)) {
            $count = db::exec_count($this->db, "SELECT COUNT(*) FROM i_users WHERE name = :name AND password = :password", [
                ':name' => $params['name'],
                ':password' => md5($params['password'] . $this->salt)
            ]);
            $params['msg'] = $count > 0 ? "complete" : "incorrect";
            if ($params['msg'] == "complete") {
                session_start();
                $_SESSION['loggined'] = $params['name'];
                header('Location: /interview.html');
            }
        }

        $this->view->render('login', $params);
    }
    
    public function get_current_action($params)
    {
        $result = db::exec_row($this->db, "SELECT id, name FROM i_users WHERE name = :name", [
            ':name' => $_SESSION['loggined']
        ]);

        $this->view->render('json', $result);
    }
}