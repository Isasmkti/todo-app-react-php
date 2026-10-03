<?php 
require_once __DIR__.'/../Repositories/TodoRepository.php';

class TodoService {
    public function getAllTodos(){
        $todoRepo = new TodoRepository();
        $data = $todoRepo-> getAll();

        return $data;
    }
}

?>