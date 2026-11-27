import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

const bundle = await build({ entryPoints: ['src/main.jsx'], bundle: true, minify: true, write: false, format: 'iife', loader: { '.css': 'empty' }, define: { 'process.env.NODE_ENV': '"production"' } });
const css = await readFile('src/styles.css', 'utf8');
const script = bundle.outputFiles[0].text.replaceAll('</script', '<\/script');
await writeFile('dist/coffeer.html', '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Coffeer — a fair share of good coffee</title><style>' + css + '</style></head><body><div id="root"></div><script>' + script + '</script></body></html>');
console.log('Standalone app: dist/coffeer.html');
