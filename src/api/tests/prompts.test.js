const { generateChangelogPrompt, systemPrompts } = require('../prompts');

describe('Prompts', () => {
  const mockCommits = [
    { sha: 'abc123', message: 'feat: add new feature', author: 'Test User', date: '2023-01-01', url: 'http://test.com/1' },
    { sha: 'def456', message: 'fix: bug fix', author: 'Test User', date: '2023-01-02', url: 'http://test.com/2' },
    { sha: 'ghi789', message: 'docs: update documentation', author: 'Test User', date: '2023-01-03', url: 'http://test.com/3' }
  ];

  describe('generateChangelogPrompt', () => {
    it('should generate prompt with version and title', () => {
      const prompt = generateChangelogPrompt(mockCommits, '1.0.0', 'Feature Release');
      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });

    it('should generate prompt with version only', () => {
      const prompt = generateChangelogPrompt(mockCommits, '1.0.0');
      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
      expect(prompt).toContain('[[versions]]');
    });

    it('should handle empty commits array', () => {
      const prompt = generateChangelogPrompt([], '1.0.0', 'Test');
      expect(prompt).toBeDefined();
      expect(prompt.length).toBeGreaterThan(0);
    });
  });

  describe('systemPrompts', () => {
    it('should have changelogWriter prompt', () => {
      expect(systemPrompts.changelogWriter).toBeDefined();
      expect(typeof systemPrompts.changelogWriter).toBe('string');
      expect(systemPrompts.changelogWriter).toContain('professional changelog writer');
    });
  });
}); 