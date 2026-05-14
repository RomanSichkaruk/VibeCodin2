# Claude Configuration Directory

This directory contains all Claude customization files for this workspace.

## Structure

```
.claude/
├── README.md                    # This file
├── agents/                      # Agent and subagent definitions
│   ├── code-review-agent.md    # Main code review orchestrator
│   └── code-reviewer.md        # Code review specialist (subagent)
├── skills/                      # Reusable skill functions
│   ├── git-operations.md       # Git utilities
│   └── code-quality.md         # Code analysis
└── mcp/                         # Model Context Protocol
    ├── git.json                # Git MCP server definition
    ├── mcp.config.json         # MCP runtime config
    └── README.md               # MCP documentation
```

## Quick Start

1. **Agents** (`agents/`)
   - Start with `code-review-agent.md`
   - Defines main orchestration and component integration
   - Lists all available subagents and skills

2. **Subagents** (`agents/`) — Subagents are agents that handle specialized tasks
   - `code-reviewer.md`: Specialized for PR/commit analysis
   - Declares required skills and MCP access
   - Defines analysis workflow

3. **Skills** (`skills/`)
   - `git-operations.md`: Git utility functions
   - `code-quality.md`: Code analysis functions
   - Referenced by agents and subagents

4. **MCP** (`mcp/`)
   - `git.json`: Git server tool definitions
   - `mcp.config.json`: Runtime configuration
   - Enable external system access (Git, APIs, etc.)

## Key Concepts

### Agent
High-level orchestrator that:
- References subagents and skills
- Manages workflow and context
- Defined with YAML frontmatter

### Subagent
Specialized tool that:
- Performs focused tasks
- Uses MCP and skills
- Invoked by main agent
- Defined with YAML frontmatter

### Skill
Reusable function that:
- Performs specific operations
- Used by agents and subagents
- Documented with parameters and returns
- Implemented as markdown spec

### MCP (Model Context Protocol)
System that:
- Provides external system access
- Defined as server configs
- Used by agents via tools
- Enables Git, APIs, databases, etc.

## Integration Flow

```
┌─────────────────────────────────┐
│   .instructions.md              │
│   (Workspace Configuration)     │
└──────────────┬──────────────────┘
               │
    ┌──────────▼──────────┐
    │  code-review-agent  │
    │  (Main Agent)       │
    └──────────┬──────────┘
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
 [Skills]  [Subagent] [MCP]
            [code-    [git]
            reviewer]
```

## Configuration

### Customize Agent Behavior
Edit `agents/code-review-agent.md`:
- Add/remove subagents
- Change applicable file types
- Modify skill usage

### Extend with New Skills
Create `skills/new-skill.md` with:
- Purpose and domain
- Function definitions
- Parameters and return values
- Integration notes

### Add MCP Servers
Define in `mcp/new-server.json`:
- Server name and description
- Available tools/operations
- Tool schemas and parameters

### Create Specialized Subagents
Create `subagents/specialized-agent.md` with:
- Clear purpose
- Required skills and MCP
- Workflow steps
- Configuration options

## Testing

To verify configuration:

1. Check file syntax (YAML frontmatter, Markdown format)
2. Verify file references exist
3. Test agent invocation (manual trigger)
4. Validate MCP connections

## Maintenance

Keep these files updated:
- **Skills**: When adding/changing functions
- **Agents**: When adjusting workflow
- **MCP**: When integrating new services
- **Subagents**: When refining analysis

## Next Steps

1. Review [`.instructions.md`](../.instructions.md) for workspace setup
2. Customize standards in [`skills/code-quality.md`](skills/code-quality.md)
3. Add domain-specific skills as needed
4. Extend MCP with additional servers

## References

- Main agent: [`agents/code-review-agent.md`](agents/code-review-agent.md)
- Code reviewer: [`subagents/code-reviewer.md`](subagents/code-reviewer.md)
- Workspace config: [`../.instructions.md`](../.instructions.md)
