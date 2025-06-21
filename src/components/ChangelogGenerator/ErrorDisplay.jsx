import React from 'react'

function ErrorDisplay({ error, onDismiss }) {
  if (!error) return null

  return (
    <div className="error-message">
      {error}
      <button onClick={onDismiss}>×</button>
    </div>
  )
}

export default ErrorDisplay 