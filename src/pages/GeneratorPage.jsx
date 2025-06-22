import React from 'react';
import ChangelogGenerator from '../components/ChangelogGenerator/ChangelogGenerator.jsx';
import './GeneratorPage.css';

function GeneratorPage() {
  return (
    <div className="generator-page">
      <header className="page-header">
        <h1>✨ Changelog Generator</h1>
        <p>Generate changelog entries from GitHub commits using AI</p>
      </header>
      <main className="page-main">
        <ChangelogGenerator />
      </main>
    </div>
  );
}

export default GeneratorPage;
