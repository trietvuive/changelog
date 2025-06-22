import { renderHook, act } from '@testing-library/react';
import { useChangelogGenerator } from '../useChangelogGenerator';

// Mock fetch
global.fetch = jest.fn();

describe('useChangelogGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (global.fetch) fetch.mockClear();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useChangelogGenerator());

    expect(result.current.formData).toEqual({
      repoOwner: '',
      repoName: '',
      version: '',
      title: '',
      fromCommit: '',
      toCommit: ''
    });
    expect(result.current.commits).toEqual([]);
    expect(result.current.generatedChangelog).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('');
    expect(result.current.step).toBe('form');
  });

  it('should update form data on input change', () => {
    const { result } = renderHook(() => useChangelogGenerator());

    act(() => {
      result.current.handleInputChange({
        target: { name: 'repoOwner', value: 'test-owner' }
      });
    });

    expect(result.current.formData.repoOwner).toBe('test-owner');
  });

  it('should show error when fetching commits without required fields', async () => {
    const { result } = renderHook(() => useChangelogGenerator());

    await act(async () => {
      await result.current.fetchCommits();
    });

    expect(result.current.error).toBe('Please fill in repository owner and name');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should fetch commits successfully', async () => {
    const { result } = renderHook(() => useChangelogGenerator());
    const mockCommits = [
      { sha: 'abc123', message: 'Test commit', author: 'Test User', date: '2023-01-01', url: 'http://test.com' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ commits: mockCommits })
    });

    act(() => {
      result.current.handleInputChange({
        target: { name: 'repoOwner', value: 'test-owner' }
      });
      result.current.handleInputChange({
        target: { name: 'repoName', value: 'test-repo' }
      });
    });

    await act(async () => {
      await result.current.fetchCommits();
    });

    expect(fetch).toHaveBeenCalledWith('/api/github/commits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner: 'test-owner',
        repo: 'test-repo',
        fromSha: '',
        toSha: ''
      })
    });
    expect(result.current.commits).toEqual(mockCommits);
    expect(result.current.step).toBe('commits');
    expect(result.current.error).toBe('');
  });

  it('should show error when fetch commits fails', async () => {
    const { result } = renderHook(() => useChangelogGenerator());

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ error: 'Repository not found' })
    });

    act(() => {
      result.current.handleInputChange({
        target: { name: 'repoOwner', value: 'test-owner' }
      });
      result.current.handleInputChange({
        target: { name: 'repoName', value: 'test-repo' }
      });
    });

    await act(async () => {
      await result.current.fetchCommits();
    });

    expect(result.current.error).toBe('Repository not found');
  });

  it('should show error when generating changelog without version', async () => {
    const { result } = renderHook(() => useChangelogGenerator());

    // Set commits but no version
    act(() => {
      result.current.commits = [{ sha: 'abc123', message: 'Test commit' }];
    });

    await act(async () => {
      await result.current.generateChangelog();
    });

    expect(result.current.error).toBe('Please fill in the version field');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should generate changelog successfully', async () => {
    const { result } = renderHook(() => useChangelogGenerator());
    const mockChangelog = '## Version 1.0.0\n\n### ✨ New Features\n- Test feature';

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ changelog: mockChangelog })
    });

    // Set version using act
    act(() => {
      result.current.handleInputChange({
        target: { name: 'version', value: '1.0.0' }
      });
    });

    await act(async () => {
      await result.current.generateChangelog();
    });

    expect(fetch).toHaveBeenCalledWith('/api/llm/generate-changelog', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    expect(result.current.generatedChangelog).toBe(mockChangelog);
    expect(result.current.step).toBe('generated');
  });

  it('should navigate back correctly', async () => {
    const { result } = renderHook(() => useChangelogGenerator());

    // Set step to commits by calling fetchCommits
    act(() => {
      result.current.handleInputChange({
        target: { name: 'repoOwner', value: 'test-owner' }
      });
      result.current.handleInputChange({
        target: { name: 'repoName', value: 'test-repo' }
      });
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ commits: [{ sha: 'abc123', message: 'Test commit' }] })
    });

    await act(async () => {
      await result.current.fetchCommits();
    });

    // Now we should be on commits step, go back to form
    act(() => {
      result.current.goBack();
    });
    expect(result.current.step).toBe('form');

    // Set step to generated by calling generateChangelog
    act(() => {
      result.current.handleInputChange({
        target: { name: 'version', value: '1.0.0' }
      });
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ changelog: 'Test changelog' })
    });

    await act(async () => {
      await result.current.generateChangelog();
    });

    // Now we should be on generated step, go back to commits
    act(() => {
      result.current.goBack();
    });
    expect(result.current.step).toBe('commits');
  });

  it('should dismiss error', () => {
    const { result } = renderHook(() => useChangelogGenerator());

    act(() => {
      result.current.handleInputChange({ target: { name: 'repoOwner', value: 'test' } });
      result.current.error = 'Test error';
      result.current.dismissError();
    });

    expect(result.current.error).toBe('');
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useChangelogGenerator());

    act(() => {
      result.current.handleInputChange({
        target: { name: 'repoOwner', value: 'test' }
      });
      result.current.commits = [{ sha: 'abc123' }];
      result.current.generatedChangelog = 'test changelog';
      result.current.error = 'test error';
      result.current.step = 'commits';
      result.current.reset();
    });

    expect(result.current.formData.repoOwner).toBe('');
    expect(result.current.commits).toEqual([]);
    expect(result.current.generatedChangelog).toBe('');
    expect(result.current.error).toBe('');
    expect(result.current.step).toBe('form');
  });
}); 