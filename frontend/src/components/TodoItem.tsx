import { useState } from "react";

import { MAX_TITLE_LENGTH } from "../constants/todo";
import type { Todo } from "../types/todo";
import { isCompleted } from "../utils/todo";

type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onEdit: (id: string, title: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onClearError: () => void;
};

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onClearError,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");

  const done = isCompleted(todo.completed);

  function startEdit() {
    setEditingTitle(todo.title);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditingTitle("");
  }

  async function saveEdit() {
    const success = await onEdit(todo.id, editingTitle);
    if (success) cancelEdit();
  }

  async function handleDelete() {
    if (!window.confirm("Yakin ingin menghapus Todo ini?")) return;
    await onDelete(todo.id);
  }

  return (
    <li className="todo-item">
      <div className="todo-main">
        <input
          type="checkbox"
          checked={done}
          onChange={() => void onToggle(todo)}
          aria-label={`Tandai ${todo.title}`}
        />

        {isEditing ? (
          <div className="edit-form">
            <input
              value={editingTitle}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(event) => setEditingTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void saveEdit();
                }

                if (event.key === "Escape") {
                  cancelEdit();
                }
              }}
              aria-label="Edit judul todo"
              autoFocus
            />

            <button type="button" onClick={() => void saveEdit()}>
              Simpan
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                cancelEdit();
                onClearError();
              }}
            >
              Batal
            </button>
          </div>
        ) : (
          <>
            <span className={done ? "todo-title done" : "todo-title"}>
              {todo.title}
            </span>

            <button
              type="button"
              className="secondary-button"
              onClick={startEdit}
            >
              Edit
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="delete-button"
        onClick={() => void handleDelete()}
        aria-label={`Hapus ${todo.title}`}
      >
        Hapus
      </button>
    </li>
  );
}
