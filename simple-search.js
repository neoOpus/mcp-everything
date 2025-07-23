#!/usr/bin/env node

/**
 * Simple Everything Search Interface for Kiro
 * Command-line version that works immediately
 */

import { spawn } from 'child_process';
import { createInterface } from 'readline';

class SimpleEverythingSearch {
  constructor() {
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.showWelcome();
    this.startSearchLoop();
  }

  showWelcome() {
    console.log('\n🚀 Everything MCP Server - Simple Search Interface');
    console.log('='.repeat(55));
    console.log('💡 Type your search query and press Enter');
    console.log('💡 Examples: *.ts, project*, ext:md, size:>1mb');
    console.log('💡 Type "help" for more options, "quit" to exit');
    console.log('='.repeat(55));
  }

  startSearchLoop() {
    this.rl.question('\n🔍 Search: ', (query) => {
      this.handleQuery(query.trim());
    });
  }

  async handleQuery(query) {
    if (!query) {
      this.startSearchLoop();
      return;
    }

    if (query.toLowerCase() === 'quit' || query.toLowerCase() === 'exit') {
      console.log('\n👋 Goodbye!');
      this.rl.close();
      return;
    }

    if (query.toLowerCase() === 'help') {
      this.showHelp();
      this.startSearchLoop();
      return;
    }

    if (query.toLowerCase() === 'test') {
      await this.runTests();
      this.startSearchLoop();
      return;
    }

    console.log(`\n🔍 Searching for: "${query}"`);
    console.log('⏳ Please wait...');

    try {
      const results = await this.executeSearch(query);
      this.displayResults(results, query);
    } catch (error) {
      console.log(`❌ Search failed: ${error.message}`);
    }

    this.startSearchLoop();
  }

  executeSearch(query) {
    return new Promise((resolve, reject) => {
      const args = ['-n', '20', query];
      const searchProcess = spawn('es', args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let stdout = '';
      let stderr = '';

      searchProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      searchProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      searchProcess.on('close', (code) => {
        if (code === 0) {
          const results = stdout.trim().split('\n').filter(line => line.trim());
          resolve(results);
        } else {
          reject(new Error(`Exit code ${code}: ${stderr || 'Unknown error'}`));
        }
      });

      searchProcess.on('error', (error) => {
        reject(new Error(`Failed to execute: ${error.message}`));
      });

      // 10 second timeout
      setTimeout(() => {
        searchProcess.kill();
        reject(new Error('Search timeout (10s)'));
      }, 10000);
    });
  }

  displayResults(results, query) {
    console.log(`\n📊 Found ${results.length} results for: "${query}"`);
    console.log('='.repeat(55));

    if (results.length === 0) {
      console.log('❌ No files found matching your query');
      console.log('💡 Try a different search term or pattern');
      return;
    }

    results.forEach((result, index) => {
      const fileName = result.split('\\').pop() || result.split('/').pop() || result;
      const shortPath = result.length > 80 ? '...' + result.slice(-77) : result;
      console.log(`${(index + 1).toString().padStart(2)}. ${fileName}`);
      console.log(`    ${shortPath}`);
    });

    console.log('='.repeat(55));
  }

  showHelp() {
    console.log('\n📚 Everything Search Syntax Help');
    console.log('='.repeat(40));
    console.log('Basic Patterns:');
    console.log('  *.txt          - All .txt files');
    console.log('  project*       - Files starting with "project"');
    console.log('  *readme*       - Files containing "readme"');
    console.log('');
    console.log('Advanced Filters:');
    console.log('  ext:js         - JavaScript files');
    console.log('  ext:md;txt     - Markdown or text files');
    console.log('  size:>1mb      - Files larger than 1MB');
    console.log('  size:<100kb    - Files smaller than 100KB');
    console.log('  dm:today       - Modified today');
    console.log('  dm:thisweek    - Modified this week');
    console.log('');
    console.log('Boolean Operators:');
    console.log('  *.js AND test  - JavaScript files containing "test"');
    console.log('  *.md OR *.txt  - Markdown or text files');
    console.log('  *.log NOT temp - Log files not containing "temp"');
    console.log('');
    console.log('Special Commands:');
    console.log('  help           - Show this help');
    console.log('  test           - Run MCP server tests');
    console.log('  quit/exit      - Exit the program');
    console.log('='.repeat(40));
  }

  async runTests() {
    console.log('\n🧪 Running MCP Server Tests...');
    console.log('='.repeat(35));

    // Test 1: Basic search
    try {
      console.log('📋 Test 1: Basic search functionality');
      const results = await this.executeSearch('*.md');
      console.log(`   ✅ Found ${results.length} markdown files`);
    } catch (error) {
      console.log(`   ❌ Basic search failed: ${error.message}`);
    }

    // Test 2: Everything service
    try {
      console.log('📋 Test 2: Everything service check');
      const results = await this.executeSearch('test');
      console.log('   ✅ Everything service is responding');
    } catch (error) {
      console.log(`   ❌ Everything service issue: ${error.message}`);
    }

    // Test 3: MCP server build
    console.log('📋 Test 3: MCP server build status');
    try {
      const fs = await import('fs');
      if (fs.existsSync('dist/index.js')) {
        console.log('   ✅ MCP server is built and ready');
      } else {
        console.log('   ⚠️  MCP server needs building (run: npm run build)');
      }
    } catch (error) {
      console.log('   ❌ Could not check MCP server status');
    }

    console.log('='.repeat(35));
    console.log('💡 For full Kiro integration, ensure MCP is configured');
  }
}

// Start the search interface
console.log('🚀 Starting Everything Search Interface...');
new SimpleEverythingSearch();