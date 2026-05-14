# Git Operations Skill

**Purpose**: Provides git-related utility functions for code review and repository management.

**Domain**: Version control, repository state analysis, commit inspection

## Functions

### `analyze_git_diff`
Analyze git diffs to identify code changes for review purposes.

**Parameters**:
- `repo_path` (string): Repository path
- `from_ref` (string): Source branch/commit
- `to_ref` (string): Target branch/commit
- `focus_areas` (array, optional): File patterns to focus on

**Returns**: 
- `changes`: Array of modified files with line-by-line diffs
- `stats`: Change statistics (additions, deletions, files modified)
- `summary`: Human-readable summary of changes

**Example**:
```javascript
const skill = require('./skills/git-operations');
const result = await skill.analyze_git_diff({
  repo_path: './',
  from_ref: 'main',
  to_ref: 'feat/new-feature',
  focus_areas: ['src/**', 'tests/**']
});
```

### `get_commit_context`
Retrieve commit metadata and history for context in code review.

**Parameters**:
- `repo_path` (string): Repository path
- `commit_sha` (string): Commit hash
- `include_files` (boolean): Include list of changed files

**Returns**:
- `author`: Commit author
- `date`: Commit date
- `message`: Commit message
- `files`: Changed files (if requested)
- `stats`: File change statistics

### `get_branch_info`
Get information about branches for understanding PR context.

**Parameters**:
- `repo_path` (string): Repository path
- `branch_name` (string, optional): Specific branch (defaults to current)

**Returns**:
- `current_branch`: Current branch name
- `branches`: List of all branches with tracking info
- `upstream`: Upstream branch if configured
- `ahead_behind`: Commit count ahead/behind

## Integration

This skill is automatically available to the `code-reviewer` agent and can be invoked during code review analysis.

## Configuration

Enable this skill by including it in your agent manifest:

```yaml
skills:
  - git-operations
```
