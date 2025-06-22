const path = require('path');
const ChangelogEntry = require('./changelogEntry');
const TomlProcessor = require('./tomlProcessor');

class ChangelogReader {
  constructor(filePath = null) {
    this.filePath = filePath || path.join(__dirname, '..', '..', 'changelog.toml');
    this.processor = new TomlProcessor(this.filePath);
  }

  async readChangelog() {
    try {
      const result = await this.processor.readChangelog();

      if (!result.success) {
        return {
          success: false,
          error: result.error,
          content: null,
          rawData: null
        };
      }

      // Sort versions by date (latest first)
      if (result.data.versions && Array.isArray(result.data.versions)) {
        result.data.versions.sort((a, b) => {
          const dateA = a.date ? new Date(a.date) : new Date(0);
          const dateB = b.date ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        });
      }

      // Convert TOML to markdown using ChangelogEntry
      const markdownContent = this.convertTomlToMarkdown(result.data);

      return {
        success: true,
        content: markdownContent,
        rawData: result.data,
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

  convertTomlToMarkdown(tomlData) {
    let markdown = '';

    // Add title and description if present
    if (tomlData.title) {
      markdown += `# ${tomlData.title}\n\n`;
    }

    if (tomlData.description) {
      markdown += `${tomlData.description}\n\n`;
    }

    // Process versions
    if (tomlData.versions && tomlData.versions.length > 0) {
      for (const versionData of tomlData.versions) {
        const entry = new ChangelogEntry(versionData);
        markdown += `${entry.toMarkdown()}\n\n`;
      }
    }

    return markdown.trim();
  }

  async getFileInfo() {
    try {
      const result = await this.processor.readChangelog();

      if (!result.success) {
        return {
          exists: false,
          error: result.error,
          path: this.filePath,
          type: 'toml'
        };
      }

      // Get file stats from the processor's file path
      const fs = require('fs').promises;
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

  // Delegate methods to tomlProcessor
  async addVersion(version, title, changelog) {
    return await this.processor.addVersion(version, title, changelog);
  }

  async getAllVersions() {
    return await this.processor.getAllVersions();
  }

  async deleteVersion(version) {
    return await this.processor.deleteVersion(version);
  }

  async updateVersion(version, updates) {
    return await this.processor.updateVersion(version, updates);
  }

  async parseChangelogEntry(tomlString) {
    return await this.processor.parseChangelogEntry(tomlString);
  }

  setFilePath(newPath) {
    this.filePath = newPath;
    this.processor.setFilePath(newPath);
  }
}

module.exports = ChangelogReader;
