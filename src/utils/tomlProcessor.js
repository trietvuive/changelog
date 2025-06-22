const fs = require('fs').promises;
const path = require('path');
const TOML = require('@iarna/toml');
const ChangelogEntry = require('./changelogEntry');

class TomlProcessor {
  constructor(filePath = null) {
    this.filePath = filePath || path.join(process.cwd(), 'changelog.toml');
  }

  async readChangelog() {
    try {
      const content = await fs.readFile(this.filePath, 'utf8');
      const changelogData = TOML.parse(content);
      return {
        success: true,
        data: changelogData,
        content: content
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty structure
        return {
          success: true,
          data: { versions: [] },
          content: ''
        };
      }
      return {
        success: false,
        error: error.message,
        data: null,
        content: null
      };
    }
  }

  async writeChangelog(changelogData) {
    try {
      const tomlContent = TOML.stringify(changelogData);
      await fs.writeFile(this.filePath, tomlContent, 'utf8');
      return {
        success: true,
        message: 'Changelog written successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async addVersion(version, title, changelog) {
    try {
      // Read and parse the TOML file (if exists)
      let changelogData = {};
      let fileExists = true;
      try {
        const content = await fs.readFile(this.filePath, 'utf8');
        changelogData = TOML.parse(content);
      } catch (err) {
        if (err.code === 'ENOENT') {
          fileExists = false;
          changelogData = {};
        } else {
          throw err;
        }
      }

      // Insert the changelog TOML string after the main TOML content
      const finalContent = changelogData + '\n' + changelog;
      
      await fs.writeFile(this.filePath, finalContent, 'utf8');

      return {
        success: true,
        message: 'Changelog entry inserted'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async parseChangelogEntry(tomlString) {
    try {
      const entry = ChangelogEntry.fromToml(tomlString);
      return {
        success: true,
        entry: entry,
        markdown: entry.toMarkdown()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        entry: null,
        markdown: null
      };
    }
  }

  async deleteVersion(version) {
    try {
      const result = await this.readChangelog();
      if (!result.success) {
        return result;
      }

      const changelogData = result.data;
      
      if (!changelogData.versions) {
        return {
          success: false,
          error: 'No versions found'
        };
      }

      const initialLength = changelogData.versions.length;
      changelogData.versions = changelogData.versions.filter(v => v.version !== version);

      if (changelogData.versions.length === initialLength) {
        return {
          success: false,
          error: 'Version not found'
        };
      }

      return await this.writeChangelog(changelogData);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateVersion(version, updates) {
    try {
      const result = await this.readChangelog();
      if (!result.success) {
        return result;
      }

      const changelogData = result.data;
      
      if (!changelogData.versions) {
        return {
          success: false,
          error: 'No versions found'
        };
      }

      const versionIndex = changelogData.versions.findIndex(v => v.version === version);
      if (versionIndex === -1) {
        return {
          success: false,
          error: 'Version not found'
        };
      }

      // Update the version with provided fields
      Object.assign(changelogData.versions[versionIndex], updates);

      const writeResult = await this.writeChangelog(changelogData);
      if (writeResult.success) {
        return {
          success: true,
          message: 'Version updated successfully',
          version: changelogData.versions[versionIndex]
        };
      }
      return writeResult;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAllVersions() {
    try {
      const result = await this.readChangelog();
      if (!result.success) {
        return result;
      }

      return {
        success: true,
        versions: result.data.versions || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        versions: []
      };
    }
  }

  setFilePath(newPath) {
    this.filePath = newPath;
  }
}

module.exports = TomlProcessor; 