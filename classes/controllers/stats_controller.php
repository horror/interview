<?php
class stats_controller extends controller
{
    public function get_interviews_count_action($params)
    {
        $u = arr::extract($params, ['user_id', 'date']);
        $count = db::exec_count($this->db, "SELECT COUNT(*) FROM i_interview_meta WHERE user_id = :user_id AND DATE(calling_date) = :date", $u);
        
        $this->view->render('json', $count);
    }
    
    public function get_interviews_list_action($params)
    {
        $i_meta = db::exec($this->db, "SELECT * FROM i_interview_meta", null);
        $i = arr::array_to_hash_id(db::exec($this->db, "SELECT * FROM i_interview", null));
        $u = arr::array_to_hash_id(db::exec($this->db, "SELECT * FROM i_users", null));
        
        $this->view->render('json', ['interviews_list' => $i_meta, 'interview_logs' => $i, 'users' => $u]);
    }
}