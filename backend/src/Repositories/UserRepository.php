<?php
require_once __DIR__ . '/../Database/Database.php';

class UserRepository
{
    private $db;

    // 2. Gunakan constructor agar koneksi otomatis dibuat saat class dipanggil
    public function __construct()
    {
        // Asumsikan getConnection() adalah fungsi global dari Database.php
        $this->db = getConnection();
    }

    public function create(array $data)
    {
        $query = 'INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at;';

        $name = $data['name'];
        $email = $data['email'];
        $password = $data['password'];


        $result = pg_query_params($this->db, $query, [$name, $email, $password]);
         if (!$result) {
            return null; // Atau tangani error sesuai kebutuhan
        };
        $user = pg_fetch_assoc($result);
        return $user;
    }

    public function findByEmail($email) {
        $query = 'SELECT id, name, email, password, created_at 
        FROM users 
        WHERE email = $1';
        $result = pg_query_params($this->db, $query, [$email]);
        $user = pg_fetch_assoc($result);

        return $user;
    }
}
