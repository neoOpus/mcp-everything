#!/usr/bin/env node

/**
 * Enhanced Everything MCP Server - World-Class Terminal User Interface
 * 
 * A comprehensive TUI for intelligent code research and spec-driven development
 * Designed for seamless integration with Kiro IDE's agentic workflow
 */

import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { spawn } from 'child_process';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class EnhancedEverythingTUI {
  constructor() {
    this.screen = null;
    this.grid = null;
    this.currentTab = 'dashboard';
    this.searchHistory = [];
    this.projectStats = {};
    this.knowledgeBase = {};
    this.lastSearchResults = [];
    
    // UI Components
    this.components = {
      header: null,
      tabBar: null,
      dashboard: {},
      search: {},
      research: {},
      specs: {},
      statusBar: null
    };
    
    this.loadProjectData();
    this.setupUI();
    this.startDataRefresh();
  }

  setupUI() {
    // Create screen
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Everything MCP - Kiro Integration'
    });

    // Header
    const header = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      content: '{center}🚀 Everything MCP Server - Kiro IDE Integration{/center}',
      tags: true,
      style: {
        fg: 'white',
        bg: 'blue',
        bold: true
      }
    });

    // Search box
    this.searchBox = blessed.textbox({
      top: 3,
      left: 0,
      width: '100%',
      height: 3,
      label: ' Search Query ',
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        bg: 'black',
        border: {
          fg: 'green'
        }
      },
      inputOnFocus: true
    });

    // Results list
    this.resultsList = blessed.list({
      top: 6,
      left: 0,
      width: '100%',
      height: '100%-9',
      label: ' Search Results ',
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        bg: 'black',
        border: {
          fg: 'cyan'
        },
        selected: {
          bg: 'blue'
        }
      },
      keys: true,
      vi: true,
      scrollable: true,
      alwaysScroll: true
    });

    // Status bar
    this.statusBar = blessed.box({
      bottom: 0,
      left: 0,
      width: '100%',
      height: 3,
      content: ' Press Enter to search | Esc to quit | ↑↓ to navigate results ',
      style: {
        fg: 'white',
        bg: 'green'
      }
    });

    // Add elements to screen
    this.screen.append(header);
    this.screen.append(this.searchBox);
    this.screen.append(this.resultsList);
    this.screen.append(this.statusBar);

    this.setupEvents();
    this.screen.render();
  }

  setupEvents() {
    // Search on Enter
    this.searchBox.on('submit', (query) => {
      this.performSearch(query);
    });

    // Quit on Escape or Ctrl+C
    this.screen.key(['escape', 'C-c'], () => {
      process.exit(0);
    });

    // Focus search box on start
    this.searchBox.focus();

    // Help
    this.screen.key(['h', 'H'], () => {
      this.showHelp();
    });

    // Clear results
    this.screen.key(['c', 'C'], () => {
      this.resultsList.clearItems();
      this.screen.render();
    });
  }

  async performSearch(query) {
    if (!query.trim()) return;

    this.statusBar.setContent(` Searching for: ${query}... `);
    this.screen.render();

    try {
      const results = await this.executeEverythingSearch(query);
      this.displayResults(results, query);
    } catch (error) {
      this.displayError(error.message);
    }
  }

  executeEverythingSearch(query) {
    return new Promise((resolve, reject) => {
      const args = ['-n', '50', query];
      const process = spawn('es', args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
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
          const results = stdout.trim().split('\n').filter(line => line.trim());
          resolve(results);
        } else {
          reject(new Error(`Search failed: ${stderr || 'Unknown error'}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to execute search: ${error.message}`));
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        process.kill();
        reject(new Error('Search timeout'));
      }, 10000);
    });
  }

  displayResults(results, query) {
    this.resultsList.clearItems();
    
    if (results.length === 0) {
      this.resultsList.addItem('No results found');
    } else {
      results.forEach((result, index) => {
        const fileName = result.split('\\').pop() || result;
        const displayText = `${index + 1}. ${fileName}`;
        this.resultsList.addItem(displayText);
      });
    }

    this.statusBar.setContent(` Found ${results.length} results for: ${query} | Press 'h' for help `);
    this.screen.render();
  }

  displayError(message) {
    this.resultsList.clearItems();
    this.resultsList.addItem(`Error: ${message}`);
    this.statusBar.setContent(` Error occurred | Press 'h' for help `);
    this.screen.render();
  }

  showHelp() {
    const helpText = `
Everything MCP Server - Help

Search Syntax:
  *.txt          - Find all .txt files
  project*       - Files starting with 'project'
  ext:js         - All JavaScript files
  size:>1mb      - Files larger than 1MB
  dm:today       - Files modified today
  "exact phrase" - Exact phrase search

Keyboard Shortcuts:
  Enter    - Perform search
  ↑↓       - Navigate results
  h        - Show this help
  c        - Clear results
  Esc      - Quit

Examples:
  *.md AND project
  ext:ts OR ext:js
  size:<100kb dm:thisweek
`;

    const helpBox = blessed.message({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: '80%',
      height: '80%',
      label: ' Help ',
      content: helpText,
      border: {
        type: 'line'
      },
      style: {
        fg: 'white',
        bg: 'black',
        border: {
          fg: 'yellow'
        }
      }
    });

    helpBox.display();
  }
}

// Check if blessed is available
try {
  const tui = new EverythingTUI();
} catch (error) {
  console.log('❌ TUI requires blessed package. Install with: npm install blessed');
  console.log('💡 For now, use the MCP server directly in Kiro chat');
  process.exit(1);
}