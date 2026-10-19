<?php

// 1. Mundur 2 tingkat untuk menemukan folder 'vendor'
require __DIR__ . '/../../vendor/autoload.php';

// 2. Mundur 2 tingkat untuk menemukan folder tempat file '.env' berada
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..');
$dotenv->load();

function getConnection()
{
    $host = "127.0.0.1";
    $port = "5432";
    $dbname = "todo-app";
    $user = $_ENV['DB_USER'] ?? "todo_user";

    // 1. Mengubah getenv() menjadi $_ENV (Lebih aman dan direkomendasikan phpdotenv)
    $password = $_ENV['DB_PASSWORD'] ?? false;

    if ($password === false || $password === "") {
        throw new Exception("Database password is not configured");
    }

    $escapedPassword = str_replace(
        ["\\", "'"],
        ["\\\\", "\\'"],
        $password
    );
    $connection_string =
        "host=$host port=$port dbname=$dbname user=$user password='$escapedPassword'";

    $koneksi = @pg_connect($connection_string);

    if (!$koneksi) {
        throw new Exception("Database connection failed");
    }

    return $koneksi;
}