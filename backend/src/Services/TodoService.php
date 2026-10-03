<?php 
require_once __DIR__.'/../Repositories/TodoRepository.php';

class TodoService {
    private $todoRepo;

    public function __construct()
    {
        $this-> todoRepo = new TodoRepository();
    }

    public function getAllTodos(){
        $data = $this-> todoRepo-> getAll();

        return $data;
    }

    public function createTodo(array $data){
        $data['user_id'] = 1;
        $newData = $this-> todoRepo-> create($data);

        return $newData;
    }
}

?>