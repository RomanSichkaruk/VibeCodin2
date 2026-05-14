# Claude MCP Code Review Setup

Complete example setup for Claude with **MCP (Model Context Protocol)**, **Subagents**, and **Skills** for code review automation.

> **Status**: ✅ Complete and Ready to Use | **Version**: 1.0.0 | **Last Updated**: May 14, 2026

## 📚 Table of Contents

- [Quick Start](#quick-start)
- [What Is This?](#what-is-this)
- [Directory Structure](#directory-structure)
- [Setup Instructions](#setup-instructions)
- [Using the Code Review Agent](#using-the-code-review-agent)
- [Architecture](#architecture)
- [Components](#components)
- [Configuration](#configuration)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Quick Start

### Automatic Setup

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Git MCP server
npm start

# 3. Open VS Code and use in Copilot Chat
@claude Review the changes in feature/new-api branch
```

---

## What Is This?

This is a **production-ready example** showing how to set up Claude with:

- **MCP (Git)**: Direct access to your Git repository for code review
- **Subagent (Code Reviewer)**: Specialized agent for analyzing code changes
- **Skills**: Reusable functions for git operations and code quality analysis

```
Your Request
    ↓
.instructions.md (workspace config)
    ↓
code-review-agent (main orchestrator)
    ├→ code-reviewer (subagent)
    ├→ git-operations (skill)
    ├→ code-quality (skill)
    └→ Git MCP server
    ↓
Detailed Code Review with Issues & Suggestions
```

---

## Directory Structure

```
VB2/
├── .claude/                              # Claude customization
│   ├── README.md                        # Claude config overview
│   ├── agents/                          # Agents and subagents
│   │   ├── code-review-agent.md         # Main orchestrating agent
│   │   └── code-reviewer.md             # Code review specialist (subagent)
│   ├── skills/                          # Reusable skill functions
│   │   ├── git-operations.md            # Git utility functions
│   │   └── code-quality.md              # Code analysis functions
│   └── mcp/                             # Model Context Protocol
│       ├── git.json                     # Git MCP server definition
│       ├── mcp.config.json              # MCP runtime config
│       └── README.md                    # MCP documentation
│
├── mcp-servers/
│   └── git-mcp.js                       # Git MCP server implementation
│
├── .instructions.md                     # Workspace customization (MAIN CONFIG)
├── package.json                         # Node.js dependencies
├── setup.sh                             # Quick start script (Linux/Mac)
├── setup.bat                            # Quick start script (Windows)
├── README.md                            # This file
├── GETTING_STARTED.md                   # Detailed setup guide
├── ARCHITECTURE.md                      # System design & diagrams
└── STRUCTURE.md                         # Project reference
```

---

## Setup Instructions

### Prerequisites

- Node.js 16+ ([download](https://nodejs.org/))
- npm or yarn
- Git command-line tools
- VS Code with Copilot extension

### Step-by-Step

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Verify File Structure

Ensure you have these key files (should already exist):

```
✓ .claude/agents/code-review-agent.md
✓ .claude/agents/code-reviewer.md
✓ .claude/skills/git-operations.md
✓ .claude/skills/code-quality.md
✓ .claude/mcp/git.json
✓ .claude/mcp/mcp.config.json
✓ mcp-servers/git-mcp.js
✓ .instructions.md
```

#### 3. Start Git MCP Server

**In one terminal:**

```bash
npm start
```

You should see:
```
[Git MCP Server] Starting...
[Git MCP Server] Connected and ready for requests
```

**Keep this terminal running** while using Claude.

#### 4. Configure Claude in VS Code

Copilot will automatically detect the `.instructions.md` file and load:
- ✅ Agent: `code-review-agent`
- ✅ Subagents: `code-reviewer`  
- ✅ Skills: `git-operations`, `code-quality`
- ✅ MCP: Git server

---

## Using the Code Review Agent

### Basic Usage

In VS Code's **Copilot Chat**, request a code review:

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

---

## Architecture

### System Diagram

```
┌────────────────────────────────────────┐
│   User Request in Copilot Chat         │
│   @claude Review this branch           │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│   .instructions.md loads               │
│   Workspace Configuration              │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│   code-review-agent.md orchestrates    │
│   Main agent workflow                  │
└──────────────┬─────────────────────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
[Subagent] [Skills]  [MCP]
    │          │        │
    ├──────────┴────────┤
    │                   │
    ▼                   ▼
code-reviewer    git-mcp.js
subagent         server
    │
    ├─ git-operations skill
    ├─ code-quality skill
    └─ git MCP (status, diff, history)
    │
    ▼
Structured Review Output
(Issues, Suggestions, Risk Score)
```

### Data Flow

```
1. Agent fetches git diff (via MCP)
   └─> Returns list of changed files

2. Subagent analyzes changes
   ├─> Uses git-operations skill
   └─> Uses code-quality skill
   
3. Code quality analysis
   ├─> Checks standards (naming, error handling)
   ├─> Detects patterns (security, performance)
   └─> Suggests improvements

4. Consolidated review
   ├─> Issues (critical, major, minor)
   ├─> Suggestions
   ├─> Risk assessment
   └─> Return to user
```

---

## Components

### 1. MCP (Model Context Protocol) - Git

**Files**: `.claude/mcp/git.json` + `mcp-servers/git-mcp.js`

**Purpose**: Direct access to Git repository for code review

**Available Tools**:
- `git_get_repo_status` - Current branch, modified files, remote URL
- `git_get_commit_history` - Recent commits with authors and dates
- `git_get_diff` - Changes between branches/commits
- `git_get_changed_files` - List of changed files with status

**Usage**: Called automatically by agents and skills when needed

### 2. Main Agent

**File**: `.claude/agents/code-review-agent.md`

**Purpose**: Orchestrates the entire code review workflow

**Responsibilities**:
- Processes code review requests
- Delegates to code-reviewer subagent
- Calls git-operations skill for repository data
- Invokes code-quality skill for analysis
- Uses Git MCP for system operations
- Consolidates findings into final review

### 3. Subagent - Code Reviewer

**File**: `.claude/agents/code-reviewer.md`

**Purpose**: Specialized code analysis and review

**Capabilities**:
- Diff analysis between branches
- Code quality checks
- Pattern detection (security, performance)
- Best practice validation
- Context-aware suggestions

**Uses**:
- git-operations skill (fetch diffs, commits)
- code-quality skill (analyze code)
- git MCP server (repository access)

### 4. Skills

#### git-operations.md
Reusable functions for Git operations:
- `analyze_git_diff()` - Compare branches/commits
- `get_commit_context()` - Retrieve commit metadata
- `get_branch_info()` - Understand branch state

#### code-quality.md
Reusable functions for code analysis:
- `check_code_standards()` - Validate against standards
- `detect_patterns()` - Find anti-patterns
- `suggest_improvements()` - Generate recommendations

### 5. Workspace Configuration

**File**: `.instructions.md`

**Purpose**: Tells Claude which agent to use and how to behave

**Contains**:
- Default agent (`code-review-agent`)
- Available skills and subagents
- MCP server configuration
- File pattern routing

---

## Configuration

### Customize Code Quality Standards

Edit `.claude/skills/code-quality.md` to define your project's standards:

```markdown
Standards to check:
- naming_conventions: camelCase for variables
- error_handling: try-catch for async operations
- comments_documentation: JSDoc for functions
- performance_patterns: No N+1 queries
```

### Adjust Review Focus

Edit `.claude/agents/code-review-agent.md` to change file types reviewed:

```yaml
applyTo:
  - "src/**/*.js"
  - "tests/**/*.test.js"
```

### Add Custom MCP Servers

1. Create server definition: `.claude/mcp/[server-name].json`
2. Implement server: `mcp-servers/[server-name].js`
3. Register in: `.claude/mcp/mcp.config.json`
4. Reference in: `.claude/agents/code-review-agent.md`

---

## Examples

### Example 1: Review a Pull Request

**Command**:
```
@claude Use code-reviewer to analyze the PR from main to feature/payment
```

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

---

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

---

## File Reference

| File | Purpose | Edit For |
|------|---------|----------|
| `.instructions.md` | Workspace config | Changing agent behavior |
| `.claude/agents/code-review-agent.md` | Main agent | Agent workflow changes |
| `.claude/agents/code-reviewer.md` | Subagent | Review logic changes |
| `.claude/skills/git-operations.md` | Git functions | Adding git capabilities |
| `.claude/skills/code-quality.md` | Code analysis | Updating standards |
| `.claude/mcp/git.json` | Git MCP schema | Changing git tools |
| `.claude/mcp/mcp.config.json` | MCP config | Enabling/disabling servers |
| `mcp-servers/git-mcp.js` | Git server code | Bug fixes, new features |

---

## Next Steps

1. ✅ **Setup**: Run `npm install && npm start`
2. ✅ **Test**: Use `@claude Review this branch` in VS Code
3. 📝 **Customize**: Edit code standards in `.claude/skills/code-quality.md`
4. 🔧 **Extend**: Add project-specific skills or agents
5. 🚀 **Deploy**: Integrate with CI/CD pipelines

---

## Key Concepts

### Agent
- High-level orchestrator
- References subagents and skills
- Manages workflow and context
- Defined with YAML frontmatter

### Subagent
- Specialized tool for focused tasks
- Uses MCP and skills
- Invoked by main agent
- Defined with YAML frontmatter (in agents/ folder)

### Skill
- Reusable function
- Used by agents and subagents
- Documented with parameters and returns
- Implemented as markdown specification

### MCP (Model Context Protocol)
- Provides external system access
- Defined as server configs
- Used by agents via tools
- Enables Git, APIs, databases, etc.

---

## Additional Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Detailed setup with examples
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and data flows
- **[STRUCTURE.md](STRUCTURE.md)** - Project structure reference
- **[.claude/README.md](.claude/README.md)** - Claude configuration directory
- **[.claude/mcp/README.md](.claude/mcp/README.md)** - MCP setup details

---

## Resources

- [Claude Documentation](https://claude.ai)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [VS Code Copilot](https://github.com/features/copilot)
- [Git Documentation](https://git-scm.com/doc)

---

## Features

- ✅ **MCP Integration**: Direct Git repository access
- ✅ **Subagents**: Specialized task delegation
- ✅ **Skills**: Reusable utility functions
- ✅ **Extensible**: Easy to add new capabilities
- ✅ **Well-Documented**: Comprehensive guides
- ✅ **Production-Ready**: Full MCP server implementation

---

**Created**: May 14, 2026  
**Version**: 1.0.0  
**Status**: ✅ Complete and Ready to Use
#   V i b e C o d i n 2  
 