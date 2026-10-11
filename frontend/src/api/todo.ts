const API_URL = import.meta.env.VITE_API_URL;

async function request(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  let data: any;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Response server bukan JSON yang valid.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request gagal.");
  }

  return data;
}

export async function getTodos() {
  const result = await request("/todos");
  return result.data;
}

export async function createTodo(title: string) {
  return request("/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function updateTodo(
  id: string,
  changes: { title?: string; completed?: boolean }
) {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Gagal memperbarui todo");
  }

  return result.data;
}

export async function deleteTodo(id: string) {
  return request(`/todos/${id}`, {
    method: "DELETE",
  });
}