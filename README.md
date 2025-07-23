# Everything MCP Server

A Model Context Protocol (MCP) server that integrates [voidtools Everything](https://www.voidtools.com/) search engine with AI assistants like Cursor, Claude, and other MCP-compatible tools. Provides lightning-fast file and folder search capabilities using Everything's powerful indexing.

![Everything MCP Architecture](./architecture.svg)

## 🚀 Features

- **Lightning Fast Search**: Leverages Everything's instant search capabilities
- **Advanced Filtering**: Filter by file types, size, date, and more
- **Multiple Sort Options**: Sort by name, size, date, or path
- **Regex Support**: Use regular expressions for complex searches
- **Service Health Checks**: Verify Everything service status
- **Comprehensive Logging**: Full trace logging for debugging
- **Easy Integration**: Simple setup with Cursor and other MCP clients

## 📋 Prerequisites

- **Windows OS**: Everything only runs on Windows
- **Everything Installed**: Download from [voidtools.com](https://www.voidtools.com/)
- **Node.js 18+**: Required for MCP server
- **es.exe Available**: Command-line interface must be accessible

### Everything Setup

1. Install Everything from [voidtools.com](https://www.voidtools.com/)
2. Ensure the Everything service is running
3. Verify `es.exe` exists at: `C:\Program Files\Everything\es.exe`
4. Test with: `"C:\Program Files\Everything\es.exe" test`

## 🛠️ Installation

### Option 1: From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/everything-mcp.git
cd everything-mcp

# Install dependencies
npm install

# Build the server
npm run build
```

### Option 2: Global Install (Coming Soon)

```bash
npm install -g everything-mcp-server
```

## 🔧 Usage with Cursor

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

The Everything MCP Server provides a bridge between AI assistants and the Everything search engine:

1. **MCP Client** (Cursor/Claude) sends search requests
2. **MCP Server** validates and processes requests
3. **es.exe** executes the actual search
4. **Results** are parsed and returned as structured JSON
5. **Trace System** logs all operations for debugging

## 🚀 Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start built server
npm start
```

### File Structure
```
everything-mcp/
├── src/
│   └── index.ts              # Main server implementation
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

---

**Made with ❤️ for the Everything and AI community** 