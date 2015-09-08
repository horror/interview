<?php
class interview_controller extends controller
{
    public function get_questions_action($params)
    {
        $result = db::exec($this->db, "SELECT id, content FROM i_questions", null);

        $this->view->render('json', $result);
    }
    
}