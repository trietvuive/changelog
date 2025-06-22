// LLM Prompts for changelog generation and commit analysis

const generateChangelogPrompt = (commits, version, title) => {
  const commitsText = commits.map(commit =>
    `- ${commit.message} (${commit.sha.substring(0, 7)}) - ${commit.author}`
  ).join('\n');

  return `
Generate a changelog entry for version ${version}${title ? ` - ${title}` : ''} based on the following commits:

${commitsText}

Please create a well-structured changelog entry in TOML format that:
1. Groups changes by type (features, fixes, improvements, breaking changes, etc.)
2. Uses short, clear, concise descriptions
3. Follows TOML syntax
4. Is written in a professional tone

Format the response as TOML with the following structure:
[[versions]]
version = "${version}"
date = "${new Date().toISOString().split('T')[0]}"
title = "${title || `Version ${version}`}"

[[versions.changes]]
type = "feature"
title = "Feature name"
description = "Feature description"

[[versions.changes]]
type = "fix"
title = "Fix name"
description = "Fix description"

Change types should be one of: feature, fix, improvement, breaking, docs, other

Please generate the TOML changelog entry now:`;
};

const systemPrompts = {
  changelogWriter: 'You are a professional changelog writer. You create clear, well-structured changelog entries in TOML format that help users understand what has changed in software releases.',
  commitAnalyzer: 'You are a commit analyzer. You categorize commits by type and return structured JSON data.'
};

module.exports = {
  generateChangelogPrompt,
  systemPrompts
};