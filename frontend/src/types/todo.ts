export type Todo = {
  id: string;
  user_id: string;
  title: string;
  completed: string | boolean;
  created_at: string;
  updated_at: string;
};

export type TodoFilter = "all" | "active" | "completed";
