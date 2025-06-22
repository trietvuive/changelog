const ChangelogEntry = require('../changelogEntry');

describe('ChangelogEntry', () => {
  describe('fromToml', () => {
    it('should parse TOML string to ChangelogEntry object', () => {
      const tomlString = `
version = "1.0.0"
date = "2024-01-15"
title = "Feature Release"

[[changes]]
type = "feature"
title = "User Authentication"
description = "Added user authentication system"

[[changes]]
type = "fix"
title = "Login Bug"
description = "Fixed login form validation"
      `;

      const entry = ChangelogEntry.fromToml(tomlString);

      expect(entry.version).toBe('1.0.0');
      expect(entry.date).toBe('2024-01-15');
      expect(entry.title).toBe('Feature Release');
      expect(entry.changes).toHaveLength(2);
      expect(entry.changes[0].type).toBe('feature');
      expect(entry.changes[0].title).toBe('User Authentication');
      expect(entry.changes[1].type).toBe('fix');
      expect(entry.changes[1].title).toBe('Login Bug');
    });

    it('should throw error for invalid TOML', () => {
      const invalidToml = 'version = "1.0.0" invalid syntax';
      
      expect(() => {
        ChangelogEntry.fromToml(invalidToml);
      }).toThrow('Failed to parse TOML');
    });
  });

  describe('toMarkdown', () => {
    it('should convert ChangelogEntry to markdown', () => {
      const entry = new ChangelogEntry({
        version: '1.0.0',
        date: '2024-01-15',
        title: 'Feature Release',
        changes: [
          {
            type: 'feature',
            title: 'User Authentication',
            description: 'Added user authentication system'
          },
          {
            type: 'fix',
            title: 'Login Bug',
            description: 'Fixed login form validation'
          }
        ]
      });

      const markdown = entry.toMarkdown();

      expect(markdown).toContain('## Feature Release');
      expect(markdown).toContain('**Date:** 2024-01-15');
      expect(markdown).toContain('### ✨ New Features');
      expect(markdown).toContain('### 🐛 Bug Fixes');
      expect(markdown).toContain('- **User Authentication**: Added user authentication system');
      expect(markdown).toContain('- **Login Bug**: Fixed login form validation');
    });

    it('should handle entry without changes', () => {
      const entry = new ChangelogEntry({
        version: '1.0.0',
        title: 'Empty Release'
      });

      const markdown = entry.toMarkdown();

      expect(markdown).toBe('## Empty Release');
    });

    it('should use version as title if title is not provided', () => {
      const entry = new ChangelogEntry({
        version: '1.0.0'
      });

      const markdown = entry.toMarkdown();

      expect(markdown).toBe('## Version 1.0.0');
    });
  });

  describe('groupChangesByType', () => {
    it('should group changes by type', () => {
      const entry = new ChangelogEntry({
        changes: [
          { type: 'feature', title: 'Feature 1' },
          { type: 'fix', title: 'Fix 1' },
          { type: 'feature', title: 'Feature 2' },
          { type: 'improvement', title: 'Improvement 1' }
        ]
      });

      const grouped = entry.groupChangesByType();

      expect(grouped.feature).toHaveLength(2);
      expect(grouped.fix).toHaveLength(1);
      expect(grouped.improvement).toHaveLength(1);
      expect(grouped.feature[0].title).toBe('Feature 1');
      expect(grouped.feature[1].title).toBe('Feature 2');
    });
  });

  describe('getTypeEmoji', () => {
    it('should return correct emoji for each type', () => {
      const entry = new ChangelogEntry();
      
      expect(entry.getTypeEmoji('feature')).toBe('✨');
      expect(entry.getTypeEmoji('fix')).toBe('🐛');
      expect(entry.getTypeEmoji('breaking')).toBe('💥');
      expect(entry.getTypeEmoji('improvement')).toBe('⚡');
      expect(entry.getTypeEmoji('security')).toBe('🔒');
      expect(entry.getTypeEmoji('deprecated')).toBe('⚠️');
      expect(entry.getTypeEmoji('removed')).toBe('🗑️');
      expect(entry.getTypeEmoji('other')).toBe('📝');
      expect(entry.getTypeEmoji('unknown')).toBe('📝');
    });
  });

  describe('getTypeTitle', () => {
    it('should return correct title for each type', () => {
      const entry = new ChangelogEntry();
      
      expect(entry.getTypeTitle('feature')).toBe('New Features');
      expect(entry.getTypeTitle('fix')).toBe('Bug Fixes');
      expect(entry.getTypeTitle('breaking')).toBe('Breaking Changes');
      expect(entry.getTypeTitle('improvement')).toBe('Improvements');
      expect(entry.getTypeTitle('security')).toBe('Security');
      expect(entry.getTypeTitle('deprecated')).toBe('Deprecated');
      expect(entry.getTypeTitle('removed')).toBe('Removed');
      expect(entry.getTypeTitle('other')).toBe('Other Changes');
      expect(entry.getTypeTitle('unknown')).toBe('Other Changes');
    });
  });

  describe('toToml', () => {
    it('should convert ChangelogEntry back to TOML', () => {
      const entry = new ChangelogEntry({
        version: '1.0.0',
        date: '2024-01-15',
        title: 'Feature Release',
        changes: [
          {
            type: 'feature',
            title: 'User Authentication',
            description: 'Added user authentication system'
          }
        ]
      });

      const toml = entry.toToml();

      expect(toml).toContain('version = "1.0.0"');
      expect(toml).toContain('date = "2024-01-15"');
      expect(toml).toContain('title = "Feature Release"');
      expect(toml).toContain('[[changes]]');
      expect(toml).toContain('type = "feature"');
      expect(toml).toContain('title = "User Authentication"');
      expect(toml).toContain('description = "Added user authentication system"');
    });
  });

  describe('addChange', () => {
    it('should add a new change to the entry', () => {
      const entry = new ChangelogEntry();
      
      entry.addChange('feature', 'New Feature', 'Description of new feature');
      
      expect(entry.changes).toHaveLength(1);
      expect(entry.changes[0].type).toBe('feature');
      expect(entry.changes[0].title).toBe('New Feature');
      expect(entry.changes[0].description).toBe('Description of new feature');
    });
  });
}); 