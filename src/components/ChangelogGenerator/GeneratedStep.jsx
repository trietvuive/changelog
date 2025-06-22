import React, { useState, useEffect } from 'react'

function GeneratedStep({ generatedChangelog, onBack, onSaveChangelog }) {
  const [editableChangelog, setEditableChangelog] = useState(generatedChangelog);

  // Update editable content when generatedChangelog prop changes
  useEffect(() => {
    setEditableChangelog(generatedChangelog);
  }, [generatedChangelog]);

  const handleSave = () => {
    onSaveChangelog(editableChangelog);
  };

  return (
    <div className="generated-view">
      <div className="generated-header">
        <h2>✨ Generated Changelog</h2>
        <p>Review and edit your generated changelog entry before saving</p>
      </div>
      
      <div className="changelog-preview">
        <textarea
          value={editableChangelog}
          onChange={(e) => setEditableChangelog(e.target.value)}
          className="changelog-textarea"
          placeholder="Generated changelog content..."
          rows={15}
        />
      </div>

      <div className="actions">
        <button 
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
        <button 
          onClick={handleSave}
          className="btn-primary"
        >
          Save to Changelog
        </button>
      </div>
    </div>
  )
}

export default GeneratedStep 