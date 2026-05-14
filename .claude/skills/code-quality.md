# Code Quality Skill

**Purpose**: Provides code quality analysis and best practices validation for code reviews.

**Domain**: Code standards, pattern recognition, best practices

## Functions

### `check_code_standards`
Validate code against established standards and patterns.

**Parameters**:
- `code_content` (string): Code to review
- `language` (string): Programming language
- `standards` (array): Standards to check against
  - `naming_conventions`
  - `error_handling`
  - `comments_documentation`
  - `performance_patterns`

**Returns**:
- `issues`: Array of identified issues with severity levels
- `suggestions`: Recommended improvements
- `score`: Overall quality score (0-100)

### `detect_patterns`
Identify common patterns and antipatterns in code.

**Parameters**:
- `code_content` (string): Code to analyze
- `language` (string): Programming language
- `pattern_type` (string): Type of patterns to detect
  - `security`: Security vulnerabilities
  - `performance`: Performance issues
  - `maintainability`: Code maintainability concerns

**Returns**:
- `patterns_found`: Detected patterns with context
- `recommendations`: Best practice suggestions
- `risk_level`: Overall risk assessment

### `suggest_improvements`
Generate actionable improvement suggestions.

**Parameters**:
- `code_content` (string): Code to improve
- `context` (object): Review context (PR description, files affected, etc.)
- `focus` (array): Focus areas for suggestions

**Returns**:
- `improvements`: Prioritized list of improvements
- `before_after`: Code examples showing improvements
- `rationale`: Explanation for each suggestion

## Integration

This skill works alongside the git-operations skill in code review workflows.

## Configuration

```yaml
skills:
  - code-quality
  - git-operations  # Usually paired with git operations
```
