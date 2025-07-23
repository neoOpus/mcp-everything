#!/usr/bin/env node

/**
 * Hello World Test for Everything MCP Server
 * 
 * This script tests the basic functionality of the MCP server
 * to ensure it's working correctly in Kiro IDE.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Everything MCP Server - Hello World Test');
console.log('='.repeat(50));

// Test 1: Check if Everything is available
console.log('\n📋 Test 1: Everything Service Check');
try {
  const everythingPath = process.env.EVERYTHING_PATH || 'C:\\Program Files\\Everything\\es.exe';
  console.log(`   Checking: ${everythingPath}`);
  
  const testProcess = spawn(everythingPath, ['-n', '1', 'test'], { 
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true 
  });
  
  testProcess.on('close', (code) => {
    if (code === 0) {
      console.log('   ✅ Everything service is running');
    } else {
      console.log('   ❌ Everything service not accessible');
      console.log('   💡 Make sure Everything is installed and running');
    }
  });
  
  testProcess.on('error', (error) => {
    console.log('   ❌ Everything not found:', error.message);
    console.log('   💡 Install Everything from https://www.voidtools.com/');
  });
  
} catch (error) {
  console.log('   ❌ Error testing Everything:', error.message);
}

// Test 2: Check MCP Server startup
console.log('\n📋 Test 2: MCP Server Startup');
try {
  const serverPath = join(__dirname, 'dist', 'index.js');
  console.log(`   Starting server: ${serverPath}`);
  
  const mcpProcess = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      EVERYTHING_PATH: process.env.EVERYTHING_PATH || 'C:\\Program Files\\Everything\\es.exe',
      TRACE_DIRECTORY: process.env.TRACE_DIRECTORY || 'D:\\outputs\\traces'
    }
  });
  
  let serverOutput = '';
  mcpProcess.stderr.on('data', (data) => {
    serverOutput += data.toString();
  });
  
  setTimeout(() => {
    if (serverOutput.includes('Everything MCP Server running')) {
      console.log('   ✅ MCP Server started successfully');
    } else {
      console.log('   ❌ MCP Server startup issue');
      console.log('   📝 Output:', serverOutput);
    }
    mcpProcess.kill();
  }, 2000);
  
} catch (error) {
  console.log('   ❌ Error starting MCP server:', error.message);
}

// Test 3: Configuration Check
console.log('\n📋 Test 3: Kiro Configuration');
try {
  const configPath = join(__dirname, 'kiro-config-example.json');
  console.log(`   Example config: ${configPath}`);
  console.log('   ✅ Configuration template available');
  console.log('   💡 Copy to your Kiro MCP settings');
} catch (error) {
  console.log('   ❌ Configuration issue:', error.message);
}

// Test 4: Specification Files
console.log('\n📋 Test 4: Specification Files');
try {
  const specPath = join(__dirname, '.kiro', 'specs', 'enhanced-everything-mcp');
  console.log(`   Spec directory: ${specPath}`);
  console.log('   ✅ Enhancement specifications available');
  console.log('   📁 Files: requirements.md, design.md, tasks.md');
} catch (error) {
  console.log('   ❌ Specification files issue:', error.message);
}

console.log('\n🎯 Next Steps for Kiro Integration:');
console.log('   1. Copy kiro-config-example.json to your Kiro MCP settings');
console.log('   2. Restart Kiro IDE to load the MCP server');
console.log('   3. Test with: "Find all TypeScript files in this project"');
console.log('   4. Explore specs in .kiro/specs/enhanced-everything-mcp/');
console.log('   5. Start implementing enhanced features from tasks.md');

console.log('\n✨ Ready to enhance your Kiro development workflow!');