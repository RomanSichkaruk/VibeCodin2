/**
 * Git MCP Server Implementation
 * 
 * This server provides Claude with access to Git repository operations
 * through the Model Context Protocol.
 * 
 * Usage: node mcp-servers/git-mcp.js
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class GitMCPServer {
  constructor() {
    this.server = new Server({
      name: 'git-mcp-server',
      version: '1.0.0',
      description: 'Git repository access for code review and analysis'
    });

    this.setupTools();
  }

  setupTools() {
    /**
     * Tool: git_get_repo_status
     * Gets the current status of the repository
     */
    this.server.tool(
      'git_get_repo_status',
      {
        type: 'object',
        properties: {
          repo_path: {
            type: 'string',
            description: 'Path to git repository (defaults to current directory)'
          }
        }
      },
      async (args) => {
        try {
          const cwd = args.repo_path || process.cwd();
          const { stdout: status } = await execAsync('git status --porcelain', { cwd });
          const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD', { cwd });
          const { stdout: remoteUrl } = await execAsync('git config --get remote.origin.url', { cwd }).catch(() => ({ stdout: 'N/A' }));

          return {
            success: true,
            data: {
              branch: branch.trim(),
              status: status || '(working tree clean)',
              remoteUrl: remoteUrl.trim(),
              timestamp: new Date().toISOString()
            }
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    );

    /**
     * Tool: git_get_commit_history
     * Retrieves commit history for a branch
     */
    this.server.tool(
      'git_get_commit_history',
      {
        type: 'object',
        properties: {
          repo_path: {
            type: 'string',
            description: 'Path to git repository'
          },
          max_commits: {
            type: 'number',
            description: 'Maximum number of commits to retrieve',
            default: 10
          },
          branch: {
            type: 'string',
            description: 'Branch name (defaults to current branch)'
          }
        },
        required: ['repo_path']
      },
      async (args) => {
        try {
          const cwd = args.repo_path;
          const maxCommits = args.max_commits || 10;
          const branch = args.branch ? ` ${args.branch}` : '';

          const { stdout } = await execAsync(
            `git log -${maxCommits} --format="%H|%an|%ae|%ad|%s" --date=short${branch}`,
            { cwd }
          );

          const commits = stdout.trim().split('\n').map(line => {
            const [hash, author, email, date, subject] = line.split('|');
            return { hash: hash.substring(0, 7), author, email, date, subject };
          });

          return {
            success: true,
            data: {
              total: commits.length,
              commits,
              branch: args.branch || 'current'
            }
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    );

    /**
     * Tool: git_get_diff
     * Gets diff between two references (commits, branches, etc.)
     */
    this.server.tool(
      'git_get_diff',
      {
        type: 'object',
        properties: {
          repo_path: {
            type: 'string',
            description: 'Path to git repository'
          },
          from_ref: {
            type: 'string',
            description: 'Source reference (commit SHA, branch name, etc.)'
          },
          to_ref: {
            type: 'string',
            description: 'Target reference (commit SHA, branch name, etc.)'
          },
          file_filter: {
            type: 'string',
            description: 'Optional file path filter (glob pattern)'
          }
        },
        required: ['repo_path', 'from_ref', 'to_ref']
      },
      async (args) => {
        try {
          const cwd = args.repo_path;
          const filter = args.file_filter ? ` -- ${args.file_filter}` : '';

          const { stdout: diffOutput } = await execAsync(
            `git diff ${args.from_ref}..${args.to_ref} --stat${filter}`,
            { cwd }
          );

          const { stdout: fullDiff } = await execAsync(
            `git diff ${args.from_ref}..${args.to_ref}${filter}`,
            { cwd }
          );

          // Parse diff stats
          const lines = diffOutput.trim().split('\n');
          const filesChanged = lines.length - 1;

          return {
            success: true,
            data: {
              from: args.from_ref,
              to: args.to_ref,
              filesChanged,
              stats: diffOutput,
              fullDiff: fullDiff.substring(0, 50000), // Limit size
              truncated: fullDiff.length > 50000
            }
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    );

    /**
     * Tool: git_get_changed_files
     * Gets list of files changed between references
     */
    this.server.tool(
      'git_get_changed_files',
      {
        type: 'object',
        properties: {
          repo_path: {
            type: 'string',
            description: 'Path to git repository'
          },
          from_ref: {
            type: 'string',
            description: 'Source reference'
          },
          to_ref: {
            type: 'string',
            description: 'Target reference'
          }
        },
        required: ['repo_path', 'from_ref', 'to_ref']
      },
      async (args) => {
        try {
          const cwd = args.repo_path;
          const { stdout } = await execAsync(
            `git diff ${args.from_ref}..${args.to_ref} --name-status`,
            { cwd }
          );

          const files = stdout.trim().split('\n').map(line => {
            const [status, ...pathParts] = line.split('\t');
            const path = pathParts.join('\t');
            return { status, path };
          });

          return {
            success: true,
            data: {
              filesChanged: files.length,
              files,
              summary: {
                added: files.filter(f => f.status === 'A').length,
                modified: files.filter(f => f.status === 'M').length,
                deleted: files.filter(f => f.status === 'D').length,
                renamed: files.filter(f => f.status === 'R').length
              }
            }
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    console.error('[Git MCP Server] Starting...');

    try {
      await this.server.connect(transport);
      console.error('[Git MCP Server] Connected and ready for requests');
    } catch (error) {
      console.error('[Git MCP Server] Error:', error);
      process.exit(1);
    }
  }
}

// Start server
const server = new GitMCPServer();
server.run().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
