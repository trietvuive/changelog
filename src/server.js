require('dotenv').config();
const express = require('express');
const { marked } = require('marked');
const path = require('path');
const ChangelogReader = require('./utils/changelogReader');

// Import API routes
const githubRoutes = require('./api/github');
const llmRoutes = require('./api/llm');
const changelogRoutes = require('./api/changelog');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize changelog reader
const changelogReader = new ChangelogReader();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true
});

// API Routes
app.use('/api/github', githubRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/changelog', changelogRoutes);

// API endpoint to get changelog as JSON (markdown)
app.get('/api/changelog', async (req, res) => {
  try {
    const result = await changelogReader.readChangelog();
    
    if (!result.success) {
      return res.status(500).json({ error: 'Failed to load changelog' });
    }
    
    res.json({
      content: result.content,
      html: marked(result.content),
      lastUpdated: result.lastModified
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load changelog' });
  }
});

// API endpoint to get raw TOML data
app.get('/api/changelog/raw', async (req, res) => {
  try {
    const result = await changelogReader.readChangelog();
    
    if (!result.success) {
      return res.status(500).json({ error: 'Failed to load changelog' });
    }
    
    res.json({
      rawData: result.rawData,
      lastUpdated: result.lastModified
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load changelog data' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const fileInfo = await changelogReader.getFileInfo();
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      changelog: fileInfo
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      error: error.message 
    });
  }
});

// File info endpoint
app.get('/api/file-info', async (req, res) => {
  try {
    const fileInfo = await changelogReader.getFileInfo();
    res.json(fileInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Changelog website running on http://localhost:${PORT}`);
  console.log(`📄 Reading changelog from: ${changelogReader.filePath}`);
  console.log('🔧 Environment check:', {
    hasGithubToken: !!process.env.GITHUB_TOKEN,
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    githubTokenPrefix: process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.substring(0, 10) + '...' : 'none',
    openaiKeyPrefix: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + '...' : 'none'
  });
}); 