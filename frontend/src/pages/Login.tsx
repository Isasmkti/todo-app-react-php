import { useState } from "react";
import { login } from "../api/auth";
import { getTodos } from "../api/todo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      const result = await login(email, password);

      console.log("Login berhasil:", result);

      const todos = await getTodos();

      console.log("Todos:", todos);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
      />

      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}

