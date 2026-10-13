<?php

function getConnection()
{
    $host = "127.0.0.1";
    $port = "5433";
    $dbname = "todo-app";
    $user = "todo_user";

    // Ambil password dari environment variable
    $password = getenv("DB_PASSWORD");

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