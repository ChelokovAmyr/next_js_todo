export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
};

// Временное "in-memory" хранилище
let seq = 3;
let todos: Todo[] = [
  { id: 1, text: "Понять App Router", completed: false, createdAt: Date.now() - 30000 },
  { id: 2, text: "Сделать To-Do", completed: true, createdAt: Date.now() - 20000 },
  { id: 3, text: "Добавить API", completed: false, createdAt: Date.now() - 10000 },
];

export async function listTodos() {
  return todos.sort((a, b) => b.createdAt - a.createdAt);
}

export async function createTodo(text: string) {
  const t = { id: ++seq, text, completed: false, createdAt: Date.now() };
  todos.unshift(t);
  return t;
}

export async function updateTodo(id: number, patch: Partial<Todo>) {
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) return null;
  todos[idx] = { ...todos[idx], ...patch };
  return todos[idx];
}

export async function deleteTodo(id: number) {
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);
  return todos.length < before;
}
