# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Claude (VS Code Copilot)                │
│                   @claude Review this PR                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Workspace Configuration                        │
│           (.instructions.md, .prompt.md)                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │  • Load agent: code-review-agent                  │    │
│  │  • Enable skills: git-operations, code-quality    │    │
│  │  • Enable subagents: code-reviewer                │    │
│  │  • MCP Servers: git                               │    │
│  └────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│         Main Agent: code-review-agent.md                      │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Purpose: Orchestrate code review workflow               │ │
│  │ ┌──────────────────────────────────────────────────────┐ │ │
│  │ │ Processes request, delegates to subagent/skills    │ │ │
│  │ │ Coordinates MCP access to repository               │ │ │
│  │ │ Consolidates findings into final review            │ │ │
│  │ └──────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────┬──────────────────┬──────────────────┬─────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
   ┌──────────┐    ┌────────────┐    ┌────────────┐
   │ Subagent │    │   Skills   │    │ MCP Servers│
   │          │    │            │    │            │
   └─────┬────┘    └───┬────┬───┘    └─────┬──────┘
         │             │    │              │
         ▼             ▼    ▼              ▼
   ┌──────────────┐  ┌──────────────┐  ┌──────────┐
   │code-reviewer │  │git-operations│  │   Git    │
   │ Subagent     │  │    Skill     │  │   MCP    │
   │              │  │              │  │  Server  │
   │ • Diff       │  │ • analyze    │  │          │
   │   analysis   │  │   _git_diff  │  │ Functions:
   │ • Pattern    │  │ • get_commit │  │ • Status │
   │   detection  │  │   _context   │  │ • Diff   │
   │ • Standards  │  │ • get_branch │  │ • History│
   │   checking   │  │   _info      │  │          │
   │              │  │              │  │          │
   └────┬─────────┘  └──────────────┘  └──────────┘
        │                                   │
        │  ┌──────────────────────────┐    │
        │  │ code-quality Skill       │◄───┘
        │  │                          │
        │  │ • check_code_standards   │
        │  │ • detect_patterns        │
        │  │ • suggest_improvements   │
        │  └──────────────────────────┘
        │
        └──────────────────┬──────────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Structured Review│
                  │  • Issues        │
                  │  • Suggestions   │
                  │  • Risk Score    │
                  └──────────────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   Claude Output  │
                  │  Ready for User  │
                  └──────────────────┘
```

## Component Details

### 1. Workspace Configuration (`.instructions.md`)
- Tells Claude which agent to use
- Lists available skills and subagents
- MCP server registration
- File pattern routing

### 2. Main Agent (`.claude/agents/code-review-agent.md`)
- **Type**: High-level orchestrator
- **Input**: Code review request (PR, branch, commit)
- **Responsibilities**:
  - Validate request and gather context
  - Delegate to code-reviewer subagent
  - Call git-operations skill for repository data
  - Invoke code-quality skill for analysis
  - Use Git MCP for system operations
  - Consolidate findings

### 3. Subagent (`.claude/agents/code-reviewer.md`)
- **Type**: Specialized worker
- **Focus**: Code review analysis
- **Capabilities**:
  - Diff analysis using git-operations skill
  - Code quality checks using code-quality skill
  - Pattern detection
  - Security scanning
  - Best practice validation

### 4. Skills

#### `git-operations.md`
- **Function**: `analyze_git_diff()`
  - Compare branches/commits
  - Retrieve change statistics
  
- **Function**: `get_commit_context()`
  - Author, date, message
  - Files changed
  - Related changes

- **Function**: `get_branch_info()`
  - Current branch
  - Upstream tracking
  - Ahead/behind count

#### `code-quality.md`
- **Function**: `check_code_standards()`
  - Naming conventions
  - Error handling patterns
  - Documentation completeness
  
- **Function**: `detect_patterns()`
  - Security vulnerabilities
  - Performance issues
  - Maintainability concerns

- **Function**: `suggest_improvements()`
  - Code examples
  - Best practices
  - Refactoring suggestions

### 5. MCP Servers

#### Git MCP Server (`mcp-servers/git-mcp.js`)
- **Tool**: `git_get_repo_status`
  - Current branch
  - Modified files
  - Remote URL
  
- **Tool**: `git_get_commit_history`
  - Recent commits
  - Authors, dates
  - Commit messages

- **Tool**: `git_get_diff`
  - Changes between refs
  - Line-by-line diff
  - File statistics

- **Tool**: `git_get_changed_files`
  - List of changed files
  - Add/modify/delete status

## Data Flow Example

```
User Request:
  "Review changes between main and feature/auth"
         │
         ▼
