
const { exec } = require('child_process');

const tools = [
    { name: 'gemini', install_url: 'https://cloud.google.com/sdk/docs/install' },
    { name: 'claude', install_url: 'https://docs.anthropic.com/claude/docs/cli-setup' },
    { name: 'gibson', install_url: '' },
    { name: 'gh', install_url: 'https://github.com/cli/cli#installation' },
    { name: 'es', install_url: 'https://www.voidtools.com/support/everything/command_line_interface/' },
    { name: 'vercel', install_url: 'https://vercel.com/docs/cli#installation' },
    { name: 'v0', install_url: 'https://v0.dev/docs/getting-started/cli' },
    { name: 'yo', install_url: 'https://yeoman.io/learning/installing-yeoman.html' }
];

tools.forEach(tool => {
    exec(`${tool.name} --version`, (error, stdout, stderr) => {
        if (error) {
            console.log(`${tool.name}: Not Found`);
            if (tool.install_url) {
                console.log(`  To install, please visit: ${tool.install_url}`);
            } else {
                console.log(`  Installation instructions not found.`);
            }
            return;
        }
        console.log(`${tool.name}: Found`);
    });
});
