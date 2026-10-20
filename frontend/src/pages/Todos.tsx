import { useState } from "react";

import { logout } from "../api/auth";
import ErrorBanner from "../components/ErrorBanner";
import Pagination from "../components/Pagination";
import TodoFilters from "../components/TodoFilters";
import TodoForm from "../components/TodoForm";
import TodoHeader from "../components/TodoHeader";
import TodoList from "../components/TodoList";
import TodoSummary from "../components/TodoSummary";
import { ITEMS_PER_PAGE } from "../constants/todo";
import { usePagination } from "../hooks/usePagination";
import { useTodos } from "../hooks/useTodos";
import type { TodoFilter } from "../types/todo";
import { filterTodos, getErrorMessage, isCompleted } from "../utils/todo";

type Props = {
  onLogout: () => void;
};

export default function Todos({ onLogout }: Props) {
  const {
    todos,
    loading,
    error,
    setError,
    clearError,
    addTodo,
    editTodo,
    toggleTodo,
    removeTodo,
  } = useTodos();

  const [filter, setFilter] = useState<TodoFilter>("all");

  const filteredTodos = filterTodos(todos, filter);
  const completedCount = todos.filter((t) => isCompleted(t.completed)).length;

  const { currentPage, totalPages, pageItems, nextPage, prevPage, resetPage } =
    usePagination(filteredTodos, ITEMS_PER_PAGE);

  function handleFilterChange(next: TodoFilter) {
    setFilter(next);
    resetPage();
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (err) {
      setError(getErrorMessage(err, "Logout gagal."));
      return;
    }

    onLogout();
  }

  return (
    <main className="todo-page">
      <TodoHeader onLogout={handleLogout} />

      <section className="todo-card">
        <TodoSummary completed={completedCount} total={todos.length} />

        <TodoForm onSubmit={addTodo} />

        <TodoFilters value={filter} onChange={handleFilterChange} />

        <ErrorBanner message={error} onClose={clearError} />

        <TodoList
          todos={pageItems}
          loading={loading}
          filter={filter}
          totalFiltered={filteredTodos.length}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={removeTodo}
          onClearError={clearError}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={prevPage}
          onNext={nextPage}
        />

        <p className="footer-note">
          Perubahan tersimpan melalui backend PHP dan PostgreSQL.
        </p>
      </section>
    </main>
  );
}
