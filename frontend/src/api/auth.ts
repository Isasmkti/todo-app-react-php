const API_URL = "http://localhost:8000";

async function request(path: string, body: object) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server mengembalikan response yang tidak valid.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request gagal.");
  }

  return data;
}

export function login(email: string, password: string) {
  return request("/login", { email, password });
}

export function register(
  name: string,
  email: string,
  password: string
) {
  return request("/register", { name, email, password });
}

export function logout() {
  return request("/logout", {});
}