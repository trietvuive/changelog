const request = require('supertest');
const express = require('express');

// Mock the OpenAI API
jest.mock('openai');
const OpenAI = require('openai');

let app;
let mockOpenAI;

describe('LLM API Endpoints', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a mock OpenAI instance
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    };

    // Mock the OpenAI constructor to return our mock instance
    OpenAI.mockImplementation(() => mockOpenAI);

    // Create app and router after mocks are set up
    app = express();
    app.use(express.json());
    const llmRoutes = require('../llm');
    app.use('/api/llm', llmRoutes);
  });

  describe('POST /api/llm/summarize', () => {
    it('should summarize commits successfully with valid data', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: '[[versions]]\nversion = "1.0.0"\ndate = "2024-01-15"\ntitle = "Test Release"\n\n## Added\n- New feature\n\n## Fixed\n- Bug fix'
            }
          }
        ]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const commitsData = {
        commits: [
          {
            sha: 'abc123',
            commit: {
              message: 'feat: add new feature',
              author: { name: 'Test User', email: 'test@example.com' }
            }
          },
          {
            sha: 'def456',
            commit: {
              message: 'fix: resolve bug',
              author: { name: 'Test User', email: 'test@example.com' }
            }
          }
        ],
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('title');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.title).toBe('Test Release');
      expect(response.body.summary).toBe(mockResponse.choices[0].message.content);
    });

    it('should return 400 when commits are missing', async () => {
      const commitsData = {
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(400);

      expect(response.body.error).toBe('Commits data is required');
    });

    it('should return 400 when commits array is empty', async () => {
      const commitsData = {
        commits: [],
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(400);

      expect(response.body.error).toBe('At least one commit is required');
    });

    it('should return 400 when version is missing', async () => {
      const commitsData = {
        commits: [
          {
            sha: 'abc123',
            commit: {
              message: 'feat: add new feature',
              author: { name: 'Test User', email: 'test@example.com' }
            }
          }
        ],
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(400);

      expect(response.body.error).toBe('Version is required');
    });

    it('should return 400 when title is missing', async () => {
      const commitsData = {
        commits: [
          {
            sha: 'abc123',
            commit: {
              message: 'feat: add new feature',
              author: { name: 'Test User', email: 'test@example.com' }
            }
          }
        ],
        version: '1.0.0'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(400);

      expect(response.body.error).toBe('Title is required');
    });

    it('should handle commits with missing commit message', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: '[[versions]]\nversion = "1.0.0"\ndate = "2024-01-15"\ntitle = "Test Release"\n\n## Added\n- New feature'
            }
          }
        ]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const commitsData = {
        commits: [
          {
            sha: 'abc123',
            commit: {
              author: { name: 'Test User', email: 'test@example.com' }
            }
          }
        ],
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
    });

    it('should handle commits with missing author information', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: '[[versions]]\nversion = "1.0.0"\ndate = "2024-01-15"\ntitle = "Test Release"\n\n## Added\n- New feature'
            }
          }
        ]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const commitsData = {
        commits: [
          {
            sha: 'abc123',
            commit: {
              message: 'feat: add new feature'
            }
          }
        ],
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
    });

    it('should handle malformed commit data gracefully', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: '[[versions]]\nversion = "1.0.0"\ndate = "2024-01-15"\ntitle = "Test Release"\n\n## Added\n- New feature'
            }
          }
        ]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const commitsData = {
        commits: [
          {
            sha: 'abc123',
            // Missing commit object
          }
        ],
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
    });

    it('should handle single commit', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: '[[versions]]\nversion = "1.0.0"\ndate = "2024-01-15"\ntitle = "Test Release"\n\n## Added\n- New feature'
            }
          }
        ]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const commitsData = {
        commits: [
          {
            sha: 'abc123',
            commit: {
              message: 'feat: add new feature',
              author: { name: 'Test User', email: 'test@example.com' }
            }
          }
        ],
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.title).toBe('Test Release');
    });

    it('should handle large number of commits', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: '[[versions]]\nversion = "1.0.0"\ndate = "2024-01-15"\ntitle = "Test Release"\n\n## Added\n- Multiple features'
            }
          }
        ]
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const commits = Array.from({ length: 50 }, (_, i) => ({
        sha: `commit${i}`,
        commit: {
          message: `feat: feature ${i}`,
          author: { name: 'Test User', email: 'test@example.com' }
        }
      }));

      const commitsData = {
        commits,
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(200);

      expect(response.body).toHaveProperty('summary');
    });

    it('should handle OpenAI API errors', async () => {
      mockOpenAI.chat.completions.create.mockRejectedValue(new Error('OpenAI API error'));

      const commitsData = {
        commits: [
          {
            sha: 'abc123',
            commit: {
              message: 'feat: add new feature',
              author: { name: 'Test User', email: 'test@example.com' }
            }
          }
        ],
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(500);

      expect(response.body.error).toBe('Failed to generate summary');
    });

    it('should handle OpenAI API response without choices', async () => {
      const mockResponse = {
        choices: []
      };

      mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

      const commitsData = {
        commits: [
          {
            sha: 'abc123',
            commit: {
              message: 'feat: add new feature',
              author: { name: 'Test User', email: 'test@example.com' }
            }
          }
        ],
        version: '1.0.0',
        title: 'Test Release'
      };

      const response = await request(app)
        .post('/api/llm/summarize')
        .send(commitsData)
        .expect(500);

      expect(response.body.error).toBe('Failed to generate summary');
    });
  });

  describe('Error handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/llm/summarize')
        .set('Content-Type', 'application/json')
        .send('invalid json')
        .expect(400);
    });

    it('should handle missing Content-Type header', async () => {
      const response = await request(app)
        .post('/api/llm/summarize')
        .send('{"commits": [], "version": "1.0.0", "title": "Test"}')
        .expect(400);
    });

    it('should handle empty request body', async () => {
      const response = await request(app)
        .post('/api/llm/summarize')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Commits data is required');
    });
  });
}); 