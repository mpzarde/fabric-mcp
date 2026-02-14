# Debugging the Fabric MCP Server

## Checking Claude Desktop Logs

When the extension shows "Server disconnected", check the logs to see what's happening:

### macOS
```bash
# View real-time logs
tail -f ~/Library/Logs/Claude/mcp*.log

# Or view all logs
ls -lt ~/Library/Logs/Claude/
cat ~/Library/Logs/Claude/mcp-server-fabric-mcp.log
```

### Windows
```powershell
# Logs location
Get-Content "$env:APPDATA\Claude\Logs\mcp-server-fabric-mcp.log" -Wait
```

### Linux
```bash
tail -f ~/.config/Claude/logs/mcp*.log
```

## Common Issues

### 1. Fabric Not Installed

**Error:** `spawn fabric ENOENT` or `Failed to start Fabric server`

**Solution:**
```bash
pipx install fabric-ai
fabric --setup
which fabric  # Should show a path
```

### 2. Fabric Not Configured

**Error:** `Fabric server failed to start`

**Solution:**
```bash
fabric --setup
# Follow the prompts to configure your API keys
```

### 3. Port Already in Use

**Error:** `Address already in use` or connection timeout

**Solution:**
```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill any process using it or change the port in Configure panel
```

### 4. Environment Variables Not Set

**Error:** `undefined` in logs

**Check:**
- Open the extension settings
- Click "Configure"
- Verify all fields have values
- Click "Save"

### 5. Permission Issues

**Error:** `EACCES` or `Permission denied`

**Solution:**
```bash
# Make sure the entry point is executable
chmod +x ~/Library/Application\ Support/Claude/.../dist/index.js
```

## Manual Testing

Test the server directly:

```bash
# Navigate to the installed extension
cd ~/Library/Application\ Support/Claude/claude_desktop_config/mcp-servers/fabric-mcp

# Test the server starts
node dist/index.js
# Should output: "Fabric MCP server running on stdio"
# Press Ctrl+C to exit

# Test Fabric is accessible
fabric --list
# Should show available patterns
```

## Testing Fabric Server

Test if Fabric server works:

```bash
# Start Fabric server manually
fabric --serve

# In another terminal, test the API
curl http://localhost:8080/patterns/names
# Should return JSON array of pattern names
```

## Debug Mode

For more detailed logging:

1. Uninstall the extension
2. Edit `src/index.ts` and add more `console.error()` statements
3. Run `./build-mcpb.sh`
4. Reinstall the extension
5. Check logs again

## Getting Help

If still having issues, gather this info:

```bash
# System info
node --version
fabric --version
which fabric

# Extension logs
cat ~/Library/Logs/Claude/mcp-server-fabric-mcp.log

# Test server
cd ~/Library/Application\ Support/Claude/claude_desktop_config/mcp-servers/fabric-mcp
node dist/index.js
```

Include all this output when asking for help.
