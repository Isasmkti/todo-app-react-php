<?php
require_once __DIR__.'/../Services/TodoService.php';

class TodoController
{
    public function getAll()
    {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");

        $todoService = new TodoService;
        echo json_encode([
            "data" => $todoService->getAllTodos()
        ]);
    }
}
?>