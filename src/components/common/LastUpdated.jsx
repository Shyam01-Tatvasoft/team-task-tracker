import { useState, useEffect } from 'react'

function LastUpdated() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return <p className="last-updated">Updated {seconds}s ago</p>
}

export default LastUpdated