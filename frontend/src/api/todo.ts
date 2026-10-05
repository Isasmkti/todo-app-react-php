const API_URL = "http://localhost:8000";

export async function getTodos() {
  const response = await fetch(`${API_URL}/todos`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}