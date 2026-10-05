import { useEffect, useState } from "react";
import { getTodos } from "../api/todo";

type Todo = {
    id: string;
    user_id: string;
    title: string;
    completed: string;
    created_at: string;
    updated_at: string;
};

function Todos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTodos() {
            try {
                const result = await getTodos();

                console.log("result:", result);
                console.log("result.data:", result.data);
                console.log("is array:", Array.isArray(result.data));

                setTodos(result.data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        }

        loadTodos();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>My Todos</h1>

            {todos.map((todo) => (
                <div key={todo.id}>
                    <p>{todo.title}</p>
                    <small>
                        {todo.completed === "t" ? "Selesai" : "Belum selesai"}
                    </small>
                </div>
            ))}
        </div>
    );
}

export default Todos;