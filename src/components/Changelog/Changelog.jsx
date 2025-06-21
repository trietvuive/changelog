import React, { useState, useEffect } from 'react'
import { marked } from 'marked'

function Changelog() {
  const [changelog, setChangelog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage for saved preference, default to dark mode
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return JSON.parse(saved)
    }
    return true // Default to dark mode
  })

  useEffect(() => {
    fetchChangelog()
  }, [])

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    // Update document class for CSS variables
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const fetchChangelog = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/changelog')
      if (!response.ok) {
        throw new Error('Failed to fetch changelog')
      }
      const data = await response.json()
      setChangelog(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  if (loading) {
    return (
      <div className="loading">
        <div>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '20px' }}>Loading changelog...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error">
        <div className="error-content">
          <h1>⚠️ Error</h1>
          <p>{error}</p>
          <button 
            onClick={fetchChangelog}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!changelog) {
    return (
      <div className="error">
        <div className="error-content">
          <h1>📝 No Changelog Available</h1>
          <p>No changelog data found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-content">
          <h1>📋 Changelog</h1>
          <p>Track the latest updates and changes to our platform</p>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="theme-toggle"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      
      <div 
        className="content"
        dangerouslySetInnerHTML={{ __html: changelog.html }}
      />
      
      <div className="footer">
        <p>Last updated: {new Date(changelog.lastUpdated).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

export default Changelog 