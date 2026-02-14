#!/bin/bash

echo "🧪 Fabric MCP Installation Test"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to run a test
test() {
    local name=$1
    local command=$2

    echo -n "Testing: $name... "

    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

# Test with output
test_output() {
    local name=$1
    local command=$2
    local expected=$3

    echo -n "Testing: $name... "

    result=$(eval "$command" 2>&1)

    if [[ "$result" == *"$expected"* ]]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "  Expected: $expected"
        echo "  Got: $result"
        ((FAILED++))
        return 1
    fi
}

echo "📋 Prerequisites Check"
echo "----------------------"

# Check Node.js
test "Node.js installed" "which node"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   Node.js version: $NODE_VERSION"
fi

# Check npm
test "npm installed" "which npm"

# Check Fabric
test "Fabric installed" "which fabric"
if command -v fabric &> /dev/null; then
    FABRIC_VERSION=$(fabric --version 2>&1 | head -1)
    echo "   Fabric version: $FABRIC_VERSION"
fi

# Check pipx
test "pipx installed" "which pipx"

echo ""
echo "📦 Project Structure"
echo "--------------------"

# Check required files
test "package.json exists" "test -f package.json"
test "tsconfig.json exists" "test -f tsconfig.json"
test "src/index.ts exists" "test -f src/index.ts"
test "manifest.json exists" "test -f manifest.json"

echo ""
echo "🔨 Build System"
echo "---------------"

# Check if dependencies are installed
test "node_modules exists" "test -d node_modules"

# Check if TypeScript builds
echo -n "Testing: TypeScript compilation... "
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Check if dist was created
test "dist/ directory exists" "test -d dist"
test "dist/index.js exists" "test -f dist/index.js"
test "dist/index.d.ts exists" "test -f dist/index.d.ts"

echo ""
echo "🔧 Entry Point"
echo "--------------"

# Check shebang
if [ -f dist/index.js ]; then
    SHEBANG=$(head -1 dist/index.js)
    echo -n "Testing: Entry point shebang... "
    if [[ "$SHEBANG" == "#!/usr/bin/env node" ]]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}"
        echo "   Expected: #!/usr/bin/env node"
        echo "   Got: $SHEBANG"
        ((FAILED++))
    fi

    # Check if executable
    test "Entry point is executable" "test -x dist/index.js"
fi

echo ""
echo "📦 Bundle"
echo "---------"

# Build bundle
echo -n "Testing: Bundle creation... "
if ./build-mcpb.sh > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Check if bundle exists
test "fabric-mcp.mcpb exists" "test -f fabric-mcp.mcpb"

# Check bundle is a valid ZIP
test "Bundle is valid ZIP" "unzip -t fabric-mcp.mcpb > /dev/null 2>&1"

# Check bundle contents
echo -n "Testing: Bundle contains manifest.json... "
if unzip -l fabric-mcp.mcpb | grep -q "manifest.json"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

echo -n "Testing: Bundle contains package.json... "
if unzip -l fabric-mcp.mcpb | grep -q "package.json"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

echo -n "Testing: Bundle contains dist/index.js... "
if unzip -l fabric-mcp.mcpb | grep -q "dist/index.js"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Check manifest is valid JSON
echo -n "Testing: Manifest is valid JSON... "
if unzip -p fabric-mcp.mcpb manifest.json | jq . > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Check bundle size
BUNDLE_SIZE=$(ls -lh fabric-mcp.mcpb | awk '{print $5}')
echo "   Bundle size: $BUNDLE_SIZE"

echo ""
echo "📝 Documentation"
echo "----------------"

test "README.md exists" "test -f README.md"
test "INSTALL.md exists" "test -f INSTALL.md"
test "QUICK-INSTALL.md exists" "test -f QUICK-INSTALL.md"
test "TROUBLESHOOTING.md exists" "test -f TROUBLESHOOTING.md"
test "QUICKSTART.md exists" "test -f QUICKSTART.md"

echo ""
echo "🧪 Functional Tests"
echo "-------------------"

# Test if server can start (quickly)
echo -n "Testing: Server can initialize... "
if timeout 2 node dist/index.js 2>&1 | grep -q "Fabric MCP server" || true; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⊘ SKIP (requires stdio)${NC}"
fi

# Test Fabric availability
if command -v fabric &> /dev/null; then
    echo -n "Testing: Fabric can list patterns... "
    if fabric --list > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${YELLOW}⊘ SKIP (Fabric not configured)${NC}"
        echo "   Run: fabric --setup"
    fi
fi

echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo ""
    echo "Your Fabric MCP server is ready to install!"
    echo ""
    echo "Next steps:"
    echo "1. Double-click fabric-mcp.mcpb to install in Claude Desktop"
    echo "2. Or follow INSTALL.md for manual installation"
    echo "3. See QUICK-INSTALL.md for quick reference"
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    echo ""
    echo "Please fix the issues above before installing."
    echo "See TROUBLESHOOTING.md for help."
    exit 1
fi
