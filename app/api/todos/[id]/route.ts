// app/api/todos/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(todo);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const deleted = await prisma.todo.delete({ where: { id } }).catch(() => null);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const updated = await prisma.todo.update({
    where: { id },
    data: { completed: true },
  }).catch(() => null);

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === "string" ? body.title.trim() : undefined;
  const completed = typeof body?.completed === "boolean" ? body.completed : undefined;

  const updated = await prisma.todo.update({
    where: { id },
    data: { title, completed },
  }).catch(() => null);

  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
