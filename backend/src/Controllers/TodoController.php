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


        // $todoService = new TodoService;
        echo json_encode([
            "data" => $this->todoService->getAllTodos($userId)
        ]);
    }

    public function create()
    {
        header("Content-Type: application/json; charset=UTF-8");


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



        if (!isset($input['title']) || trim($input['title']) === '') {
            http_response_code(400);

            echo json_encode([
                "message" => "Title is required"
            ]);

            return;
        }

        if (trim($input['title']) === '') {
            http_response_code(400);

            echo json_encode([
                "message" => "Title cannot be empty"
            ]);

            return;
        }

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
        $userId = AuthMiddleware::userId();

        if (!$userId) {
            http_response_code(401);

            echo json_encode([
                "message" => "Unauthorized"
            ]);

            return;
        }
        $response = $this->todoService->deleteTodo($id, $userId);

        if (!$response) {
            http_response_code(404);

            echo json_encode([
                "message" => "Todo not found"
            ]);

            return;
        }

        echo json_encode([
            "data" => $response
        ]);
    }

    public function update($id)
{
    header("Content-Type: application/json; charset=UTF-8");

    $userId = AuthMiddleware::userId();

    if (!$userId) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
        return;
    }

    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid JSON body"]);
        return;
    }

    // Validasi title jika dikirim
    if (array_key_exists('title', $input)) {
        if (
            !is_string($input['title']) ||
            trim($input['title']) === ''
        ) {
            http_response_code(400);
            echo json_encode([
                "message" => "title must be a non-empty string"
            ]);
            return;
        }

        $input['title'] = trim($input['title']);
    }

    // Validasi completed jika dikirim
    if (
        array_key_exists('completed', $input) &&
        !is_bool($input['completed'])
    ) {
        http_response_code(400);
        echo json_encode([
            "message" => "completed must be a boolean"
        ]);
        return;
    }

    // Harus ada setidaknya satu kolom yang ingin diubah
    if (
        !array_key_exists('title', $input) &&
        !array_key_exists('completed', $input)
    ) {
        http_response_code(400);
        echo json_encode([
            "message" => "Provide title or completed"
        ]);
        return;
    }

    $response = $this->todoService->update($id, $input, $userId);

    if (!$response) {
        http_response_code(404);
        echo json_encode(["message" => "Todo not found"]);
        return;
    }

    echo json_encode(["data" => $response]);
}
}
