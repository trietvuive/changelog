const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const toml = require('@iarna/toml');

const router = express.Router();

// Save generated changelog entry
router.post('/save-changelog', async (req, res) => {
  try {
    const { changelog, version, title } = req.body;

    if (!changelog || !version) {
      return res.status(400).json({ error: 'Changelog content and version are required' });
    }

    const changelogPath = path.join(process.cwd(), 'changelog.toml');
    
    // Read existing changelog
    let existingContent = '';
    try {
      existingContent = await fs.readFile(changelogPath, 'utf8');
    } catch (error) {
      // File doesn't exist, start with empty content
      existingContent = '';
    }

    // Parse existing TOML or create new structure
    let changelogData;
    if (existingContent.trim()) {
      try {
        changelogData = toml.parse(existingContent);
      } catch (error) {
        console.error('Error parsing existing TOML:', error);
        changelogData = { versions: [] };
      }
    } else {
      changelogData = { versions: [] };
    }

    // Ensure versions array exists
    if (!changelogData.versions) {
      changelogData.versions = [];
    }

    // Create new version entry
    const newVersion = {
      version: version,
      title: title || `Version ${version}`,
      date: new Date().toISOString().split('T')[0],
      content: changelog
    };

    // Add to beginning of versions array (newest first)
    changelogData.versions.unshift(newVersion);

    // Convert back to TOML
    const newTomlContent = toml.stringify(changelogData);

    // Write to file
    await fs.writeFile(changelogPath, newTomlContent, 'utf8');

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
    const changelogPath = path.join(process.cwd(), 'changelog.toml');
    
    const content = await fs.readFile(changelogPath, 'utf8');
    const changelogData = toml.parse(content);

    const versions = changelogData.versions || [];
    
    res.json({ versions });

  } catch (error) {
    console.error('Error reading versions:', error);
    res.status(500).json({ error: 'Failed to read versions' });
  }
});

// Delete a version
router.delete('/versions/:version', async (req, res) => {
  try {
    const { version } = req.params;
    const changelogPath = path.join(process.cwd(), 'changelog.toml');
    
    const content = await fs.readFile(changelogPath, 'utf8');
    const changelogData = toml.parse(content);

    if (!changelogData.versions) {
      return res.status(404).json({ error: 'No versions found' });
    }

    const initialLength = changelogData.versions.length;
    changelogData.versions = changelogData.versions.filter(v => v.version !== version);

    if (changelogData.versions.length === initialLength) {
      return res.status(404).json({ error: 'Version not found' });
    }

    const newTomlContent = toml.stringify(changelogData);
    await fs.writeFile(changelogPath, newTomlContent, 'utf8');

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
    const changelogPath = path.join(process.cwd(), 'changelog.toml');
    
    const fileContent = await fs.readFile(changelogPath, 'utf8');
    const changelogData = toml.parse(fileContent);

    if (!changelogData.versions) {
      return res.status(404).json({ error: 'No versions found' });
    }

    const versionIndex = changelogData.versions.findIndex(v => v.version === version);
    if (versionIndex === -1) {
      return res.status(404).json({ error: 'Version not found' });
    }

    // Update the version
    if (title !== undefined) {
      changelogData.versions[versionIndex].title = title;
    }
    if (newContent !== undefined) {
      changelogData.versions[versionIndex].content = newContent;
    }

    const newTomlContent = toml.stringify(changelogData);
    await fs.writeFile(changelogPath, newTomlContent, 'utf8');

    res.json({ 
      success: true, 
      message: 'Version updated successfully',
      version: changelogData.versions[versionIndex]
    });

  } catch (error) {
    console.error('Error updating version:', error);
    res.status(500).json({ error: 'Failed to update version' });
  }
});

module.exports = router; 