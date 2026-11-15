// Starts the backend (port 8787) and the Vite dev server together.
import { spawn } from 'node:child_process';
const run = (cmd, args) => spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
const api = run('node', ['backend/server.js']);
const web = run('npx', ['vite']);
const stop = () => { api.kill(); web.kill(); process.exit(); };
process.on('SIGINT', stop); process.on('SIGTERM', stop);
web.on('exit', stop); api.on('exit', c => { if (c) console.log('Backend stopped with code', c); });
