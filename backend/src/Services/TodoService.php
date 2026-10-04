<?php 
require_once __DIR__.'/../Repositories/TodoRepository.php';

class TodoService {
    private $todoRepo;

    public function __construct()
    {
        $this-> todoRepo = new TodoRepository();
    }

    public function getAllTodos($userId){
        $data = $this-> todoRepo-> getAll($userId);

        return $data;
    }

    public function createTodo(array $data){
        $newData = $this-> todoRepo-> create($data);

        return $newData;
    }

    public function deleteTodo($id, $userId){
        $data = $this -> todoRepo -> delete($id, $userId);
        return $data;
    }

    public function update($id, $data, $userId) {
        $updatedTodo = $this -> todoRepo -> update($id, $data, $userId);
        return $updatedTodo;
    }
}

?>