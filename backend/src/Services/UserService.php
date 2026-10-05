<?php
require_once __DIR__ . '/../Repositories/UserRepository.php';

class UserService
{
    private $userRepo;

    public function __construct()
    {
        $this->userRepo = new UserRepository();
    }


public function createUser(array $data)
{
    $data['password'] = password_hash(
        $data['password'],
        PASSWORD_DEFAULT
    );

    $newUser = $this->userRepo->create($data);

    return $newUser;
}

    function login(array $data)
    {
        $user = $this->userRepo->findByEmail($data['email']);

        if (!$user) {
            return null;
        };

        if (!password_verify($data['password'], $user['password'])) {
            return null;
        }
        unset($user['password']);

        return $user;
    }
}
