import { execFileSync } from 'node:child_process';
const scripts = ['render-home.mjs', 'render-mental-home.mjs', 'render-report-demo.mjs', 'render-report-preview.mjs', 'render-seo.mjs'];
for (const script of scripts) execFileSync(process.execPath, [`scripts/${script}`], { stdio: 'inherit' });
execFileSync(process.execPath, ['--check', 'worker/index.mjs'], { stdio: 'inherit' });
// Workers serves /auth-config.mjs dynamically from its own public binding.
// The GitHub Pages workflow remains separate and injects its existing public key.
console.log('Website assets ready. Worker public configuration is supplied at runtime.');
