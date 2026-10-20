import type { Todo, TodoFilter } from "../types/todo";

export function isCompleted(value: string | boolean) {
  return value === true || value === "t";
}

export function filterTodos(todos: Todo[], filter: TodoFilter) {
  if (filter === "active") {
    return todos.filter((todo) => !isCompleted(todo.completed));
  }

  if (filter === "completed") {
    return todos.filter((todo) => isCompleted(todo.completed));
  }

  return todos;
}

export function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback;
}
