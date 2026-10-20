type Props = {
  completed: number;
  total: number;
};

export default function TodoSummary({ completed, total }: Props) {
  return (
    <div className="todo-summary">
      <div>
        <h2>Daftar tugas</h2>
        <p className="muted">
          {completed} dari {total} tugas selesai
        </p>
      </div>

      <span className="count">{total} tugas</span>
    </div>
  );
}
