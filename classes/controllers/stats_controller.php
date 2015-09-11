<?php
class stats_controller extends controller
{
    public function get_interviews_count_action($params)
    {
        $u = arr::extract($params, ['user_id', 'date']);
        $count = db::exec_count($this->db, "SELECT COUNT(*) FROM i_interview_meta WHERE user_id = :user_id AND DATE(calling_date) = :date", $u);
        
        $this->view->render('json', $count);
    }
}