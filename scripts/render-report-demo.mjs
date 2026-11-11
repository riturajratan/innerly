import {readFile,writeFile} from 'node:fs/promises';
import {sampleReportData} from '../dist/sample-report.mjs';
import {sampleReportMarkup} from '../dist/sample-report-view.mjs';
const source=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const sample=sampleReportData();
const html=source
 .replace('<body class="mh-home-page">','<body class="mh-home-page" data-report-demo="true">')
 .replace(/<title>[^<]*<\/title>/,'<title>Innerly — Interactive sample report</title>')
 .replace('<meta name="robots" content="index,follow">','<meta name="robots" content="noindex,follow">')
 .replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="https://www.riturajratan.com/innerly/report-demo.html">')
 .replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="Explore an interactive Innerly sample report with six visual dimensions and illustrative answers.">')
 .replace(/<meta property="og:title" content="[^"]*">/,'<meta property="og:title" content="Innerly — Interactive sample report">')
 .replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="https://www.riturajratan.com/innerly/report-demo.html">')
 .replace(/<link rel="preload" as="image"[^>]*>/,'')
 .replace('<button id="mh-history">','<button id="mh-history" hidden>')
 .replace(/<main id="app"[^>]*>.*?<\/main>/s,`<main id="app" tabindex="-1">${sampleReportMarkup({...sample,language:'en'})}</main>`)
 .replace(/<script type="application\/ld\+json">.*?<\/script>/,'');
if(!html.includes('data-report-demo="true"'))throw new Error('Sample report page could not be configured.');
await writeFile(new URL('../dist/report-demo.html',import.meta.url),html);
console.log('Rendered the interactive sample report page.');
