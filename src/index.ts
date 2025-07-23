#!/usr/bin/env node

/**
 * MCP Server for Everything Search (es.exe)
 * 
 * Provides file search capabilities using voidtools Everything search engine
 * via the es.exe command line interface.
 * 
 * @author Everything MCP Server
 * @version 1.0.0
 * @license MIT
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const EVERYTHING_PATH = process.env.EVERYTHING_PATH || 'C:\\Program Files\\Everything\\es.exe';
const TRACE_DIRECTORY = process.env.TRACE_DIRECTORY || 'D:\\outputs\\traces';

interface SearchResult {
  path: string;
  name: string;
  size?: number;
  modified?: string;
  type: 'file' | 'folder';
}

class EverythingMCPServer {
  private server: Server;
  private traceDir: string;

  constructor() {
    this.server = new Server(
      {
        name: 'everything-search',
        version: '1.0.0',
      }
    );

    this.traceDir = path.join(TRACE_DIRECTORY, `everything-mcp-${Date.now()}`);
    this.setupHandlers();
    this.initializeTrace();
  }

  private async initializeTrace(): Promise<void> {
    try {
      await fs.mkdir(this.traceDir, { recursive: true });
      
      const diaryPath = path.join(this.traceDir, 'development_diary.md');
      const timestamp = new Date().toISOString();
      
      const diaryContent = `# Everything MCP Server Session

## ${timestamp}
- Initialized MCP server for Everything search
- Created trace directory: ${this.traceDir}
- Server capabilities: file search, filtering, sorting
- Target: es.exe integration for AI assistants

## Architecture
- MCP Server with stdio transport
- Direct es.exe command execution
- Result parsing and formatting
- Error handling and validation

## Tools Available
- everything_search: General file/folder search
- everything_search_advanced: Advanced search with filters
- everything_check_service: Verify Everything service status
`;

      await fs.writeFile(diaryPath, diaryContent);
      console.error(`Trace initialized: ${this.traceDir}`);
    } catch (error) {
      console.error('Failed to initialize trace:', error);
    }
  }

  private async logTrace(operation: string, data: any): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const logPath = path.join(this.traceDir, `${operation}_${Date.now()}.json`);
      
      const logData = {
        timestamp,
        operation,
        data,
        traceDirectory: this.traceDir
      };

      await fs.writeFile(logPath, JSON.stringify(logData, null, 2));
    } catch (error) {
      console.error('Failed to log trace:', error);
    }
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      await this.logTrace('list_tools', { timestamp: new Date().toISOString() });
      
      return {
        tools: [
          {
            name: 'everything_search',
            description: 'Search for files and folders using Everything search engine',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query (supports Everything syntax)',
                },
                maxResults: {
                  type: 'number',
                  description: 'Maximum number of results to return (default: 50)',
                  default: 50,
                },
                fileOnly: {
                  type: 'boolean',
                  description: 'Search files only (exclude folders)',
                  default: false,
                },
                folderOnly: {
                  type: 'boolean',
                  description: 'Search folders only (exclude files)',
                  default: false,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'everything_search_advanced',
            description: 'Advanced search with filtering and sorting options',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                maxResults: {
                  type: 'number',
                  description: 'Maximum results (default: 50)',
                  default: 50,
                },
                sortBy: {
                  type: 'string',
                  enum: ['name', 'size', 'date', 'path'],
                  description: 'Sort results by field',
                  default: 'name',
                },
                fileTypes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Filter by file extensions (e.g., ["js", "ts", "md"])',
                },
                includeHidden: {
                  type: 'boolean',
                  description: 'Include hidden files/folders',
                  default: false,
                },
                regex: {
                  type: 'boolean',
                  description: 'Use regex search',
                  default: false,
                },
                caseSensitive: {
                  type: 'boolean',
                  description: 'Case sensitive search',
                  default: false,
                },
              },
              required: ['query'],
            },
          },
                     {
             name: 'everything_check_service',
             description: 'Check if Everything service is running and accessible',
             inputSchema: {
               type: 'object',
               properties: {},
             },
           },
           {
             name: 'everything_search_docs',
             description: 'Search for documentation, specifications, and requirement files optimized for SpecStory workflows',
             inputSchema: {
               type: 'object',
               properties: {
                 query: {
                   type: 'string',
                   description: 'Search query for documentation files',
                 },
                 maxResults: {
                   type: 'number',
                   description: 'Maximum results (default: 50)',
                   default: 50,
                 },
                 docTypes: {
                   type: 'array',
                   items: { type: 'string' },
                   description: 'Documentation types to search for: ["spec", "requirements", "design", "api", "readme", "docs"]',
                   default: ['md', 'mdx', 'txt', 'rst', 'adoc']
                 },
                 includeArchived: {
                   type: 'boolean',
                   description: 'Include archived/old documentation',
                   default: false,
                 },
                 sortBy: {
                   type: 'string',
                   enum: ['relevance', 'date', 'name', 'size'],
                   description: 'Sort results by field',
                   default: 'relevance',
                 },
               },
               required: ['query'],
             },
           },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      await this.logTrace('call_tool', {
        tool: request.params.name,
        arguments: request.params.arguments,
      });

      switch (request.params.name) {
        case 'everything_search':
          return await this.handleSearch(request.params.arguments);
        
        case 'everything_search_advanced':
          return await this.handleAdvancedSearch(request.params.arguments);
        
                 case 'everything_check_service':
           return await this.handleServiceCheck();
         
         case 'everything_search_docs':
           return await this.handleDocumentationSearch(request.params.arguments);
         
         default:
           throw new McpError(
             ErrorCode.MethodNotFound,
             `Unknown tool: ${request.params.name}`
           );
       }
     });
   }

  private async executeEverything(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(EVERYTHING_PATH, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
      });

      let stdout = '';
      let stderr = '';

      process.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(`es.exe exited with code ${code}: ${stderr}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to execute es.exe: ${error.message}`));
      });
    });
  }

  private async handleSearch(args: any) {
    try {
      const { query, maxResults = 50, fileOnly = false, folderOnly = false } = args;

      const esArgs = ['-n', maxResults.toString()];
      
      if (fileOnly) esArgs.push('-file');
      if (folderOnly) esArgs.push('-folder');
      
      esArgs.push(query);

      const output = await this.executeEverything(esArgs);
      const results = this.parseSearchResults(output);

      await this.logTrace('search_results', {
        query,
        resultCount: results.length,
        args: esArgs,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              query,
              resultCount: results.length,
              results: results.slice(0, maxResults),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.logTrace('search_error', { error: errorMessage });
      throw new McpError(ErrorCode.InternalError, `Search failed: ${errorMessage}`);
    }
  }

  private async handleAdvancedSearch(args: any) {
    try {
      const {
        query,
        maxResults = 50,
        sortBy = 'name',
        fileTypes = [],
        includeHidden = false,
        regex = false,
        caseSensitive = false,
      } = args;

      const esArgs = ['-n', maxResults.toString()];

      // Sort options
      switch (sortBy) {
        case 'size': esArgs.push('-sort', 'size'); break;
        case 'date': esArgs.push('-sort', 'dm'); break;
        case 'path': esArgs.push('-sort', 'path'); break;
        default: esArgs.push('-sort', 'name'); break;
      }

      // Search options
      if (regex) esArgs.push('-regex');
      if (caseSensitive) esArgs.push('-case');
      if (!includeHidden) esArgs.push('-no-hidden');

      // Build query with file type filters
      let finalQuery = query;
      if (fileTypes.length > 0) {
        const extensions = fileTypes.map((ext: string) => `ext:${ext}`).join(' | ');
        finalQuery = `(${extensions}) ${query}`;
      }

      esArgs.push(finalQuery);

      const output = await this.executeEverything(esArgs);
      const results = this.parseSearchResults(output);

      await this.logTrace('advanced_search_results', {
        query: finalQuery,
        options: { sortBy, fileTypes, includeHidden, regex, caseSensitive },
        resultCount: results.length,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              query: finalQuery,
              options: { sortBy, fileTypes, includeHidden, regex, caseSensitive },
              resultCount: results.length,
              results: results.slice(0, maxResults),
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.logTrace('advanced_search_error', { error: errorMessage });
      throw new McpError(ErrorCode.InternalError, `Advanced search failed: ${errorMessage}`);
    }
  }

  private async handleServiceCheck() {
    try {
      // Test with a simple query
      const output = await this.executeEverything(['-n', '1', 'test']);
      
      await this.logTrace('service_check', {
        status: 'running',
        everythingPath: EVERYTHING_PATH,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'running',
              everythingPath: EVERYTHING_PATH,
              message: 'Everything service is accessible and responding',
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      await this.logTrace('service_check_error', { error: errorMessage });
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'error',
              everythingPath: EVERYTHING_PATH,
              message: `Everything service check failed: ${errorMessage}`,
              troubleshooting: [
                'Ensure Everything is installed and running',
                'Check if es.exe exists at the specified path',
                'Verify Everything service is started',
                'Run Everything as administrator if needed',
              ],
            }, null, 2),
          },
        ],
      };
         }
   }

   private async handleDocumentationSearch(args: any) {
     try {
       const {
         query,
         maxResults = 50,
         docTypes = ['md', 'mdx', 'txt', 'rst', 'adoc'],
         includeArchived = false,
         sortBy = 'relevance',
       } = args;

       const esArgs = ['-n', maxResults.toString()];

       // Sort options for documentation
       switch (sortBy) {
         case 'date': esArgs.push('-sort', 'dm'); break;
         case 'name': esArgs.push('-sort', 'name'); break;
         case 'size': esArgs.push('-sort', 'size'); break;
         default: esArgs.push('-sort', 'name'); break; // Default to name for docs
       }

       // Build documentation-focused query
       let docQuery = query;
       
       // Add documentation file extensions
       const extensions = docTypes.map((ext: string) => `ext:${ext}`).join(' | ');
       
       // Enhance query with documentation keywords
       const docKeywords = [
         'spec', 'specification', 'requirement', 'design', 'architecture',
         'api', 'readme', 'doc', 'documentation', 'guide', 'manual',
         'proposal', 'rfc', 'adr', 'decision'
       ];
       
       // Combine extensions and query
       let finalQuery = `(${extensions})`;
       if (query.trim()) {
         finalQuery += ` (${docQuery})`;
       }
       
       // Exclude archived files unless requested
       if (!includeArchived) {
         esArgs.push('-no-archived');
         finalQuery += ' !archive !old !deprecated !legacy';
       }

       esArgs.push(finalQuery);

       const output = await this.executeEverything(esArgs);
       const results = this.parseSearchResults(output);

       // Enhance results with documentation context
       const enhancedResults = results.map(result => ({
         ...result,
         category: this.categorizeDocumentationFile(result.name, result.path),
         priority: this.calculateDocumentationPriority(result.name, result.path, docKeywords)
       }));

       // Sort by priority if relevance is selected
       if (sortBy === 'relevance') {
         enhancedResults.sort((a, b) => (b as any).priority - (a as any).priority);
       }

       await this.logTrace('documentation_search_results', {
         query: finalQuery,
         options: { docTypes, includeArchived, sortBy },
         resultCount: enhancedResults.length,
         categories: this.summarizeDocumentationCategories(enhancedResults)
       });

       return {
         content: [
           {
             type: 'text',
             text: JSON.stringify({
               query: finalQuery,
               originalQuery: query,
               options: { docTypes, includeArchived, sortBy },
               resultCount: enhancedResults.length,
               results: enhancedResults.slice(0, maxResults),
               summary: this.summarizeDocumentationCategories(enhancedResults)
             }, null, 2),
           },
         ],
       };
     } catch (error) {
       const errorMessage = error instanceof Error ? error.message : String(error);
       await this.logTrace('documentation_search_error', { error: errorMessage });
       throw new McpError(ErrorCode.InternalError, `Documentation search failed: ${errorMessage}`);
     }
   }

   private categorizeDocumentationFile(filename: string, filepath: string): string {
     const lower = filename.toLowerCase();
     const path = filepath.toLowerCase();
     
     if (lower.includes('readme')) return 'readme';
     if (lower.includes('spec') || lower.includes('specification')) return 'specification';
     if (lower.includes('requirement') || lower.includes('req')) return 'requirements';
     if (lower.includes('design') || lower.includes('architecture')) return 'design';
     if (lower.includes('api')) return 'api';
     if (lower.includes('guide') || lower.includes('tutorial')) return 'guide';
     if (lower.includes('rfc') || lower.includes('proposal')) return 'proposal';
     if (lower.includes('adr') || lower.includes('decision')) return 'decision';
     if (path.includes('/docs/') || path.includes('\\docs\\')) return 'documentation';
     
     return 'general';
   }

   private calculateDocumentationPriority(filename: string, filepath: string, keywords: string[]): number {
     let priority = 0;
     const lower = filename.toLowerCase() + ' ' + filepath.toLowerCase();
     
     // Higher priority for important doc types
     if (lower.includes('readme')) priority += 10;
     if (lower.includes('spec') || lower.includes('specification')) priority += 9;
     if (lower.includes('requirement')) priority += 8;
     if (lower.includes('design') || lower.includes('architecture')) priority += 7;
     if (lower.includes('api')) priority += 6;
     
     // Boost for keywords in filename
     keywords.forEach(keyword => {
       if (filename.toLowerCase().includes(keyword)) priority += 2;
       if (filepath.toLowerCase().includes(keyword)) priority += 1;
     });
     
     // Prefer newer-style documentation
     if (filename.endsWith('.md') || filename.endsWith('.mdx')) priority += 3;
     if (filepath.includes('/docs/') || filepath.includes('\\docs\\')) priority += 2;
     
     return priority;
   }

   private summarizeDocumentationCategories(results: any[]): Record<string, number> {
     const categories: Record<string, number> = {};
     results.forEach(result => {
       const category = result.category || 'general';
       categories[category] = (categories[category] || 0) + 1;
     });
     return categories;
   }

   private parseSearchResults(output: string): SearchResult[] {
    const lines = output.trim().split('\n').filter(line => line.trim());
    
    return lines.map(line => {
      const fullPath = line.trim();
      const name = path.basename(fullPath);
      const isDirectory = !path.extname(fullPath);
      
      return {
        path: fullPath,
        name,
        type: isDirectory ? 'folder' : 'file',
      };
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Everything MCP Server running on stdio');
    console.error(`Trace directory: ${this.traceDir}`);
  }
}

// Start the server
const server = new EverythingMCPServer();
server.run().catch(console.error); 