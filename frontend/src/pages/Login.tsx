import { useState } from "react";
import { login, register } from "../api/auth";

type Props = {
  onSuccess: () => void;
};

export default function Login({ onSuccess }: Props) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await register(name.trim(), email.trim(), password);
        setIsRegister(false);
        setPassword("");
        setError("");
        alert("Registrasi berhasil. Silakan login.");
      } else {
        await login(email.trim(), password);
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{isRegister ? "Buat Akun" : "Todo List"}</h1>
        <p className="muted">
          {isRegister
            ? "Daftar untuk mulai mengelola tugas."
            : "Login untuk melihat daftar tugasmu."}
        </p>

        {isRegister && (
          <label>
            Nama
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
              placeholder="Nama kamu"
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={100}
            required
            placeholder="nama@email.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Masukkan password"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Memproses..."
            : isRegister
              ? "Daftar"
              : "Login"}
        </button>

        <p className="switch-auth">
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            {isRegister ? "Login" : "Daftar"}
          </button>
        </p>
      </form>
    </main>
  );
}