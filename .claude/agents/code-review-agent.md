---
name: code-review-agent
type: agent
description: Main agent for code review operations using MCP, subagents, and skills
version: 1.0.0
subagents:
  - code-reviewer
skills:
  - git-operations
  - code-quality
mcp:
  - git
applyTo:
  - "**/*.js"
  - "**/*.ts"
  - "**/*.py"
  - "**/*.md"
---

# Code Review Agent

## Overview

This agent orchestrates code review workflows by combining:
- **MCP (Model Context Protocol)**: Git server for repository access
- **Subagents**: Specialized `code-reviewer` for detailed analysis
- **Skills**: Reusable functions for git and code quality operations

## Architecture

```
┌─────────────────────────────┐
│   Code Review Agent         │
│  (Main Orchestrator)        │
└──────────────┬──────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
[Git MCP] [Code-Reviewer] [Skills]
          [Subagent]
            │      │
            ├──────┴──────┐
            ▼             ▼
        [Git Ops]  [Code Quality]
```

## Responsibilities

### 1. Request Processing
- Accept code review requests (PR, branch, commit)
- Parse review context and scope
- Validate repository accessibility

### 2. Analysis Coordination
- Delegate to `code-reviewer` subagent
- Gather git data via MCP
- Apply quality assessment skills

### 3. Output Generation
- Consolidate findings into coherent review
- Format feedback with line references
- Provide prioritized recommendations

## Subagent Integration

### Code Reviewer Subagent
The `code-reviewer` subagent handles:
- Diff analysis between branches
- Pattern detection and anti-pattern identification
- Code standard validation
- Security and performance checks

**Invocation Example**:
```
Request: "Review the changes in PR #42 (main -> feature/auth)"
→ Delegates to code-reviewer subagent
← Returns structured review with issues and suggestions
```

## Skill Integration

### Git Operations Skill
- `analyze_git_diff()`: Get change summaries
- `get_commit_context()`: Retrieve commit metadata
- `get_branch_info()`: Understand branch relationships

### Code Quality Skill
- `check_code_standards()`: Validate against standards
- `detect_patterns()`: Find anti-patterns
- `suggest_improvements()`: Generate recommendations

## MCP Integration

### Git MCP Server
Provides direct access to repository operations:
- `git_get_repo_status`: Current repo state
- `git_get_commit_history`: Historical context
- `git_get_diff`: Change analysis

**Configuration**: See `.claude/mcp/mcp.config.json`

## Workflow Example

### Scenario: Review a Feature Branch

1. **User Request**:
   ```
   "Review changes in feat/database-migration branch"
   ```

2. **Agent Processing**:
   - Calls git MCP to fetch diff vs. main
   - Identifies 5 modified files
   - Delegates to code-reviewer subagent

3. **Subagent Analysis**:
   - Applies code-quality skill
   - Detects potential SQL injection vulnerability
   - Identifies missing error handling
   - Notes good documentation practices

4. **Skill Execution**:
   - Git skill: Retrieves commit messages for context
   - Code quality skill: Analyzes patterns
   - Generates suggestions

5. **Output**:
   ```
   Review Summary:
   - 3 Critical Issues (security)
   - 2 Major Issues (error handling)
   - 1 Minor Issue (naming)
   - 5 Suggestions for improvement
   - Risk Assessment: HIGH (security concerns)
   ```

## Configuration Options

### Agent Behavior

Edit this file to configure:
- `subagents`: Which subagents are available
- `skills`: Active skills for analysis
- `mcp`: Enabled MCP servers
- `applyTo`: File types/patterns to process

### Performance Tuning

```yaml
analysis:
  max_diff_size: 10000  # Lines per analysis
  parallel_skill_execution: true
  cache_git_data: true
```

## Extension Points

To add new capabilities:

1. **New Skill**: Create `.claude/skills/new-skill.md`
2. **New Subagent**: Create `.claude/subagents/new-agent.md`
3. **New MCP Server**: Add to `.claude/mcp/mcp.config.json`
4. Update this agent file to reference new components

## Best Practices

1. **Clear Scope**: Specify which branch/commit to review
2. **Context**: Provide PR descriptions for better analysis
3. **Focus Areas**: Highlight specific concerns
4. **Iteration**: Use feedback to refine guidelines

## Troubleshooting

### Subagent Not Responding
- Check `.claude/subagents/code-reviewer.md` is properly configured
- Verify git MCP is running

### Missing Code Quality Checks
- Ensure `code-quality.md` skill is listed in subagent
- Check standards configuration in skill file

### Git Data Unavailable
- Verify MCP configuration in `.claude/mcp/mcp.config.json`
- Check git MCP server is running: `node mcp-servers/git-mcp.js`
