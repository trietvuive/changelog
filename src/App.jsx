import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './contexts/DarkModeContext'
import Navigation from './components/Navigation/Navigation.jsx'
import ChangelogPage from './pages/ChangelogPage.jsx'
import GeneratorPage from './pages/GeneratorPage.jsx'
import './App.css'

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div className="app">
          <Navigation />
          <Routes>
            <Route path="/" element={<ChangelogPage />} />
            <Route path="/generate" element={<GeneratorPage />} />
          </Routes>
        </div>
      </Router>
    </DarkModeProvider>
  )
}

export default App 