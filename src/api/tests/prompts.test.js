const { generateChangelogPrompt, analyzeCommitsPrompt, systemPrompts } = require('../prompts');

describe('Prompts', () => {
  const mockCommits = [
    { sha: 'abc123', message: 'feat: add new feature', author: 'Test User', date: '2023-01-01', url: 'http://test.com/1' },
    { sha: 'def456', message: 'fix: bug fix', author: 'Test User', date: '2023-01-02', url: 'http://test.com/2' },
    { sha: 'ghi789', message: 'docs: update documentation', author: 'Test User', date: '2023-01-03', url: 'http://test.com/3' }
  ];

  describe('generateChangelogPrompt', () => {
    it('should generate prompt with version and title', () => {
      const prompt = generateChangelogPrompt(mockCommits, '1.0.0', 'Feature Release');
      expect(prompt).toContain('Generate a changelog entry for version 1.0.0 - Feature Release');
      expect(prompt).toContain('feat: add new feature (abc123) - Test User');
      expect(prompt).toContain('fix: bug fix (def456) - Test User');
      expect(prompt).toContain('docs: update documentation (ghi789) - Test User');
      expect(prompt).toContain('✨ New Features');
      expect(prompt).toContain('🐛 Bug Fixes');
      expect(prompt).toContain('📚 Documentation');
    });

    it('should generate prompt with version only', () => {
      const prompt = generateChangelogPrompt(mockCommits, '1.0.0');
      expect(prompt).toContain('Generate a changelog entry for version 1.0.0');
      expect(prompt).not.toContain('Generate a changelog entry for version 1.0.0 -');
    });

    it('should handle empty commits array', () => {
      const prompt = generateChangelogPrompt([], '1.0.0', 'Test');
      expect(prompt).toContain('Generate a changelog entry for version 1.0.0 - Test');
      expect(prompt).toContain('Please generate the changelog entry now:');
    });

    it('should include all required sections in the prompt', () => {
      const prompt = generateChangelogPrompt(mockCommits, '1.0.0', 'Test');
      expect(prompt).toContain('### ✨ New Features');
      expect(prompt).toContain('### 🐛 Bug Fixes');
      expect(prompt).toContain('### 🔧 Improvements');
      expect(prompt).toContain('### ⚠️ Breaking Changes (if any)');
      expect(prompt).toContain('### 📚 Documentation (if any)');
      expect(prompt).toContain('### 🔧 Other Changes (if any)');
    });
  });

  describe('analyzeCommitsPrompt', () => {
    it('should generate analysis prompt with commits', () => {
      const prompt = analyzeCommitsPrompt(mockCommits);
      
      expect(prompt).toContain('feat: add new feature (abc123) - Test User');
      expect(prompt).toContain('fix: bug fix (def456) - Test User');
      expect(prompt).toContain('docs: update documentation (ghi789) - Test User');
      expect(prompt).toContain('feature (new functionality)');
      expect(prompt).toContain('fix (bug fix)');
      expect(prompt).toContain('improvement (enhancement)');
      expect(prompt).toContain('breaking (breaking change)');
      expect(prompt).toContain('docs (documentation)');
      expect(prompt).toContain('other (miscellaneous)');
    });

    it('should include JSON structure in the prompt', () => {
      const prompt = analyzeCommitsPrompt(mockCommits);
      
      expect(prompt).toContain('"categories":');
      expect(prompt).toContain('"feature":');
      expect(prompt).toContain('"fix":');
      expect(prompt).toContain('"improvement":');
      expect(prompt).toContain('"breaking":');
      expect(prompt).toContain('"docs":');
      expect(prompt).toContain('"other":');
      expect(prompt).toContain('"summary":');
    });

    it('should handle empty commits array', () => {
      const prompt = analyzeCommitsPrompt([]);
      
      expect(prompt).toContain('Commits to analyze:');
      expect(prompt).toContain('Return only the JSON object:');
    });
  });

  describe('systemPrompts', () => {
    it('should have changelogWriter prompt', () => {
      expect(systemPrompts.changelogWriter).toBeDefined();
      expect(typeof systemPrompts.changelogWriter).toBe('string');
      expect(systemPrompts.changelogWriter).toContain('professional changelog writer');
    });

    it('should have commitAnalyzer prompt', () => {
      expect(systemPrompts.commitAnalyzer).toBeDefined();
      expect(typeof systemPrompts.commitAnalyzer).toBe('string');
      expect(systemPrompts.commitAnalyzer).toContain('commit analyzer');
    });
  });
}); 