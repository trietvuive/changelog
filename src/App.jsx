import React, { useState } from 'react'
import Changelog from './components/Changelog/Changelog.jsx'
import ChangelogGenerator from './components/ChangelogGenerator/ChangelogGenerator.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('view') // 'view' or 'generate'

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Changelog Manager</h1>
        <nav className="app-nav">
          <button 
            className={`nav-tab ${activeTab === 'view' ? 'active' : ''}`}
            onClick={() => setActiveTab('view')}
          >
            📖 View Changelog
          </button>
          <button 
            className={`nav-tab ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            ✨ Generate Entry
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'view' && <Changelog />}
        {activeTab === 'generate' && <ChangelogGenerator />}
      </main>
    </div>
  )
}

export default App 