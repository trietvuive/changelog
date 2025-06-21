const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

// Generate changelog entry using OpenAI
router.post('/generate-changelog', async (req, res) => {
  try {
    const { commits, version, title, openaiKey } = req.body;

    if (!commits || !Array.isArray(commits) || commits.length === 0) {
      return res.status(400).json({ error: 'No commits provided' });
    }

    if (!openaiKey) {
      return res.status(400).json({ error: 'OpenAI API key required' });
    }

    if (!version) {
      return res.status(400).json({ error: 'Version required' });
    }

    const openai = new OpenAI({
      apiKey: openaiKey,
    });

    // Prepare commits data for the prompt
    const commitsText = commits.map(commit => 
      `- ${commit.message} (${commit.sha.substring(0, 7)}) - ${commit.author}`
    ).join('\n');

    const prompt = `Generate a changelog entry for version ${version}${title ? ` - ${title}` : ''} based on the following commits:

${commitsText}

Please create a well-structured changelog entry that:
1. Groups changes by type (features, fixes, improvements, breaking changes, etc.)
2. Uses clear, concise descriptions
3. Follows conventional changelog format
4. Includes emojis for visual appeal
5. Is written in a professional tone

Format the response as markdown with the following structure:
## Version [version] - [date]

### ✨ New Features
- [feature descriptions]

### 🐛 Bug Fixes
- [fix descriptions]

### 🔧 Improvements
- [improvement descriptions]

### ⚠️ Breaking Changes (if any)
- [breaking change descriptions]

### 📚 Documentation (if any)
- [documentation descriptions]

### 🔧 Other Changes (if any)
- [other change descriptions]

---

Please generate the changelog entry now:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional changelog writer. You create clear, well-structured changelog entries that help users understand what has changed in software releases."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const generatedChangelog = completion.choices[0].message.content;

    res.json({ 
      changelog: generatedChangelog,
      version,
      title,
      commitCount: commits.length
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error.code === 'invalid_api_key') {
      res.status(401).json({ error: 'Invalid OpenAI API key' });
    } else if (error.code === 'insufficient_quota') {
      res.status(402).json({ error: 'OpenAI API quota exceeded' });
    } else {
      res.status(500).json({ error: 'Failed to generate changelog' });
    }
  }
});

// Analyze commits and categorize them
router.post('/analyze-commits', async (req, res) => {
  try {
    const { commits, openaiKey } = req.body;

    if (!commits || !Array.isArray(commits) || commits.length === 0) {
      return res.status(400).json({ error: 'No commits provided' });
    }

    if (!openaiKey) {
      return res.status(400).json({ error: 'OpenAI API key required' });
    }

    const openai = new OpenAI({
      apiKey: openaiKey,
    });

    const commitsText = commits.map(commit => 
      `- ${commit.message} (${commit.sha.substring(0, 7)}) - ${commit.author}`
    ).join('\n');

    const prompt = `Analyze the following commits and categorize them by type. For each commit, determine if it's a:

1. feature (new functionality)
2. fix (bug fix)
3. improvement (enhancement)
4. breaking (breaking change)
5. docs (documentation)
6. other (miscellaneous)

Return the analysis as a JSON object with this structure:
{
  "categories": {
    "feature": ["commit messages"],
    "fix": ["commit messages"],
    "improvement": ["commit messages"],
    "breaking": ["commit messages"],
    "docs": ["commit messages"],
    "other": ["commit messages"]
  },
  "summary": {
    "total": number,
    "features": number,
    "fixes": number,
    "improvements": number,
    "breaking": number,
    "docs": number,
    "other": number
  }
}

Commits to analyze:
${commitsText}

Return only the JSON object:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a commit analyzer. You categorize commits by type and return structured JSON data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    res.json(analysis);

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: 'Failed to analyze commits' });
  }
});

module.exports = router; 