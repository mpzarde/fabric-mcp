#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { spawn } from "child_process";
import { existsSync } from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
import { platform } from "os";
import { join } from "path";

const execFileAsync = promisify(execFile);

// Get home directory cross-platform
function getHomeDir(): string {
  return process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH || "";
}

// Build enhanced PATH with common binary locations
function buildEnhancedPath(): string {
  const isWindows = platform() === "win32";
  const pathSeparator = isWindows ? ";" : ":";
  const homeDir = getHomeDir();

  // Platform-specific common paths
  const commonBinPaths: string[] = [];

  if (isWindows) {
    // Windows common paths
    if (homeDir) {
      commonBinPaths.push(
        join(homeDir, "AppData", "Local", "Programs", "Python"),
        join(homeDir, "AppData", "Roaming", "Python", "Scripts"),
        join(homeDir, ".local", "bin")
      );
    }
    commonBinPaths.push(
      "C:\\Program Files\\Python311\\Scripts",
      "C:\\Program Files\\Python312\\Scripts",
      "C:\\Python311\\Scripts",
      "C:\\Python312\\Scripts"
    );
  } else {
    // Unix-like (macOS/Linux) common paths
    if (homeDir) {
      commonBinPaths.push(join(homeDir, ".local", "bin"));
    }
    commonBinPaths.push(
      "/usr/local/bin",
      "/opt/homebrew/bin",
      "/usr/bin",
      "/bin"
    );
  }

  // Add common paths to existing PATH
  const existingPath = process.env.PATH || "";
  const pathsToAdd = commonBinPaths.filter(p => !existingPath.includes(p));

  return [...pathsToAdd, existingPath].filter(Boolean).join(pathSeparator);
}

const ENHANCED_PATH = buildEnhancedPath();

// Get Fabric path - try common locations, then PATH
function getFabricCommand(): string {
  const isWindows = platform() === "win32";
  const homeDir = getHomeDir();
  const fabricName = isWindows ? "fabric.exe" : "fabric";

  // Try common installation locations
  const commonPaths: string[] = [];

  if (isWindows) {
    if (homeDir) {
      commonPaths.push(
        join(homeDir, "AppData", "Roaming", "Python", "Scripts", fabricName),
        join(homeDir, ".local", "bin", fabricName)
      );
    }
    commonPaths.push(
      `C:\\Program Files\\Python311\\Scripts\\${fabricName}`,
      `C:\\Program Files\\Python312\\Scripts\\${fabricName}`,
      `C:\\Python311\\Scripts\\${fabricName}`,
      `C:\\Python312\\Scripts\\${fabricName}`
    );
  } else {
    if (homeDir) {
      commonPaths.push(join(homeDir, ".local", "bin", fabricName));
    }
    commonPaths.push(
      "/usr/local/bin/fabric",
      "/opt/homebrew/bin/fabric"
    );
  }

  for (const path of commonPaths) {
    try {
      if (existsSync(path)) {
        console.error(`Found fabric at: ${path}`);
        return path;
      }
    } catch {
      // Continue checking
    }
  }

  // Fall back to "fabric" and hope it's in PATH
  console.error("Using 'fabric' from PATH");
  return "fabric";
}

const FABRIC_COMMAND = getFabricCommand();

// Get yt-dlp command with enhanced path
function getYtDlpCommand(): string {
  const isWindows = platform() === "win32";
  const homeDir = getHomeDir();
  const ytdlpName = isWindows ? "yt-dlp.exe" : "yt-dlp";

  // Try common installation locations
  const commonPaths: string[] = [];

  if (isWindows) {
    if (homeDir) {
      commonPaths.push(
        join(homeDir, "AppData", "Roaming", "Python", "Scripts", ytdlpName),
        join(homeDir, ".local", "bin", ytdlpName)
      );
    }
    commonPaths.push(
      `C:\\Program Files\\Python311\\Scripts\\${ytdlpName}`,
      `C:\\Program Files\\Python312\\Scripts\\${ytdlpName}`,
      `C:\\Python311\\Scripts\\${ytdlpName}`,
      `C:\\Python312\\Scripts\\${ytdlpName}`
    );
  } else {
    if (homeDir) {
      commonPaths.push(join(homeDir, ".local", "bin", ytdlpName));
    }
    commonPaths.push(
      "/opt/homebrew/bin/yt-dlp",
      "/usr/local/bin/yt-dlp"
    );
  }

  for (const path of commonPaths) {
    try {
      if (existsSync(path)) {
        console.error(`Found yt-dlp at: ${path}`);
        return path;
      }
    } catch {
      // Continue checking
    }
  }

  // Fall back to "yt-dlp" and hope it's in PATH
  console.error("Using 'yt-dlp' from PATH");
  return "yt-dlp";
}

