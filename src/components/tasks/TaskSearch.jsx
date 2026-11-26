import { useState, useEffect } from 'react'
import { searchTasks } from '../../services/api.js'

function TaskSearch() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState({ query: '', items: [], error: null })

  const text = query.trim()
  // Derived: we are searching until the stored result belongs to the current text
  const isSearching = text !== '' && result.query !== text

  useEffect(() => {
    if (!text) return

    const controller = new AbortController()

    searchTasks(text, { signal: controller.signal })
      .then((items) => setResult({ query: text, items, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return // expected, not a real error
        setResult({ query: text, items: [], error: err.message })
      })

    return () => controller.abort() // cancels the previous request on every change
  }, [text])

  return (
    <div className="quick-find">
      <input
        type="search"
        className="search-input"
        placeholder="Quick find a task..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {isSearching && <p className="loading-text">Searching...</p>}
      {text !== '' && !isSearching && (
        <>
          {result.error && <p className="loading-text">{result.error}</p>}
          {!result.error && result.items.length === 0 && (
            <p className="loading-text">No tasks found.</p>
          )}
          <ul className="quick-find__results">
            {result.items.map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default TaskSearch