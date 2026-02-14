# Installation Guide

## 🚀 One-Click Installation with .mcpb

The easiest way to install the Fabric MCP Server for Claude Desktop!

### Step 1: Download

You already have the bundle: `fabric-mcp.mcpb`

### Step 2: Double-Click to Install

Simply **double-click** the `fabric-mcp.mcpb` file.

Claude Desktop will automatically:
- Open and recognize the bundle
- Show you the extension details
- Prompt you to install

### Step 3: Click Install

Click the **Install** button in Claude Desktop.

That's it! The MCP server is now installed and ready to use.

### Step 4: Restart Claude Desktop

Close and reopen Claude Desktop to activate the extension.

## ✅ Verify Installation

1. Open Claude Desktop
2. Look for the connector icon (🔌) at the bottom of the chat input
3. Click it to see available tools
4. You should see Fabric tools like:
   - `list_fabric_patterns`
   - `fabric_extract_wisdom`
   - `fabric_summarize`
   - And more!

## 💬 Try It Out

Ask Claude:

```
List all fabric patterns
```

or

```
Summarize this text: [paste some text]
```

## ⚠️ Prerequisites

**IMPORTANT:** This extension requires both Claude Desktop and Fabric to be installed.

### 1. Claude Desktop
- Download from [claude.ai](https://claude.ai/download)
- Requires version 0.7.0 or later for MCPB support

### 2. Fabric Installation
Fabric must be installed before using this MCP server:

```bash
# Install Fabric using pipx (recommended)
pipx install fabric-ai

# Setup Fabric (configure API keys - required!)
fabric --setup

# Verify installation
fabric --version
fabric --list
```

If you don't have `pipx`, install it first:
```bash
# macOS
brew install pipx
pipx ensurepath

# Linux/WSL
python3 -m pip install --user pipx
python3 -m pipx ensurepath

# Windows
python -m pip install --user pipx
python -m pipx ensurepath
```

The MCP server will automatically start the Fabric REST API when needed.

## 🔧 Alternative: Manual Installation

If the `.mcpb` bundle doesn't work, you can install manually:

### Step 1: Extract the Bundle

```bash
# Create extension directory
mkdir -p ~/Library/Application\ Support/Claude/claude_desktop_config/mcp-servers/fabric-mcp

# Extract the bundle
unzip fabric-mcp.mcpb -d ~/Library/Application\ Support/Claude/claude_desktop_config/mcp-servers/fabric-mcp

# On Windows, extract to:
# %APPDATA%\Claude\claude_desktop_config\mcp-servers\fabric-mcp

# On Linux, extract to:
# ~/.config/Claude/claude_desktop_config/mcp-servers/fabric-mcp
```

### Step 2: Install Dependencies

```bash
cd ~/Library/Application\ Support/Claude/claude_desktop_config/mcp-servers/fabric-mcp
npm install
```

### Step 3: Configure Claude Desktop

Edit your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Linux:** `~/.config/Claude/claude_desktop_config.json`

Add this configuration:

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

**Important:** Replace `/Users/YOUR_USERNAME/` with your actual home directory path.

### Step 4: Restart Claude Desktop

Close and reopen Claude Desktop completely.

## 📦 Sharing the Bundle

You can share `fabric-mcp.mcpb` with others! They just need to:
1. Have Claude Desktop installed
2. Have Fabric installed (`pipx install fabric-ai`)
3. Double-click the `.mcpb` file

## 🐛 Troubleshooting

### Bundle won't open
- Make sure you're running the latest version of Claude Desktop
- Try right-click → Open With → Claude Desktop

### Extension not showing up
- Restart Claude Desktop completely
- Check Settings → Developer → Extensions

### "Fabric not found" error
- Install Fabric: `pipx install fabric-ai`
- Verify: `which fabric`
- Setup: `fabric --setup`

## 📚 More Information

- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
- [Fabric GitHub](https://github.com/danielmiessler/Fabric) - Fabric documentation
