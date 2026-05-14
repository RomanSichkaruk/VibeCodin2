# Getting Started Guide

Complete setup guide for using Claude with MCP, Subagents, and Skills for code review.

## Overview

This setup provides:
- **MCP (Git)**: Access to repository data through Model Context Protocol
- **Subagent (Code Reviewer)**: Specialized agent for analyzing code changes
- **Skills**: Reusable functions for git and code quality operations

```
Your Request
    ↓
code-review-agent (main orchestrator)
    ├→ Code Reviewer (subagent)
    ├→ Git Operations (skill)
    ├→ Code Quality (skill)
    └→ Git MCP (external system access)
    ↓
Review with Issues & Suggestions
```

## Prerequisites

- Node.js 16+
- npm or yarn
- Git command-line tools
- VS Code with Copilot extension

## Installation Steps

### 1. Install Dependencies

```bash
npm install @modelcontextprotocol/sdk
npm install
```

### 2. Create MCP Server Directory

```bash
mkdir -p mcp-servers
# Copy git-mcp.js from .claude/examples/ or download:
# Located at: mcp-servers/git-mcp.js
```

### 3. Verify File Structure

```
.
├── .claude/
│   ├── agents/
│   │   └── code-review-agent.md
│   ├── subagents/
│   │   └── code-reviewer.md
│   ├── skills/
│   │   ├── git-operations.md
│   │   └── code-quality.md
│   ├── mcp/
│   │   ├── git.json
│   │   └── mcp.config.json
│   └── README.md
├── .instructions.md
├── mcp-servers/
│   └── git-mcp.js
└── README.md
```

### 4. Start Git MCP Server

```bash
# In a terminal
node mcp-servers/git-mcp.js
```

You should see:
```
[Git MCP Server] Starting...
[Git MCP Server] Connected and ready for requests
```

**Keep this terminal running** while using Claude.

### 5. Configure Claude in VS Code

Copilot will automatically detect the `.instructions.md` file and load:
- Agent: `code-review-agent`
- Subagents: `code-reviewer`
- Skills: `git-operations`, `code-quality`
- MCP: Git server configuration

## Using the Code Review Agent

### Basic Usage

In VS Code's Copilot Chat, request a code review:

```
@claude Review the changes in the feature/new-api branch
```

Claude will:
1. Fetch diffs using Git MCP
2. Invoke code-reviewer subagent
3. Apply code-quality and git-operations skills
4. Generate detailed review

### Advanced Usage

#### Review Specific Files

```
Review src/api/handlers.js and src/api/middleware.js between main and feature/auth
```

#### Check Code Standards

```
Use the code-quality skill to check if recent commits follow our naming conventions
```

#### Get Commit Context

```
What were the recent changes in this repo? Use git-operations skill for context.
```

#### Security Review

```
Code-reviewer, perform a security analysis on the database-migration branch
```

## Configuration

### Customize Code Quality Standards

Edit `.claude/skills/code-quality.md` to define your project's standards:

```markdown
### `check_code_standards`

Standards to check:
- naming_conventions: camelCase for variables
- error_handling: try-catch for async operations
- comments_documentation: JSDoc for functions
- performance_patterns: No N+1 queries
```

### Adjust Review Focus

Edit `.claude/agents/code-review-agent.md` to change which files are reviewed:

```yaml
applyTo:
  - "src/**/*.js"
  - "tests/**/*.test.js"
  # Remove patterns to exclude from review
```

### Add Custom MCP Servers

1. Create new server definition in `.claude/mcp/[server-name].json`
2. Register in `.claude/mcp/mcp.config.json`
3. Update `.claude/agents/code-review-agent.md` to reference it

## Examples

### Example 1: Review a Pull Request

**Command**:
```
@claude Use code-reviewer to analyze the PR from main to feature/payment
```

**Process**:
1. Agent fetches git diff (main → feature/payment)
2. Subagent analyzes changes
3. Skills check standards and patterns
4. Review generated with findings

