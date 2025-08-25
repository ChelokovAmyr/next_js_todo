import TodoList from "./components/TodoList";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const todos = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
  return <TodoList initialTodos={todos} />;
}
