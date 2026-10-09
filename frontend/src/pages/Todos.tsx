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
      await updateTodo(todo.id, !isCompleted(todo.completed));
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
        ) : todos.length === 0 ? (
          <div className="empty-state">
            <h3>Belum ada tugas</h3>
            <p>Tambahkan Todo pertamamu di atas.</p>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => {
              const done = isCompleted(todo.completed);

              return (
                <li className="todo-item" key={todo.id}>
                  <label className="todo-label">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => void handleToggle(todo)}
                    />

                    <span className={done ? "todo-title done" : "todo-title"}>
                      {todo.title}
                    </span>
                  </label>

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

        <p className="footer-note">
          Perubahan tersimpan melalui backend PHP dan PostgreSQL.
        </p>
      </section>
    </main>
  );
}