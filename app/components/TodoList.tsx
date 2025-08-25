'use client';

import { useState, useRef } from "react";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

type TodoListProps = {
  initialTodos: Todo[];
};

type Filter = "all" | "active" | "completed";

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);

  const toggleTimeouts = useRef<Record<number, NodeJS.Timeout>>({});

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    setAdding(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ title: newTodo }),
        headers: { "Content-Type": "application/json" },
      });
      const todo = await res.json();
      setTodos([todo, ...todos]);
      setNewTodo("");
    } finally {
      setAdding(false);
    }
  };

  // Toggle with debounce 300ms
  const handleToggle = (id: number) => {
    if (toggleTimeouts.current[id]) clearTimeout(toggleTimeouts.current[id]);
    toggleTimeouts.current[id] = setTimeout(async () => {
      setLoadingIds((prev) => [...prev, id]);
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      try {
        const res = await fetch(`/api/todos/${id}`, {
          method: "PUT",
          body: JSON.stringify({ completed: !todo.completed }),
          headers: { "Content-Type": "application/json" },
        });
        const updated = await res.json();
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } finally {
        setLoadingIds((prev) => prev.filter((lid) => lid !== id));
      }
    }, 300);
  };

  const handleDelete = async (id: number) => {
    setLoadingIds((prev) => [...prev, id]);
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setLoadingIds((prev) => prev.filter((lid) => lid !== id));
    }
  };

  const startEditing = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  // Save with debounce 300ms
  const handleEditSave = (id: number) => {
    if (toggleTimeouts.current[id]) clearTimeout(toggleTimeouts.current[id]);
    toggleTimeouts.current[id] = setTimeout(async () => {
      setLoadingIds((prev) => [...prev, id]);
      try {
        const res = await fetch(`/api/todos/${id}`, {
          method: "PUT",
          body: JSON.stringify({ title: editText }),
          headers: { "Content-Type": "application/json" },
        });
        const updated = await res.json();
        setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
        setEditingId(null);
        setEditText("");
      } finally {
        setLoadingIds((prev) => prev.filter((lid) => lid !== id));
      }
    }, 300);
  };

  const handleClearCompleted = async () => {
    const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
    setLoadingIds((prev) => [...prev, ...completedIds]);
    try {
      await Promise.all(
        completedIds.map((id) =>
          fetch(`/api/todos/${id}`, { method: "DELETE" })
        )
      );
      setTodos((prev) => prev.filter((t) => !t.completed));
      setShowConfirm(false);
    } finally {
      setLoadingIds((prev) =>
        prev.filter((id) => !completedIds.includes(id))
      );
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const Spinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-white mx-auto"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-2xl animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        My Todo List
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a new task..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          disabled={adding}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {adding ? <Spinner /> : "Add"}
        </button>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3">
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
        >
          Clear completed
        </button>
      </div>

      <ul className="space-y-3">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition"
          >
            {editingId === todo.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleEditSave(todo.id)
                }
                className="flex-1 border border-gray-300 rounded-lg px-2 py-1"
              />
            ) : (
              <span
                onClick={() => handleToggle(todo.id)}
                className={`flex-1 cursor-pointer ${
                  todo.completed ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {todo.title}
              </span>
            )}

            <div className="flex gap-2">
              {editingId === todo.id ? (
                <button
                  onClick={() => handleEditSave(todo.id)}
                  disabled={loadingIds.includes(todo.id)}
                  className="text-green-500 hover:text-green-700 transition disabled:opacity-50"
                >
                  {loadingIds.includes(todo.id) ? <Spinner /> : "Save"}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(todo.id, todo.title)}
                    className="text-yellow-500 hover:text-yellow-700 transition"
                  >
                    ✎
                  </button>

                  <button
                    onClick={() => handleDelete(todo.id)}
                    disabled={loadingIds.includes(todo.id)}
                    className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                  >
                    {loadingIds.includes(todo.id) ? <Spinner /> : "✕"}
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p className="text-center text-gray-400 mt-6">🎉 No tasks found!</p>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Clear all completed tasks?
            </h2>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleClearCompleted}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}