# Kiro Agent Autonomous Setup Instructions

## Single Prompt for Complete MCP Server Integration

**Copy and paste this entire prompt to any Kiro agent for autonomous setup:**

---

## 🤖 KIRO AGENT AUTONOMOUS SETUP PROMPT

You are a Kiro AI agent tasked with setting up the Enhanced Everything MCP Server for intelligent code research and spec-driven development. Follow these steps autonomously:

### Phase 1: Repository Setup
1. Clone the repository: `git clone https://github.com/SoMaCoSF/mcp-everything.git`
2. Navigate to directory: `cd mcp-everything`
3. Install dependencies: `npm install`
4. Build the server: `npm run build`

### Phase 2: Environment Validation
1. Run preflight check: `node preflight-check.js`
2. If Everything is not installed:
   - Download from https://www.voidtools.com/
   - Install and start the Everything service
   - Verify es.exe is at: `C:\Program Files\Everything\es.exe`
3. Run validation test: `npm run test:kiro`

### Phase 3: Kiro MCP Configuration
Add this configuration to your Kiro MCP settings:

```json
{
  "mcpServers": {
    "everything-search": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "EVERYTHING_PATH": "C:\\Program Files\\Everything\\es.exe",
        "TRACE_DIRECTORY": "D:\\outputs\\traces"
      },
      "description": "Enhanced Everything search with GitHub integration and spec-driven development",
      "autoApprove": [
        "everything_search",
        "everything_search_advanced", 
        "everything_search_docs",
        "everything_check_service"
      ]
    }
  }
}
```

### Phase 4: Functionality Testing
Test these commands in Kiro chat:
1. "Find all TypeScript files in this project"
2. "Search for specification files"
3. "Show me documentation files"
4. "Check Everything service status"

### Phase 5: Advanced Features (Future)
The system includes specifications for:
- Intent-based GitHub code research
- SQLite knowledge base building
- Terminal User Interface (TUI)
- CSV export capabilities
- Pattern recognition and analysis

Review the enhancement specifications in `.kiro/specs/enhanced-everything-mcp/`

### Expected Capabilities After Setup:
- ✅ Lightning-fast local file search
- ✅ Specification-aware search
- ✅ Documentation categorization
- ✅ Service health monitoring
- ✅ Comprehensive logging
- 🚧 GitHub integration (planned)
- 🚧 Intent-based research (planned)
- 🚧 Terminal UI (planned)

### Troubleshooting:
- If Everything not found: Install from voidtools.com
- If build fails: Check Node.js version (requires 18+)
- If MCP not loading: Restart Kiro IDE after configuration
- If tests fail: Run `node preflight-check.js` for diagnostics

### Success Indicators:
- ✅ `npm run test:kiro` passes
- ✅ Kiro recognizes the MCP server
- ✅ Search commands return results
- ✅ No errors in Kiro MCP logs

**Repository:** https://github.com/SoMaCoSF/mcp-everything
**Documentation:** https://gist.github.com/SoMaCoSF/68365b131f7bd6641a9f85ae71bcee70
**Deep Research Guide:** ./deep_research.md

---

## 🎯 AUTONOMOUS EXECUTION CHECKLIST

- [ ] Clone repository
- [ ] Install dependencies
- [ ] Build server
- [ ] Run preflight check
- [ ] Install Everything if needed
- [ ] Configure Kiro MCP
- [ ] Test functionality
- [ ] Verify all tools work
- [ ] Review enhancement specs
- [ ] Report setup status

**Execute this setup autonomously and report any issues encountered.**

---

## 📊 EXPECTED OUTCOMES

After successful setup, the Kiro agent will have access to:

1. **Enhanced File Search**: Fast Everything-powered search with advanced filtering
2. **Specification Integration**: Understands and searches spec documents
3. **Documentation Discovery**: Smart categorization of project documentation
4. **Service Monitoring**: Health checks and status reporting
5. **Future Research**: Foundation for GitHub integration and AI-powered code discovery

The system transforms simple file search into an intelligent development research platform, perfectly integrated with Kiro's spec-driven development workflow.

## 🚀 POST-SETUP USAGE

Once configured, use natural language commands like:
- "Find all authentication-related files"
- "Search for API documentation"
- "Show me recent specification changes"
- "What TypeScript files were modified today?"
- "Find examples of JWT implementation"

The MCP server will intelligently interpret these requests and provide relevant results using Everything's lightning-fast search capabilities.