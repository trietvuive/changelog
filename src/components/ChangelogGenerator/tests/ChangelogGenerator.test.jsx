import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ChangelogGenerator from '../ChangelogGenerator';

// Mock the custom hook
jest.mock('../useChangelogGenerator', () => ({
  useChangelogGenerator: jest.fn()
}));

const mockUseChangelogGenerator = require('../useChangelogGenerator').useChangelogGenerator;

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ChangelogGenerator', () => {
  const defaultMockReturn = {
    formData: {
      repoOwner: '',
      repoName: '',
      version: '',
      title: '',
      fromCommit: '',
      toCommit: ''
    },
    commits: [],
    generatedChangelog: '',
    loading: false,
    error: '',
    step: 'form',
    handleInputChange: jest.fn(),
    fetchCommits: jest.fn(),
    generateChangelog: jest.fn(),
    saveChangelog: jest.fn(),
    goBack: jest.fn(),
    dismissError: jest.fn()
  };

  beforeEach(() => {
    mockUseChangelogGenerator.mockReturnValue(defaultMockReturn);
  });

  it('should render form step by default', () => {
    renderWithRouter(<ChangelogGenerator />);
    
    expect(screen.getByText('GitHub Repository')).toBeInTheDocument();
    expect(screen.getByText('Commit Range')).toBeInTheDocument();
    expect(screen.getByText('Release Information')).toBeInTheDocument();
  });

  it('should render commits step when step is commits', () => {
    mockUseChangelogGenerator.mockReturnValue({
      ...defaultMockReturn,
      step: 'commits',
      commits: [
        { sha: 'abc123', message: 'Test commit', author: 'Test User', date: '2023-01-01' }
      ]
    });

    renderWithRouter(<ChangelogGenerator />);
    
    expect(screen.getByText('📝 Review Commits')).toBeInTheDocument();
    expect(screen.getByText('Found 1 commits')).toBeInTheDocument();
  });

  it('should render generated step when step is generated', () => {
    mockUseChangelogGenerator.mockReturnValue({
      ...defaultMockReturn,
      step: 'generated',
      generatedChangelog: '## Version 1.0.0\n\n### ✨ New Features\n- Test feature'
    });

    renderWithRouter(<ChangelogGenerator />);
    
    expect(screen.getByText('✨ Generated Changelog')).toBeInTheDocument();
    expect(screen.getByText((content, node) => {
      return node.tagName.toLowerCase() === 'pre' && content.includes('## Version 1.0.0');
    })).toBeInTheDocument();
  });

  it('should render error display when error exists', () => {
    mockUseChangelogGenerator.mockReturnValue({
      ...defaultMockReturn,
      error: 'Test error message'
    });

    renderWithRouter(<ChangelogGenerator />);
    
    expect(screen.getAllByText('Test error message').length).toBeGreaterThan(0);
  });

  it('should not render error display when no error', () => {
    renderWithRouter(<ChangelogGenerator />);
    
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
  });

  it('should render nothing for unknown step', () => {
    mockUseChangelogGenerator.mockReturnValue({
      ...defaultMockReturn,
      step: 'unknown'
    });

    const { container } = renderWithRouter(<ChangelogGenerator />);
    
    // Should only render the wrapper div and error display
    expect(container.firstChild).toHaveClass('changelog-generator');
  });
}); 