Agent receives: { type: 'review', from: 'main', to: 'feature/auth' }
         │
    ┌────┴────┐
    ▼         ▼
 MCP Git   Subagent
   │          │
   │      Uses git-operations
   │      skill to get diff
   │          │
   ├──────────┤
   │          │
   ▼          ▼
 Returns:  Returns:
 • Status   • Diff summary
 • Diff     • Files changed
 • History  • Analysis
    │          │
    └────┬─────┘
         │
         ▼ (data consolidation)
    code-quality skill
    analyzes changes
         │
         ▼
    Structured Review:
    {
      summary: "5 files changed",
      issues: [
        { severity: "critical", type: "security", ... },
        { severity: "major", type: "error_handling", ... }
      ],
      suggestions: [...],
      risk: "HIGH"
    }
         │
         ▼
    User sees comprehensive review
```

## Sequence Diagram

```
User                Agent              Subagent             Skills             MCP Git
 │                   │                    │                   │                  │
 │ Review PR         │                    │                   │                  │
 ├──────────────────>│                    │                   │                  │
 │                   │ Fetch diff         │                   │                  │
 │                   ├────────────────────────────────────────────────────────────>│
 │                   │                    │                   │                  │
 │                   │<─ git_get_diff ────────────────────────────────────────────┤
 │                   │                    │                   │                  │
 │                   │ Analyze diff       │                   │                  │
 │                   ├───────────────────>│                   │                  │
 │                   │                    │ Apply skills      │                  │
 │                   │                    ├──────────────────>│                  │
 │                   │                    │                   │ Validate code    │
 │                   │                    │  Return findings  │                  │
 │                   │                    │<──────────────────┤                  │
 │                   │ Return review      │                   │                  │
 │                   │<───────────────────┤                   │                  │
 │                   │                    │                   │                  │
 │ Detailed Review   │                    │                   │                  │
 │<──────────────────┤                    │                   │                  │
 │                   │                    │                   │                  │
```

## Configuration Hierarchy

```
.claude/
├── README.md
│   └── Overview of .claude directory structure
│
├── agents/
│   ├── code-review-agent.md
│   │   ├── Lists subagents
│   │   ├── Lists skills
│   │   ├── Specifies MCP servers
│   │   └── File patterns for routing
│   │
│   └── code-reviewer.md
│       ├── Depends on: git-operations, code-quality (subagent)
│       ├── Uses MCP: git
│       └── Defines workflow
│
├── skills/
│   ├── git-operations.md
│   │   └── Functions: analyze_diff, get_context, get_branch_info
│   │
│   └── code-quality.md
│       └── Functions: check_standards, detect_patterns, suggest_improvements
│
└── mcp/
    ├── git.json
    │   └── Tool definitions for Git MCP
    │
    └── mcp.config.json
        └── Runtime configuration for MCP servers
```

## Extension Points

To extend this architecture:

```
Add new subagent:
  1. Create .claude/subagents/new-agent.md
  2. Reference skills and MCP
  3. Update agent to list it

Add new skill:
  1. Create .claude/skills/new-skill.md
  2. Define functions
  3. Add to agent/subagent that uses it

Add new MCP server:
  1. Create server definition .claude/mcp/new-server.json
  2. Implement mcp-servers/new-server.js
  3. Register in mcp.config.json
  4. Update agent to reference it
```

## Performance Considerations

- **Git MCP**: Caches repo data when possible
- **Subagent**: Focuses analysis to reduce overhead
- **Skills**: Reusable, avoid duplication
- **MCP**: Lazy-loads servers on first use

## Security Model

- **MCP**: Local repository access only
- **Skills**: No external network calls
- **Subagent**: Operates within scope set by agent
- **Workspace**: Controlled by `.instructions.md`
