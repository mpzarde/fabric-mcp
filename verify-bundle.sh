#!/bin/bash

echo "🔍 Verifying fabric-mcp.mcpb bundle..."
echo ""

# Check if bundle exists
if [ ! -f "fabric-mcp.mcpb" ]; then
    echo "❌ fabric-mcp.mcpb not found!"
    exit 1
fi

# Check bundle contents
echo "📦 Bundle contents:"
unzip -l fabric-mcp.mcpb
echo ""

# Extract and verify manifest
echo "📋 Manifest contents:"
unzip -p fabric-mcp.mcpb manifest.json | jq . 2>/dev/null || unzip -p fabric-mcp.mcpb manifest.json
echo ""

# Verify the entry point has shebang
echo "🔧 Checking entry point shebang:"
unzip -p fabric-mcp.mcpb dist/index.js | head -1
echo ""

# Check if node_modules are included (they shouldn't be in the bundle)
if unzip -l fabric-mcp.mcpb | grep -q "node_modules/"; then
    echo "⚠️  Warning: node_modules found in bundle (bundle will be large)"
else
    echo "✅ No node_modules in bundle (good!)"
fi
echo ""

echo "✅ Bundle verification complete!"
echo ""
echo "To install:"
echo "1. Double-click fabric-mcp.mcpb"
echo "2. Or drag it to Claude Desktop"
echo "3. Restart Claude Desktop after installation"
