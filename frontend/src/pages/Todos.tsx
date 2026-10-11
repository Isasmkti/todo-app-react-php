import { useCallback, useEffect, useState } from "react";

import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../api/todo";
import { logout } from "../api/auth";

type Todo = {
  id: string;
  user_id: string;
  title: string;
  completed: string | boolean;
  created_at: string;
  updated_at: string;
};

type Props = {
  onLogout: () => void;
};

function isCompleted(value: string | boolean) {
  return value === true || value === "t";
}

export default function Todos({ onLogout }: Props) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [page, setPage] = useState(1);

  function startEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  async function saveEdit(id: string) {
    const title = editingTitle.trim();

    if (!title) {
      setError("Judul todo tidak boleh kosong");
      return;
    }

    try {
      setError("");
      await updateTodo(id, { title });
      setEditingId(null);
      setEditingTitle("");
      await loadTodos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mengedit todo"
      );
    }
  }

  const loadTodos = useCallback(async () => {
    try {
      setError("");

      const result = await getTodos();

      if (!Array.isArray(result)) {
        throw new Error("Format data Todo dari server tidak valid.");
      }

      setTodos(result);
    } catch (err) {
      if (err instanceof Error && err.message) {
        setError(err.message);
      } else {
        setError("Gagal mengambil daftar Todo.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Judul Todo tidak boleh kosong.");
      return;
    }

    if (cleanTitle.length > 50) {
      setError("Judul maksimal 50 karakter.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await createTodo(cleanTitle);
      setTitle("");
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah Todo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(todo: Todo) {
    setError("");

    try {
      await updateTodo(todo.id, {
        completed: !isCompleted(todo.completed),
      });
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui Todo.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Yakin ingin menghapus Todo ini?")) {
      return;
    }

    setError("");

    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus Todo.");
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Logout gagal."
      );
      return;
    }

    onLogout();
  }

  const completedCount = todos.filter((todo) =>
    isCompleted(todo.completed)
  ).length;

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !isCompleted(todo.completed);
    }

    if (filter === "completed") {
      return isCompleted(todo.completed);
    }

    return true;
  });

const itemPerPage = 5;

const totalPages = Math.ceil(filteredTodos.length / itemPerPage);
const currentPage = Math.min(
  page,
  Math.max(totalPages, 1)
);

const firstIndex = (currentPage - 1) * itemPerPage;
const lastIndex = firstIndex + itemPerPage;

const items = filteredTodos.slice(firstIndex, lastIndex);

function nextPage() {
  if (currentPage < totalPages) {
    setPage(currentPage + 1);
  }
}

function prevPage() {
  if (currentPage > 1) {
    setPage(currentPage - 1);
  }
}

  return (
    <main className="todo-page">
      <header className="topbar">
        <div>
          <p className="eyebrow">PERSONAL PRODUCTIVITY</p>
          <h1>My Todos</h1>
        </div>

        <button className="secondary-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="todo-card">
        <div className="todo-summary">
          <div>
            <h2>Daftar tugas</h2>
            <p className="muted">
              {completedCount} dari {todos.length} tugas selesai
            </p>
          </div>

          <span className="count">{todos.length} tugas</span>
        </div>

        <form className="create-form" onSubmit={handleCreate}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            placeholder="Apa yang ingin kamu kerjakan?"
            aria-label="Judul Todo"
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Menambah..." : "+ Tambah"}
          </button>
        </form>

        <div className="todo-filters" aria-label="Filter tugas">
          <button
            type="button"
            className={filter === "all" ? "filter-button active" : "filter-button"}
            onClick={() => {setFilter("all");
              setPage(1);
            }}
          >
            Semua
          </button>

          <button
            type="button"
            className={filter === "active" ? "filter-button active" : "filter-button"}
            onClick={() => {setFilter("active");
              setPage(1);
            }}
          >
            Belum selesai
          </button>

          <button
            type="button"
            className={
              filter === "completed" ? "filter-button active" : "filter-button"
            }
            onClick={() => {setFilter("completed");
              setPage(1);
            }}
          >
            Selesai
          </button>
        </div>

        {error && (
          <div className="error-banner" role="alert">
            {error}
            <button
              type="button"
              className="text-button"
              onClick={() => setError("")}
            >
              Tutup
            </button>
          </div>
        )}

        {loading ? (
          <p className="empty-state">Memuat tugas...</p>
        ) : filteredTodos.length === 0 ? (
          <div className="empty-state">
            <h3>
              {filter === "active"
                ? "Semua tugas sudah selesai"
                : filter === "completed"
                  ? "Belum ada tugas selesai"
                  : "Belum ada tugas"}
            </h3>
            <p>Coba pilih filter lain atau tambahkan tugas baru.</p>
          </div>
        ) : (
          <ul className="todo-list">
            {items.map((todo) => {
              const done = isCompleted(todo.completed);

              return (
                <li className="todo-item" key={todo.id}>
                  <div className="todo-main">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => void handleToggle(todo)}
                      aria-label={`Tandai ${todo.title}`}
                    />

                    {editingId === todo.id ? (
                      <div className="edit-form">
                        <input
                          value={editingTitle}
                          maxLength={50}
                          onChange={(event) =>
                            setEditingTitle(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              void saveEdit(todo.id);
                            }

                            if (event.key === "Escape") {
                              setEditingId(null);
                              setEditingTitle("");
                            }
                          }}
                          aria-label="Edit judul todo"
                          autoFocus
                        />

                        <button
                          type="button"
                          onClick={() => void saveEdit(todo.id)}
                        >
                          Simpan
                        </button>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => {
                            setEditingId(null);
                            setEditingTitle("");
                            setError("");
                          }}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <>
                        <span
                          className={done ? "todo-title done" : "todo-title"}
                        >
                          {todo.title}
                        </span>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => startEdit(todo)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => void handleDelete(todo.id)}
                    aria-label={`Hapus ${todo.title}`}
                  >
                    Hapus
                  </button>
                </li>
              );
            })}
          </ul>
        )}



<div className="pagination">
  <button
    type="button"
    onClick={prevPage}
    disabled={currentPage <= 1}
  >
    Prev
  </button>

  <span>
    Halaman {currentPage} dari {Math.max(totalPages, 1)}
  </span>

  <button
    type="button"
    onClick={nextPage}
    disabled={currentPage >= totalPages}
  >
    Next
  </button>
</div>
        <p className="footer-note">
          Perubahan tersimpan melalui backend PHP dan PostgreSQL.
        </p>
      </section>
    </main>
  );
}