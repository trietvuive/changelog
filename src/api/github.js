const express = require('express');
const axios = require('axios');

const router = express.Router();

// Fetch commits from GitHub repository
router.post('/commits', async (req, res) => {
  try {
    const { owner, repo, token, from, to } = req.body;

    if (!owner || !repo || !token) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Build the GitHub API URL
    let url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    const params = new URLSearchParams();

    if (from && to) {
      params.append('sha', `${from}..${to}`);
    } else if (from) {
      params.append('sha', from);
    } else if (to) {
      params.append('sha', to);
    }

    // Add pagination
    params.append('per_page', '100');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    // Fetch commits from GitHub
    const response = await axios.get(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Changelog-Generator'
      }
    });

    // Transform the response
    const commits = response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url
    }));

    res.json({ commits });

  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid GitHub token' });
    } else if (error.response?.status === 404) {
      res.status(404).json({ error: 'Repository not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch commits from GitHub' });
    }
  }
});

// Get repository information
router.get('/repo/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'GitHub token required' });
    }

    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Changelog-Generator'
      }
    });

    res.json({
      name: response.data.name,
      full_name: response.data.full_name,
      description: response.data.description,
      language: response.data.language,
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      default_branch: response.data.default_branch
    });

  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch repository information' });
  }
});

// Get tags for a repository
router.get('/tags/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'GitHub token required' });
    }

    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/tags`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Changelog-Generator'
      }
    });

    const tags = response.data.map(tag => ({
      name: tag.name,
      commit: tag.commit.sha,
      zipball_url: tag.zipball_url,
      tarball_url: tag.tarball_url
    }));

    res.json({ tags });

  } catch (error) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

module.exports = router; 