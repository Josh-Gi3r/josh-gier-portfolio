import { defineConfig } from 'vite';

export default defineConfig({
  root: 'dist',
  server: {host: '0.0.0.0', allowedHosts: ['terminal.local']},
  plugins: [{
    name: 'responsive-review',
    configureServer(server) {
      server.middlewares.use('/__review', (req,res) => {
        const args = new URL(req.url, 'http://terminal.local').searchParams;
        const requestedWidth = Number(args.get('width'));
        const width = [320,390,768,1440,1920].includes(requestedWidth) ? requestedWidth : 390;
        const allowed = ['room','campaigns','products','about','contact','work'];
        const requested = args.get('view') || 'room';
        const view = allowed.includes(requested) || /^(case|product)\/[a-z0-9-]+$/.test(requested) ? requested : 'room';
        const entry = args.get('study') === 'room' ? 'room-study.html' : args.get('study') === 'portable' ? 'room-study-portable.html' : 'index.html';
        res.setHeader('Content-Type', 'text/html');
        res.end(`<!doctype html><html><head><title>Portfolio responsive review</title><style>body{margin:0;background:#333;font:14px Arial;color:white}header{padding:12px}a{color:white;margin-right:20px}iframe{display:block;border:0;width:${width}px;height:844px;background:#111}</style></head><body><header>${width}px viewport <a href="/">Full desktop view</a><a href="/__review?width=390&view=campaigns">Mobile TV</a><a href="/__review?width=390&view=products">Mobile computer</a><a href="/__review?width=768&view=products">Tablet computer</a></header><iframe title="Portfolio at ${width} pixels" src="/${entry}#${view}"></iframe></body></html>`);
      });
    }
  }]
});
