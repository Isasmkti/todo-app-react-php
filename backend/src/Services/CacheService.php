<?php

class CacheService
{
    private $redis;

    public function __construct()
    {
        $this->redis = new Redis();
        $this->redis->connect('127.0.0.1', 6379);
    }

    public function set(string $key, string $value, $ttl = 300)
    {
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