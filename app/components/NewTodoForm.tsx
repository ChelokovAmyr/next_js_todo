"use client"
import { useState } from "react"

type Props = { onAdd: (title: string) => void }

export default function NewTodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title)
    setTitle("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="New todo..."
        className="border p-2 rounded flex-1"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
    </form>
  )
}
