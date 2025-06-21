import React, { useState } from 'react'
import './ChangelogGenerator.css'

function ChangelogGenerator() {
  const [formData, setFormData] = useState({
    repoOwner: '',
    repoName: '',
    githubToken: '',
    version: '',
    title: '',
    fromCommit: '',
    toCommit: '',
    openaiKey: ''
  })
  
  const [commits, setCommits] = useState([])
  const [generatedChangelog, setGeneratedChangelog] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState('form') // form, commits, generated

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const fetchCommits = async () => {
    if (!formData.repoOwner || !formData.repoName || !formData.githubToken) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/github/commits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner: formData.repoOwner,
          repo: formData.repoName,
          token: formData.githubToken,
          from: formData.fromCommit,
          to: formData.toCommit
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch commits')
      }

      const data = await response.json()
      setCommits(data.commits)
      setStep('commits')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateChangelog = async () => {
    if (!formData.openaiKey) {
      setError('Please provide your OpenAI API key')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/llm/generate-changelog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commits,
          version: formData.version,
          title: formData.title,
          openaiKey: formData.openaiKey
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate changelog')
      }

      const data = await response.json()
      setGeneratedChangelog(data.changelog)
      setStep('generated')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const saveChangelog = async () => {
    try {
      const response = await fetch('/api/changelog/save-changelog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          changelog: generatedChangelog,
          version: formData.version,
          title: formData.title
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save changelog')
      }

      alert('Changelog saved successfully!')
      setStep('form')
      setGeneratedChangelog('')
      setCommits([])
    } catch (err) {
      setError(err.message)
    }
  }

  const renderForm = () => (
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
                onChange={handleInputChange}
                placeholder="e.g., facebook"
              />
            </div>
            <div className="form-group">
              <label>Repository Name</label>
              <input
                type="text"
                name="repoName"
                value={formData.repoName}
                onChange={handleInputChange}
                placeholder="e.g., react"
              />
            </div>
          </div>
          <div className="form-group">
            <label>GitHub Personal Access Token</label>
            <input
              type="password"
              name="githubToken"
              value={formData.githubToken}
              onChange={handleInputChange}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
            <small>
              <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                Generate token here
              </a>
            </small>
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
                onChange={handleInputChange}
                placeholder="e.g., v1.0.0 or commit hash"
              />
            </div>
            <div className="form-group">
              <label>To Commit (optional)</label>
              <input
                type="text"
                name="toCommit"
                value={formData.toCommit}
                onChange={handleInputChange}
                placeholder="e.g., HEAD or commit hash"
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
                onChange={handleInputChange}
                placeholder="e.g., 2.1.0"
              />
            </div>
            <div className="form-group">
              <label>Release Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Feature Release"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>AI Configuration</h3>
          <div className="form-group">
            <label>OpenAI API Key</label>
            <input
              type="password"
              name="openaiKey"
              value={formData.openaiKey}
              onChange={handleInputChange}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
            />
            <small>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                Get API key here
              </a>
            </small>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button 
          onClick={fetchCommits}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Fetching Commits...' : 'Fetch Commits'}
        </button>
      </div>
    </div>
  )

  const renderCommits = () => (
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
          onClick={() => setStep('form')}
          className="btn-secondary"
        >
          Back
        </button>
        <button 
          onClick={generateChangelog}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Generating Changelog...' : 'Generate Changelog'}
        </button>
      </div>
    </div>
  )

  const renderGenerated = () => (
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
          onClick={() => setStep('commits')}
          className="btn-secondary"
        >
          Back
        </button>
        <button 
          onClick={saveChangelog}
          className="btn-primary"
        >
          Save to Changelog
        </button>
      </div>
    </div>
  )

  return (
    <div className="changelog-generator">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {step === 'form' && renderForm()}
      {step === 'commits' && renderCommits()}
      {step === 'generated' && renderGenerated()}
    </div>
  )
}

export default ChangelogGenerator 