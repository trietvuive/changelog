import React from 'react'

function FormStep({ formData, onInputChange, onFetchCommits, loading, error }) {
  return (
    <div className="generator-form">
      <div className="form-grid">
        <div className="form-section">
          <h3>GitHub Repository</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Repository Owner</label>
              <input
                type="text"
                name="repoOwner"
                value={formData.repoOwner}
                onChange={onInputChange}
                placeholder="e.g., facebook"
              />
            </div>
            <div className="form-group">
              <label>Repository Name</label>
              <input
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
              <label>From Commit (optional)</label>
              <input
                type="text"
                name="fromCommit"
                value={formData.fromCommit}
                onChange={onInputChange}
                placeholder="inclusive. latest commit"
              />
            </div>
            <div className="form-group">
              <label>To Commit (optional)</label>
              <input
                type="text"
                name="toCommit"
                value={formData.toCommit}
                onChange={onInputChange}
                placeholder="inclusive. earliest commit"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Release Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Version</label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={onInputChange}
                placeholder="e.g., 2.1.0"
              />
            </div>
            <div className="form-group">
              <label>Release Title</label>
              <input
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