const YTDLP_COMMAND = getYtDlpCommand();

// Helper to run fabric command and get output
async function runFabric(args: string[], input?: string, timeoutMs: number = 30000): Promise<string> {
  return new Promise((resolve, reject) => {
    const fabricProcess = spawn(FABRIC_COMMAND, args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, PATH: ENHANCED_PATH },
    });

    let stdout = "";
    let stderr = "";
    let didTimeout = false;

    // Set a timeout
    const timeout = setTimeout(() => {
      didTimeout = true;
      fabricProcess.kill();
      reject(new Error(`Fabric command timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    fabricProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    fabricProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    fabricProcess.on("error", (error: any) => {
      clearTimeout(timeout);
      if (!didTimeout) {
        const err: any = new Error(`Failed to spawn fabric: ${error.message} (${error.code})`);
        err.spawnError = error.code;
        err.errno = error.errno;
        err.syscall = error.syscall;
        err.path = error.path;
        reject(err);
      }
    });

    fabricProcess.on("close", (code) => {
      clearTimeout(timeout);
      if (didTimeout) return; // Already rejected

      if (code !== 0) {
        const error: any = new Error(`Fabric exited with code ${code}: ${stderr}`);
        error.code = code;
        error.stderr = stderr;
        error.stdout = stdout;
        reject(error);
      } else {
        resolve(stdout);
      }
    });

    // Always close stdin - if there's input, write it first
    if (input) {
      fabricProcess.stdin.write(input);
    }
    fabricProcess.stdin.end();
  });
}

// Helper to get available patterns
async function getPatterns(): Promise<string[]> {
  try {
    const output = await runFabric(["--listpatterns"]);
    // Parse the output - fabric --listpatterns returns patterns one per line
    return output
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } catch (error) {
    console.error("Error fetching patterns:", error);
    return [];
  }
}

// Helper to apply a pattern
async function applyPattern(
  patternName: string,
  input: string
): Promise<string> {
  try {
    const output = await runFabric(["--pattern", patternName], input);
    return output;
  } catch (error) {
    throw new Error(`Error applying pattern: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper to get YouTube transcript
async function getYouTubeTranscript(url: string): Promise<string> {
  try {
    const output = await runFabric(["--youtube", url]);
    return output;
  } catch (error) {
    throw new Error(`Error fetching YouTube transcript: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper to run any command with proper stdin handling
async function runCommand(command: string, args: string[], timeoutMs: number = 30000): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, PATH: ENHANCED_PATH },
    });

    let stdout = "";
    let stderr = "";
    let didTimeout = false;

    const timeout = setTimeout(() => {
      didTimeout = true;
      proc.kill();
      reject(new Error(`Command timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("error", (error) => {
      clearTimeout(timeout);
      if (!didTimeout) {
        reject(new Error(`Failed to run command: ${error.message}`));
      }
    });

    proc.on("close", (code) => {
      clearTimeout(timeout);
      if (didTimeout) return;

      if (code !== 0) {
        reject(new Error(`Command exited with code ${code}: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });

    // Always close stdin immediately
    proc.stdin.end();
  });
}

// Health check function
async function performHealthCheck(): Promise<string> {
  const checks: string[] = [];
  let allGood = true;

  checks.push("# Fabric MCP Server Health Check\n");

  // Debug: Show PATH and environment
  checks.push("## 0. Debug Information");
  checks.push(`   Platform: ${platform()}`);
  checks.push(`   Home Directory: ${getHomeDir()}`);
  checks.push(`   Original PATH: ${process.env.PATH}`);
  checks.push(`   Enhanced PATH: ${ENHANCED_PATH}`);
  checks.push(`   Resolved FABRIC_COMMAND: ${FABRIC_COMMAND}`);
  checks.push(`   Resolved YTDLP_COMMAND: ${YTDLP_COMMAND}`);

  // Check 1: Fabric installation - use runFabric which properly closes stdin!
  checks.push("\n## 1. Fabric Installation");
  let fabricVersion: string | undefined;
  let fabricWorks = false;

  try {
    const output = await runFabric(["--version"], undefined, 5000);
    fabricVersion = output.trim().split("\n")[0];
    fabricWorks = true;
    checks.push(`✅ Fabric is installed and accessible`);
    checks.push(`   Command: ${FABRIC_COMMAND}`);
    checks.push(`   Version: ${fabricVersion}`);
  } catch (error: any) {
    allGood = false;
    checks.push(`❌ Fabric is NOT installed or not accessible`);
    checks.push(`   Tried to run: ${FABRIC_COMMAND}`);
    checks.push(`   Error: ${error instanceof Error ? error.message : String(error)}`);
    if (error.spawnError) checks.push(`   Spawn error: ${error.spawnError}`);
    if (error.errno) checks.push(`   Errno: ${error.errno}`);
    if (error.syscall) checks.push(`   Syscall: ${error.syscall}`);
    if (error.code !== undefined) checks.push(`   Exit code: ${error.code}`);
    if (error.stdout) checks.push(`   Stdout: ${error.stdout.substring(0, 200)}`);
    if (error.stderr) checks.push(`   Stderr: ${error.stderr.substring(0, 200)}`);
    checks.push(`\n   To install Fabric:`);
    checks.push(`   macOS/Linux: pipx install fabric-ai`);
    checks.push(`   Windows: pip install fabric-ai`);
    checks.push(`   Then run: fabric --setup`);
    checks.push(`\n   More info: https://github.com/danielmiessler/fabric`);
  }

  // Check 2: Fabric configuration
  checks.push("\n## 2. Fabric Configuration");
  if (fabricWorks) {
    try {
      // Try to list patterns to verify Fabric is configured (use --listpatterns for v1.4+)
      await runFabric(["--listpatterns"], undefined, 10000);
      checks.push(`✅ Fabric is configured and working`);
    } catch (error) {
      allGood = false;
      checks.push(`❌ Fabric is installed but not configured properly`);
      checks.push(`   Error: ${error instanceof Error ? error.message : String(error)}`);
      checks.push(`\n   To configure Fabric:`);
      checks.push(`   Run: fabric --setup`);
      checks.push(`   This will configure your API keys and preferences`);
    }
  } else {
    checks.push(`⚠️  Skipped (Fabric not installed)`);
  }

  // Check 3: yt-dlp installation - use resolved command
  checks.push("\n## 3. yt-dlp Installation (for YouTube transcripts)");
  let ytdlpVersion: string | undefined;
  let ytdlpWorks = false;

  try {
    const output = await runCommand(YTDLP_COMMAND, ["--version"], 5000);
    ytdlpVersion = output.trim().split("\n")[0];
    ytdlpWorks = true;
    checks.push(`✅ yt-dlp is installed and accessible`);
    checks.push(`   Command: ${YTDLP_COMMAND}`);
    checks.push(`   Version: ${ytdlpVersion}`);
  } catch (error) {
    checks.push(`⚠️  yt-dlp is NOT installed (YouTube transcript feature will not work)`);
    checks.push(`   Tried: ${YTDLP_COMMAND}`);
    checks.push(`\n   To install yt-dlp:`);
    checks.push(`   macOS: brew install yt-dlp`);
    checks.push(`   Linux: pip install yt-dlp`);
    checks.push(`   Windows: pip install yt-dlp`);
    checks.push(`\n   More info: https://github.com/yt-dlp/yt-dlp`);
  }

  // Check 4: Node.js environment
  checks.push("\n## 4. Node.js Environment");
  checks.push(`✅ Node.js version: ${process.version}`);
  checks.push(`   Platform: ${process.platform}`);
  checks.push(`   Architecture: ${process.arch}`);

  // Check 5: Fabric path configuration
  checks.push("\n## 5. Fabric Path Configuration");
  checks.push(`   Using: ${FABRIC_COMMAND}`);

  // Summary
  checks.push("\n## Summary");
  if (allGood && ytdlpWorks) {
    checks.push(`✅ All checks passed! The server is ready to use.`);
  } else if (allGood) {
    checks.push(`⚠️  Server is functional but YouTube transcripts require yt-dlp.`);
  } else {
    checks.push(`❌ Some issues found. Please install/configure missing components.`);
  }

  return checks.join("\n");
}

// Define the key patterns we want to expose as tools
const KEY_PATTERNS = [
  {
    name: "extract_wisdom",
    description: "Extract key insights, quotes, and wisdom from any content (articles, videos, podcasts)",
  },
  {
    name: "summarize",
    description: "Create a concise summary of content",
  },
  {
    name: "analyze_claims",
    description: "Analyze and fact-check claims made in content",
  },
  {
    name: "create_quiz",
    description: "Generate quiz questions from content for learning",
  },
  {
    name: "to_flashcards",
    description: "Convert content into flashcards for studying",
  },
  {
    name: "analyze_paper",
    description: "Analyze academic papers or technical documents",
  },
  {
    name: "summarize_git_diff",
    description: "Summarize git diff output for code reviews",
  },
  {
    name: "analyze_logs",
    description: "Analyze log files for issues and patterns",
  },
  {
    name: "analyze_incident",
    description: "Analyze security incidents or system failures",
  },
  {
    name: "create_coding_project",
    description: "Generate project structure and planning from an idea",
  },
  {
    name: "explain_code",
    description: "Explain code in simple terms",
  },
  {
    name: "improve_writing",
    description: "Improve writing quality and clarity",
  },
];

// Create MCP server
const server = new Server(
  {
    name: "fabric-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools: Tool[] = [
    // Health check tool
    {
      name: "health_check",
      description: "Check if Fabric, yt-dlp, and other dependencies are installed and configured correctly. Provides installation instructions if needed.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    // Generic pattern runner
    {
      name: "run_fabric_pattern",
      description: "Run any Fabric pattern with custom input. Use this for patterns not covered by specific tools.",
      inputSchema: {
        type: "object",
        properties: {
          pattern: {
            type: "string",
            description: "The name of the Fabric pattern to run",
          },
          input: {
            type: "string",
            description: "The input text to process with the pattern",
          },
        },
        required: ["pattern", "input"],
      },
    },
    // YouTube transcript fetcher
    {
      name: "get_youtube_transcript",
      description: "Fetch transcript from a YouTube video URL",
      inputSchema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The YouTube video URL",
          },
        },
        required: ["url"],
      },
    },
    // List all patterns
    {
      name: "list_fabric_patterns",
      description: "List all available Fabric patterns",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ];

  // Add specific tools for key patterns
  for (const pattern of KEY_PATTERNS) {
    tools.push({
      name: `fabric_${pattern.name}`,
      description: pattern.description,
      inputSchema: {
        type: "object",
        properties: {
          input: {
            type: "string",
            description: "The input text to process",
          },
        },
        required: ["input"],
      },
    });
  }

  return { tools };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {

    // Handle health check
    if (name === "health_check") {
      const report = await performHealthCheck();
      return {
        content: [
          {
            type: "text",
            text: report,
          },
        ],
      };
    }

    // Handle list patterns
    if (name === "list_fabric_patterns") {
      const patterns = await getPatterns();
      return {
        content: [
          {
            type: "text",
            text: `Available Fabric patterns:\n\n${patterns.join("\n")}`,
          },
        ],
      };
    }

    // Handle YouTube transcript
    if (name === "get_youtube_transcript") {
      const url = args?.url as string;
      if (!url) {
        throw new Error("url parameter is required");
      }
      const transcript = await getYouTubeTranscript(url);
      return {
        content: [
          {
            type: "text",
            text: transcript,
          },
        ],
      };
    }

    // Handle generic pattern runner
    if (name === "run_fabric_pattern") {
      const pattern = args?.pattern as string;
      const input = args?.input as string;
      
      if (!pattern || !input) {
        throw new Error("Both pattern and input parameters are required");
      }

      const result = await applyPattern(pattern, input);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    }

    // Handle specific pattern tools
    if (name.startsWith("fabric_")) {
      const patternName = name.replace("fabric_", "");
      const input = args?.input as string;
      
      if (!input) {
        throw new Error("input parameter is required");
      }

      const result = await applyPattern(patternName, input);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Cleanup on exit
process.on("SIGINT", () => {
  console.error("Shutting down...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.error("Shutting down...");
  process.exit(0);
});

// Start the server
async function main() {
  try {
    console.error("Fabric MCP Server starting...");
    console.error("Using Fabric CLI directly (no REST API server needed)");

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("Fabric MCP server running on stdio");
    console.error("Server ready to accept requests");
  } catch (error) {
    console.error("Fatal error during startup:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
