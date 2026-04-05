# Proyectos Thumbnails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el gradiente + emoji del thumbnail en cada card de Proyectos por una captura de pantalla real del sitio correspondiente, optimizada con `<Image>` de Astro.

**Architecture:** Un script Node.js con Puppeteer genera los PNG en `src/assets/proyectos/` en un solo paso manual. Astro convierte los PNG a WebP optimizado durante el build vía su componente `<Image>`. El componente `Proyectos.astro` importa las imágenes estáticamente.

**Tech Stack:** Puppeteer (devDependency), Astro `<Image>` component, Node.js 22

---

### Task 1: Instalar Puppeteer como devDependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Instalar puppeteer**

```bash
npm install --save-dev puppeteer
```

- [ ] **Step 2: Verificar instalación**

```bash
node -e "import('puppeteer').then(m => console.log('ok', m.default))"
```

Expected output: `ok [Function: ...]` (sin errores)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add puppeteer as devDependency for screenshot script"
```

---

### Task 2: Crear carpeta de assets y script de screenshots

**Files:**
- Create: `src/assets/proyectos/.gitkeep`
- Create: `scripts/screenshots.js`

- [ ] **Step 1: Crear carpeta de assets**

```bash
mkdir -p src/assets/proyectos
touch src/assets/proyectos/.gitkeep
```

- [ ] **Step 2: Crear `scripts/screenshots.js`**

```js
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
```

- [ ] **Step 3: Commit**

```bash
git add src/assets/proyectos/.gitkeep scripts/screenshots.js
git commit -m "feat: add Puppeteer screenshot script for project thumbnails"
```

---

### Task 3: Ejecutar el script y verificar las imágenes

**Files:**
- Create (generated): `src/assets/proyectos/pimbalu.png`
- Create (generated): `src/assets/proyectos/lumiere.png`
- Create (generated): `src/assets/proyectos/indicadores-bc.png`

- [ ] **Step 1: Ejecutar el script**

```bash
node scripts/screenshots.js
```

Expected output:
```
📸 Capturando https://pimbalu.vercel.app/ ...
   ✓ Guardado en src/assets/proyectos/pimbalu.png
📸 Capturando https://webpeluqueria.vercel.app/ ...
   ✓ Guardado en src/assets/proyectos/lumiere.png
📸 Capturando https://indicadores-bc.vercel.app/ ...
   ✓ Guardado en src/assets/proyectos/indicadores-bc.png

✅ Screenshots generados.
```

- [ ] **Step 2: Verificar que los archivos existen y tienen tamaño razonable**

```bash
ls -lh src/assets/proyectos/*.png
```

Expected: 3 archivos PNG, cada uno entre 200KB y 2MB.

- [ ] **Step 3: Commit de las imágenes**

```bash
git add src/assets/proyectos/pimbalu.png src/assets/proyectos/lumiere.png src/assets/proyectos/indicadores-bc.png
git commit -m "feat: add project screenshots for portfolio thumbnails"
```

---

### Task 4: Actualizar Proyectos.astro para usar las imágenes

**Files:**
- Modify: `src/components/Proyectos.astro`

- [ ] **Step 1: Reemplazar el contenido completo de `Proyectos.astro`**

```astro
---
// src/components/Proyectos.astro
import { ArrowUpRight } from 'lucide-astro';
import { Image } from 'astro:assets';
import imgPimbalu from '../assets/proyectos/pimbalu.png';
import imgLumiere from '../assets/proyectos/lumiere.png';
import imgIndicadoresBc from '../assets/proyectos/indicadores-bc.png';

const proyectos = [
  {
    nombre: 'Pimbalú Delicias Caseras',
    desc: 'Sitio para negocio de dulces artesanales con catálogo y pedidos vía WhatsApp y delivery a domicilio.',
    url: 'https://pimbalu.vercel.app/',
    tags: ['Astro', 'E-commerce'],
    img: imgPimbalu,
  },
  {
    nombre: 'Lumière — Peluquería',
    desc: 'Sitio premium para salón de belleza con catálogo de servicios, precios y reserva online.',
    url: 'https://webpeluqueria.vercel.app/',
    tags: ['Next.js', 'Tailwind'],
    img: imgLumiere,
  },
  {
    nombre: 'Indicadores BC',
    desc: 'Calculadora de conversión de divisas con tasas en tiempo real del Banco Central de Chile.',
    url: 'https://indicadores-bc.vercel.app/',
    tags: ['Web App', 'API'],
    img: imgIndicadoresBc,
  },
];
---
<section id="proyectos" class="bg-cream py-20 px-6">
  <div class="max-w-6xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-12 reveal">
      <p class="text-teal text-xs font-semibold tracking-widest uppercase mb-3">Portafolio</p>
      <h2 class="font-display text-navy-darkest text-4xl font-bold">
        Proyectos que <span class="text-navy-mid">hablan</span> por nosotros
      </h2>
      <p class="text-navy-dark/60 text-base mt-4 max-w-lg mx-auto leading-relaxed">
        Algunos de los productos que hemos construido junto a nuestros clientes.
      </p>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {proyectos.map((p) => (
        <article class="reveal border border-navy-mid/10 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-mid/10 transition-all duration-300">

          <!-- Thumbnail -->
          <div class="h-40 overflow-hidden">
            <Image
              src={p.img}
              alt={`Captura de pantalla de ${p.nombre}`}
              width={640}
              height={300}
              format="webp"
              quality={85}
              class="w-full h-full object-cover object-top"
            />
          </div>

          <!-- Body -->
          <div class="p-5">
            <h3 class="text-navy-darkest font-bold text-sm mb-2">{p.nombre}</h3>
            <p class="text-navy-dark/60 text-xs leading-relaxed mb-3">{p.desc}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              {p.tags.map((tag) => (
                <span class="bg-navy-mid text-cream text-xs font-semibold px-2 py-1 rounded">{tag}</span>
              ))}
            </div>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-teal text-xs font-semibold hover:underline"
            >
              Ver proyecto <ArrowUpRight size={13} />
            </a>
          </div>

        </article>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Verificar que el build compila sin errores**

```bash
npm run build
```

Expected: `✓ Completed` sin errores. Las imágenes aparecerán en el output de `generating optimized images`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Proyectos.astro
git commit -m "feat: replace emoji thumbnails with real project screenshots in Proyectos"
```

---

### Task 5: Push a main

- [ ] **Step 1: Push**

```bash
git push origin HEAD:main
```

Expected: `main` actualizado en GitHub sin conflictos.
