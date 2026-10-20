import { useCallback, useEffect, useState } from "react";

import { createTodo, deleteTodo, getTodos, updateTodo } from "../api/todo";
import { MAX_TITLE_LENGTH } from "../constants/todo";
import type { Todo } from "../types/todo";
import { getErrorMessage, isCompleted } from "../utils/todo";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
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
      setError(getErrorMessage(err, "Gagal mengambil daftar Todo."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTodos();
  }, [loadTodos]);

  // addTodo & editTodo mengembalikan boolean: true jika berhasil.
  async function addTodo(rawTitle: string) {
    const cleanTitle = rawTitle.trim();

    if (!cleanTitle) {
      setError("Judul Todo tidak boleh kosong.");
      return false;
    }

    if (cleanTitle.length > MAX_TITLE_LENGTH) {
      setError(`Judul maksimal ${MAX_TITLE_LENGTH} karakter.`);
      return false;
    }

    setError("");

    try {
      await createTodo(cleanTitle);
      await loadTodos();
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menambah Todo."));
      return false;
    }
  }

  async function editTodo(id: string, rawTitle: string) {
    const title = rawTitle.trim();

    if (!title) {
      setError("Judul todo tidak boleh kosong");
      return false;
    }

    try {
      setError("");
      await updateTodo(id, { title });
      await loadTodos();
      return true;
    } catch (err) {
      setError(getErrorMessage(err, "Gagal mengedit todo"));
      return false;
    }
  }

  async function toggleTodo(todo: Todo) {
    setError("");

    try {
      await updateTodo(todo.id, { completed: !isCompleted(todo.completed) });
      await loadTodos();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal memperbarui Todo."));
    }
  }

  async function removeTodo(id: string) {
    setError("");

    try {
      await deleteTodo(id);
      await loadTodos();
    } catch (err) {
      setError(getErrorMessage(err, "Gagal menghapus Todo."));
    }
  }

  const clearError = useCallback(() => setError(""), []);

  return {
    todos,
    loading,
    error,
    setError,
    clearError,
    addTodo,
    editTodo,
    toggleTodo,
    removeTodo,
  };
}
