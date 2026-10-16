<?php

// 1. Mundur 2 tingkat untuk menemukan folder 'vendor'
require __DIR__ . '/../../vendor/autoload.php';

// 2. Mundur 2 tingkat untuk menemukan folder tempat file '.env' berada
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..');
$dotenv->load();

function getConnection()
{
    $host = "127.0.0.1";
    $port = "5433";
    $dbname = "todo-app";
    $user = "todo_user";

    // 1. Mengubah getenv() menjadi $_ENV (Lebih aman dan direkomendasikan phpdotenv)
    $password = $_ENV['DB_PASSWORD'] ?? false;

    if ($password === false || $password === "") {
        throw new Exception("Database password is not configured");
    }

    $connection_string =
        "host=$host port=$port dbname=$dbname user=$user password=$password";

    $koneksi = pg_connect($connection_string);

    if (!$koneksi) {
        throw new Exception("Database connection failed");
    }

    return $koneksi;
}