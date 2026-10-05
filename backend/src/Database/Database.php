<?php
function getConnection()
{
    $host     = "localhost";
    $port     = "5432";
    $dbname   = "todo-app"; // Ganti dengan nama database Anda
    $user     = "postgres";
    $password = "admin123";          // Password baru Anda

    // Membuat koneksi menggunakan pg_connect
    $connection_string = "host=$host port=$port dbname=$dbname user=$user password=$password";
    $koneksi = @pg_connect($connection_string);

    // Cek apakah koneksi berhasil
    if (!$koneksi) {
        throw new Exception("Database connection failed");
    }
    return $koneksi;
};
