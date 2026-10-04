<?php
require_once __DIR__ . '/../Services/UserService.php';

class AuthController {
    private $userService;

    public function __construct()
    {
     $this -> userService = new UserService;   
    }

    public function register(){
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");

        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        $response = $this -> userService -> createUser($input);

        echo json_encode([
            "data" => $response
            ]);
    }
}
?>