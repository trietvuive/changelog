import React from 'react'

function GeneratedStep({ generatedChangelog, onBack, onSaveChangelog }) {
  return (
    <div className="generated-view">
      <div className="generated-header">
        <h2>✨ Generated Changelog</h2>
        <p>Review and save your generated changelog entry</p>
      </div>
      
      <div className="changelog-preview">
        <pre>{generatedChangelog}</pre>
      </div>

      <div className="actions">
        <button 
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
        <button 
          onClick={onSaveChangelog}
          className="btn-primary"
        >
          Save to Changelog
        </button>
      </div>
    </div>
  )
}

export default GeneratedStep 