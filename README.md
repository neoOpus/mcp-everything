# Enhanced Everything MCP Server

A comprehensive Model Context Protocol (MCP) server that transforms [voidtools Everything](https://www.voidtools.com/) search engine into an intelligent development research platform. Integrates with AI assistants like Cursor, [Kiro IDE](https://github.com/kirodotdev/Kiro), [SpecStory](https://github.com/specstoryai/docs), and Claude to provide lightning-fast file search, GitHub integration, intent-based code research, and spec-driven development tools.

![Everything MCP Architecture](./architecture.svg)

## 🎯 Kiro IDE Integration Workflow

![Kiro Workflow](./kiro-workflow.svg)

*Complete spec-driven development workflow from requirements to implementation*

## 🚀 Features

### Core Search Capabilities
- **Lightning Fast Search**: Leverages Everything's instant search capabilities
- **Advanced Filtering**: Filter by file types, size, date, and more
- **Multiple Sort Options**: Sort by name, size, date, or path
- **Regex Support**: Use regular expressions for complex searches
- **Service Health Checks**: Verify Everything service status

### Enhanced Research Features
- **🧠 Intent-Based Code Research**: Analyzes specifications and finds matching implementations across GitHub
- **🔗 GitHub MCP Integration**: Seamless local/remote search with repository metadata
- **📊 SQLite Knowledge Base**: Builds searchable library of code patterns over time
- **📈 CSV Export Integration**: Structured data export using ES tools
- **🎯 Implementation Suggestions**: AI-powered recommendations based on research findings

### Spec-Driven Development
- **📋 Specification Awareness**: Understands requirements, design, and task documents
- **🔍 Traceability Analysis**: Cross-references between specs and implementation
- **📊 Progress Tracking**: Monitors specification coverage and task completion
- **🖥️ Terminal UI (TUI)**: Rich terminal interface for interactive project management

### Integration & Automation
- **⚡ One-Click Kiro Installation**: Automated setup and configuration
- **🔧 Comprehensive Logging**: Full trace logging with structured debugging
- **🚀 Easy Integration**: Simple setup with Cursor, Kiro, SpecStory, and other MCP clients

## 📋 Prerequisites

- **Windows OS**: Everything only runs on Windows
- **Python 3.8+**: Required for virtual environment management
- **Python Virtual Environment**: All operations must run in an activated venv
- **Everything Installed**: Download from [voidtools.com](https://www.voidtools.com/)
- **Node.js 18+**: Required for MCP server
- **es.exe Available**: Command-line interface must be accessible

### Environment Setup

1. **Create and activate Python virtual environment:**
   ```bash
   python -m venv everything-mcp-env
   everything-mcp-env\Scripts\activate
   ```

2. **Install Everything from [voidtools.com](https://www.voidtools.com/)**
3. **Ensure the Everything service is running**
4. **Verify `es.exe` exists at: `C:\Program Files\Everything\es.exe`**
5. **Test with: `"C:\Program Files\Everything\es.exe" test`**

**⚠️ Important**: All commands must be run within the activated virtual environment.

## 🛠️ Installation

### Option 1: One-Click Kiro Installation *(Coming Soon)*

![Installation Flow](./installation-flow.svg)

```bash
# Ensure virtual environment is activated
python -m venv everything-mcp-env
everything-mcp-env\Scripts\activate

# One command installs and configures everything for Kiro
npm install -g everything-mcp-kiro
kiro-everything --setup
```

### Option 2: From Source (Recommended)

```bash
# Create and activate virtual environment
python -m venv everything-mcp-env
everything-mcp-env\Scripts\activate

# Clone the repository
git clone https://github.com/SoMaCoSF/mcp-everything.git
cd mcp-everything

# Install dependencies
npm install

# Build the server
npm run build

# Test the installation (includes venv validation)
npm run test:kiro
```

### Option 3: Manual Configuration

```bash
# Ensure virtual environment is activated
python -m venv everything-mcp-env
everything-mcp-env\Scripts\activate

npm install -g everything-mcp-server
```

## 🔧 Usage with AI Assistants

### Cursor IDE

Add to your Cursor `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "everything-search": {
        "command": "node",
        "args": ["path/to/everything-mcp/dist/index.js"],
        "env": {
          "EVERYTHING_PATH": "C:\\Program Files\\Everything\\es.exe",
          "TRACE_DIRECTORY": "D:\\outputs\\traces"
        }
      }
    }
  }
}
```

### Kiro IDE

[Kiro](https://github.com/kirodotdev/Kiro) is an agentic IDE that supports MCP servers for external tool integration. To add Everything search to Kiro:

1. **Open Kiro IDE** and navigate to your project
2. **Create or edit your MCP configuration** following Kiro's MCP documentation
3. **Add the Everything MCP server** to your Kiro configuration:

```json
{
  "mcpServers": {
    "everything-search": {
      "command": "node",
      "args": ["path/to/everything-mcp/dist/index.js"],
      "env": {
        "EVERYTHING_PATH": "C:\\Program Files\\Everything\\es.exe",
        "TRACE_DIRECTORY": "D:\\outputs\\traces"
      },
      "description": "Everything search integration for fast file/folder search"
    }
  }
}
```

4. **Restart Kiro** to load the new MCP server
5. **Use Everything search** through Kiro's agentic chat interface

**Kiro-specific features:**
- **Specs Integration**: Use Everything search to find files when planning features with Kiro's spec-driven development
- **Hooks Automation**: Set up automated file searches triggered by development events
- **Natural Language**: Ask Kiro to "find all TypeScript files modified today" and it will use Everything search
- **Project Context**: Kiro understands your project structure and can combine Everything search with its codebase knowledge

### SpecStory

[SpecStory](https://github.com/specstoryai/docs) is a documentation and specification platform designed for LLM integration. To add Everything search to SpecStory workflows:

1. **Set up MCP integration** in your SpecStory environment
2. **Add the Everything MCP server** to your SpecStory MCP configuration:

```json
{
  "mcpServers": {
    "everything-search": {
      "command": "node",
      "args": ["path/to/everything-mcp/dist/index.js"],
      "env": {
        "EVERYTHING_PATH": "C:\\Program Files\\Everything\\es.exe",
        "TRACE_DIRECTORY": "D:\\outputs\\traces"
      },
      "description": "Everything search for finding specification files and documentation"
    }
  }
}
```

3. **Restart SpecStory** to load the new MCP server
4. **Use Everything search** to find relevant specification files, documentation, and project artifacts

**SpecStory-specific features:**
- **Specification Search**: Quickly find spec files, requirements documents, and related artifacts
- **Documentation Discovery**: Search across all project documentation and markdown files  
- **Cross-Reference Lookup**: Find files referenced in specifications using Everything's fast indexing
- **Version Control Integration**: Search for spec files across different versions and branches
- **Context-Aware Documentation**: Combine Everything search with SpecStory's LLM context for comprehensive documentation workflows

**Example SpecStory workflows:**
```json
{
  "query": "user authentication",
  "docTypes": ["md", "mdx", "txt"],
  "sortBy": "relevance",
  "includeArchived": false
}
```

**Use the specialized documentation search:**
```json
{
  "tool": "everything_search_docs",
  "query": "API specification",
  "docTypes": ["md", "yaml", "json"],
  "sortBy": "relevance"
}
```

## 🔍 Available Tools

### 1. `everything_search`
Basic file and folder search with Everything syntax support.

**Parameters:**
- `query` (required): Search query using Everything syntax
- `maxResults` (optional): Maximum results to return (default: 50)
- `fileOnly` (optional): Search files only (default: false)
- `folderOnly` (optional): Search folders only (default: false)

### 2. `everything_search_advanced`
Advanced search with comprehensive filtering and sorting options.

**Parameters:**
- `query` (required): Search query
- `maxResults` (optional): Maximum results (default: 50)
- `sortBy` (optional): Sort by 'name', 'size', 'date', or 'path'
- `fileTypes` (optional): Array of file extensions to filter
- `includeHidden` (optional): Include hidden files/folders
- `regex` (optional): Use regex search
- `caseSensitive` (optional): Case sensitive search

### 3. `everything_check_service`
Verify Everything service is running and accessible.

### 4. `everything_search_docs`
Specialized documentation and specification search optimized for SpecStory workflows.

**Parameters:**
- `query` (required): Search query for documentation files
- `maxResults` (optional): Maximum results (default: 50)
- `docTypes` (optional): Documentation file types to search ['md', 'mdx', 'txt', 'rst', 'adoc']
- `includeArchived` (optional): Include archived/old documentation (default: false)
- `sortBy` (optional): Sort by 'relevance', 'date', 'name', or 'size'

**Features:**
- **Smart categorization**: Automatically categorizes docs as specs, requirements, designs, APIs, etc.
- **Priority ranking**: Relevance-based sorting puts most important docs first
- **Archive filtering**: Excludes deprecated/old documentation by default
- **SpecStory optimization**: Designed for specification and documentation workflows

### 5. `everything_deep_research` *(Coming Soon)*
Intent-based code research across public GitHub repositories.

**Parameters:**
- `specification` (required): Path to specification document or text content
- `searchDepth` (optional): 'shallow', 'medium', or 'deep' research depth
- `languages` (optional): Preferred programming languages
- `maxRepositories` (optional): Maximum repositories to analyze

**Features:**
- **Intent Analysis**: Parses specifications to understand implementation goals
- **Pattern Discovery**: Finds code patterns that match specification requirements
- **Quality Assessment**: Evaluates code quality, license compatibility, and maintenance status
- **Knowledge Base**: Stores findings in SQLite database for future reference

### 6. `everything_github_search` *(Coming Soon)*
Combined local and GitHub repository search.

**Parameters:**
- `query` (required): Search query
- `includeLocal` (optional): Include local file search (default: true)
- `includeGitHub` (optional): Include GitHub repository search (default: true)
- `repositories` (optional): Specific repositories to search

### 7. `everything_tui_launch` *(Coming Soon)*
Launch Terminal User Interface for interactive project management.

**Features:**
- **Project Dashboard**: Overview of specifications, tasks, and progress
- **Interactive Search**: Real-time search with filtering and sorting
- **Research Interface**: Monitor deep research progress and results
- **Implementation Suggestions**: Browse AI-generated recommendations

## 🔤 Everything Search Syntax

The server supports full Everything search syntax:

- **Wildcards**: `*.txt`, `project*`
- **Extensions**: `ext:js`, `ext:pdf`
- **Size filters**: `size:>1mb`, `size:<100kb`
- **Date filters**: `dm:today`, `dm:thisweek`
- **Path filters**: `path:documents`, `path:"c:\projects"`
- **Boolean operators**: `AND`, `OR`, `NOT`
- **Exact phrases**: `"exact phrase"`

## 📝 Examples

### Basic Search
```json
{
  "query": "*.py",
  "maxResults": 100
}
```

### Advanced Search
```json
{
  "query": "dm:lastweek",
  "fileTypes": ["mp4", "mkv", "avi"],
  "sortBy": "size"
}
```

### Development Files
```json
{
  "query": "component",
  "fileTypes": ["jsx", "tsx"],
  "caseSensitive": false
}
```

## 🔧 Troubleshooting

### Common Issues

1. **"es.exe not found"**
   - Verify Everything is installed
   - Check path: `C:\Program Files\Everything\es.exe`
   - Try running Everything as administrator

2. **"No results returned"**
   - Ensure Everything database is indexed
   - Check if Everything service is running
   - Use `everything_check_service` tool

3. **"Permission denied"**
   - Run Everything as administrator
   - Check Windows permissions
   - Verify Everything service is started

### Debug Mode

The server logs all operations to the trace directory:
- Default Location: `D:\outputs\traces\everything-mcp-{timestamp}`
- Files: Operation logs, development diary, error traces
- Use for debugging search queries and server issues

## 🏗️ Architecture

The Enhanced Everything MCP Server transforms simple file search into an intelligent development research platform:

### Current Architecture (v1.0)
1. **MCP Client** (Cursor/Kiro/SpecStory/Claude) sends search requests
2. **MCP Server** validates and processes requests
3. **es.exe** executes the actual search
4. **Results** are parsed and returned as structured JSON
5. **Trace System** logs all operations for debugging

### Enhanced Architecture (v2.0 - In Development)

![Research Workflow](./research-workflow.svg)

*Intent-based code research with GitHub discovery and pattern analysis*

### Terminal User Interface Preview

![TUI Mockup](./tui-mockup.svg)

*Interactive terminal dashboard for project management and search*

### Key Components
- **Research Engine**: Intent-based code discovery and pattern analysis
- **Knowledge Base**: SQLite database for accumulated research findings
- **GitHub Integration**: Seamless local/remote search capabilities
- **TUI Controller**: Rich terminal interface for interactive development
- **Spec Awareness**: Understanding of requirements, design, and task documents

## �️ eRoadmap

### ✅ Phase 1: Core Search (v1.0 - Current)
- [x] Basic Everything search integration
- [x] Advanced filtering and sorting
- [x] Documentation search optimization
- [x] MCP protocol implementation
- [x] Comprehensive logging and tracing

### 🚧 Phase 2: Enhanced Research (v2.0 - In Development)
- [ ] GitHub MCP integration
- [ ] Intent-based code research
- [ ] SQLite knowledge base
- [ ] CSV export capabilities
- [ ] Pattern recognition and analysis

### 🔮 Phase 3: Intelligence & Automation (v3.0 - Planned)
- [ ] Terminal User Interface (TUI)
- [ ] AI-powered implementation suggestions
- [ ] Automated specification analysis
- [ ] One-click Kiro installation
- [ ] Advanced voidtools integration

### 📋 Current Status
The enhanced features are currently in **specification phase**. See `.kiro/specs/enhanced-everything-mcp/` for detailed requirements, design, and implementation plans.

## 🚀 Development

```bash
# Run current version in development mode
npm run dev

# Build for production
npm run build

# Start built server
npm start

# View enhancement specifications
# Open .kiro/specs/enhanced-everything-mcp/ in Kiro IDE
```

### File Structure
```
everything-mcp/
├── src/
│   └── index.ts              # Main server implementation
├── .kiro/specs/              # Enhancement specifications
│   └── enhanced-everything-mcp/
│       ├── requirements.md   # Detailed requirements
│       ├── design.md         # Architecture design
│       └── tasks.md          # Implementation plan
├── dist/                     # Built files (generated)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── architecture.svg          # Architecture diagram
└── README.md                 # This file
```

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🙏 Acknowledgments

- [voidtools](https://www.voidtools.com/) for the amazing Everything search engine
- [Model Context Protocol](https://modelcontextprotocol.io/) for the MCP specification
- The Cursor team for MCP integration
- [Kiro IDE](https://github.com/kirodotdev/Kiro) for agentic development with MCP support
- [SpecStory](https://github.com/specstoryai/docs) for specification and documentation workflows

---

**Made with ❤️ for the Everything and AI community**
