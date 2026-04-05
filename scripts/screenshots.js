// scripts/screenshots.js
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '../src/assets/proyectos');
mkdirSync(outDir, { recursive: true });

const proyectos = [
  { nombre: 'pimbalu',        url: 'https://pimbalu.vercel.app/' },
  { nombre: 'lumiere',        url: 'https://webpeluqueria.vercel.app/' },
  { nombre: 'indicadores-bc', url: 'https://indicadores-bc.vercel.app/' },
];

const browser = await puppeteer.launch({ headless: true });

for (const { nombre, url } of proyectos) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  console.log(`📸 Capturando ${url} ...`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  const outPath = resolve(outDir, `${nombre}.png`);
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1280, height: 600 } });
  console.log(`   ✓ Guardado en src/assets/proyectos/${nombre}.png`);
  await page.close();
}

await browser.close();
console.log('\n✅ Screenshots generados.');
