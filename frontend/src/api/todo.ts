const API_URL = "http://localhost:8000";

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
  completed: boolean
) {
  return request(`/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ completed }),
  });
}

export async function deleteTodo(id: string) {
  return request(`/todos/${id}`, {
    method: "DELETE",
  });
}