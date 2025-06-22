const express = require('express');
const ChangelogReader = require('../utils/changelogReader');

const router = express.Router();
const changelogReader = new ChangelogReader();

// Save generated changelog entry
router.post('/save-changelog', async (req, res) => {
  try {
    const { changelog, version, title } = req.body;

    if (!changelog || !version) {
      return res.status(400).json({ error: 'Changelog content and version are required' });
    }

    const result = await changelogReader.addVersion(version, title, changelog);
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ 
      success: true, 
      message: 'Changelog saved successfully',
      version: version,
      title: title
    });

  } catch (error) {
    console.error('Error saving changelog:', error);
    res.status(500).json({ error: 'Failed to save changelog' });
  }
});

// Get all versions
router.get('/versions', async (req, res) => {
  try {
    const result = await changelogReader.getAllVersions();
    
    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({ versions: result.versions });

  } catch (error) {
    console.error('Error reading versions:', error);
    res.status(500).json({ error: 'Failed to read versions' });
  }
});

// Delete a version
router.delete('/versions/:version', async (req, res) => {
  try {
    const { version } = req.params;
    
    const result = await changelogReader.deleteVersion(version);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.json({ 
      success: true, 
      message: 'Version deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting version:', error);
    res.status(500).json({ error: 'Failed to delete version' });
  }
});

// Update a version
router.put('/versions/:version', async (req, res) => {
  try {
    const { version } = req.params;
    const { title, content: newContent } = req.body;
    
    const updates = {};
    if (title !== undefined) {
      updates.title = title;
    }
    if (newContent !== undefined) {
      updates.content = newContent;
    }

    const result = await changelogReader.updateVersion(version, updates);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error });
    }

    res.json({ 
      success: true, 
      message: 'Version updated successfully',
      version: result.version
    });

  } catch (error) {
    console.error('Error updating version:', error);
    res.status(500).json({ error: 'Failed to update version' });
  }
});

module.exports = router; 