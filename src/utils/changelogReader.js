const fs = require('fs').promises;
const path = require('path');

class ChangelogReader {
  constructor(filePath = null) {
    this.filePath = filePath || path.join(__dirname, '..', '..', 'changelog.txt');
  }

  async readChangelog() {
    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      return {
        success: true,
        content,
        lastModified: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        content: null
      };
    }
  }

  async getFileInfo() {
    try {
      const stats = await fs.stat(this.filePath);
      return {
        exists: true,
        size: stats.size,
        lastModified: stats.mtime,
        path: this.filePath
      };
    } catch (error) {
      return {
        exists: false,
        error: error.message,
        path: this.filePath
      };
    }
  }

  setFilePath(newPath) {
    this.filePath = newPath;
  }
}

module.exports = ChangelogReader; 