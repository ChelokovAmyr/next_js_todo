'use client';

import { create } from 'zustand';

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoState = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: number, text?: string, completed?: boolean) => void;
  deleteTodo: (id: number) => void;
};

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (id, text, completed) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === id
          ? {
              ...t,
              text: text ?? t.text,
              completed: completed ?? t.completed,
            }
          : t
      ),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
}));
