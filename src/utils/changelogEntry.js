const TOML = require('@iarna/toml');

class ChangelogEntry {
  constructor(data = {}) {
    this.version = data.version || '';
    this.date = data.date || '';
    this.title = data.title || '';
    this.changes = data.changes || [];
  }

  static fromToml(tomlString) {
    try {
      const parsed = TOML.parse(tomlString);
      return new ChangelogEntry(parsed);
    } catch (error) {
      throw new Error(`Failed to parse TOML: ${error.message}`);
    }
  }

  toMarkdown() {
    let markdown = `## ${this.title || `Version ${this.version}`}\n\n`;

    if (this.date) {
      markdown += `**Date:** ${this.date}\n\n`;
    }

    if (this.changes && this.changes.length > 0) {
      // Group changes by type
      const groupedChanges = this.groupChangesByType();

      for (const [type, changes] of Object.entries(groupedChanges)) {
        const typeEmoji = this.getTypeEmoji(type);
        const typeTitle = this.getTypeTitle(type);

        markdown += `### ${typeEmoji} ${typeTitle}\n\n`;

        for (const change of changes) {
          markdown += `- **${change.title}**`;
          if (change.description) {
            markdown += `: ${change.description}`;
          }
          markdown += '\n';
        }
        markdown += '\n';
      }
    }

    return markdown.trim();
  }

  groupChangesByType() {
    const grouped = {};

    for (const change of this.changes) {
      const type = change.type || 'other';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(change);
    }

    return grouped;
  }

  getTypeEmoji(type) {
    const emojiMap = {
      'feature': '✨',
      'fix': '🐛',
      'breaking': '💥',
      'improvement': '⚡',
      'security': '🔒',
      'deprecated': '⚠️',
      'removed': '🗑️',
      'other': '📝'
    };

    return emojiMap[type] || '📝';
  }

  getTypeTitle(type) {
    const titleMap = {
      'feature': 'New Features',
      'fix': 'Bug Fixes',
      'breaking': 'Breaking Changes',
      'improvement': 'Improvements',
      'security': 'Security',
      'deprecated': 'Deprecated',
      'removed': 'Removed',
      'other': 'Other Changes'
    };

    return titleMap[type] || 'Other Changes';
  }

  toToml() {
    const data = {
      version: this.version,
      date: this.date,
      title: this.title
    };

    if (this.changes && this.changes.length > 0) {
      data.changes = this.changes;
    }

    return TOML.stringify(data);
  }

  addChange(type, title, description = '') {
    this.changes.push({
      type,
      title,
      description
    });
  }

  setVersion(version) {
    this.version = version;
  }

  setTitle(title) {
    this.title = title;
  }

  setDate(date) {
    this.date = date;
  }
}

module.exports = ChangelogEntry;
