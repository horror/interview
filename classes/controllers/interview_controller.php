<?php
class interview_controller extends controller
{
    public function get_questions_action($params)
    {
        $q = db::exec($this->db, "SELECT id, content FROM i_questions", null);
        $this->view->render('json', $q);
    }
    
    public function get_answers_action($params)
    {
        $a = db::exec($this->db, "SELECT id, question_id, content FROM i_answers", null);
        $this->view->render('json', $a);
    }
    
    public function save_interview_action($params)
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $data['meta'] = arr::extract($data['meta'], ['user_id', 'client', 'date'], 'anonim');
        $data['meta']['date'] = date('Y-m-d H:i:s');
        db::exec($this->db, "INSERT INTO i_interview_meta (date, user_id, client) VALUES(:date, :user_id, :client)", $data['meta']);
        $curr_meta = db::last_id($this->db);
        $interview = $data["interview"];
        foreach ($interview as $i) 
            foreach ($i["answer"] as $a)
                db::exec($this->db, "INSERT INTO i_interview (question_id, answer, meta_id) VALUES(:question_id, :answer, :meta_id)", [
                    ':question_id' => $i["question_id"],
                    ':answer' => $a,
                    ':meta_id' => $curr_meta
                ]);
        
       $this->view->render('json', 'привет');
    }
    
    public function add_question_action($params)
    {
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
    
    public function add_answer_action($params)
    {
        $a = arr::extract($params, ['question_id', 'content', 'type']);
        db::exec($this->db, "INSERT INTO i_answers (question_id, content, type) VALUES(:question_id, :content, :type)", 
            [':question_id' => $a['question_id'], ':content' => $a['content'], ':type' => $a['type']]);
        $curr_a = db::last_id($this->db);
        $this->view->render('json', $curr_a);
    }
}