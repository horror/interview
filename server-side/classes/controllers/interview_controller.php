<?php

class interview_controller extends controller {

    public function get_questions_action($params) {
        $q = db::exec($this->db, "SELECT id, content, category, ordinal FROM i_questions ORDER BY ordinal", null);
        $this->view->render('json', $q);
    }
    
    public function reorder_questions_action($params) {
        $order = $params['order'];
        $idx = 0;
        foreach ($order as $id) {
            db::exec($this->db, "UPDATE i_questions SET ordinal = :ordinal WHERE id = :id", [
                ":ordinal" => ++$idx,
                ":id" => $id,
            ]);
        }
        $this->view->render('json', $order);
    }

    public function get_answers_action($params) {
        $a = db::exec($this->db, "SELECT id, question_id, content FROM i_answers WHERE type = 0", null);
        $this->view->render('json', $a);
    }

    public function save_interview_action($params) {
        $data = json_decode(file_get_contents('php://input'), true);
        $data['meta'] = arr::extract($data['meta'], ['user_id', 'client', 'client_phone', 'calling_date', 'order_no', 'shop', 'answers_type', 'question_categories']);
        $data['meta']['date'] = date('Y-m-d H:i:s');
        $data['meta']['question_categories'] = implode(",", $data['meta']['question_categories']);
        db::exec($this->db, "INSERT INTO i_interview_meta (date, user_id, client, client_phone, calling_date, order_no, shop, answers_type, question_categories) "
                . "VALUES(:date, :user_id, :client, :client_phone, :calling_date, :order_no, :shop, :answers_type, :question_categories)", $data['meta']);
        $curr_meta = db::last_id($this->db);
        $interview = $data["interview"];
        foreach ($interview as $i) {
            if ($i["score"] != null) {
                db::exec($this->db, "INSERT INTO i_interview_scores (question_id, meta_id, score) VALUES(:question_id, :meta_id, :score)", [
                    ':question_id' => $i["question_id"],
                    ':meta_id' => $curr_meta,
                    ':score' => $i["score"],
                ]);
            }
            foreach ($i["answer"] as $a)
                db::exec($this->db, "INSERT INTO i_interview (question_id, answer, meta_id) VALUES(:question_id, :answer, :meta_id)", [
                    ':question_id' => $i["question_id"],
                    ':answer' => $a,
                    ':meta_id' => $curr_meta
                ]);
        }
        $this->view->render('json', $data['meta']);
    }

    public function add_question_action($params) {
        $q = arr::extract($params, ['category', 'content', 'a']);
        db::exec($this->db, "INSERT INTO i_questions (content, category) VALUES(:content, :category)", [':content' => $q['content'], ':category' => $q['category']]);
        $curr_q = db::last_id($this->db);
        if ($q['a'] == null)
            return;
        foreach ($q['a'] as $a)
            db::exec($this->db, "INSERT INTO i_answers (question_id, content) VALUES(:question_id, :content)", [
                ':question_id' => $curr_q,
                ':content' => $a,
            ]);
    }

    public function add_answer_action($params) {
        $a = arr::extract($params, ['question_id', 'content', 'type']);
        db::exec($this->db, "INSERT INTO i_answers (question_id, content, type) VALUES(:question_id, :content, :type)", [':question_id' => $a['question_id'], ':content' => $a['content'], ':type' => $a['type']]);
        $curr_a = db::last_id($this->db);
        $this->view->render('json', $curr_a);
    }

    public function check_access_action($params) {
        $p = arr::extract($params, ['calling_date', 'shop']);
        $p['user_id'] = usr::id();
        $c = db::exec_count($this->db, "SELECT COUNT(*) FROM i_interview_meta WHERE calling_date = :calling_date AND shop = :shop AND user_id != :user_id", $p);
        $this->view->render('json', !$c);
    }

}
