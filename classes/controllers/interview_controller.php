<?php
class interview_controller extends controller
{
    public function get_questions_action($params)
    {
        $q = db::exec($this->db, "SELECT id, type, content FROM i_questions", null);
        $this->view->render('json', $q);
    }
    
    public function get_answears_action($params)
    {
        $a = db::exec($this->db, "SELECT id, question_id, content FROM i_answears", null);
        $this->view->render('json', $a);
    }
    
    public function save_interview_action($params)
    {
        $request_body = file_get_contents('php://input');
        $this->view->render('json', json_decode($request_body, true));
    }
}