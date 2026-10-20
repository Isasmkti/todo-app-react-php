type Props = {
  onLogout: () => void;
};

export default function TodoHeader({ onLogout }: Props) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">PERSONAL PRODUCTIVITY</p>
        <h1>My Todos</h1>
      </div>

      <button className="secondary-button" onClick={onLogout}>
        Logout
      </button>
    </header>
  );
}
