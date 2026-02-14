# Troubleshooting Guide

## Installation Issues

### Issue: Bundle won't install in Claude Desktop

**Symptoms:**
- Double-clicking the `.mcpb` file doesn't open Claude Desktop
- No installation prompt appears
- Error messages during installation

**Solutions:**

1. **Verify Claude Desktop is up to date**
   - Check you're running Claude Desktop version 0.7.0 or later
   - Update from the Claude Desktop settings if needed

2. **Try manual installation**
   ```bash
   # Extract the bundle to Claude Desktop's config directory
   # On macOS:
   mkdir -p ~/Library/Application\ Support/Claude/extensions/fabric-mcp
   unzip fabric-mcp.mcpb -d ~/Library/Application\ Support/Claude/extensions/fabric-mcp

   # On Windows:
   # Extract to %APPDATA%\Claude\extensions\fabric-mcp

   # On Linux:
   # Extract to ~/.config/Claude/extensions/fabric-mcp
   ```

3. **Install dependencies manually**
   ```bash
   cd ~/Library/Application\ Support/Claude/extensions/fabric-mcp
   npm install
   ```

4. **Check file permissions**
   ```bash
   chmod +x ~/Library/Application\ Support/Claude/extensions/fabric-mcp/dist/index.js
   ```

### Issue: Extension not showing in Claude Desktop

**Symptoms:**
- Bundle installed successfully but tools not appearing
- No Fabric patterns visible

**Solutions:**

1. **Restart Claude Desktop completely**
   - Quit the application (not just close the window)
   - Reopen Claude Desktop

2. **Check Developer Settings**
   - Open Settings → Developer
   - Look for "Extensions" or "MCP Servers"
   - Verify "fabric-mcp" is listed and enabled

3. **Check the logs**
   - On macOS: `~/Library/Logs/Claude/`
   - Look for error messages related to the extension

### Issue: "Fabric not found" error

**Symptoms:**
- Extension loads but returns "Fabric not found" errors
- Cannot execute patterns

**Solutions:**

1. **Install Fabric**
   ```bash
   pipx install fabric-ai
   ```

2. **Verify Fabric is in PATH**
   ```bash
   which fabric
   # Should output: /Users/yourusername/.local/bin/fabric
   ```

3. **Setup Fabric**
   ```bash
   fabric --setup
   # Follow prompts to configure API keys
   ```

4. **Test Fabric directly**
   ```bash
   fabric --list
   # Should show available patterns
   ```

### Issue: Patterns fail to execute

**Symptoms:**
- Can see patterns but they fail when run
- Timeout errors
- Connection errors

**Solutions:**

1. **Check Fabric server**
   ```bash
   # Try starting Fabric server manually
   fabric --serve
   # Should start on http://localhost:8080
   ```

2. **Set environment variables**
   - If using custom Fabric configuration:
   ```bash
   export FABRIC_HOST="http://localhost"
   export FABRIC_PORT="8080"
   ```

3. **Check network/firewall**
   - Ensure localhost connections are allowed
   - Check if port 8080 is available

## Debug Mode

To get more detailed logs:

1. **Check MCP server logs**
   - The extension logs to stderr
   - Check Claude Desktop's console output

2. **Test the server standalone**
   ```bash
   cd /path/to/fabric-mcp
   node dist/index.js
   # Should output: "Fabric MCP server running on stdio"
   # Press Ctrl+C to exit
   ```

3. **Test Fabric integration**
   ```bash
   # Test if Fabric patterns are accessible
   curl http://localhost:8080/patterns/names
   ```

## Common Error Messages

### "Cannot find module '@modelcontextprotocol/sdk'"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd ~/Library/Application\ Support/Claude/extensions/fabric-mcp
npm install
```

### "Permission denied" when starting

**Cause:** Entry point not executable

**Solution:**
```bash
chmod +x ~/Library/Application\ Support/Claude/extensions/fabric-mcp/dist/index.js
```

### "Fabric server failed to start"

**Cause:** Fabric not installed or not in PATH

**Solution:**
```bash
pipx install fabric-ai
fabric --setup
```

## Getting Help

If you're still having issues:

1. Check the [main README](README.md) for setup instructions
2. Verify your system meets all prerequisites
3. Try the manual installation method above
4. Open an issue with:
   - Your OS and version
   - Claude Desktop version
   - Complete error messages
   - Output from `fabric --version`
   - Output from `node --version`

## Verification Checklist

- [ ] Claude Desktop version 0.7.0 or later
- [ ] Node.js installed and in PATH
- [ ] Fabric installed (`pipx install fabric-ai`)
- [ ] Fabric configured (`fabric --setup`)
- [ ] Bundle extracted properly
- [ ] Dependencies installed (`npm install`)
- [ ] Entry point is executable
- [ ] Claude Desktop restarted
- [ ] Extension shows in Settings → Developer
