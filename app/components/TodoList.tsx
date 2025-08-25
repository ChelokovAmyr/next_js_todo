'use client';

import { useState } from "react";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

type TodoListProps = {
  initialTodos: Todo[];
};

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleAdd = () => {
    if (!newTodo.trim()) return;
    setTodos([
      { id: Date.now(), title: newTodo, completed: false, createdAt: new Date().toISOString() },
      ...todos,
    ]);
    setNewTodo("");
  };

  const handleToggle = (id: number) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id));
    setDeleteId(null);
  };

  const startEditing = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleEditSave = () => {
    if (editingId !== null) {
      setTodos(
        todos.map((t) => (t.id === editingId ? { ...t, title: editText } : t))
      );
      setEditingId(null);
      setEditText("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-2xl animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        My Todo List
      </h1>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>

      {/* Todos */}
      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition"
          >
            <span
              onClick={() => handleToggle(todo.id)}
              className={`flex-1 cursor-pointer ${
                todo.completed ? "line-through text-gray-400" : "text-gray-800"
              }`}
            >
              {todo.title}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => startEditing(todo.id, todo.title)}
                className="text-yellow-500 hover:text-yellow-700 transition"
              >
                ✎
              </button>
              <button
                onClick={() => setDeleteId(todo.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-center text-gray-400 mt-6">
          🎉 No tasks yet. Add your first one!
        </p>
      )}

      {/* Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Delete this task?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Edit task
            </h2>
            <input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSave();
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditText("");
                }}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
