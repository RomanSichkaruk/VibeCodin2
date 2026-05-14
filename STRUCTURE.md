# Project Structure Summary

## Complete Directory Layout

```
VB2/
├── .claude/                              # Main Claude customization directory
│   ├── README.md                        # .claude directory overview
│   ├── agents/                          # Agents and subagents
│   │   ├── code-review-agent.md         # Main orchestrating agent
│   │   └── code-reviewer.md             # Code review specialist (subagent)
│   ├── skills/
│   │   ├── git-operations.md            # Git utility functions
│   │   └── code-quality.md              # Code analysis functions
│   └── mcp/
│       ├── README.md                    # MCP setup documentation
│       ├── git.json                     # Git MCP server definition
│       └── mcp.config.json              # MCP runtime configuration
│
├── mcp-servers/
│   └── git-mcp.js                       # Git MCP server implementation
│
├── .instructions.md                     # Workspace customization (main config)
├── GETTING_STARTED.md                   # Setup and usage guide
├── ARCHITECTURE.md                      # System design and diagrams
├── package.json                         # Node.js dependencies
├── README.md                            # Original project README
├── skills/                              # (legacy, from original)
└── subagents/                           # (legacy, from original)
```

## Key Files Quick Reference

| File | Purpose | Edit For | Owner |
|------|---------|----------|-------|
| `.instructions.md` | Claude workspace config | Changing agent behavior | User |
| `.claude/agents/code-review-agent.md` | Main agent definition | Agent workflow changes | User |
| `.claude/agents/code-reviewer.md` | Subagent definition | Review logic changes | User |
| `.claude/skills/git-operations.md` | Git functions spec | Adding git functions | Developer |
| `.claude/skills/code-quality.md` | Code analysis spec | Updating standards | User |
| `.claude/mcp/git.json` | Git MCP schema | Changing git tools | Developer |
| `.claude/mcp/mcp.config.json` | MCP runtime config | Enabling/disabling servers | User |
| `mcp-servers/git-mcp.js` | Git server code | Bug fixes, new features | Developer |
| `GETTING_STARTED.md` | Setup guide | Adding setup steps | User |
| `ARCHITECTURE.md` | System design | Documenting changes | Developer |

## Setup Checklist

```
☐ Prerequisites
  ☐ Node.js 16+ installed
  ☐ npm or yarn available
  ☐ Git command line available
  ☐ VS Code with Copilot

☐ Installation
  ☐ Run: npm install
  ☐ Create: mcp-servers/ directory
  ☐ Ensure: mcp-servers/git-mcp.js exists
  ☐ Verify: .claude/ directory structure

☐ Configuration
  ☐ Review: .instructions.md
  ☐ Check: .claude/agents/code-review-agent.md
  ☐ Verify: .claude/mcp/mcp.config.json

☐ Testing
  ☐ Start: node mcp-servers/git-mcp.js
  ☐ Open: VS Code
  ☐ Trigger: @claude Review this [branch]
  ☐ Verify: Response includes review
```

## Common Tasks

### Use Code Review Agent
```bash
# In VS Code Copilot Chat
@claude Review the changes in feature/auth branch
```

### Run Git MCP Server
```bash
npm start
# Or:
node mcp-servers/git-mcp.js
```

### Install Dependencies
```bash
npm install
```

### Update Code Quality Standards
Edit: `.claude/skills/code-quality.md`
- Modify `check_code_standards` function
- Update example code patterns

### Add New Skill
1. Create: `.claude/skills/new-skill.md`
2. Define: Functions with parameters
3. Register: Add to `.claude/agents/code-review-agent.md`

### Add New Subagent
1. Create: `.claude/subagents/new-agent.md`
2. Define: Purpose and workflow
3. Register: Add to `.claude/agents/code-review-agent.md`

### Add New MCP Server
1. Create: `.claude/mcp/new-server.json` (definition)
2. Implement: `mcp-servers/new-server.js` (code)
3. Register: Update `.claude/mcp/mcp.config.json`
4. Reference: Add to `.claude/agents/code-review-agent.md`

