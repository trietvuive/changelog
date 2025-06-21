// LLM Prompts for changelog generation and commit analysis

const generateChangelogPrompt = (commits, version, title) => {
  const commitsText = commits.map(commit => 
    `- ${commit.message} (${commit.sha.substring(0, 7)}) - ${commit.author}`
  ).join('\n');

  return `Generate a changelog entry for version ${version}${title ? ` - ${title}` : ''} based on the following commits:

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
};

const analyzeCommitsPrompt = (commits) => {
  const commitsText = commits.map(commit => 
    `- ${commit.message} (${commit.sha.substring(0, 7)}) - ${commit.author}`
  ).join('\n');

  return `Analyze the following commits and categorize them by type. For each commit, determine if it's a:

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
};

const systemPrompts = {
  changelogWriter: "You are a professional changelog writer. You create clear, well-structured changelog entries that help users understand what has changed in software releases.",
  commitAnalyzer: "You are a commit analyzer. You categorize commits by type and return structured JSON data."
};

module.exports = {
  generateChangelogPrompt,
  analyzeCommitsPrompt,
  systemPrompts
}; 