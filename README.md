# Changelog Manager
**DISCLAIMER: THIS IS CURRENTLY A PROTOTYPE. DEPLOY AT YOUR OWN RISK**
- use toml (better than JSON) to build the changelog
- fetch a range of commits and use LLM to generate changelog from it. This works best since you can scrap any data automatically from GitHub API (can extend to PR description, reviews,...)
- add to the toml file and renders the changelog
- add unit tests to correct weird behaviors
- also have dark mode for aesthetic

https://github.com/user-attachments/assets/3414d2a0-96a9-4728-a39b-deb6f0ecdd1c



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

Create a `.env` file that follows env.example

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

### AI Integration
- `POST /api/llm/generate-changelog` - Generate changelog with AI

## Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm lint` - Run linter

### Environment Variables
- `GITHUB_TOKEN` - GitHub Personal Access Token
- `OPENAI_API_KEY` - OpenAI API Key
- `OPENAI_MODEL` - OpenAI model

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

MIT License - see LICENSE file for detail
