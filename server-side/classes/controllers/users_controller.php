<?php

class users_controller extends controller {

    private $salt = "dffsfsrare2135";

    public function registration_action($params) {
        $params = arr::extract($params, ['name', 'password']);
        $params['msg'] = "Зарегистрируйтесь";

        if (arr::is_all_values_not_null($params)) {
            $count = db::exec_count($this->db, "SELECT COUNT(*) FROM i_users WHERE name = :name", [':name' => $params['name']]);
            if ($count > 0)
                $params['msg'] = "Такое имя уже существует";
            else {
                db::exec($this->db, "INSERT INTO i_users (name, password) VALUES(:name, :password)", [
                    ':name' => $params['name'],
                    ':password' => md5($params['password'] . $this->salt)
                ]);
                $params['msg'] = "Успешно";
            }
        }

        $this->view->render('json', $params);
    }

    public function login_action($params) {
        $params = arr::extract($params, ['name', 'password']);
        $params['msg'] = "Введите своё имя и пароль";

        if (arr::is_all_values_not_null($params)) {
            $row = db::exec_row($this->db, "SELECT id FROM i_users WHERE name = :name AND password = :password", [
                        ':name' => $params['name'],
                        ':password' => md5($params['password'] . $this->salt)
            ]);
            $params['msg'] = $row ? "complete" : "incorrect";
            if ($params['msg'] == "complete") {
                usr::init([id => $row["id"], name => $params['name']]);
                header('Location: /interview.html#!start/');
            }
        }

        $this->view->render('json', $params);
    }

    public function logout_action() {
        usr::destroy();
        header('Location: /');
    }

    public function get_current_action($params) {
        $result = db::exec_row($this->db, "SELECT id, name FROM i_users WHERE name = :name", [
                    ':name' => usr::name()
        ]);

        $this->view->render('json', $result);
    }

}
