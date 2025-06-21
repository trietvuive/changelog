const express = require('express');
const { marked } = require('marked');
const { getMainTemplate, getErrorTemplate } = require('./components/templates');
const ChangelogReader = require('./utils/changelogReader');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize changelog reader
const changelogReader = new ChangelogReader();

// Serve static files
app.use(express.static('public'));

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true
});

// Main route to display changelog
app.get('/', async (req, res) => {
  try {
    // Read the changelog file
    const result = await changelogReader.readChangelog();
    
    if (!result.success) {
      console.error('Error reading changelog:', result.error);
      return res.status(500).send(getErrorTemplate());
    }
    
    // Convert markdown to HTML
    const htmlContent = marked(result.content);
    
    // Send the HTML page
    res.send(getMainTemplate(htmlContent));
    
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).send(getErrorTemplate());
  }
});

// API endpoint to get changelog as JSON
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

app.listen(PORT, () => {
  console.log(`🚀 Changelog website running on http://localhost:${PORT}`);
  console.log(`📄 Reading changelog from: ${changelogReader.filePath}`);
}); 