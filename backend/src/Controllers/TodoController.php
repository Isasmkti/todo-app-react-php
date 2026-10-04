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
        session_start();
        $id = $_SESSION['user_id'];
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");

        // $todoService = new TodoService;
        echo json_encode([
            "data" => $this->todoService->getAllTodos($id)
        ]);
    }

    public function create()
    {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");
        session_start();
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        $data = [
            "user_id" => $_SESSION['user_id'],
            "title" => $input['title']
        ];
        $response = $this->todoService->createTodo($data);

        echo json_encode([
            "data" => $response
        ]);
    }

    public function delete($id)
    {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");
        session_start();
        $userId = $_SESSION['user_id'];
        $response = $this->todoService->deleteTodo($id, $userId);
        echo json_encode([
            "data" => $response
        ]);
    }

    public function update($id)
    {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");
        session_start();
        $userId = $_SESSION['user_id'];
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);

        $response = $this->todoService->update($id, $input, $userId);
        echo json_encode([
            "data" => $response
        ]);
    }
}
