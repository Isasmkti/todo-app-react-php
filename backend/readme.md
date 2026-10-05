# Todo List API

Backend REST API untuk aplikasi Todo List dengan autentikasi berbasis PHP Session, PostgreSQL sebagai database utama, dan Valkey sebagai cache/session storage.

## Tech Stack

- PHP 8.5
- PostgreSQL
- Valkey
- phpredis
- PHP Session
- Composer
- Thunder Client / REST Client untuk testing API

---

# Getting Started

## 1. Run PHP Development Server

Jalankan dari folder `backend`:

```bash
php -S localhost:8000 -t public
````

API akan tersedia di:

```text
http://localhost:8000
```

---

# Authentication

Authentication menggunakan **PHP Session**.

Flow:

```text
POST /login
    ↓
UserRepository
    ↓
PostgreSQL
    ↓
password_verify()
    ↓
PHP Session
    ↓
PHPSESSID
    ↓
Valkey
```

Session menyimpan:

```php
$_SESSION['user_id']
```

Kemudian `AuthMiddleware` mengambil `user_id` dari session tersebut.

```text
Request
   ↓
AuthMiddleware
   ↓
PHP Session
   ↓
user_id
```

Jika session tidak ditemukan:

```http
401 Unauthorized
```

---

# Dummy User

Untuk testing login:

```json
{
  "email": "redis@test.com",
  "password": "123456"
}
```

> Gunakan dummy user hanya untuk development/testing.

---

# Cache Architecture

PHP menggunakan extension **phpredis** untuk berkomunikasi dengan Valkey.

```text
PHP
 ↓
phpredis
 ↓
Valkey
```

Valkey digunakan untuk:

* PHP Session storage
* Todo cache

## Session Cache

```text
PHP Session
    ↓
phpredis
    ↓
Valkey
```

Contoh key:

```text
PHPREDIS_SESSION:<session_id>
```

## Todo Cache

Cache Todo dipisahkan berdasarkan `user_id`.

Format key:

```text
todos:user:{user_id}
```

Contoh:

```text
todos:user:4
```

Hal ini memastikan cache antar-user tidak tercampur.

---

# Request Flow

## Register

```text
POST /register
    ↓
AuthController
    ↓
UserService
    ↓
UserRepository
    ↓
PostgreSQL
```

Password tidak disimpan sebagai plaintext.

Password diproses menggunakan:

```php
password_hash()
```

---

## Login

```text
POST /login
    ↓
AuthController
    ↓
UserService
    ↓
UserRepository
    ↓
PostgreSQL
    ↓
password_verify()
    ↓
PHP Session
    ↓
Valkey
```

---

## Get Todos

```text
GET /todos
    ↓
AuthMiddleware
    ↓
user_id dari session
    ↓
TodoService
    ↓
Valkey
```

Jika cache ditemukan:

```text
Valkey
  ↓
cache hit
  ↓
response
```

Jika cache tidak ditemukan:

```text
Valkey
  ↓
cache miss
  ↓
PostgreSQL
  ↓
simpan ke Valkey
  ↓
response
```

---

# Cache Invalidation

Cache Todo akan dihapus ketika data berubah.

## Create

```text
POST /todos
    ↓
PostgreSQL
    ↓
invalidate todos:user:{user_id}
```

## Update

```text
PUT /todos/:id
    ↓
PostgreSQL
    ↓
invalidate todos:user:{user_id}
```

## Delete

```text
DELETE /todos/:id
    ↓
PostgreSQL
    ↓
invalidate todos:user:{user_id}
```

Request `GET /todos` berikutnya akan mengambil data terbaru dari PostgreSQL dan membuat cache baru.

---

# Cache TTL

Todo cache menggunakan TTL selama:

```text
300 seconds
```

atau:

```text
5 minutes
```

Contoh:

```php
setex($key, 300, $value)
```

TTL menjadi lapisan perlindungan tambahan apabila cache tidak berhasil di-invalidate.

Flow:

```text
Mutation
   ↓
invalidate cache
   ↓
GET /todos
   ↓
cache miss
   ↓
PostgreSQL
   ↓
SETEX 300
   ↓
Valkey
```

Jika cache tidak diakses sampai TTL habis:

```text
Valkey
   ↓
5 minutes
   ↓
