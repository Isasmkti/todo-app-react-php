<?php
require_once __DIR__ . '/../Services/TodoService.php';

class TodoController
{
    private $todoService;
    public function __construct()
    {
        $this->todoService = new TodoService;
    }

    public function getAll()
    {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");

        // $todoService = new TodoService;
        echo json_encode([
            "data" => $this->todoService->getAllTodos()
        ]);
    }

    public function create()
    {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");

        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        $data = [
            "title"=> $input['title']
        ];
        $response = $this->todoService->createTodo($data);

        echo json_encode([
            "data" => $response
        ]);
    }

    public function delete($id){
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");

        $response = $this-> todoService->deleteTodo($id);
        echo json_encode([
            "data" => $response
        ]);
    }
}
