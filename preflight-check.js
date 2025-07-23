#!/usr/bin/env node

/**
 * Enhanced Everything MCP Server - Pre-Flight Check System
 * 
 * This system performs comprehensive environment validation when Kiro first invokes the MCP
 * and provides detailed guidance to the Kiro agent on how to correct any issues.
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PreflightChecker {
  constructor() {
    this.results = {
      overall: 'unknown',
      checks: [],
      recommendations: [],
      kiroInstructions: []
    };
  }

  async runAllChecks() {
    console.log('🚀 Enhanced Everything MCP Server - Pre-Flight Check');
    console.log('='.repeat(60));
    console.log('🤖 Kiro Agent Environment Validation System');
    console.log('');

    await this.checkOperatingSystem();
    await this.checkNodeJS();
    await this.checkEverythingService();
    await this.checkGitHubCLI();
    await this.checkKiroEnvironment();
    await this.checkDirectoryStructure();
    await this.checkMCPServerBuild();
    await this.generateKiroInstructions();

    this.summarizeResults();
    return this.results;
  }

  async checkOperatingSystem() {
    console.log('📋 Check 1: Operating System Compatibility');
    
    const isWindows = platform() === 'win32';
    
    if (isWindows) {
      console.log('   ✅ Windows OS detected - Everything search compatible');
      this.addCheck('os', true, 'Windows OS detected', 'Everything search engine is compatible');
    } else {
      console.log('   ❌ Non-Windows OS detected');
      console.log('   💡 Everything search only works on Windows');
      this.addCheck('os', false, `${platform()} OS detected`, 'Everything requires Windows OS');
      this.addRecommendation('Install Windows or use Windows Subsystem for Linux with Windows Everything service');
      this.addKiroInstruction('CRITICAL: This MCP server requires Windows OS for Everything search functionality');
    }
  }

  async checkNodeJS() {
    console.log('\n📋 Check 2: Node.js Environment');
    
    try {
      const nodeVersion = process.version;
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      if (majorVersion >= 18) {
        console.log(`   ✅ Node.js ${nodeVersion} - Compatible`);
        this.addCheck('nodejs', true, `Node.js ${nodeVersion}`, 'Version meets requirements (≥18.0.0)');
      } else {
        console.log(`   ❌ Node.js ${nodeVersion} - Too old`);
        console.log('   💡 Requires Node.js 18.0.0 or higher');
        this.addCheck('nodejs', false, `Node.js ${nodeVersion}`, 'Version too old, requires ≥18.0.0');
        this.addRecommendation('Update Node.js to version 18.0.0 or higher');
        this.addKiroInstruction('UPDATE_REQUIRED: Node.js version must be upgraded to ≥18.0.0');
      }
    } catch (error) {
      console.log('   ❌ Node.js not detected');
      this.addCheck('nodejs', false, 'Node.js not found', 'Node.js installation required');
      this.addRecommendation('Install Node.js 18.0.0 or higher from https://nodejs.org/');
      this.addKiroInstruction('INSTALL_REQUIRED: Node.js 18+ must be installed');
    }
  }

  async checkEverythingService() {
    console.log('\n📋 Check 3: Everything Search Engine');
    
    const everythingPaths = [
      process.env.EVERYTHING_PATH,
      'C:\\Program Files\\Everything\\es.exe',
      'C:\\Program Files (x86)\\Everything\\es.exe'
    ].filter(Boolean);

    let everythingFound = false;
    let workingPath = null;

    for (const path of everythingPaths) {
      if (existsSync(path)) {
        console.log(`   📁 Found Everything at: ${path}`);
        
        try {
          const result = await this.testEverythingExecution(path);
          if (result.success) {
            console.log('   ✅ Everything service is running and accessible');
            this.addCheck('everything', true, `Everything found at ${path}`, 'Service running and accessible');
            everythingFound = true;
            workingPath = path;
            break;
          } else {
            console.log(`   ⚠️  Everything found but not responding: ${result.error}`);
          }
        } catch (error) {
          console.log(`   ⚠️  Everything found but test failed: ${error.message}`);
        }
      }
    }

    if (!everythingFound) {
      console.log('   ❌ Everything search engine not found or not running');
      console.log('   💡 Install Everything from https://www.voidtools.com/');
      console.log('   💡 Ensure Everything service is running');
      this.addCheck('everything', false, 'Everything not found/running', 'Installation or service start required');
      this.addRecommendation('1. Install Everything from https://www.voidtools.com/');
      this.addRecommendation('2. Start Everything service');
      this.addRecommendation('3. Verify es.exe is accessible');
      this.addKiroInstruction('DEPENDENCY_MISSING: Everything search engine must be installed and running');
    }

    return { found: everythingFound, path: workingPath };
  }

  async testEverythingExecution(path) {
    return new Promise((resolve) => {
      const testProcess = spawn(path, ['-n', '1', 'test'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        timeout: 5000
      });

      let stdout = '';
      let stderr = '';

      testProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      testProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      testProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output: stdout });
        } else {
          resolve({ success: false, error: `Exit code ${code}: ${stderr}` });
        }
      });

      testProcess.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });

      // Timeout fallback
      setTimeout(() => {
        testProcess.kill();
        resolve({ success: false, error: 'Timeout - Everything service may not be responding' });
      }, 5000);
    });
  }

  async checkGitHubCLI() {
    console.log('\n📋 Check 4: GitHub CLI (Optional)');
    
    try {
      const result = await this.executeCommand('gh', ['--version']);
      if (result.success) {
        console.log('   ✅ GitHub CLI detected');
        console.log(`   📝 Version: ${result.output.split('\n')[0]}`);
        
        // Check authentication
        const authResult = await this.executeCommand('gh', ['auth', 'status']);
        if (authResult.success) {
          console.log('   ✅ GitHub CLI authenticated');
          this.addCheck('github-cli', true, 'GitHub CLI installed and authenticated', 'Enhanced GitHub integration available');
        } else {
          console.log('   ⚠️  GitHub CLI not authenticated');
          this.addCheck('github-cli', 'partial', 'GitHub CLI installed but not authenticated', 'Authentication recommended for full features');
          this.addRecommendation('Run: gh auth login');
          this.addKiroInstruction('OPTIONAL: GitHub CLI authentication enables enhanced research features');
        }
      } else {
        console.log('   ⚠️  GitHub CLI not found (optional)');
        this.addCheck('github-cli', 'optional', 'GitHub CLI not installed', 'Optional for enhanced GitHub integration');
        this.addRecommendation('Install GitHub CLI for enhanced features: https://cli.github.com/');
        this.addKiroInstruction('OPTIONAL: GitHub CLI installation enables advanced research capabilities');
      }
    } catch (error) {
      console.log('   ⚠️  GitHub CLI check failed (optional)');
      this.addCheck('github-cli', 'optional', 'GitHub CLI check failed', 'Optional component');
    }
  }

  async checkKiroEnvironment() {
    console.log('\n📋 Check 5: Kiro IDE Environment');
    
    // Check for Kiro-specific environment variables or files
    const kiroIndicators = [
      process.env.KIRO_PROJECT_ROOT,
      process.env.KIRO_CONFIG_PATH,
      '.kiro',
      'kiro.config.json'
    ];

    let kiroDetected = false;
    const foundIndicators = [];

    for (const indicator of kiroIndicators) {
      if (indicator && (process.env[indicator] || existsSync(indicator))) {
        foundIndicators.push(indicator);
        kiroDetected = true;
      }
    }

    if (kiroDetected) {
      console.log('   ✅ Kiro IDE environment detected');
      console.log(`   📁 Indicators: ${foundIndicators.join(', ')}`);
      this.addCheck('kiro', true, 'Kiro environment detected', 'MCP integration ready');
    } else {
      console.log('   ⚠️  Kiro IDE environment not clearly detected');
      console.log('   💡 This may be normal if running outside Kiro');
      this.addCheck('kiro', 'unknown', 'Kiro environment unclear', 'May be running outside Kiro IDE');
      this.addKiroInstruction('INFO: Running outside Kiro IDE context - this is normal for testing');
    }

    // Check for MCP configuration
    if (existsSync('kiro-config-example.json')) {
      console.log('   ✅ Kiro MCP configuration template available');
      this.addRecommendation('Copy kiro-config-example.json settings to your Kiro MCP configuration');
    }
  }

  async checkDirectoryStructure() {
    console.log('\n📋 Check 6: Project Directory Structure');
    
    const requiredDirs = [
      'src',
      'dist',
      '.kiro/specs/enhanced-everything-mcp'
    ];

    const requiredFiles = [
      'package.json',
      'src/index.ts',
      '.kiro/specs/enhanced-everything-mcp/requirements.md',
      '.kiro/specs/enhanced-everything-mcp/design.md',
      '.kiro/specs/enhanced-everything-mcp/tasks.md'
    ];

    let allGood = true;

    // Check directories
    for (const dir of requiredDirs) {
      if (existsSync(dir)) {
        console.log(`   ✅ Directory exists: ${dir}`);
      } else {
        console.log(`   ❌ Missing directory: ${dir}`);
        allGood = false;
        try {
          mkdirSync(dir, { recursive: true });
          console.log(`   🔧 Created directory: ${dir}`);
        } catch (error) {
          console.log(`   ❌ Failed to create directory: ${dir}`);
        }
      }
    }

    // Check files
    for (const file of requiredFiles) {
      if (existsSync(file)) {
        console.log(`   ✅ File exists: ${file}`);
      } else {
        console.log(`   ❌ Missing file: ${file}`);
        allGood = false;
      }
    }

    if (allGood) {
      this.addCheck('structure', true, 'All required files and directories present', 'Project structure complete');
    } else {
      this.addCheck('structure', false, 'Missing required files or directories', 'Project structure incomplete');
      this.addRecommendation('Ensure all required project files are present');
      this.addKiroInstruction('PROJECT_INCOMPLETE: Some required files or directories are missing');
    }
  }

  async checkMCPServerBuild() {
    console.log('\n📋 Check 7: MCP Server Build Status');
    
    if (existsSync('dist/index.js')) {
      console.log('   ✅ Built MCP server found');
      this.addCheck('build', true, 'MCP server built', 'Ready to run');
    } else {
      console.log('   ⚠️  MCP server not built');
      console.log('   💡 Run: npm run build');
      this.addCheck('build', false, 'MCP server not built', 'Build required');
      this.addRecommendation('Run: npm run build');
      this.addKiroInstruction('BUILD_REQUIRED: Run npm run build before using MCP server');
    }

    // Check if we can import the built server
    try {
      const serverPath = join(__dirname, 'dist', 'index.js');
      if (existsSync(serverPath)) {
        console.log('   ✅ MCP server file accessible');
      }
    } catch (error) {
      console.log('   ⚠️  MCP server build may have issues');
    }
  }

  async generateKiroInstructions() {
    console.log('\n📋 Generating Kiro Agent Instructions...');
    
    const instructions = {
      setup_commands: [],
      mcp_configuration: {},
      test_commands: [],
      troubleshooting: []
    };

    // Setup commands based on check results
    const failedChecks = this.results.checks.filter(check => check.status === false);
    
    if (failedChecks.some(check => check.id === 'nodejs')) {
      instructions.setup_commands.push('Install Node.js 18+ from https://nodejs.org/');
    }
    
    if (failedChecks.some(check => check.id === 'everything')) {
      instructions.setup_commands.push('Install Everything from https://www.voidtools.com/');
      instructions.setup_commands.push('Start Everything service');
    }
    
    if (failedChecks.some(check => check.id === 'build')) {
      instructions.setup_commands.push('npm install');
      instructions.setup_commands.push('npm run build');
    }

    // MCP Configuration
    instructions.mcp_configuration = {
      "mcpServers": {
        "everything-search": {
          "command": "node",
          "args": [join(__dirname, "dist", "index.js")],
          "env": {
            "EVERYTHING_PATH": "C:\\Program Files\\Everything\\es.exe",
            "TRACE_DIRECTORY": "D:\\outputs\\traces"
          },
          "description": "Enhanced Everything search with GitHub integration",
          "autoApprove": [
            "everything_search",
            "everything_search_advanced",
            "everything_search_docs",
            "everything_check_service"
          ]
        }
      }
    };

    // Test commands
    instructions.test_commands = [
      'npm run test:kiro',
      'Test search: "Find all TypeScript files"',
      'Test docs: "Search for specification files"'
    ];

    // Save instructions for Kiro
    const instructionsPath = join(__dirname, 'kiro-setup-instructions.json');
    writeFileSync(instructionsPath, JSON.stringify(instructions, null, 2));
    console.log(`   ✅ Kiro setup instructions saved to: ${instructionsPath}`);
  }

  async executeCommand(command, args = []) {
    return new Promise((resolve) => {
      const process = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true,
        timeout: 10000
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
        resolve({
          success: code === 0,
          output: stdout,
          error: stderr,
          code
        });
      });

      process.on('error', (error) => {
        resolve({
          success: false,
          output: '',
          error: error.message,
          code: -1
        });
      });
    });
  }

  addCheck(id, status, description, details) {
    this.results.checks.push({
      id,
      status,
      description,
      details,
      timestamp: new Date().toISOString()
    });
  }

  addRecommendation(recommendation) {
    this.results.recommendations.push(recommendation);
  }

  addKiroInstruction(instruction) {
    this.results.kiroInstructions.push(instruction);
  }

  summarizeResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PRE-FLIGHT CHECK SUMMARY');
    console.log('='.repeat(60));

    const passed = this.results.checks.filter(c => c.status === true).length;
    const failed = this.results.checks.filter(c => c.status === false).length;
    const warnings = this.results.checks.filter(c => c.status === 'partial' || c.status === 'optional').length;

    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️  Warnings: ${warnings}`);

    if (failed === 0) {
      this.results.overall = 'ready';
      console.log('\n🎉 SYSTEM READY FOR KIRO INTEGRATION!');
    } else if (failed <= 2) {
      this.results.overall = 'needs-setup';
      console.log('\n⚠️  SYSTEM NEEDS MINOR SETUP');
    } else {
      this.results.overall = 'not-ready';
      console.log('\n❌ SYSTEM NOT READY - MAJOR ISSUES DETECTED');
    }

    if (this.results.recommendations.length > 0) {
      console.log('\n📋 RECOMMENDATIONS:');
      this.results.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    }

    if (this.results.kiroInstructions.length > 0) {
      console.log('\n🤖 KIRO AGENT INSTRUCTIONS:');
      this.results.kiroInstructions.forEach((inst, i) => {
        console.log(`   ${i + 1}. ${inst}`);
      });
    }

    console.log('\n📁 Setup files created:');
    console.log('   - kiro-setup-instructions.json (Kiro configuration)');
    console.log('   - preflight-results.json (Detailed results)');

    // Save detailed results
    writeFileSync('preflight-results.json', JSON.stringify(this.results, null, 2));
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new PreflightChecker();
  checker.runAllChecks().then((results) => {
    process.exit(results.overall === 'ready' ? 0 : 1);
  }).catch((error) => {
    console.error('❌ Pre-flight check failed:', error);
    process.exit(1);
  });
}