<?php
class users_controller extends controller
{
    private $salt = "dffsfsrare2135";

    public function registration_action($params)
    {
        $params = arr::extract($_POST, array('email', 'password'));
        $params['msg'] = "please, sign up";

        if (arr::is_all_values_not_null($params)) {
            $count = db::exec_count($this->db, "SELECT COUNT(*) FROM i_users WHERE email = :email", array(':email' => $params['email']));
            if ($count > 0)
                $params['msg'] = "this email exists";
            else {
                db::exec($this->db, "INSERT INTO i_users (email, password) VALUES(:email, :password)", array(
                    ':email' => $params['email'],
                    ':password' => md5($params['password'] . $this->salt)
                ));
                $params['msg'] = "complete";
            }
        }

        $this->view->render('registration', $params);
    }

    public function login_action($params)
    {
        $params = arr::extract($_POST, array('email', 'password'));
        $params['msg'] = "please, sign in";

        if (arr::is_all_values_not_null($params)) {
            $count = db::exec_count($this->db, "SELECT COUNT(*) FROM i_users WHERE email = :email AND password = :password", array(
                ':email' => $params['email'],
                ':password' => md5($params['password'] . $this->salt)
            ));
            $params['msg'] = $count > 0 ? "complete" : "incorrect";
            if ($params['msg'] == "complete") {
                session_start();
                $_SESSION['loggined'] = true;
                header('Location: /?controller=photos&action=upload');
            }
        }

        $this->view->render('login', $params);
    }
}