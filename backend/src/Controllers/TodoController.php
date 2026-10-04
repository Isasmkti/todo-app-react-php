<?php
require_once __DIR__ . '/../Services/TodoService.php';
require_once __DIR__ . '/../Middleware/AuthMiddleware.php';

class TodoController
{
    private $todoService;
    public function __construct()
    {
        $this->todoService = new TodoService;
    }

    public function getAll()
    {
        $userId = AuthMiddleware::userId();

        if (!$userId) {
            http_response_code(401);

            echo json_encode([
                "message" => "Unauthorized"
            ]);

            return;
        }

        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");

        // $todoService = new TodoService;
        echo json_encode([
            "data" => $this->todoService->getAllTodos($userId)
        ]);
    }

    public function create()
    {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");
        
        $userId = AuthMiddleware::userId();

        if (!$userId) {
            http_response_code(401);

            echo json_encode([
                "message" => "Unauthorized"
            ]);

            return;
        }
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        $data = [
            "user_id" => $userId,
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
        $userId = AuthMiddleware::userId();

        if (!$userId) {
            http_response_code(401);

            echo json_encode([
                "message" => "Unauthorized"
            ]);

            return;
        }
        $response = $this->todoService->deleteTodo($id, $userId);
        echo json_encode([
            "data" => $response
        ]);
    }

    public function update($id)
    {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");
        $userId = AuthMiddleware::userId();

        if (!$userId) {
            http_response_code(401);

            echo json_encode([
                "message" => "Unauthorized"
            ]);

            return;
        }
        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);

        $response = $this->todoService->update($id, $input, $userId);
        echo json_encode([
            "data" => $response
        ]);
    }
}