**Output**:
```
REVIEW SUMMARY
==============

Branch: feature/payment (5 commits)
Files Changed: 8
Lines: +234 -67

CRITICAL ISSUES (1):
- Security: Hardcoded API key in config.js:12

MAJOR ISSUES (2):
- Error Handling: Missing try-catch in payment-handler.js:45
- Performance: Unoptimized database query in checkout.js:78

SUGGESTIONS (3):
- Add JSDoc comments to payment functions
- Use environment variables for configuration
- Consider caching strategy for frequent queries

OVERALL: Review Required (security concern)
```

### Example 2: Check Standards on Main Branch

**Command**:
```
Check the last 5 commits on main for coding standard violations
```

**Process**:
1. Git skill fetches commit history
2. Code-quality skill validates standards
3. Results summarized

**Output**:
```
STANDARDS CHECK
================

Commits Analyzed: 5
Time Period: Last 3 days

Violations:
- Commit abc1234: Missing comments in utils.js
- Commit def5678: Inconsistent naming (snake_case found)

Recommendations:
1. Add pre-commit hooks for documentation
2. Enable ESLint with naming rules
3. Require code review for main branch
```

### Example 3: Security Audit

**Command**:
```
Perform a security audit on the develop branch using code-reviewer
```

**Process**:
1. Detect security patterns
2. Check for common vulnerabilities
3. Suggest security improvements

**Output**:
```
SECURITY AUDIT
===============

Issues Found: 3

🔴 CRITICAL (1):
  - Potential SQL Injection in query builder (db.js:156)
    Fix: Use parameterized queries

🟠 HIGH (1):
  - Unvalidated user input in API handler (routes.js:89)
    Fix: Add input validation middleware

🟡 MEDIUM (1):
  - Missing CORS validation (server.js:34)
    Fix: Restrict CORS origins
```

## Troubleshooting

### Git MCP Server Not Running

**Error**: "Tool 'git_get_repo_status' not found"

**Solution**:
1. Check server is running: `node mcp-servers/git-mcp.js`
2. Verify `.claude/mcp/mcp.config.json` points to correct file
3. Check console for error messages
4. Ensure Node.js is installed: `node --version`

### Subagent Not Responding

**Error**: "code-reviewer subagent not found"

**Solution**:
1. Verify `.claude/agents/code-reviewer.md` exists
2. Check YAML frontmatter is valid
3. Ensure all referenced skills exist in `.claude/skills/`
4. Reload VS Code

### Skills Not Available

**Error**: "git-operations skill not found"

**Solution**:
1. Check files exist in `.claude/skills/`
2. Verify they're listed in agent/subagent files
3. Check for YAML syntax errors
4. Restart Claude in VS Code

### Performance Issues

**If reviews are slow**:
1. Reduce `max_commits` in git-operations skill
2. Limit file patterns in `applyTo`
3. Check Git MCP server logs
4. Consider splitting large reviews

## Next Steps

1. **Customize Standards**: Modify `code-quality.md` for your project
2. **Add Skills**: Create new skills for domain-specific analysis
3. **Extend MCP**: Integrate GitHub API, Jira, or other tools
4. **Create Workflows**: Define multiple agents for different tasks
5. **Automate**: Set up CI/CD integration

## Key Files Reference

| File | Purpose |
|------|---------|
| `.instructions.md` | Workspace configuration for Claude |
| `.claude/agents/code-review-agent.md` | Main agent orchestration |
| `.claude/subagents/code-reviewer.md` | Specialized code review subagent |
| `.claude/skills/git-operations.md` | Git utility functions |
| `.claude/skills/code-quality.md` | Code analysis functions |
| `.claude/mcp/mcp.config.json` | MCP runtime configuration |
| `mcp-servers/git-mcp.js` | Git MCP server implementation |

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `.claude/README.md` for configuration details
3. Check `.claude/mcp/README.md` for MCP-specific help
4. Verify file syntax using a YAML/Markdown validator

## Resources

- [Claude Documentation](https://claude.ai)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [VS Code Copilot](https://github.com/features/copilot)
