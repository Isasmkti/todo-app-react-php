<?php 
require_once '../src/Controllers/TodoController.php';
// method dan path
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

if ($method == 'GET' && $path =='/todos'){
   $todoController = new TodoController;
   $todoController -> getAll();
   exit;
}


?>