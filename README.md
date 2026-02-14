# Fabric MCP Server

Model Context Protocol (MCP) server for [Fabric](https://github.com/danielmiessler/Fabric) - Daniel Miessler's AI-powered content processing framework.

This MCP server allows Claude (via Claude Desktop or Warp CLI) to use Fabric's extensive collection of AI patterns for content analysis, summarization, learning, coding, security analysis, and more.

## Features

- 🚀 **Auto-start**: Automatically starts Fabric REST API server if not running
- 🔧 **15+ Pre-configured Tools**: Direct access to commonly-used Fabric patterns
- 🎯 **Generic Pattern Runner**: Run any Fabric pattern with `run_fabric_pattern`
- 📺 **YouTube Support**: Fetch video transcripts directly
- 🔍 **Pattern Discovery**: List all available patterns dynamically
- 🔐 **API Key Support**: Optional authentication with Fabric API

## Prerequisites

### 1. Install Fabric

If you don't have Fabric installed:

```bash
# Install Fabric
pip install fabric-ai

# Or using pipx (recommended)
pipx install fabric-ai

# Setup Fabric (configures API keys, patterns, etc.)
fabric --setup
```

For detailed Fabric installation instructions, see: https://github.com/danielmiessler/Fabric#installation

### 2. Verify Fabric Installation

```bash
# Test that fabric is working
fabric --version

# List available patterns
fabric --listpatterns

# Optional: Test the REST API manually
fabric --serve
# In another terminal: curl http://localhost:8080/patterns/names
```

## Installation

### Option 1: Double-Click Install (Recommended) 🎉

The easiest way to install:

1. **Double-click** `fabric-mcp.mcpb`
2. Claude Desktop will open and prompt you to install
3. Click **Install**
4. Done!

The `.mcpb` file is a self-contained bundle that includes everything needed.

### Option 2: Manual Installation

If you want to install manually:

```bash
cd /Users/mpzarde/projects/fabric-mcp
npm install
npm run build
```

Then configure manually (see Configuration section below).

## Configuration

### For Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "fabric": {
      "command": "node",
      "args": ["/Users/mpzarde/projects/fabric-mcp/dist/index.js"],
      "env": {
        "FABRIC_HOST": "http://localhost",
        "FABRIC_PORT": "8080"
      }
    }
  }
}
```

**Optional environment variables:**
- `FABRIC_API_KEY`: Your Fabric API key (if configured)
- `FABRIC_HOST`: Fabric server host (default: `http://localhost`)
- `FABRIC_PORT`: Fabric server port (default: `8080`)

### For Warp CLI

Add to your Warp MCP configuration file:

**macOS/Linux**: `~/.warp/mcp_config.json`

```json
{
  "mcpServers": {
    "fabric": {
      "command": "node",
      "args": ["/Users/mpzarde/projects/fabric-mcp/dist/index.js"],
      "env": {
        "FABRIC_HOST": "http://localhost",
        "FABRIC_PORT": "8080"
      }
    }
  }
}
```

### Restart Claude/Warp

After configuration:
- **Claude Desktop**: Restart the application
- **Warp**: Restart the terminal or run `warp mcp reload`

## Available Tools

### Core Tools

1. **`list_fabric_patterns`** - List all available Fabric patterns
2. **`run_fabric_pattern`** - Run any Fabric pattern with custom input
3. **`get_youtube_transcript`** - Fetch transcript from YouTube video

### Pre-configured Pattern Tools

These patterns are exposed as dedicated tools with the `fabric_` prefix:

#### Content Analysis
- `fabric_extract_wisdom` - Extract key insights and quotes from content
- `fabric_summarize` - Create concise summaries
- `fabric_analyze_claims` - Analyze and fact-check claims
- `fabric_analyze_paper` - Analyze academic papers

#### Learning
- `fabric_create_quiz` - Generate quiz questions
- `fabric_to_flashcards` - Convert content to flashcards

#### Development
- `fabric_summarize_git_diff` - Summarize git diffs for reviews
- `fabric_create_coding_project` - Generate project structure from ideas
- `fabric_explain_code` - Explain code in simple terms

#### Security & Operations
- `fabric_analyze_logs` - Analyze log files
- `fabric_analyze_incident` - Analyze security incidents

#### Writing
- `fabric_improve_writing` - Improve writing quality

## Usage Examples

### With Claude Desktop

**Extract wisdom from a YouTube video:**
```
User: Can you extract the key insights from this video? 
      https://www.youtube.com/watch?v=dQw4w9WgXcQ

Claude: [Uses get_youtube_transcript + fabric_extract_wisdom]
```