cache expired
```

---

# User Isolation

Setiap Todo terikat dengan `user_id` dari session.

```text
PHP Session
    ↓
user_id
    ↓
TodoRepository
    ↓
WHERE user_id = session user
```

Contoh:

```sql
WHERE user_id = $1
```

User tidak boleh mendapatkan Todo milik user lain hanya dengan mengganti ID request.

---

# API Endpoints

## Authentication

### Register

```http
POST /register
```

Request:

```json
{
  "name": "Bim",
  "email": "bim@example.com",
  "password": "123456"
}
```

Response:

```text
201 Created
```

### Login

```http
POST /login
```

Request:

```json
{
  "email": "bim@example.com",
  "password": "123456"
}
```

Response:

```text
200 OK
```

---

# Todo

### Get Todos

```http
GET /todos
```

### Create Todo

```http
POST /todos
```

Request:

```json
{
  "title": "Belajar Redis"
}
```

### Update Todo

```http
PUT /todos/:id
```

### Delete Todo

```http
DELETE /todos/:id
```

---

# Validation & HTTP Status

## Register

```text
Input tidak lengkap
→ 400 Bad Request

Email sudah terdaftar
→ 409 Conflict

Register berhasil
→ 201 Created
```

## Login

```text
Input tidak valid
→ 400 Bad Request

Credential salah
→ 401 Unauthorized

Login berhasil
→ 200 OK
```

## Todo

```text
Belum login
→ 401 Unauthorized

Input tidak valid
→ 400 Bad Request

Todo tidak ditemukan
→ 404 Not Found

Request berhasil
→ 200 OK
```

---

# Error Handling

Backend menggunakan global error handling pada `public/index.php`.

Exception yang tidak tertangani akan menghasilkan:

```http
500 Internal Server Error
```

Response:

```json
{
  "message": "Internal server error"
}
```

Detail internal seperti:

* database connection error
* filesystem path
* stack trace
* PostgreSQL error

tidak dikirimkan ke client.

---

# Testing Valkey

Masuk ke Valkey CLI:

```bash
docker exec -it cendekia-cache valkey-cli
```

Test connection:

```text
PING
```

Expected:

```text
PONG
```

Melihat semua key:

```text
KEYS *
```

Contoh:

```text
1) "PHPREDIS_SESSION:<session_id>"
2) "todos:user:4"
```

Melihat TTL Todo cache:

```text
TTL todos:user:4
```

Expected:

```text
(integer) 267
```

Nilai tersebut menunjukkan jumlah detik yang tersisa sebelum cache expired.

Keluar:

```text
exit
```

---

# Architecture

Project menggunakan pemisahan layer:

```text
Request
   ↓
Controller
   ↓
Middleware
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

Untuk caching:

```text
Service
   ↓
CacheService
   ↓
phpredis
   ↓
Valkey
```

Struktur sederhananya:

```text
backend/
├── public/
│   └── index.php
│
├── src/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   └── TodoController.php
│   │
│   ├── Services/
│   │   ├── UserService.php
│   │   ├── TodoService.php
│   │   └── CacheService.php
│   │
│   ├── Repositories/
│   │   ├── UserRepository.php
│   │   └── TodoRepository.php
│   │
│   ├── Middleware/
│   │   └── AuthMiddleware.php
│   │
│   └── Database/
│       └── Database.php
│
└── composer.json
```

---

# Current Status

```text
Authentication
├── Register              ✅
├── Login                 ✅
├── PHP Session           ✅
└── Auth Middleware       ✅

Todo CRUD
├── Create                ✅
├── Read                  ✅
├── Update                ✅
└── Delete                ✅

Database
└── PostgreSQL            ✅

Caching
├── phpredis              ✅
├── Valkey                ✅
├── Session caching       ✅
├── Todo caching          ✅
├── Cache invalidation    ✅
└── TTL                   ✅

Validation
├── 400 Bad Request       ✅
├── 401 Unauthorized      ✅
├── 404 Not Found         ✅
└── 409 Conflict          ✅

Error Handling
└── Global 500 handler    ✅

Frontend
└── React                 🚧
```

---

# Next Step

Backend MVP sudah siap untuk diintegrasikan dengan React.

Next development phase:

```text
PHP REST API
      ↓
React Frontend
      ↓
Login
      ↓
Session / Cookie
      ↓
Todo Dashboard
      ↓
CRUD Todo
```