## Understanding the Flow

```
┌─────────────────┐
│  Your Request   │  "Review PR from main to feature/auth"
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ .instructions.md loads agent    │  Tells Claude which agent to use
└────────┬────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ code-review-agent.md orchestrates   │  Main agent delegates to subagent
└────────┬─────────────────────────────┘
         │
         ▼
┌───────────────────────────────────┐
│ code-reviewer subagent works      │  Subagent analyzes code
│ Uses:                             │
│  • git-operations skill           │  - Fetches diffs, commits
│  • code-quality skill             │  - Checks standards, detects patterns
│  • git MCP server                 │  - Gets repo status
└────────┬────────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Structured review generated      │  With issues, suggestions, risk score
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ User sees detailed feedback      │
└──────────────────────────────────┘
```

## File Relationships

```
.instructions.md (entry point)
    ├─> references: code-review-agent
    │
    └─> .claude/agents/code-review-agent.md
         ├─> uses: code-reviewer (subagent in agents/)
         ├─> uses: git-operations (skill)
         ├─> uses: code-quality (skill)
         └─> uses: git (MCP)
             │
             ├─> .claude/agents/code-reviewer.md
             │    ├─> uses: git-operations
             │    ├─> uses: code-quality
             │    └─> uses: git MCP
             │
             ├─> .claude/skills/git-operations.md (skill spec)
             │    └─> implemented by: git MCP
             │
             ├─> .claude/skills/code-quality.md (skill spec)
             │    └─> provides: analysis functions
             │
             └─> mcp-servers/git-mcp.js (implementation)
                  └─> uses: .claude/mcp/mcp.config.json (runtime config)
                       └─> defines: .claude/mcp/git.json (schema)
```

## When to Edit What

| Scenario | Edit | Reason |
|----------|------|--------|
| Change review focus | `.claude/agents/code-review-agent.md` | Update `applyTo` patterns |
| Update code standards | `.claude/skills/code-quality.md` | Modify standards definition |
| Add new analysis type | Create new `.claude/skills/` file | Extend capabilities |
| Change agent behavior | `.claude/agents/code-review-agent.md` | Update workflow |
| Fix git issues | `mcp-servers/git-mcp.js` | Debug server code |
| Add new MCP tool | Create `.claude/mcp/new-server.json` | Define new capability |
| Global configuration | `.instructions.md` | Workspace settings |

## Troubleshooting Guide

| Problem | Check | Solution |
|---------|-------|----------|
| Agent not responding | `.instructions.md` exists | Reload VS Code |
| Subagent not found | `.claude/subagents/code-reviewer.md` | Verify YAML frontmatter |
| Skill not working | `.claude/skills/` files exist | Check skill is listed in agent |
| MCP connection error | `npm start` running | Run git MCP server |
| Git commands fail | `.claude/mcp/mcp.config.json` | Check git-mcp.js path |
| Large diffs slow | Review scope too wide | Limit files in `applyTo` |

## Next Steps

1. ✅ Read [GETTING_STARTED.md](GETTING_STARTED.md) for setup
2. ✅ Run `npm install` to install dependencies
3. ✅ Start MCP server: `npm start`
4. ✅ Test in VS Code: `@claude Review this branch`
5. 📝 Customize standards in [.claude/skills/code-quality.md](.claude/skills/code-quality.md)
6. 🔧 Add project-specific skills as needed
7. 📊 Create additional MCP servers for other systems

## Documentation Files

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Complete setup guide with examples
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and data flows
- **[.claude/README.md](.claude/README.md)** - Claude customization overview
- **[.claude/mcp/README.md](.claude/mcp/README.md)** - MCP configuration details
- **[README.md](README.md)** - Original project information

---

**Version**: 1.0.0  
**Last Updated**: May 14, 2026  
**Status**: Ready for use
