'use client';

import { useState, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newTitle: string) => void;
  currentTitle: string;
};

export default function EditTodoModal({ isOpen, onClose, onSave, currentTitle }: Props) {
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl animate-fadeIn">
        <h2 className="text-lg font-bold mb-4">Edit Todo</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(title);
              onClose();
            }}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
