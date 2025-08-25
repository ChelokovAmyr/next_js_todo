'use client';
import { useState, useEffect } from "react";

type Todo = { id: number; title: string; completed: boolean; };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then(res => res.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    const res = await fetch("/api/todos", { method: "POST", body: JSON.stringify({ title: newTodo }) });
    const todo = await res.json();
    setTodos([todo, ...todos]);
    setNewTodo("");
  };

  const toggleTodo = async (id: number) => {
    const res = await fetch(`/api/todos/${id}`, { method: "PATCH" });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
  };

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t.id !== id));
  };

  const updateTodo = async (id: number, title: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: "PUT", body: JSON.stringify({ title }) });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Todo List</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded px-4 py-2"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTodo()}
          placeholder="New task"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addTodo}>Add</button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex justify-between items-center p-2 border rounded">
            <span
              className={`flex-1 cursor-pointer ${todo.completed ? "line-through text-gray-400" : ""}`}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.title}
            </span>
            <button className="text-red-500" onClick={() => deleteTodo(todo.id)}>✕</button>
            <button className="text-green-500" onClick={() => {
              const title = prompt("New title", todo.title);
              if (title) updateTodo(todo.id, title);
            }}>✎</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
