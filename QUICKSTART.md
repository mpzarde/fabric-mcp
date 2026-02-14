# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Verify Fabric is Installed

```bash
fabric --version
```

If not installed, run:
```bash
pipx install fabric-ai
fabric --setup
```

### Step 2: Build the MCP Server (Already Done!)

```bash
# You already did this:
npm install
npm run build
```

✅ Server is ready at: `/Users/mpzarde/projects/fabric-mcp/dist/index.js`

### Step 3: Configure Claude Desktop

Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "fabric": {
      "command": "node",
      "args": ["/Users/mpzarde/projects/fabric-mcp/dist/index.js"]
    }
  }
}
```

**Restart Claude Desktop**

### Step 4: Configure Warp CLI

Edit: `~/.warp/mcp_config.json`

```json
{
  "mcpServers": {
    "fabric": {
      "command": "node",
      "args": ["/Users/mpzarde/projects/fabric-mcp/dist/index.js"]
    }
  }
}
```

**Restart Warp or run:** `warp mcp reload`

### Step 5: Test It!

In Claude Desktop or Warp, try:

```
List all fabric patterns
```

or

```
Summarize this text: [paste some text]
```

## 🎯 Try These Examples

### Example 1: Extract Wisdom from YouTube
```
Get the transcript from https://www.youtube.com/watch?v=VIDEO_ID 
and extract the key wisdom from it
```

### Example 2: Create Flashcards
```
Convert these notes into flashcards:
[paste your notes]
```

### Example 3: Analyze Code
```
Explain this code to me:
[paste code]
```

### Example 4: Summarize Git Changes
```
Summarize this git diff:
[paste git diff output]
```

## 🔧 Troubleshooting

### Server won't connect?

1. Check if Fabric is installed: `which fabric`
2. Test manually: `fabric --serve` (in another terminal)
3. Check the path in your config is correct
4. Restart Claude Desktop/Warp completely

### Can't find patterns?

```bash
# Update patterns
fabric --updatepatterns

# List them
fabric --listpatterns
```

## 📚 Available Tools

Once connected, Claude will have access to:

- **Core Tools**: 
  - `list_fabric_patterns` - See all available patterns
  - `run_fabric_pattern` - Run any pattern
  - `get_youtube_transcript` - Fetch YouTube transcripts

- **Pre-configured Patterns** (15+):
  - `fabric_extract_wisdom`
  - `fabric_summarize`
  - `fabric_analyze_claims`
  - `fabric_create_quiz`
  - `fabric_to_flashcards`
  - `fabric_analyze_paper`
  - `fabric_summarize_git_diff`
  - `fabric_analyze_logs`
  - `fabric_analyze_incident`
  - `fabric_create_coding_project`
  - `fabric_explain_code`
  - `fabric_improve_writing`
  - And more!

## 🎉 You're Ready!

The MCP server will automatically start the Fabric REST API when needed, so you don't have to worry about managing it manually.

For more details, see the full [README.md](README.md)
