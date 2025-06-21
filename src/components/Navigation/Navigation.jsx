import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDarkMode } from '../../contexts/DarkModeContext'
import './Navigation.css'

function Navigation() {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useDarkMode()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            📋 Changelog Manager
          </Link>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            📖 View Changelog
          </Link>
          <Link 
            to="/generate" 
            className={`nav-link ${location.pathname === '/generate' ? 'active' : ''}`}
          >
            ✨ Generate Entry
          </Link>
          <button 
            onClick={toggleDarkMode}
            className="theme-toggle"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 