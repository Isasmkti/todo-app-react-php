<?php

require_once __DIR__ . '/src/Services/CacheService.php';

$cache = new CacheService();

$cache->set('test', 'hello');

$value = $cache->get('test');

var_dump($value);