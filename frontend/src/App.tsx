import { useCallback, useEffect, useState } from "react";
import Login from "./pages/Login";
import Todos from "./pages/Todos";
import { getTodos } from "./api/todo";

type AuthState = "checking" | "authenticated" | "guest";

function App() {
  const [authState, setAuthState] = useState<AuthState>("checking");

  const checkSession = useCallback(async () => {
    try {
      await getTodos();
      setAuthState("authenticated");
    } catch {
      setAuthState("guest");
    }
  }, []);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  if (authState === "checking") {
    return <p className="screen-loading">Memeriksa sesi login...</p>;
  }

  if (authState === "guest") {
    return <Login onSuccess={() => setAuthState("authenticated")} />;
  }

  return <Todos onLogout={() => setAuthState("guest")} />;
}

export default App;