**Summarize an article:**
```
User: Summarize this article: [paste article text]

Claude: [Uses fabric_summarize]
```

**Create flashcards from lecture notes:**
```
User: Convert these lecture notes into flashcards: [paste notes]

Claude: [Uses fabric_to_flashcards]
```

**Analyze a git diff:**
```
User: Review this git diff and summarize the changes:
      [paste git diff output]

Claude: [Uses fabric_summarize_git_diff]
```

### Chaining Patterns

Claude can chain multiple patterns together:

```
User: Get the transcript from this video, extract the wisdom, 
      then create flashcards from it.
      https://www.youtube.com/watch?v=example

Claude: 
[1. Uses get_youtube_transcript]
[2. Uses fabric_extract_wisdom on transcript]
[3. Uses fabric_to_flashcards on extracted wisdom]
```

## Use Cases

Based on Daniel Miessler's Fabric patterns:

### Content Processing
- YouTube video → extract wisdom / summarize
- Article / blog post → summarize, analyze claims
- Podcast transcript → extract wisdom, pull quotes

### Writing & Development
- Idea → essay (via `create_coding_project` or similar patterns)
- Code diff → PR description (via `summarize_git_diff`)
- Meeting notes → user stories (via `run_fabric_pattern` with `agility_story`)

### Learning
- Any content → flashcards (via `to_flashcards`)
- Dense docs → glossary with analogies
- Video/article → quiz (via `create_quiz`)

### Security Analysis
- Malware samples → analysis (via `analyze_malware`)
- Log files → threat interpretation (via `analyze_logs`)
- Security scans → rules (via `run_fabric_pattern`)

## Troubleshooting

### Fabric server won't start

**Error**: `Fabric server failed to start`

**Solutions**:
1. Verify Fabric is installed: `which fabric`
2. Test Fabric manually: `fabric --version`
3. Check if port 8080 is already in use: `lsof -i :8080`
4. Try a different port in your MCP config:
   ```json
   "env": {
     "FABRIC_PORT": "8081"
   }
   ```

### Pattern not found

**Error**: `Pattern not found: pattern_name`

**Solutions**:
1. List available patterns in Claude: Ask "List all fabric patterns"
2. Update Fabric patterns: `fabric --updatepatterns`
3. Check spelling - pattern names use underscores (e.g., `extract_wisdom` not `extractWisdom`)

### API authentication errors

**Error**: `401 Unauthorized`

**Solution**:
If you've configured Fabric with an API key, add it to your MCP config:
```json
"env": {
  "FABRIC_API_KEY": "your-api-key-here"
}
```

### MCP server not appearing in Claude

**Solutions**:
1. Verify the config file path is correct
2. Check JSON syntax (use a JSON validator)
3. Ensure the path to `dist/index.js` is absolute
4. Restart Claude Desktop completely
5. Check Claude's logs (usually in `~/Library/Logs/Claude/`)

## Development

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run watch
```

### Testing locally

```bash
# Terminal 1: Start Fabric server manually
fabric --serve

# Terminal 2: Test the MCP server
node dist/index.js
# Then interact via stdin/stdout (requires MCP client)
```

## Architecture

```
┌─────────────────┐
│  Claude/Warp    │
└────────┬────────┘
         │ MCP Protocol (stdio)
         ▼
┌─────────────────┐
│  MCP Server     │ ← This project
│  (Node.js)      │
└────────┬────────┘
         │ HTTP REST API
         ▼
┌─────────────────┐
│  Fabric Server  │
│  (fabric --serve)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Patterns    │
│  OpenAI/etc.    │
└─────────────────┘
```

The MCP server:
1. Automatically starts `fabric --serve` if not running
2. Exposes Fabric patterns as MCP tools
3. Translates MCP tool calls → Fabric REST API calls
4. Returns results back to Claude/Warp

## Resources

- **Fabric**: https://github.com/danielmiessler/Fabric
- **Fabric REST API Docs**: https://github.com/danielmiessler/Fabric/blob/main/docs/rest-api.md
- **MCP Documentation**: https://modelcontextprotocol.io
- **MCP SDK**: https://github.com/modelcontextprotocol/typescript-sdk

## License

MIT

## Contributing

Contributions welcome! Please open an issue or PR.

## Credits

- **Fabric** by [Daniel Miessler](https://github.com/danielmiessler)
- **MCP** by [Anthropic](https://www.anthropic.com)
