import React from 'react'
import Changelog from '../components/Changelog/Changelog.jsx'
import './ChangelogPage.css'

function ChangelogPage() {
  return (
    <div className="changelog-page">
      <header className="page-header">
        <h1>📖 Changelog</h1>
        <p>View and browse all changelog entries</p>
      </header>
      <main className="page-main">
        <Changelog />
      </main>
    </div>
  )
}

export default ChangelogPage 