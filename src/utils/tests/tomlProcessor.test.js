const fs = require('fs').promises;
const path = require('path');
const TomlProcessor = require('../tomlProcessor');

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    stat: jest.fn()
  }
}));

describe('TomlProcessor', () => {
  let tomlProcessor;
  const testFilePath = '/test/changelog.toml';

  beforeEach(() => {
    tomlProcessor = new TomlProcessor(testFilePath);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should set default file path when none provided', () => {
      const processor = new TomlProcessor();
      expect(processor.filePath).toContain('changelog.toml');
    });

    it('should set custom file path when provided', () => {
      const customPath = '/custom/path/changelog.toml';
      const processor = new TomlProcessor(customPath);
      expect(processor.filePath).toBe(customPath);
    });
  });

  describe('readChangelog', () => {
    it('should read and parse existing TOML file successfully', async () => {
      const mockContent = `
title = "Test Changelog"
description = "Test description"

[[versions]]
version = "1.0.0"
date = "2024-01-15"
title = "First Release"
      `;

      fs.readFile.mockResolvedValue(mockContent);

      const result = await tomlProcessor.readChangelog();

      expect(result.success).toBe(true);
      expect(result.data.title).toBe('Test Changelog');
      expect(result.data.description).toBe('Test description');
      expect(result.data.versions).toHaveLength(1);
      expect(result.data.versions[0].version).toBe('1.0.0');
      expect(fs.readFile).toHaveBeenCalledWith(testFilePath, 'utf8');
    });

    it('should handle file not found by returning empty structure', async () => {
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);

      const result = await tomlProcessor.readChangelog();

      expect(result.success).toBe(true);
      expect(result.data.versions).toEqual([]);
    });

    it('should handle parsing errors', async () => {
      const invalidToml = 'invalid toml content';
      fs.readFile.mockResolvedValue(invalidToml);

      const result = await tomlProcessor.readChangelog();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid character');
    });

    it('should handle other file system errors', async () => {
      const error = new Error('Permission denied');
      error.code = 'EACCES';
      fs.readFile.mockRejectedValue(error);

      const result = await tomlProcessor.readChangelog();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Permission denied');
    });
  });

  describe('writeChangelog', () => {
    it('should write TOML data to file successfully', async () => {
      const changelogData = {
        title: 'Test Changelog',
        versions: [
          { version: '1.0.0', date: '2024-01-15', title: 'First Release' }
        ]
      };

      fs.writeFile.mockResolvedValue();

      const result = await tomlProcessor.writeChangelog(changelogData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Changelog written successfully');
      expect(fs.writeFile).toHaveBeenCalledWith(testFilePath, expect.any(String), 'utf8');
    });

    it('should handle write errors', async () => {
      const changelogData = { title: 'Test' };
      const error = new Error('Write failed');
      fs.writeFile.mockRejectedValue(error);

      const result = await tomlProcessor.writeChangelog(changelogData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Write failed');
    });
  });

  describe('addVersion', () => {
    it('should add new version to existing file', async () => {
      const existingContent = `
title = "Test Changelog"

[[versions]]
version = "1.0.0"
date = "2024-01-15"
title = "First Release"
      `;

      const newChangelog = `
[[versions]]
version = "1.1.0"
date = "2024-01-20"
title = "Second Release"

[[versions.changes]]
type = "feature"
title = "New Feature"
description = "Added new feature"
      `;

      fs.readFile.mockResolvedValue(existingContent);
      fs.writeFile.mockResolvedValue();

      const result = await tomlProcessor.addVersion('1.1.0', 'Second Release', newChangelog);

      expect(result.success).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledWith(testFilePath, expect.stringContaining("1.0.0"), 'utf8');
      expect(fs.writeFile).toHaveBeenCalledWith(testFilePath, expect.stringContaining("1.1.0"), 'utf8');
    });

    it('should handle errors during addVersion', async () => {
      const error = new Error('Permission denied');
      fs.readFile.mockRejectedValue(error);

      const result = await tomlProcessor.addVersion('1.0.0', 'Test', 'changelog');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Permission denied');
    });
  });

  describe('parseChangelogEntry', () => {
    it('should parse valid TOML string to ChangelogEntry', async () => {
      const tomlString = `
version = "1.0.0"
date = "2024-01-15"
title = "Test Release"

[[changes]]
type = "feature"
title = "New Feature"
description = "Added new feature"
      `;

      const result = await tomlProcessor.parseChangelogEntry(tomlString);

      expect(result.success).toBe(true);
      expect(result.entry).toBeDefined();
      expect(result.entry.version).toBe('1.0.0');
      expect(result.entry.title).toBe('Test Release');
      expect(result.markdown).toContain('## Test Release');
    });

    it('should handle invalid TOML string', async () => {
      const invalidToml = 'invalid toml content';

      const result = await tomlProcessor.parseChangelogEntry(invalidToml);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to parse TOML');
      expect(result.entry).toBeNull();
      expect(result.markdown).toBeNull();
    });
  });

  describe('deleteVersion', () => {
    it('should delete existing version successfully', async () => {
      const mockContent = `
[[versions]]
version = "1.0.0"
date = "2024-01-15"
title = "First Release"

[[versions]]
version = "1.1.0"
date = "2024-01-20"
title = "Second Release"
      `;

      fs.readFile.mockResolvedValue(mockContent);
      fs.writeFile.mockResolvedValue();

      const result = await tomlProcessor.deleteVersion('1.0.0');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Changelog written successfully');
      expect(fs.writeFile).toHaveBeenCalledWith(testFilePath, expect.not.stringContaining('1.0.0'), 'utf8');
    });

    it('should handle version not found', async () => {
      const mockContent = `
[[versions]]
version = "1.0.0"
date = "2024-01-15"
title = "First Release"
      `;

      fs.readFile.mockResolvedValue(mockContent);

      const result = await tomlProcessor.deleteVersion('2.0.0');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Version not found');
    });

    it('should handle no versions found', async () => {
      const mockContent = 'title = "Empty Changelog"';
      fs.readFile.mockResolvedValue(mockContent);

      const result = await tomlProcessor.deleteVersion('1.0.0');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No versions found');
    });
  });

  describe('updateVersion', () => {
    it('should update existing version successfully', async () => {
      const mockContent = `
[[versions]]
version = "1.0.0"
date = "2024-01-15"
title = "First Release"
      `;

      fs.readFile.mockResolvedValue(mockContent);
      fs.writeFile.mockResolvedValue();

      const updates = { title: 'Updated Release' };
      const result = await tomlProcessor.updateVersion('1.0.0', updates);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Version updated successfully');
      expect(result.version.title).toBe('Updated Release');
    });

    it('should handle version not found', async () => {
      const mockContent = `
[[versions]]
version = "1.0.0"
date = "2024-01-15"
title = "First Release"
      `;

      fs.readFile.mockResolvedValue(mockContent);

      const result = await tomlProcessor.updateVersion('2.0.0', { title: 'New Title' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Version not found');
    });

    it('should handle no versions found', async () => {
      const mockContent = 'title = "Empty Changelog"';
      fs.readFile.mockResolvedValue(mockContent);

      const result = await tomlProcessor.updateVersion('1.0.0', { title: 'New Title' });

      expect(result.success).toBe(false);
      expect(result.error).toBe('No versions found');
    });
  });

  describe('getAllVersions', () => {
    it('should return all versions successfully', async () => {
      const mockContent = `
[[versions]]
version = "1.0.0"
date = "2024-01-15"
title = "First Release"

[[versions]]
version = "1.1.0"
date = "2024-01-20"
title = "Second Release"
      `;

      fs.readFile.mockResolvedValue(mockContent);

      const result = await tomlProcessor.getAllVersions();

      expect(result.success).toBe(true);
      expect(result.versions).toHaveLength(2);
      expect(result.versions[0].version).toBe('1.0.0');
      expect(result.versions[1].version).toBe('1.1.0');
    });

    it('should return empty array when no versions exist', async () => {
      const mockContent = 'title = "Empty Changelog"';
      fs.readFile.mockResolvedValue(mockContent);

      const result = await tomlProcessor.getAllVersions();

      expect(result.success).toBe(true);
      expect(result.versions).toEqual([]);
    });

    it('should handle read errors', async () => {
      const error = new Error('Read failed');
      fs.readFile.mockRejectedValue(error);

      const result = await tomlProcessor.getAllVersions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Read failed');
      expect(result.versions).toBeUndefined();
    });
  });

  describe('setFilePath', () => {
    it('should update file path', () => {
      const newPath = '/new/path/changelog.toml';
      tomlProcessor.setFilePath(newPath);
      expect(tomlProcessor.filePath).toBe(newPath);
    });
  });
}); 