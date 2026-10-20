import type { Todo, TodoFilter } from "../types/todo";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  loading: boolean;
  filter: TodoFilter;
  totalFiltered: number;
  onToggle: (todo: Todo) => Promise<void>;
  onEdit: (id: string, title: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onClearError: () => void;
};

function emptyTitle(filter: TodoFilter) {
  if (filter === "active") return "Semua tugas sudah selesai";
  if (filter === "completed") return "Belum ada tugas selesai";
  return "Belum ada tugas";
}

export default function TodoList({
  todos,
  loading,
  filter,
  totalFiltered,
  ...itemHandlers
}: Props) {
  if (loading) {
    return <p className="empty-state">Memuat tugas...</p>;
  }

  if (totalFiltered === 0) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle(filter)}</h3>
        <p>Coba pilih filter lain atau tambahkan tugas baru.</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} {...itemHandlers} />
      ))}
    </ul>
  );
}
