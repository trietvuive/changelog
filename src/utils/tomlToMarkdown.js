class TomlToMarkdown {
  static convert(tomlData) {
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

  static groupChangesByType(changes) {
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
}

module.exports = TomlToMarkdown; 