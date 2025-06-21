# Changelog Manager

A comprehensive changelog management system with both viewing and generation capabilities. Features a React-based frontend with dark mode support and a Node.js backend with GitHub integration and AI-powered changelog generation.

## Features

### 📖 Changelog Viewer
- Display changelog entries from TOML format
- Dark mode support with theme toggle
- Responsive design for mobile and desktop
- Markdown rendering with syntax highlighting

### ✨ Changelog Generator
- **GitHub Integration**: Connect to any GitHub repository
- **Commit Analysis**: Fetch commits between specified ranges
- **AI-Powered Summarization**: Use OpenAI to generate professional changelog entries
- **Automatic Categorization**: Commits are automatically categorized by type
- **Direct Save**: Save generated changelogs directly to your TOML file

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   # GitHub Personal Access Token
   GITHUB_TOKEN=ghp_your_github_token_here
   
   # OpenAI API Key
   OPENAI_API_KEY=sk-your_openai_api_key_here
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

5. **Access the application**:
   - Open http://localhost:3000
   - Use the navigation tabs to switch between viewing and generating changelogs

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

#### GitHub Integration
- **GITHUB_TOKEN**: Your GitHub Personal Access Token
  - Generate at: https://github.com/settings/tokens
  - Requires `repo` scope for private repositories
  - Requires `public_repo` scope for public repositories

#### OpenAI Integration
- **OPENAI_API_KEY**: Your OpenAI API Key
  - Get at: https://platform.openai.com/api-keys
  - Uses GPT-3.5-turbo model by default

### Security Notes
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- API keys are stored server-side only, never sent to the client

## Usage

### Viewing Changelogs
1. Navigate to the "View Changelog" tab
2. Your changelog entries are displayed in chronological order
3. Toggle dark mode using the theme button in the navigation
4. Changelog is automatically loaded from `changelog.toml`

### Generating Changelogs
1. Navigate to the "Generate Entry" tab
2. **Repository Setup**:
   - Enter repository owner (e.g., "facebook")
   - Enter repository name (e.g., "react")
3. **Commit Range** (optional):
   - Specify "from" and "to" commits or tags
   - Leave empty to fetch recent commits
4. **Release Information**:
   - Enter version number (e.g., "2.1.0")
   - Add release title (optional)
5. **Generate**:
   - Click "Fetch Commits" to retrieve commits from GitHub
   - Review the commits list
   - Click "Generate Changelog" to create AI-powered summary
   - Review and save the generated changelog

## API Endpoints

### Changelog Management
- `GET /api/changelog` - Get formatted changelog
- `GET /api/changelog/raw` - Get raw TOML data
- `POST /api/changelog/save-changelog` - Save generated changelog
- `GET /api/changelog/versions` - Get all versions
- `DELETE /api/changelog/versions/:version` - Delete a version
- `PUT /api/changelog/versions/:version` - Update a version

### GitHub Integration
- `POST /api/github/commits` - Fetch commits from repository
- `GET /api/github/repo/:owner/:repo` - Get repository info
- `GET /api/github/tags/:owner/:repo` - Get repository tags

### AI Integration
- `POST /api/llm/generate-changelog` - Generate changelog with AI
- `POST /api/llm/analyze-commits` - Analyze and categorize commits

## Changelog Format

The application uses TOML format for storing changelog data:

```toml
[[versions]]
version = "2.1.0"
title = "Feature Release"
date = "2024-01-15"
content = """
## Version 2.1.0 - 2024-01-15

### ✨ New Features
- Added user authentication system
- Implemented real-time notifications

### 🐛 Bug Fixes
- Fixed login form validation
- Resolved navigation issues

### 🔧 Improvements
- Enhanced performance optimization
- Updated documentation
"""
```

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run preview` - Preview production build

### Environment Variables
- `PORT` - Server port (default: 3000)
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `OPENAI_API_KEY` - OpenAI API Key

## Security Notes

- API keys are stored in environment variables and never exposed to the client
- GitHub tokens and OpenAI API keys are used server-side only
- The `.env` file is gitignored to prevent accidental commits
- Consider using environment variables for production deployments
- Implement proper authentication for production use

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

```
npm install && npm start