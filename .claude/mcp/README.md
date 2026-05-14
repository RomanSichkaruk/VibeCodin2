# Model Context Protocol (MCP) Configuration

This directory contains MCP server definitions that provide Claude with external system access.

## Overview

MCP enables Claude to:
- Access Git repositories for code review
- Interact with external APIs and services
- Read and manipulate file systems
- Query databases
- Execute system commands (with permission)

## Files

### `git.json`
Git server definition with tools for:
- Repository status (`git_get_repo_status`)
- Commit history (`git_get_commit_history`)
- Diff analysis (`git_get_diff`)

**Used by**: code-review-agent, code-reviewer subagent

### `mcp.config.json`
Runtime configuration:
- Registers active MCP servers
- Specifies command/args for launching servers
- Sets environment variables
- Enables/disables specific servers

## Setting Up Git MCP

### 1. Install Dependencies
```bash
npm install @modelcontextprotocol/server-git
```

### 2. Create Git Server File
Create `mcp-servers/git-mcp.js`:

```javascript
const { Server } = require('@modelcontextprotocol/sdk/server/index');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class GitMCPServer {
  constructor() {
    this.server = new Server({
      name: 'git-mcp',
      version: '1.0.0',
    });

    this.setupTools();
  }

  setupTools() {
    // git_get_repo_status
    this.server.tool('git_get_repo_status', 
      { repo_path: { type: 'string' } },
      async (args) => {
        const { stdout } = await execAsync('git status --porcelain', {
          cwd: args.repo_path || process.cwd()
        });
        return { status: stdout };
      }
    );

    // git_get_commit_history
    this.server.tool('git_get_commit_history',
      {
        repo_path: { type: 'string' },
        max_commits: { type: 'number', default: 10 },
        branch: { type: 'string' }
      },
      async (args) => {
        const branch = args.branch ? ` ${args.branch}` : '';
        const { stdout } = await execAsync(
          `git log -${args.max_commits} --oneline${branch}`,
          { cwd: args.repo_path || process.cwd() }
        );
        return { commits: stdout };
      }
    );

    // git_get_diff
    this.server.tool('git_get_diff',
      {
        repo_path: { type: 'string' },
        from_ref: { type: 'string' },
        to_ref: { type: 'string' }
      },
      async (args) => {
        const { stdout } = await execAsync(
          `git diff ${args.from_ref}..${args.to_ref}`,
          { cwd: args.repo_path || process.cwd() }
        );
        return { diff: stdout };
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new GitMCPServer();
server.run().catch(console.error);
```

### 3. Enable in Configuration

The `mcp.config.json` already references this server. Ensure it's available:

```json
{
  "mcpServers": {
    "git": {
      "command": "node",
      "args": ["mcp-servers/git-mcp.js"],
      "enabled": true
    }
  }
}
```

### 4. Start the Server

```bash
node mcp-servers/git-mcp.js
```

Claude will automatically connect via the configuration.

## Adding More MCP Servers

### 1. Define Server Schema
Create a new JSON file (e.g., `github.json`):

```json
{
  "name": "github",
  "description": "GitHub API access",
  "tools": [
    {
      "name": "get_pull_requests",
      "description": "Fetch pull requests",
      "inputSchema": {
        "type": "object",
        "properties": {
          "repo": { "type": "string" },
          "state": { "type": "string" }
        }
      }
    }
  ]
}
```

### 2. Add to MCP Config
Update `mcp.config.json`:

```json
{
  "mcpServers": {
    "git": { ... },
    "github": {
      "command": "node",
      "args": ["mcp-servers/github-mcp.js"],
      "enabled": true
    }
  }
}
```

### 3. Implement Server
Create `mcp-servers/github-mcp.js` with tool implementations.

### 4. Update Agent References
Add to agent's `mcp` list in `.claude/agents/code-review-agent.md`.

## Troubleshooting

### Server Not Connecting
- Check command path is correct
- Verify dependencies are installed
- Check stdio transport setup
- Look for error logs

### Tool Not Available
- Verify tool is defined in server implementation
- Check tool name matches exactly
- Ensure server is enabled in config

### Permission Issues
- Check file permissions on server script
- Verify user has repo access
- Check firewall/network access

## Best Practices

1. **Minimal Permissions**: Request only needed access
2. **Error Handling**: Implement proper error responses
3. **Caching**: Cache results when possible
4. **Documentation**: Update tool descriptions
5. **Testing**: Test servers locally before deploying

## References

- [MCP Protocol Spec](https://modelcontextprotocol.io/docs)
- Git server definition: [`git.json`](git.json)
- Runtime config: [`mcp.config.json`](mcp.config.json)
