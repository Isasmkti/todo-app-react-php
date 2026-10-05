<?php
require_once __DIR__ . '/../Services/UserService.php';



class AuthController
{
    private $userService;

    public function __construct()
    {
        $this->userService = new UserService;
    }

    public function register()
    {
        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");

        $rawInput = file_get_contents('php://input');
        $input = json_decode($rawInput, true);
        // validasi input 
        if (
            !isset($input['name']) ||
            !isset($input['email']) ||
            !isset($input['password']) ||
            trim($input['name']) === '' ||
            trim($input['email']) === '' ||
            trim($input['password']) === ''
        ) {
            http_response_code(400);

            echo json_encode([
                "message" => "Name, email, and password are required"
            ]);

            return;
        }

        $response = $this->userService->createUser($input);

        if ($response && isset($response['error'])) {
            if ($response['error'] === 'email_exists') {
                http_response_code(409);

                echo json_encode([
                    "message" => "Email already registered"
                ]);

                return;
            }
        }

        http_response_code(201);

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

        // 1. JSON valid?
        if (!is_array($input)) {
            http_response_code(400);

            echo json_encode([
                "message" => "Invalid JSON"
            ]);

            return;
        }

        // 2. Field wajib ada?
        if (
            !isset($input['email']) ||
            !isset($input['password'])
        ) {
            http_response_code(400);

            echo json_encode([
                "message" => "Email and password are required"
            ]);

            return;
        }

        // 3. Field tidak boleh kosong
        if (
            trim($input['email']) === '' ||
            trim($input['password']) === ''
        ) {
            http_response_code(400);

            echo json_encode([
                "message" => "Email and password cannot be empty"
            ]);

            return;
        }

        // 4. Cek credential
        $user = $this->userService->login($input);

        if (!$user) {
            http_response_code(401);

            echo json_encode([
                "message" => "Invalid email or password"
            ]);

            return;
        }

        // 5. Buat session
        session_start();

        $_SESSION['user_id'] = $user['id'];

        echo json_encode([
            "data" => $user
        ]);
    }
}
