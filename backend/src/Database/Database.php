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
    $koneksi = pg_connect($connection_string);

    // Cek apakah koneksi berhasil
    if (!$koneksi) {
        // Tangkap pesan error asli dari PostgreSQL
        // kita bisa memanggil pg_last_error() tanpa argumen untuk mengambil pesan error dari koneksi terakhir
        $pesan_error = pg_last_error(null);
        throw new Exception("Error: " . $pesan_error);
    }



    
    return $koneksi;
};
