# Quick Install Guide

## Prerequisites

✅ Install these first:

```bash
# 1. Install pipx (if not installed)
brew install pipx          # macOS
# or python3 -m pip install --user pipx  # Linux/Windows

# 2. Install Fabric
pipx install fabric-ai

# 3. Setup Fabric (REQUIRED - configures API keys)
fabric --setup

# 4. Verify Fabric works
fabric --list
```

## Installation

### Method 1: MCPB Bundle (Easiest)

1. **Double-click** `fabric-mcp.mcpb`
2. Click **Install** in Claude Desktop
3. **Restart** Claude Desktop
4. Done! ✅

### Method 2: Manual Installation

If the bundle doesn't work:

```bash
# 1. Create directory
mkdir -p ~/Library/Application\ Support/Claude/claude_desktop_config/mcp-servers/fabric-mcp

# 2. Extract bundle
unzip fabric-mcp.mcpb -d ~/Library/Application\ Support/Claude/claude_desktop_config/mcp-servers/fabric-mcp

# 3. Install dependencies
cd ~/Library/Application\ Support/Claude/claude_desktop_config/mcp-servers/fabric-mcp
npm install

# 4. Edit config file:
# ~/Library/Application Support/Claude/claude_desktop_config.json
```

Add to config:
```json
{
  "mcpServers": {
    "fabric": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/Library/Application Support/Claude/claude_desktop_config/mcp-servers/fabric-mcp/dist/index.js"
      ]
    }
  }
}
```

5. **Restart** Claude Desktop

## Verification

1. Open Claude Desktop
2. Look for 🔌 connector icon
3. Click it - should see Fabric tools
4. Try: "List all fabric patterns"

## Troubleshooting

**"Fabric not found"**
```bash
which fabric  # Should show a path
fabric --setup  # Configure if needed
```

**No tools showing**
- Restart Claude Desktop completely
- Check Settings → Developer → Extensions

**Still not working?**
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Check [INSTALL.md](INSTALL.md) for details

## Quick Test

In Claude Desktop, try:
```
List all fabric patterns
```

Should show a long list of patterns like:
- extract_wisdom
- summarize
- analyze_claims
- create_quiz
- etc.

## Next Steps

See [README.md](README.md) for:
- Full documentation
- Available patterns
- Usage examples
- API reference
