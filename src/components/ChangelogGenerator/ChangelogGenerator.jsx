import React from 'react'
import FormStep from './FormStep.jsx'
import CommitsStep from './CommitsStep.jsx'
import GeneratedStep from './GeneratedStep.jsx'
import ErrorDisplay from './ErrorDisplay.jsx'
import { useChangelogGenerator } from './useChangelogGenerator.js'
import './ChangelogGenerator.css'

function ChangelogGenerator() {
  const {
    formData,
    commits,
    generatedChangelog,
    loading,
    error,
    step,
    handleInputChange,
    fetchCommits,
    generateChangelog,
    saveChangelog,
    goBack,
    dismissError
  } = useChangelogGenerator()

  const renderCurrentStep = () => {
    switch (step) {
      case 'form':
        return (
          <FormStep
            formData={formData}
            onInputChange={handleInputChange}
            onFetchCommits={fetchCommits}
            loading={loading}
            error={error}
          />
        )
      case 'commits':
        return (
          <CommitsStep
            commits={commits}
            onBack={goBack}
            onGenerateChangelog={generateChangelog}
            loading={loading}
          />
        )
      case 'generated':
        return (
          <GeneratedStep
            generatedChangelog={generatedChangelog}
            onBack={goBack}
            onSaveChangelog={saveChangelog}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="changelog-generator">
      {renderCurrentStep()}
      <ErrorDisplay error={error} onDismiss={dismissError} />
    </div>
  )
}

export default ChangelogGenerator 