import React from 'react'

function CommitsStep({ commits, onBack, onGenerateChangelog, loading }) {
  return (
    <div className="commits-view">
      <div className="commits-header">
        <h2>📝 Review Commits</h2>
        <p>Review and select commits to include in your changelog</p>
        <div className="commits-summary">
          <span>Found {commits.length} commits</span>
        </div>
      </div>
      
      <div className="commits-list">
        {commits.map((commit, index) => (
          <div key={commit.sha} className="commit-item">
            <div className="commit-header">
              <span className="commit-sha">{commit.sha.substring(0, 7)}</span>
              <span className="commit-author">{commit.author}</span>
              <span className="commit-date">{new Date(commit.date).toLocaleDateString()}</span>
            </div>
            <div className="commit-message">{commit.message}</div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button 
          onClick={onBack}
          className="btn-secondary"
        >
          Back
        </button>
        <button 
          onClick={onGenerateChangelog}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Generating Changelog...' : 'Generate Changelog'}
        </button>
      </div>
    </div>
  )
}

export default CommitsStep 