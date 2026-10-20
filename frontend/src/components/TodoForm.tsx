import { useState } from "react";

import { MAX_TITLE_LENGTH } from "../constants/todo";

type Props = {
  onSubmit: (title: string) => Promise<boolean>;
};

export default function TodoForm({ onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);
    const success = await onSubmit(title);
    setSubmitting(false);

    if (success) {
      setTitle("");
    }
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={MAX_TITLE_LENGTH}
        placeholder="Apa yang ingin kamu kerjakan?"
        aria-label="Judul Todo"
        required
      />

      <button type="submit" disabled={submitting}>
        {submitting ? "Menambah..." : "+ Tambah"}
      </button>
    </form>
  );
}
