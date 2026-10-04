<?php
require_once __DIR__ . '/../Database/Database.php';

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

    public function getAll($id)
    {
        $query = "SELECT * FROM todos WHERE user_id = $1";

        // 3. Gunakan $this->db yang sudah disiapkan di atas
        $result = pg_query_params($this->db, $query, [$id]);

        if (!$result) {
            return [];
        }

        $todos = pg_fetch_all($result);

        if ($todos === false) {
            return [];
        }

        return $todos;
    }

    public function create(array $data)
    {
        // 1 & 2. Ambil user_id dan title dari array
        $userId = $data['user_id'] ?? null;
        $title = $data['title'] ?? null;

        // 3. Buat query INSERT dengan placeholder $1 dan $2
        $query = "INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *";

        // 4 & 5. Gunakan pg_query_params dan masukkan data ke dalam array parameter
        $result = pg_query_params($this->db, $query, [$userId, $title]);

        if (!$result) {
            return null; // Atau tangani error sesuai kebutuhan
        }

        // 6 & 7. Ambil row hasil INSERT (karena pakai RETURNING *, datanya ada 1 baris)
        $todo = pg_fetch_assoc($result);

        // 8. Return Todo tersebut
        return $todo ? $todo : null;
    }

    public function delete($id, $userId)
    {
        $query = "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING * ;";
        $result = pg_query_params($this->db, $query, [$id, $userId]);
        // cek berhasil/gagal
        if (!$result) {
            return [];
        }

        $item = pg_fetch_assoc($result);
        return $item;
    }

    public function update($id, $data, $userId){
        $completed = $data['completed'];
        $query = "UPDATE todos SET completed = $1  WHERE id = $2 AND user_id =$3 RETURNING *;";
        $result = pg_query_params($this->db, $query, [$completed, $id, $userId]);

        if (!$result){
            return false;
        }

        $task = pg_fetch_assoc($result);
        return $task;
    }
}
