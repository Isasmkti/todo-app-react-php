<?php
require_once '../src/Controllers/TodoController.php';
require_once '../src/Controllers/AuthController.php';
// method dan path
$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];


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
};


switch ($method) {
   case 'POST':
      if ($path == '/register') {
         $authController = new AuthController;
         $authController->register();
      }
      break;
};
