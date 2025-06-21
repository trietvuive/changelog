import React from 'react'

function FormStep({ formData, onInputChange, onFetchCommits, loading, error }) {
  return (
    <div className="generator-form">
      <div className="form-grid">
        <div className="form-section">
          <h3>GitHub Repository</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="repoOwner">Repository Owner</label>
              <input
                id="repoOwner"
                type="text"
                name="repoOwner"
                value={formData.repoOwner}
                onChange={onInputChange}
                placeholder="e.g., facebook"
              />
            </div>
            <div className="form-group">
              <label htmlFor="repoName">Repository Name</label>
              <input
                id="repoName"
                type="text"
                name="repoName"
                value={formData.repoName}
                onChange={onInputChange}
                placeholder="e.g., react"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Commit Range</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fromCommit">From Commit (optional)</label>
              <input
                id="fromCommit"
                type="text"
                name="fromCommit"
                value={formData.fromCommit}
                onChange={onInputChange}
                placeholder="e.g., v1.0.0 or commit hash"
              />
            </div>
            <div className="form-group">
              <label htmlFor="toCommit">To Commit (optional)</label>
              <input
                id="toCommit"
                type="text"
                name="toCommit"
                value={formData.toCommit}
                onChange={onInputChange}
                placeholder="e.g., HEAD or commit hash"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Release Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="version">Version</label>
              <input
                id="version"
                type="text"
                name="version"
                value={formData.version}
                onChange={onInputChange}
                placeholder="e.g., 2.1.0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Release Title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                placeholder="e.g., Feature Release"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        {error && (
          <div className="form-error" style={{ color: 'red', marginBottom: '1em' }}>{error}</div>
        )}
        <button 
          onClick={onFetchCommits}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Fetching Commits...' : 'Fetch Commits'}
        </button>
      </div>
    </div>
  )
}

export default FormStep 