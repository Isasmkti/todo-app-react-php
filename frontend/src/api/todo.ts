const API_URL = import.meta.env.VITE_API_URL;

type ApiResponse = {
  data?: unknown;
  message?: string;
};

function isApiResponse(value: unknown): value is ApiResponse {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function request(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  let data: unknown;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Server mengembalikan response bukan JSON (HTTP ${response.status}).`
    );
  }

  if (!isApiResponse(data)) {
    throw new Error(
      `Format response server tidak valid (HTTP ${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request gagal (HTTP ${response.status}).`
    );
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
  const response = await request(`/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });
  return response.data;
}

export async function deleteTodo(id: string) {
  return request(`/todos/${id}`, {
    method: "DELETE",
  });
}