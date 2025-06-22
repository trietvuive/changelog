const request = require('supertest');
const express = require('express');

// Mock the ChangelogReader
jest.mock('../../utils/changelogReader');
const ChangelogReader = require('../../utils/changelogReader');

let app;
let mockChangelogReader;

describe('Changelog API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockChangelogReader = {
      addVersion: jest.fn(),
      getAllVersions: jest.fn(),
      deleteVersion: jest.fn(),
      updateVersion: jest.fn()
    };
    ChangelogReader.mockImplementation(() => mockChangelogReader);

    app = express();
    app.use(express.json());
    const changelogRoutes = require('../changelog');
    app.use('/api/changelog', changelogRoutes);
  });

  describe('POST /api/changelog/save-changelog', () => {
    it('should save changelog successfully with valid data', async () => {
      mockChangelogReader.addVersion.mockResolvedValue({
        success: true,
        message: 'Changelog entry inserted'
      });

      const changelogData = {
        changelog: `
[[versions]]
version = "1.0.0"
date = "2024-01-15"
title = "Test Release"
`,
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/changelog/save-changelog')
        .send(changelogData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Changelog saved successfully');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.title).toBe('Test Release');
      expect(mockChangelogReader.addVersion).toHaveBeenCalledWith('1.0.0', 'Test Release', changelogData.changelog);
    });

    it('should return 400 when changelog is missing', async () => {
      const changelogData = {
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/changelog/save-changelog')
        .send(changelogData)
        .expect(400);

      expect(response.body.error).toBe('Changelog content and version are required');
    });

    it('should return 400 when version is missing', async () => {
      const changelogData = {
        changelog: 'test changelog',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/changelog/save-changelog')
        .send(changelogData)
        .expect(400);

      expect(response.body.error).toBe('Changelog content and version are required');
    });

    it('should return 400 when both changelog and version are missing', async () => {
      const changelogData = {
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/changelog/save-changelog')
        .send(changelogData)
        .expect(400);

      expect(response.body.error).toBe('Changelog content and version are required');
    });

    it('should return 500 when addVersion fails', async () => {
      mockChangelogReader.addVersion.mockResolvedValue({
        success: false,
        error: 'Failed to save'
      });

      const changelogData = {
        changelog: 'test changelog',
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/changelog/save-changelog')
        .send(changelogData)
        .expect(500);

      // The API returns a generic error message
      expect(response.body.error).toBe('Failed to save changelog');
    });
  });

  describe('GET /api/changelog/versions', () => {
    it('should return all versions successfully', async () => {
      const mockVersions = [
        { version: '1.0.0', title: 'First Release', date: '2024-01-15' },
        { version: '1.1.0', title: 'Second Release', date: '2024-01-20' }
      ];

      mockChangelogReader.getAllVersions.mockResolvedValue({
        success: true,
        versions: mockVersions
      });

      const response = await request(app)
        .get('/api/changelog/versions')
        .expect(200);

      expect(response.body).toHaveProperty('versions');
      expect(Array.isArray(response.body.versions)).toBe(true);
      expect(response.body.versions).toEqual(mockVersions);
    });

    it('should return 500 when getAllVersions fails', async () => {
      mockChangelogReader.getAllVersions.mockResolvedValue({
        success: false,
        error: 'Failed to read versions'
      });

      const response = await request(app)
        .get('/api/changelog/versions')
        .expect(500);

      expect(response.body.error).toBe('Failed to read versions');
    });
  });

  describe('DELETE /api/changelog/versions/:version', () => {
    it('should delete version successfully', async () => {
      mockChangelogReader.deleteVersion.mockResolvedValue({
        success: true,
        message: 'Version deleted successfully'
      });

      const version = '1.0.0';

      const response = await request(app)
        .delete(`/api/changelog/versions/${version}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Version deleted successfully');
      expect(mockChangelogReader.deleteVersion).toHaveBeenCalledWith(version);
    });

    it('should return 404 when version not found', async () => {
      mockChangelogReader.deleteVersion.mockResolvedValue({
        success: false,
        error: 'Version not found'
      });

      const version = 'nonexistent-version';

      const response = await request(app)
        .delete(`/api/changelog/versions/${version}`)
        .expect(404);

      // The API returns a generic error message
      expect(response.body.error).toBe('Failed to delete version');
    });
  });

  describe('PUT /api/changelog/versions/:version', () => {
    it('should update version title successfully', async () => {
      const mockUpdatedVersion = {
        version: '1.0.0',
        title: 'Updated Release Title',
        date: '2024-01-15'
      };

      mockChangelogReader.updateVersion.mockResolvedValue({
        success: true,
        message: 'Version updated successfully',
        version: mockUpdatedVersion
      });

      const version = '1.0.0';
      const updateData = {
        title: 'Updated Release Title'
      };

      const response = await request(app)
        .put(`/api/changelog/versions/${version}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Version updated successfully');
      expect(response.body.version).toEqual(mockUpdatedVersion);
      expect(mockChangelogReader.updateVersion).toHaveBeenCalledWith(version, updateData);
    });

    it('should update version content successfully', async () => {
      mockChangelogReader.updateVersion.mockResolvedValue({
        success: true,
        message: 'Version updated successfully'
      });

      const version = '1.0.0';
      const updateData = {
        content: 'Updated changelog content'
      };

      const response = await request(app)
        .put(`/api/changelog/versions/${version}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Version updated successfully');
    });

    it('should update both title and content', async () => {
      mockChangelogReader.updateVersion.mockResolvedValue({
        success: true,
        message: 'Version updated successfully'
      });

      const version = '1.0.0';
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      const response = await request(app)
        .put(`/api/changelog/versions/${version}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Version updated successfully');
    });

    it('should return 404 when version not found', async () => {
      mockChangelogReader.updateVersion.mockResolvedValue({
        success: false,
        error: 'Version not found'
      });

      const version = 'nonexistent-version';
      const updateData = {
        title: 'Updated Title'
      };

      const response = await request(app)
        .put(`/api/changelog/versions/${version}`)
        .send(updateData)
        .expect(404);

      // The API returns a generic error message
      expect(response.body.error).toBe('Failed to update version');
    });

    it('should handle empty update data', async () => {
      mockChangelogReader.updateVersion.mockResolvedValue({
        success: true,
        message: 'Version updated successfully'
      });

      const version = '1.0.0';
      const updateData = {};

      const response = await request(app)
        .put(`/api/changelog/versions/${version}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Version updated successfully');
    });
  });

  describe('Error handling', () => {
    it('should handle missing Content-Type header', async () => {
      const response = await request(app)
        .post('/api/changelog/save-changelog')
        .send('{"changelog": "test", "version": "1.0.0"}')
        .expect(400);
    });
  });
}); 