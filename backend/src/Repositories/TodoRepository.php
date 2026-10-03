<?php
require_once '../src/Database/Database.php';

class TodoRepository
{
    // 1. Buat properti untuk menampung koneksi database
    private $db;

    // 2. Gunakan constructor agar koneksi otomatis dibuat saat class dipanggil
    public function __construct()
    {
        // Asumsikan getConnection() adalah fungsi global dari Database.php
        $this->db = getConnection(); 
    }

    public function getAll()
    {
        $query = "SELECT * FROM todos";
        
        // 3. Gunakan $this->db yang sudah disiapkan di atas
        $result = pg_query($this->db, $query);

        if (!$result) {
            return []; 
        }

        $todos = pg_fetch_all($result);

        if ($todos === false) {
            return [];
        }

        return $todos;
    }

    public function create($data)
    {
        // Contoh jika method create butuh koneksi juga, tinggal pakai $this->db
        $query = "INSERT INTO todos (user_id, title) VALUES ()";

        pg_query($this->db, $query);
    }
}