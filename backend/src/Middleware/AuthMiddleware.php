<?php 

class AuthMiddleware
{
    public static function userId()
    {
        session_start();

        if(!isset($_SESSION['user_id'])){
            return null;
        }

        return $_SESSION['user_id'];
    }
}