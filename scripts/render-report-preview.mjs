import {writeFile} from 'node:fs/promises';
import {reportConceptPage} from '../dist/report-concept-view.mjs?v=highlights-1';
await writeFile(new URL('../dist/report-preview.html',import.meta.url),reportConceptPage());
console.log('Rendered the six-area report preview at report-preview.html.');
