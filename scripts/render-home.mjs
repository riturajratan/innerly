import { readFile, writeFile } from 'node:fs/promises';
import { discoveryHomeMarkup } from '../dist/start-experience.mjs';

const page = new URL('../dist/index.html', import.meta.url);
const source = await readFile(page, 'utf8');
const main = /(<main\b[^>]*id="app"[^>]*>)[\s\S]*?(<\/main>)/;
if (!main.test(source)) throw new Error('Missing homepage render target');
await writeFile(page, source.replace(main, (_, open, close) => `${open}${discoveryHomeMarkup({})}${close}`));
console.log('Rendered the public homepage into static HTML.');
