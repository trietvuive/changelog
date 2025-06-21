const fs = require('fs').promises;
const path = require('path');
const TOML = require('@iarna/toml');

class ChangelogReader {
  constructor(filePath = null) {
    this.filePath = filePath || path.join(__dirname, '..', '..', 'changelog.toml');
  }

  async readChangelog() {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      const tomlData = TOML.parse(content);
      
      // Convert TOML to markdown
      const markdownContent = this.tomlToMarkdown(tomlData);
      
      return {
        success: true,
        content: markdownContent,
        rawData: tomlData,
        lastModified: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        content: null,
        rawData: null
      };
    }
  }

  tomlToMarkdown(tomlData) {
    let markdown = '';
    
    // Add title if present
    if (tomlData.title) {
      markdown += `# ${tomlData.title}\n\n`;
    }
    
    if (tomlData.description) {
      markdown += `${tomlData.description}\n\n`;
    }

    // Process versions
    if (tomlData.versions && Array.isArray(tomlData.versions)) {
      tomlData.versions.forEach(version => {
        // Version header
        const versionTitle = version.title || `Version ${version.version}`;
        markdown += `## ${versionTitle} - ${version.date}\n\n`;
        
        // Group changes by type
        const changesByType = this.groupChangesByType(version.changes);
        
        // Breaking changes first
        if (changesByType.breaking && changesByType.breaking.length > 0) {
          markdown += '### ⚠️ Breaking Changes\n\n';
          changesByType.breaking.forEach(change => {
            markdown += `- **${change.title}** - ${change.description}\n`;
          });
          markdown += '\n';
        }
        
        // Features
        if (changesByType.feature && changesByType.feature.length > 0) {
          markdown += '### ✨ New Features\n\n';
          changesByType.feature.forEach(change => {
            markdown += `- **${change.title}** - ${change.description}\n`;
          });
          markdown += '\n';
        }
        
        // Fixes
        if (changesByType.fix && changesByType.fix.length > 0) {
          markdown += '### 🐛 Bug Fixes\n\n';
          changesByType.fix.forEach(change => {
            markdown += `- **${change.title}** - ${change.description}\n`;
          });
          markdown += '\n';
        }
        
        // Improvements
        if (changesByType.improvement && changesByType.improvement.length > 0) {
          markdown += '### 🔧 Improvements\n\n';
          changesByType.improvement.forEach(change => {
            markdown += `- **${change.title}** - ${change.description}\n`;
          });
          markdown += '\n';
        }
        
        // Documentation
        if (changesByType.docs && changesByType.docs.length > 0) {
          markdown += '### 📚 Documentation\n\n';
          changesByType.docs.forEach(change => {
            markdown += `- **${change.title}** - ${change.description}\n`;
          });
          markdown += '\n';
        }
        
        // Other changes
        if (changesByType.other && changesByType.other.length > 0) {
          markdown += '### 🔧 Other Changes\n\n';
          changesByType.other.forEach(change => {
            markdown += `- **${change.title}** - ${change.description}\n`;
          });
          markdown += '\n';
        }
        
        // Add separator between versions
        markdown += '---\n\n';
      });
    }
    
    return markdown.trim();
  }

  groupChangesByType(changes) {
    const grouped = {
      breaking: [],
      feature: [],
      fix: [],
      improvement: [],
      docs: [],
      other: []
    };
    
    if (changes && Array.isArray(changes)) {
      changes.forEach(change => {
        const type = change.type || 'other';
        if (grouped[type]) {
          grouped[type].push(change);
        } else {
          grouped.other.push(change);
        }
      });
    }
    
    return grouped;
  }

  async getFileInfo() {
    try {
      const stats = await fs.stat(this.filePath);
      return {
        exists: true,
        size: stats.size,
        lastModified: stats.mtime,
        path: this.filePath,
        type: 'toml'
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message,
        path: this.filePath,
        type: 'toml'
      };
    }
  }

  setFilePath(newPath) {
    this.filePath = newPath;
  }
}

module.exports = ChangelogReader; 