import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormStep from '../FormStep';

describe('FormStep', () => {
  const defaultProps = {
    formData: {
      repoOwner: '',
      repoName: '',
      version: '',
      title: '',
      fromCommit: '',
      toCommit: ''
    },
    onInputChange: jest.fn(),
    onFetchCommits: jest.fn(),
    loading: false,
    error: ''
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<FormStep {...defaultProps} />);

    expect(screen.getByLabelText('Repository Owner')).toBeInTheDocument();
    expect(screen.getByLabelText('Repository Name')).toBeInTheDocument();
    expect(screen.getByLabelText('From Commit (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('To Commit (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Version')).toBeInTheDocument();
    expect(screen.getByLabelText('Release Title')).toBeInTheDocument();
  });

  it('should display form data values', () => {
    const formData = {
      repoOwner: 'test-owner',
      repoName: 'test-repo',
      version: '1.0.0',
      title: 'Test Release',
      fromCommit: 'abc123',
      toCommit: 'def456'
    };

    render(<FormStep {...defaultProps} formData={formData} />);

    expect(screen.getByDisplayValue('test-owner')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-repo')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1.0.0')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Release')).toBeInTheDocument();
    expect(screen.getByDisplayValue('abc123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('def456')).toBeInTheDocument();
  });

  it('should call onInputChange when input values change', () => {
    render(<FormStep {...defaultProps} />);

    const repoOwnerInput = screen.getByLabelText('Repository Owner');
    fireEvent.change(repoOwnerInput, { target: { value: 'new-owner' } });

    expect(defaultProps.onInputChange).toHaveBeenCalled();
  });

  it('should call onFetchCommits when button is clicked', () => {
    render(<FormStep {...defaultProps} />);

    const fetchButton = screen.getByRole('button', { name: 'Fetch Commits' });
    fireEvent.click(fetchButton);

    expect(defaultProps.onFetchCommits).toHaveBeenCalled();
  });

  it('should disable button when loading', () => {
    render(<FormStep {...defaultProps} loading={true} />);

    const fetchButton = screen.getByRole('button', { name: 'Fetching Commits...' });
    expect(fetchButton).toBeDisabled();
  });

  it('should display error message when error is provided', () => {
    const error = 'Test error message';
    render(<FormStep {...defaultProps} error={error} />);

    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('should not display error message when no error', () => {
    render(<FormStep {...defaultProps} />);

    expect(screen.queryByText('Test error message')).not.toBeInTheDocument();
  });

  it('should display correct button text based on loading state', () => {
    const { rerender } = render(<FormStep {...defaultProps} loading={false} />);
    expect(screen.getByRole('button', { name: 'Fetch Commits' })).toBeInTheDocument();

    rerender(<FormStep {...defaultProps} loading={true} />);
    expect(screen.getByRole('button', { name: 'Fetching Commits...' })).toBeInTheDocument();
  });
}); 