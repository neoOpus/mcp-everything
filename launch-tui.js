#!/usr/bin/env node

/**
 * TUI Launcher for Kiro Integration
 * 
 * This script can be called from Kiro to launch the Terminal User Interface
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Launching Kiro Everything MCP Terminal Interface...');
console.log('📍 Location:', __dirname);

// Launch the TUI in a new process
const tuiProcess = spawn('node', [join(__dirname, 'src', 'tui.js')], {
  stdio: 'inherit',
  shell: true
});

tuiProcess.on('close', (code) => {
  console.log(`\n✨ TUI exited with code ${code}`);
  process.exit(code);
});

tuiProcess.on('error', (error) => {
  console.error('❌ Failed to launch TUI:', error.message);
  console.log('💡 Make sure dependencies are installed: npm install');
  process.exit(1);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down TUI...');
  tuiProcess.kill('SIGINT');
});