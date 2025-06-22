const express = require('express');
const OpenAI = require('openai');
const { generateChangelogPrompt, systemPrompts } = require('./prompts');

const router = express.Router();

// Generate changelog entry using OpenAI
router.post('/generate-changelog', async (req, res) => {
  try {
    console.log('Received generate-changelog request:', {
      body: req.body,
      commitsCount: req.body.commits?.length,
      version: req.body.version
    });

    const { commits, version, title } = req.body;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!commits || !Array.isArray(commits) || commits.length === 0) {
      console.log('Error: No commits provided');
      return res.status(400).json({ error: 'No commits provided' });
    }

    if (!openaiKey) {
      console.log('Error: OpenAI API key not configured');
      return res.status(500).json({ error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' });
    }

    if (!version) {
      console.log('Error: Version required');
      return res.status(400).json({ error: 'Version required' });
    }

    console.log('Initializing OpenAI with key:', `${openaiKey.substring(0, 10)}...`);

    const openai = new OpenAI({
      apiKey: openaiKey
    });

    const prompt = generateChangelogPrompt(commits, version, title);

    console.log('Sending request to OpenAI with prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompts.changelogWriter
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

/*
    Mock this if you got rate-limited by chatGPT :)
    const mockchatGPTResponse = `
    [[versions]]
    version = "1.0.0"
    date = "2025-06-22"
    title = "Adding NNUE Evaluation"
    
    [[versions.changes]]
    type = "feature"
    title = "Initial NNUE integration"
    description = "Introduced foundational support for NNUE (Efficiently Updatable Neural Networks) evaluation, enabling enhanced positional assessment capabilities."
    
    [[versions.changes]]
    type = "other"
    title = "Added project logo"
    description = "Included a new logo asset to represent the project visually."
    `;


    const completion = {
      choices: [
        {
          message: {
            content: mockchatGPTResponse
          }
        }
      ]
    };
*/

    console.log('OpenAI response received');
    const generatedChangelog = completion.choices[0].message.content;

    console.log('Generated changelog length:', generatedChangelog.length);

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
      res.status(500).json({ error: `Failed to generate changelog: ${error.message}` });
    }
  }
});

module.exports = router;
