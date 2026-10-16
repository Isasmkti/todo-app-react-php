<?php

class CacheService
{
    private $redis;

    public function __construct()
    {
        $this->redis = new Redis();
        
        // 1. Ambil konfigurasi dari .env, gunakan nilai default jika tidak ada
        $host = $_ENV['VALKEY_HOST'] ?? '127.0.0.1';
        
        // 2. SESUAIKAN PORT: Ubah ke 6380 (sesuai docker-compose.yml Anda)
        $port = $_ENV['VALKEY_PORT'] ?? 6380; 

        try {
            $this->redis->connect($host, (int)$port);
        } catch (Exception $e) {
            throw new Exception("Gagal terhubung ke Valkey/Redis: " . $e->getMessage());
        }
    }

    public function set(string $key, string $value, $ttl = 300)
    {
        // setex digunakan untuk menyimpan key dengan waktu kedaluwarsa (TTL)
        return $this->redis->setex($key, $ttl, $value);
    }

    public function get(string $key)
    {
        return $this->redis->get($key);
    }

    public function delete(string $key)
    {
        return $this->redis->del($key);
    }
}
