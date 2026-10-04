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

 public function login()
{
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Origin: *");

    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    $user = $this->userService->login($input);

    if ($user) {
        session_start();

        $_SESSION['user_id'] = $user['id'];

        echo json_encode([
            "data" => $user
        ]);

        return;
    }

    echo json_encode([
        "data" => null
    ]);
}
}
?>