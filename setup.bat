@echo off
REM Quick Start Script for Claude MCP Code Review Setup (Windows)
REM Run this batch file to get started immediately

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   Claude MCP Code Review Setup - Quick Start (Windows)     ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check Node.js
echo ✓ Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not found. Please install Node.js 16+ first.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo   %%i ✓
echo.

REM Check npm
echo ✓ Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm not found.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo   npm %%i ✓
echo.

REM Check git
echo ✓ Checking Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Git not found.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('git --version') do echo   %%i ✓
echo.

REM Install dependencies
echo ═════════════════════════════════════════════════════════════
echo Installing dependencies...
echo ═════════════════════════════════════════════════════════════
call npm install
echo.

REM Summary
echo ╔════════════════════════════════════════════════════════════╗
echo ║                    Setup Complete! ✓                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo.
echo 1. Start the Git MCP server:
echo    npm start
echo.
echo 2. Open VS Code and in Copilot Chat, try:
echo    @claude Review the current branch
echo.
echo 📚 Documentation:
echo    - Getting Started: GETTING_STARTED.md
echo    - Architecture:    ARCHITECTURE.md
echo    - Structure:       STRUCTURE.md
echo.
echo 📁 Configuration files:
echo    - Agent config:      .claude\agents\code-review-agent.md
echo    - Subagent:          .claude\subagents\code-reviewer.md
echo    - Skills:            .claude\skills\
echo    - MCP config:        .claude\mcp\mcp.config.json
echo.
echo For more information, read GETTING_STARTED.md
echo.
pause
