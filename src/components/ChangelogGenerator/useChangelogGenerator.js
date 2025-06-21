import { useState } from 'react'

export function useChangelogGenerator() {
  const [formData, setFormData] = useState({
    repoOwner: '',
    repoName: '',
    version: '',
    title: '',
    fromCommit: '',
    toCommit: ''
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
    if (!formData.repoOwner || !formData.repoName) {
      setError('Please fill in repository owner and name')
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
          fromSha: formData.fromCommit,
          toSha: formData.toCommit
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
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
    if (!formData.version) {
      setError('Please fill in the version field')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('Generating changelog with:', {
        commits: commits.length,
        version: formData.version,
        title: formData.title
      })

      const response = await fetch('/api/llm/generate-changelog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commits,
          version: formData.version,
          title: formData.title
        })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Generated changelog:', data)
      setGeneratedChangelog(data.changelog)
      setStep('generated')
    } catch (err) {
      console.error('Error generating changelog:', err)
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

  const goBack = () => {
    if (step === 'commits') {
      setStep('form')
    } else if (step === 'generated') {
      setStep('commits')
    }
  }

  const dismissError = () => {
    setError('')
  }

  const reset = () => {
    setFormData({
      repoOwner: '',
      repoName: '',
      version: '',
      title: '',
      fromCommit: '',
      toCommit: ''
    })
    setCommits([])
    setGeneratedChangelog('')
    setError('')
    setStep('form')
  }

  return {
    // State
    formData,
    commits,
    generatedChangelog,
    loading,
    error,
    step,
    
    // Actions
    handleInputChange,
    fetchCommits,
    generateChangelog,
    saveChangelog,
    goBack,
    dismissError,
    reset
  }
}