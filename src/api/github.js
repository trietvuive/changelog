const express = require('express');
const axios = require('axios');

const router = express.Router();

// Filter commits based on fromSha and toSha parameters
const filterCommitsByRange = (commits, fromSha, toSha) => {
  if (!toSha) {
    return commits;
  }

  console.log(`Filtering commits to ${toSha}`);
  
  // Find the index of the 'to' commit to stop at
  const toIndex = commits.findIndex(commit => 
    commit.sha === toSha || commit.sha.startsWith(toSha)
  );
  
  if (toIndex !== -1) {
    // Include commits up to (but not including) the 'to' commit
    const filteredCommits = commits.slice(0, toIndex);
    console.log(`Filtered to ${filteredCommits.length} commits`);
    return filteredCommits;
  } else {
    console.log(`Could not find 'to' commit ${toSha}, returning all commits`);
    return commits;
  }
};

// Fetch commits from GitHub repository
router.post('/commits', async (req, res) => {
  try {
    console.log('GitHub commits request received:', {
      body: req.body,
    })

    const { owner, repo, fromSha, toSha } = req.body;
    const githubToken = process.env.GITHUB_TOKEN;

    console.log('Environment check:', {
      hasGithubToken: !!githubToken,
      tokenPrefix: githubToken ? githubToken.substring(0, 10) + '...' : 'none'
    })

    if (!owner || !repo) {
      console.log('Validation failed: missing owner or repo')
      return res.status(400).json({ error: 'Repository owner and name are required' });
    }

    if (!githubToken) {
      console.log('GitHub token not configured')
      return res.status(500).json({ error: 'GitHub token not configured. Please set GITHUB_TOKEN environment variable.' });
    }

    // Build the GitHub API URL
    let url = `https://api.github.com/repos/${owner}/${repo}/commits`;
    const params = new URLSearchParams();

    // Set the starting point for commits
    if (fromSha) {
      params.append('sha', fromSha);
    }

    // Add pagination
    params.append('per_page', '100');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log('Making GitHub API request to:', url)

    // Fetch commits from GitHub
    const response = await axios.get(url, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Changelog-Generator'
      }
    });

    console.log('GitHub API response received, commits count:', response.data.length)

    // Transform the response
    let commits = response.data.map(commit => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url
    }));

    // Filter commits based on range
    commits = filterCommitsByRange(commits, fromSha, toSha);

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
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return res.status(500).json({ error: 'GitHub token not configured. Please set GITHUB_TOKEN environment variable.' });
    }

    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `token ${githubToken}`,
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
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      return res.status(500).json({ error: 'GitHub token not configured. Please set GITHUB_TOKEN environment variable.' });
    }

    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/tags`, {
      headers: {
        'Authorization': `token ${githubToken}`,
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