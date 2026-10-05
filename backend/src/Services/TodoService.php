<?php
require_once __DIR__ . '/../Repositories/TodoRepository.php';
require_once __DIR__ . '/CacheService.php';

class TodoService
{
    private $todoRepo;
    private $cache;

    public function __construct()
    {
        $this->todoRepo = new TodoRepository();
        $this->cache = new CacheService();
    }

    public function getAllTodos($userId)
    {
        $key = "todos:user:" . $userId;

        $cachedData = $this->cache->get($key);

        if ($cachedData) {
            return [
                "source" => "cache",
                "data" => json_decode($cachedData, true)
            ];
        }

        $data = $this->todoRepo->getAll($userId);

        $this->cache->set($key, json_encode($data));

        return $data;
    }

    public function createTodo(array $data)
    {
        $newData = $this->todoRepo->create($data);

        if (!$newData) {
            return null;
        }

        $key = "todos:user:" . $data['user_id'];

        $this->cache->delete($key);

        return $newData;
    }

    public function deleteTodo($id, $userId)
    {
        $data = $this->todoRepo->delete($id, $userId);

        if (!$data) {
            return null;
        }

        $key = "todos:user:" . $userId;

        $this->cache->delete($key);

        return $data;
    }

    public function update($id, $data, $userId)
    {
        $updatedTodo = $this->todoRepo->update($id, $data, $userId);
        if (!$updatedTodo) {
            return null;
        }

        $key = "todos:user:" . $userId;

        $this->cache->delete($key);

        return $updatedTodo;
    }
}
