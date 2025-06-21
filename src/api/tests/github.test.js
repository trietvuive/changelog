const axios = require('axios');
const { filterCommitsByRange } = require('../github');

// Mock axios
jest.mock('axios');

describe('GitHub API', () => {
  beforeEach(() => {
    axios.get.mockClear();
  });

  describe('filterCommitsByRange', () => {
    const mockCommits = [
      { sha: 'abc123456789', message: 'First commit', author: 'User 1', date: '2023-01-01', url: 'http://test.com/1' },
      { sha: 'def456789012', message: 'Second commit', author: 'User 2', date: '2023-01-02', url: 'http://test.com/2' },
      { sha: 'ghi789012345', message: 'Third commit', author: 'User 3', date: '2023-01-03', url: 'http://test.com/3' },
      { sha: 'jkl012345678', message: 'Fourth commit', author: 'User 4', date: '2023-01-04', url: 'http://test.com/4' }
    ];

    it('should return all commits when no toSha is provided', () => {
      const result = filterCommitsByRange(mockCommits, 'abc123', null);
      expect(result).toEqual(mockCommits);
    });

    it('should filter commits up to the specified toSha', () => {
      const result = filterCommitsByRange(mockCommits, 'abc123', 'ghi789012345');
      expect(result).toEqual(mockCommits.slice(0, 2)); // First two commits
    });

    it('should handle partial SHA matches', () => {
      const result = filterCommitsByRange(mockCommits, 'abc123', 'ghi789');
      expect(result).toEqual(mockCommits.slice(0, 2)); // First two commits
    });

    it('should return all commits when toSha is not found', () => {
      const result = filterCommitsByRange(mockCommits, 'abc123', 'nonexistent');
      expect(result).toEqual(mockCommits);
    });

    it('should handle empty commits array', () => {
      const result = filterCommitsByRange([], 'abc123', 'def456');
      expect(result).toEqual([]);
    });

    it('should handle single commit', () => {
      const singleCommit = [mockCommits[0]];
      const result = filterCommitsByRange(singleCommit, 'abc123', 'abc123456789');
      expect(result).toEqual([]); // Should return empty since we stop before the commit
    });
  });
}); 