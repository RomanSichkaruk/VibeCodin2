#!/bin/bash
# Quick Start Script for Claude MCP Code Review Setup
# Run this to get started immediately

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   Claude MCP Code Review Setup - Quick Start               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Please install Node.js 16+ first."
    exit 1
fi
echo "  Node.js $(node --version) ✓"
echo ""

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm not found."
    exit 1
fi
echo "  npm $(npm --version) ✓"
echo ""

# Check git
echo "✓ Checking Git..."
if ! command -v git &> /dev/null; then
    echo "✗ Git not found."
    exit 1
fi
echo "  Git $(git --version | awk '{print $3}') ✓"
echo ""

# Install dependencies
echo "═════════════════════════════════════════════════════════════"
echo "Installing dependencies..."
echo "═════════════════════════════════════════════════════════════"
npm install
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete! ✓                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the Git MCP server:"
echo "   npm start"
echo ""
echo "2. Open VS Code and in Copilot Chat, try:"
echo "   @claude Review the current branch"
echo ""
echo "📚 Documentation:"
echo "   • Getting Started: GETTING_STARTED.md"
echo "   • Architecture:    ARCHITECTURE.md"
echo "   • Structure:       STRUCTURE.md"
echo ""
echo "📁 Configuration files:"
echo "   • Agent config:      .claude/agents/code-review-agent.md"
echo "   • Subagent:          .claude/subagents/code-reviewer.md"
echo "   • Skills:            .claude/skills/"
echo "   • MCP config:        .claude/mcp/mcp.config.json"
echo ""
echo "For more information, read GETTING_STARTED.md"
echo ""
