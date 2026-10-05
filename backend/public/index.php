<?php

require_once '../src/Controllers/TodoController.php';
require_once '../src/Controllers/AuthController.php';



try {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

    // method dan path
    $method = $_SERVER['REQUEST_METHOD'];
    $path = $_SERVER['REQUEST_URI'];

    if ($method === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    switch ($method) {

        case 'GET':

            $todoController = new TodoController;
            $todoController->getAll();

            break;

        case 'POST':

            if ($path == '/todos') {

                $todoController = new TodoController;
                $todoController->create();
            }

            if ($path == '/register') {

                $authController = new AuthController;
                $authController->register();
            }

            if ($path == '/login') {

                $authController = new AuthController;
                $authController->login();
            }

            break;

        case 'DELETE':

            $pathId = explode("/", $path);

            $todoController = new TodoController;
            $todoController->delete($pathId[2]);

            break;

        case 'PUT':

            $pathId = explode("/", $path);

            $todoController = new TodoController;
            $todoController->update($pathId[2]);

            break;
    }
} catch (Throwable $e) {

    http_response_code(500);

    header("Content-Type: application/json; charset=UTF-8");

    echo json_encode([
        "message" => "Internal server error"
    ]);
}
