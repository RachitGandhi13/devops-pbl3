// Smoke test: start the app on port 3999, call /health, expect HTTP 200
const { spawn } = require('child_process');
const http = require('http');
const app = spawn('node', ['app.js'], { env: { ...process.env, PORT: '3999' } });
setTimeout(() => {
  http.get('http://localhost:3999/health', res => {
    console.log('Health check status:', res.statusCode);
    app.kill();
    process.exit(res.statusCode === 200 ? 0 : 1);
  }).on('error', err => { console.error(err.message); app.kill(); process.exit(1); });
}, 1500);
