'use client'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 16 }}>
      <h2>Упс, ошибка</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <button onClick={reset} style={{ marginTop: 8, padding: '6px 10px', border: '1px solid #333' }}>
        Повторить
      </button>
    </div>
  )
}
