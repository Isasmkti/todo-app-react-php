import type { TodoFilter } from "../types/todo";

type Props = {
  value: TodoFilter;
  onChange: (filter: TodoFilter) => void;
};

const OPTIONS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "active", label: "Belum selesai" },
  { value: "completed", label: "Selesai" },
];

export default function TodoFilters({ value, onChange }: Props) {
  return (
    <div className="todo-filters" aria-label="Filter tugas">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            value === option.value ? "filter-button active" : "filter-button"
          }
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
