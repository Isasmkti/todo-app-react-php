<?php

class CacheService
{
    private $redis;

    public function __construct()
    {
        $this -> redis = new Redis();
        $this->redis->connect('127.0.0.1', 6379);
    }
}