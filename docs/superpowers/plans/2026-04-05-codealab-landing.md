# CodeaLab Landing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescribir el sitio de CodeaLab como un proyecto Astro con Tailwind CSS v4, SEO optimizado, diseño Duality (navbar/contenido claro, hero/proceso/CTA oscuro), 9 secciones en una sola página, usando el logo SVG existente y los assets en `/img`.

**Architecture:** Proyecto Astro SSG con un layout base (`BaseLayout.astro`) que maneja todo el SEO. La página `index.astro` ensambla 9 componentes en orden. Los estilos globales (paleta, fuentes, reset) viven en `src/styles/global.css` e importados vía Tailwind. Las animaciones de scroll son CSS puro + IntersectionObserver en un script inline mínimo.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@astrojs/tailwind`), `lucide-astro`, `@astrojs/sitemap`, `@fontsource/inter`, `@fontsource/space-grotesk`

---

## File Map

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `package.json` | Crear | Dependencias del proyecto |
| `astro.config.mjs` | Crear | Config Astro + integraciones (tailwind, sitemap) |
| `tailwind.config.mjs` | Crear | Paleta de colores personalizada |
| `src/styles/global.css` | Crear | Variables CSS, reset, estilos base |
| `src/layouts/BaseLayout.astro` | Crear | `<head>` con SEO completo, fonts, JSON-LD |
| `src/pages/index.astro` | Crear | Ensambla todos los componentes |
| `src/components/Navbar.astro` | Crear | Logo + links + CTA, scroll blur |
| `src/components/Hero.astro` | Crear | Split hero: texto + img/hero.jpg |
| `src/components/Servicios.astro` | Crear | Grid 3×2 con Lucide icons |
| `src/components/Proceso.astro` | Crear | 4 pasos con conectores |
| `src/components/Proyectos.astro` | Crear | 3 cards con links a proyectos reales |
| `src/components/Testimonios.astro` | Crear | 3 testimonios con avatar iniciales |
| `src/components/CTABand.astro` | Crear | Headline + CTA button |
| `src/components/Contacto.astro` | Crear | Info + formulario con validación |
| `src/components/Footer.astro` | Crear | Logo blanco + copyright + redes |
| `public/robots.txt` | Crear | Directivas para crawlers |
| `public/favicon.svg` | Crear | Favicon usando el logo |

---

## Task 1: Inicializar proyecto Astro

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`

- [ ] **Step 1: Crear el proyecto Astro desde cero**

Ejecutar en la raíz del repo (donde está el `index.html` actual):

```bash
npm create astro@latest . -- --template minimal --no-git --install --typescript strict
```

Cuando pregunte si sobrescribir archivos existentes, responder **No** (conservar `img/` y `docs/`).

- [ ] **Step 2: Instalar dependencias**

```bash
npm install @astrojs/tailwind @astrojs/sitemap tailwindcss@next @fontsource/inter @fontsource/space-grotesk lucide-astro
```

- [ ] **Step 3: Configurar astro.config.mjs**

Reemplazar el contenido generado con:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://codealab.dev',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
});
```

- [ ] **Step 4: Configurar tailwind.config.mjs**

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'navy-darkest': '#0A1128',
        'navy-dark':    '#001F54',
        'navy-mid':     '#034078',
        'teal':         '#1282A2',
        'cream':        '#FEFCFB',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: Crear src/styles/global.css**

```css
/* src/styles/global.css */
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/space-grotesk/700.css';
@import '@fontsource/space-grotesk/800.css';
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
    font-family: 'Inter', system-ui, sans-serif;
  }
  body {
    @apply bg-cream text-navy-dark antialiased;
  }
}

/* Scroll reveal — estado inicial */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 6: Verificar que el proyecto compila**

```bash
npm run dev
```

Esperado: servidor corriendo en `http://localhost:4321` sin errores en consola.

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs tailwind.config.mjs tsconfig.json package.json package-lock.json src/styles/global.css
git commit -m "feat: initialize Astro project with Tailwind v4 and dependencies"
```

---

## Task 2: BaseLayout y SEO

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/robots.txt`
- Create: `public/favicon.svg`

- [ ] **Step 1: Crear src/layouts/BaseLayout.astro**

```astro
---
// src/layouts/BaseLayout.astro
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
}

const {
  title = 'CodeaLab — Desarrollo Web y Software a Medida',
  description = 'CodeaLab construye aplicaciones web, apps móviles y APIs robustas a medida. Soluciones digitales que escalan con tu negocio. Buenos Aires, Argentina.',
  ogImage = '/og-image.jpg',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CodeaLab',
  url: 'https://codealab.dev',
  logo: 'https://codealab.dev/logo.svg',
  description,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Buenos Aires',
    addressCountry: 'AR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hola@codealab.dev',
    contactType: 'customer support',
  },
  sameAs: [
    'https://linkedin.com/company/codealab',
    'https://github.com/codealab',
  ],
};
---
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="canonical" href={canonicalURL} />

    <!-- Primary -->
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content="index, follow" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(ogImage, Astro.site)} />
    <meta property="og:locale" content="es_AR" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={new URL(ogImage, Astro.site)} />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- JSON-LD -->
    <script type="application/ld+json" set:html={JSON.stringify(schema)} />
  </head>
  <body>
    <slot />

    <!-- Scroll reveal -->
    <script>
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1 }
      );
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    </script>
  </body>
</html>
```

- [ ] **Step 2: Crear public/robots.txt**

```txt
User-agent: *
Allow: /

Sitemap: https://codealab.dev/sitemap-index.xml
```

- [ ] **Step 3: Crear public/favicon.svg**

Copiar el logo SVG y adaptarlo como favicon (solo el ícono del matraz, sin texto):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68.2 72">
  <rect width="68.2" height="72" rx="8" fill="#034078"/>
  <path fill="#FEFCFB" d="M34,2.64h2.62V11.5a1.31,1.31,0,0,1-2.62,0ZM39.27,2.64h2.62V21.71A1.31,1.31,0,0,1,39.27,21.71ZM45.93,58.65H35.35V38.25h2.38V56.49h8.2Z"/>
  <polygon fill="#FEFCFB" points="32.72 38.24 32.73 40.81 23.89 48.47 32.73 56.13 32.72 58.67 20.94 48.45 32.72 38.24"/>
  <path fill="#1282A2" d="M22.26,30.68h0a1.32,1.32,0,0,0,1.32-1.32V11.08L17.09,2.64H51l-6.5,8.44v20L64.78,63.62a5,5,0,0,1,0,5.3,5.19,5.19,0,0,1-4.48,2.49H7.77a5.24,5.24,0,0,1-4.64-2.7,5.07,5.07,0,0,1-.47-1.26,1.33,1.33,0,0,0-1.29-1h0A1.32,1.32,0,0,0,.09,68.05a7.76,7.76,0,0,0,.82,2.1,7.89,7.89,0,0,0,6.86,3.9H60.45A7.74,7.74,0,0,0,67,62.23L47.14,30.3V12L56.35,0H11.73L21,12V29.36A1.32,1.32,0,0,0,22.26,30.68Z"/>
</svg>
```

- [ ] **Step 4: Crear src/pages/index.astro (esqueleto)**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout>
  <main>
    <!-- componentes irán aquí -->
    <p class="text-navy-darkest p-8">CodeaLab — en construcción</p>
  </main>
</BaseLayout>
```

- [ ] **Step 5: Verificar build**

```bash
npm run build
```

Esperado: carpeta `dist/` generada sin errores. Debe existir `dist/sitemap-index.xml`.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro public/robots.txt public/favicon.svg
git commit -m "feat: add BaseLayout with full SEO, JSON-LD schema, and robots.txt"
```

---

## Task 3: Navbar

**Files:**
- Create: `src/components/Navbar.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear src/components/Navbar.astro**

```astro
---
// src/components/Navbar.astro
---
<header
  id="navbar"
  class="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-navy-mid/10 transition-all duration-300"
>
  <nav class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

    <!-- Logo -->
    <a href="/" class="flex items-center gap-2" aria-label="CodeaLab inicio">
      <!-- Versión dark del logo para navbar claro: aplicamos filter para convertir blanco a navy -->
      <img
        src="/img/Negativo B Texto.svg"
        alt="CodeaLab"
        width="110"
        height="40"
        class="h-8 w-auto"
        style="filter: invert(1) sepia(1) saturate(3) hue-rotate(190deg) brightness(0.35);"
      />
    </a>

    <!-- Links desktop -->
    <ul class="hidden md:flex items-center gap-8">
      <li><a href="#servicios" class="text-navy-dark text-sm font-medium hover:text-teal transition-colors">Servicios</a></li>
      <li><a href="#proceso" class="text-navy-dark text-sm font-medium hover:text-teal transition-colors">Proceso</a></li>
      <li><a href="#proyectos" class="text-navy-dark text-sm font-medium hover:text-teal transition-colors">Proyectos</a></li>
      <li><a href="#testimonios" class="text-navy-dark text-sm font-medium hover:text-teal transition-colors">Testimonios</a></li>
    </ul>

    <!-- CTA -->
    <a
      href="#contacto"
      class="bg-navy-mid text-cream text-sm font-semibold px-5 py-2 rounded-md hover:bg-teal transition-colors"
    >
      Contáctanos
    </a>
  </nav>
</header>

<!-- Spacer para compensar el fixed navbar -->
<div class="h-16"></div>

<script>
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('backdrop-blur-md', 'bg-cream/90');
    } else {
      navbar?.classList.remove('backdrop-blur-md', 'bg-cream/90');
    }
  });
</script>
```

- [ ] **Step 2: Agregar Navbar a index.astro**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
---
<BaseLayout>
  <Navbar />
  <main>
    <p class="text-navy-darkest p-8">Secciones en construcción...</p>
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verificar visualmente**

```bash
npm run dev
```

Abrir `http://localhost:4321`. Verificar: logo visible en navbar, links presentes, CTA button con fondo navy. Al scrollear debe agregar blur.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navbar.astro src/pages/index.astro
git commit -m "feat: add fixed Navbar with scroll blur and anchor links"
```

---

## Task 4: Hero

**Files:**
- Create: `src/components/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear src/components/Hero.astro**

```astro
---
// src/components/Hero.astro
import { Image } from 'astro:assets';
import heroImg from '../../img/hero.jpg';
---
<section class="bg-gradient-to-br from-navy-darkest via-navy-dark to-navy-mid py-20 px-6">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[420px]">

    <!-- Texto -->
    <div class="reveal">
      <p class="text-teal text-xs font-semibold tracking-widest uppercase mb-4">
        Desarrollo de software a medida
      </p>
      <h1 class="font-display text-cream text-5xl font-extrabold leading-tight mb-6">
        Código que<br />
        <span class="text-teal">transforma</span><br />
        negocios.
      </h1>
      <p class="text-cream/60 text-base leading-relaxed mb-8 max-w-md">
        Construimos aplicaciones web, apps móviles y APIs robustas que escalan con tu empresa.
      </p>
      <div class="flex flex-wrap gap-4">
        <a
          href="#proyectos"
          class="bg-teal text-cream font-semibold px-6 py-3 rounded-md hover:bg-teal/90 transition-colors"
        >
          Ver proyectos →
        </a>
        <a
          href="#contacto"
          class="border border-cream/30 text-cream font-medium px-6 py-3 rounded-md hover:border-cream/60 transition-colors"
        >
          Hablar con nosotros
        </a>
      </div>
    </div>

    <!-- Imagen -->
    <div class="reveal">
      <Image
        src={heroImg}
        alt="CodeaLab — Desarrollo de software"
        width={560}
        height={560}
        class="w-full aspect-square object-cover rounded-xl"
        loading="eager"
      />
    </div>

  </div>
</section>
```

- [ ] **Step 2: Agregar Hero a index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
---
<BaseLayout>
  <Navbar />
  <main>
    <Hero />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verificar**

```bash
npm run dev
```

Verificar: hero con gradiente navy, título en blanco con acento teal, imagen a la derecha, botones funcionales.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add Hero section with split layout and optimized image"
```

---

## Task 5: Servicios

**Files:**
- Create: `src/components/Servicios.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear src/components/Servicios.astro**

```astro
---
// src/components/Servicios.astro
import { Monitor, Smartphone, Server, PenTool, ShoppingBag, Lightbulb } from 'lucide-astro';

const servicios = [
  {
    icon: Monitor,
    nombre: 'Desarrollo Web',
    desc: 'Aplicaciones web modernas, rápidas y escalables.',
    tags: ['React', 'Next.js', 'Vue'],
  },
  {
    icon: Smartphone,
    nombre: 'Apps Móviles',
    desc: 'Experiencias nativas e híbridas para iOS y Android.',
    tags: ['React Native', 'Flutter'],
  },
  {
    icon: Server,
    nombre: 'Backend & APIs',
    desc: 'Arquitecturas robustas, seguras y de alto rendimiento.',
    tags: ['Node', 'Python', 'AWS'],
  },
  {
    icon: PenTool,
    nombre: 'UI/UX Design',
    desc: 'Interfaces que enamoran y convierten usuarios en clientes.',
    tags: ['Figma', 'Design Systems'],
  },
  {
    icon: ShoppingBag,
    nombre: 'E-commerce',
    desc: 'Tiendas online que venden más, con mejor experiencia.',
    tags: ['Shopify', 'WooCommerce'],
  },
  {
    icon: Lightbulb,
    nombre: 'Consultoría Tech',
    desc: 'Arquitectura, code review y estrategia de producto.',
    tags: ['DevOps', 'Code Review'],
  },
];
---
<section id="servicios" class="bg-cream py-20 px-6">
  <div class="max-w-6xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-12 reveal">
      <p class="text-teal text-xs font-semibold tracking-widest uppercase mb-3">Lo que hacemos</p>
      <h2 class="font-display text-navy-darkest text-4xl font-extrabold">
        Servicios que <span class="text-navy-mid">impulsan</span> tu negocio
      </h2>
      <p class="text-navy-dark/60 text-base mt-4 max-w-lg mx-auto leading-relaxed">
        Soluciones digitales completas, desde el diseño hasta el despliegue en producción.
      </p>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {servicios.map((s) => (
        <article class="reveal border border-navy-mid/10 rounded-xl p-7 hover:border-teal hover:shadow-lg hover:shadow-teal/10 transition-all duration-300 group">
          <div class="w-10 h-10 bg-navy-mid rounded-lg flex items-center justify-center mb-5 text-cream group-hover:bg-teal transition-colors">
            <s.icon size={20} />
          </div>
          <h3 class="text-navy-darkest font-bold text-base mb-2">{s.nombre}</h3>
          <p class="text-navy-dark/60 text-sm leading-relaxed mb-4">{s.desc}</p>
          <div class="flex flex-wrap gap-2">
            {s.tags.map((tag) => (
              <span class="bg-navy-mid text-cream text-xs font-semibold px-2 py-1 rounded">{tag}</span>
            ))}
          </div>
        </article>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Agregar Servicios a index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import Servicios from '../components/Servicios.astro';
---
<BaseLayout>
  <Navbar />
  <main>
    <Hero />
    <Servicios />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verificar**

```bash
npm run dev
```

Verificar: 6 cards con iconos Lucide, tags de tecnologías, hover con borde teal.

- [ ] **Step 4: Commit**

```bash
git add src/components/Servicios.astro src/pages/index.astro
git commit -m "feat: add Servicios section with Lucide icons and tech tags"
```

---

## Task 6: Proceso

**Files:**
- Create: `src/components/Proceso.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear src/components/Proceso.astro**

```astro
---
// src/components/Proceso.astro
const pasos = [
  {
    num: '01',
    titulo: 'Descubrimiento',
    desc: 'Entendemos tu negocio, metas y usuarios para definir la solución ideal.',
  },
  {
    num: '02',
    titulo: 'Diseño',
    desc: 'Wireframes, prototipo y sistema de diseño validado contigo antes de codear.',
  },
  {
    num: '03',
    titulo: 'Desarrollo',
    desc: 'Sprints cortos con entregas continuas. Código limpio, testeable y documentado.',
  },
  {
    num: '04',
    titulo: 'Lanzamiento',
    desc: 'Deploy, monitoreo y soporte post-lanzamiento. Tu éxito es el nuestro.',
  },
];
---
<section id="proceso" class="bg-gradient-to-br from-navy-darkest to-navy-mid py-20 px-6">
  <div class="max-w-6xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-12 reveal">
      <p class="text-teal text-xs font-semibold tracking-widest uppercase mb-3">Cómo trabajamos</p>
      <h2 class="font-display text-cream text-4xl font-extrabold">
        Un proceso <span class="text-teal">probado</span> y transparente
      </h2>
      <p class="text-cream/50 text-base mt-4 max-w-lg mx-auto leading-relaxed">
        Cada proyecto sigue un flujo claro que minimiza riesgos y maximiza resultados.
      </p>
    </div>

    <!-- Pasos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {pasos.map((paso, i) => (
        <div class="reveal relative">
          <!-- Conector (todos menos el último) -->
          {i < pasos.length - 1 && (
            <div class="hidden lg:block absolute top-5 left-12 right-0 h-px bg-gradient-to-r from-teal to-teal/20" />
          )}
          <div class="w-11 h-11 border-2 border-teal rounded-full flex items-center justify-center text-teal font-extrabold text-sm mb-5 relative bg-navy-darkest">
            {paso.num}
          </div>
          <h3 class="text-cream font-bold text-sm mb-2">{paso.titulo}</h3>
          <p class="text-cream/50 text-xs leading-relaxed">{paso.desc}</p>
        </div>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Agregar Proceso a index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import Servicios from '../components/Servicios.astro';
import Proceso from '../components/Proceso.astro';
---
<BaseLayout>
  <Navbar />
  <main>
    <Hero />
    <Servicios />
    <Proceso />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verificar**

```bash
npm run dev
```

Verificar: 4 pasos sobre fondo oscuro, conectores visibles en desktop, números circulares en teal.

- [ ] **Step 4: Commit**

```bash
git add src/components/Proceso.astro src/pages/index.astro
git commit -m "feat: add Proceso section with step connectors on dark background"
```

---

## Task 7: Proyectos

**Files:**
- Create: `src/components/Proyectos.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear src/components/Proyectos.astro**

```astro
---
// src/components/Proyectos.astro
import { ArrowUpRight } from 'lucide-astro';

const proyectos = [
  {
    nombre: 'Pimbalú Delicias Caseras',
    desc: 'Sitio para negocio de dulces artesanales con catálogo y pedidos vía WhatsApp y delivery a domicilio.',
    url: 'https://pimbalu.vercel.app/',
    tags: ['Astro', 'E-commerce'],
    gradientFrom: '#6B21A8',
    gradientTo: '#9333EA',
    emoji: '🍭',
  },
  {
    nombre: 'Lumière — Peluquería',
    desc: 'Sitio premium para salón de belleza con catálogo de servicios, precios y reserva online.',
    url: 'https://webpeluqueria.vercel.app/',
    tags: ['Next.js', 'Tailwind'],
    gradientFrom: '#1a1a2e',
    gradientTo: '#16213e',
    emoji: '✂️',
  },
  {
    nombre: 'Indicadores BC',
    desc: 'Calculadora de conversión de divisas con tasas en tiempo real del Banco Central de Chile.',
    url: 'https://indicadores-bc.vercel.app/',
    tags: ['Web App', 'API'],
    gradientFrom: '#034078',
    gradientTo: '#1282A2',
    emoji: '💱',
  },
];
---
<section id="proyectos" class="bg-cream py-20 px-6">
  <div class="max-w-6xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-12 reveal">
      <p class="text-teal text-xs font-semibold tracking-widest uppercase mb-3">Portafolio</p>
      <h2 class="font-display text-navy-darkest text-4xl font-extrabold">
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
          <div
            class="h-36 flex items-center justify-center"
            style={`background: linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo});`}
          >
            <div class="text-center text-white">
              <div class="text-4xl mb-1">{p.emoji}</div>
              <div class="text-xs font-semibold opacity-80">{p.nombre}</div>
            </div>
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

- [ ] **Step 2: Agregar Proyectos a index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import Servicios from '../components/Servicios.astro';
import Proceso from '../components/Proceso.astro';
import Proyectos from '../components/Proyectos.astro';
---
<BaseLayout>
  <Navbar />
  <main>
    <Hero />
    <Servicios />
    <Proceso />
    <Proyectos />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verificar**

```bash
npm run dev
```

Verificar: 3 cards con thumbnails de color, links abriendo en nueva pestaña, hover con elevación.

- [ ] **Step 4: Commit**

```bash
git add src/components/Proyectos.astro src/pages/index.astro
git commit -m "feat: add Proyectos section with real project cards and external links"
```

---

## Task 8: Testimonios

**Files:**
- Create: `src/components/Testimonios.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear src/components/Testimonios.astro**

```astro
---
// src/components/Testimonios.astro
const testimonios = [
  {
    texto: 'CodeaLab transformó nuestra plataforma en tiempo récord. La calidad del código y la comunicación fueron excepcionales.',
    nombre: 'Martín Rodríguez',
    rol: 'CTO — PlataformaPro',
    iniciales: 'MR',
  },
  {
    texto: 'El equipo entendió nuestra visión desde el día uno. El resultado superó todas nuestras expectativas de diseño y performance.',
    nombre: 'Sofía López',
    rol: 'Fundadora — ShopLux',
    iniciales: 'SL',
  },
  {
    texto: 'Proceso claro, entregas puntuales y código de primer nivel. Los recomendaría sin dudar a cualquier startup.',
    nombre: 'Andrés Castillo',
    rol: 'CEO — HealthTrack',
    iniciales: 'AC',
  },
];
---
<section id="testimonios" class="bg-navy-dark/5 border-y border-navy-mid/10 py-20 px-6">
  <div class="max-w-6xl mx-auto">

    <!-- Header -->
    <div class="text-center mb-12 reveal">
      <p class="text-teal text-xs font-semibold tracking-widest uppercase mb-3">Clientes</p>
      <h2 class="font-display text-navy-darkest text-4xl font-extrabold">
        Lo que dicen quienes <span class="text-navy-mid">confían</span> en nosotros
      </h2>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {testimonios.map((t) => (
        <article class="reveal bg-cream border border-navy-mid/10 rounded-xl p-7">
          <div class="text-teal text-5xl font-black leading-none mb-3">"</div>
          <p class="text-navy-dark text-sm leading-relaxed italic mb-6">{t.texto}</p>
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-navy-mid flex items-center justify-center text-cream text-xs font-bold shrink-0">
              {t.iniciales}
            </div>
            <div>
              <div class="text-navy-darkest text-sm font-bold">{t.nombre}</div>
              <div class="text-navy-dark/50 text-xs">{t.rol}</div>
            </div>
          </div>
        </article>
      ))}
    </div>

  </div>
</section>
```

- [ ] **Step 2: Agregar Testimonios a index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import Servicios from '../components/Servicios.astro';
import Proceso from '../components/Proceso.astro';
import Proyectos from '../components/Proyectos.astro';
import Testimonios from '../components/Testimonios.astro';
---
<BaseLayout>
  <Navbar />
  <main>
    <Hero />
    <Servicios />
    <Proceso />
    <Proyectos />
    <Testimonios />
  </main>
</BaseLayout>
```

- [ ] **Step 3: Verificar**

```bash
npm run dev
```

Verificar: 3 cards de testimonio sobre fondo gris tenue, avatar con iniciales, cita en cursiva.

- [ ] **Step 4: Commit**

```bash
git add src/components/Testimonios.astro src/pages/index.astro
git commit -m "feat: add Testimonios section with avatar initials cards"
```

---

## Task 9: CTABand y Contacto

**Files:**
- Create: `src/components/CTABand.astro`
- Create: `src/components/Contacto.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear src/components/CTABand.astro**

```astro
---
// src/components/CTABand.astro
---
<section class="bg-gradient-to-br from-navy-dark to-navy-mid py-20 px-6 text-center">
  <div class="max-w-2xl mx-auto reveal">
    <h2 class="font-display text-cream text-4xl font-extrabold leading-tight mb-5">
      ¿Listo para construir algo<br />
      <span class="text-teal">extraordinario</span>?
    </h2>
    <p class="text-cream/60 text-base mb-8">Cuéntanos tu idea — la primera consulta es gratis.</p>
    <a
      href="#contacto"
      class="inline-block bg-teal text-cream font-semibold px-8 py-4 rounded-md text-base hover:bg-teal/90 transition-colors"
    >
      Empezar ahora →
    </a>
  </div>
</section>
```

- [ ] **Step 2: Crear src/components/Contacto.astro**

```astro
---
// src/components/Contacto.astro
import { Mail, MapPin } from 'lucide-astro';
---
<section id="contacto" class="bg-cream py-20 px-6">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

    <!-- Info -->
    <div class="reveal">
      <p class="text-teal text-xs font-semibold tracking-widest uppercase mb-3">Contacto</p>
      <h2 class="font-display text-navy-darkest text-3xl font-extrabold mb-4">
        Hablemos de tu proyecto
      </h2>
      <p class="text-navy-dark/60 text-sm leading-relaxed mb-8">
        Respondemos en menos de 24 horas. Sin compromisos, sin presión.
      </p>

      <div class="space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-navy-mid rounded-lg flex items-center justify-center text-cream shrink-0">
            <Mail size={16} />
          </div>
          <span class="text-navy-dark text-sm">hola@codealab.dev</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-navy-mid rounded-lg flex items-center justify-center text-cream shrink-0">
            <MapPin size={16} />
          </div>
          <span class="text-navy-dark text-sm">Buenos Aires, Argentina · Trabajo remoto global</span>
        </div>
      </div>
    </div>

    <!-- Formulario -->
    <form
      class="reveal space-y-4"
      id="contact-form"
      novalidate
    >
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="nombre" class="sr-only">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="Nombre"
            class="w-full border border-navy-mid/20 rounded-lg px-4 py-3 text-sm text-navy-darkest placeholder:text-navy-dark/40 focus:outline-none focus:border-teal transition-colors"
          />
        </div>
        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            class="w-full border border-navy-mid/20 rounded-lg px-4 py-3 text-sm text-navy-darkest placeholder:text-navy-dark/40 focus:outline-none focus:border-teal transition-colors"
          />
        </div>
      </div>
      <div>
        <label for="asunto" class="sr-only">Asunto</label>
        <input
          id="asunto"
          name="asunto"
          type="text"
          required
          placeholder="Asunto"
          class="w-full border border-navy-mid/20 rounded-lg px-4 py-3 text-sm text-navy-darkest placeholder:text-navy-dark/40 focus:outline-none focus:border-teal transition-colors"
        />
      </div>
      <div>
        <label for="mensaje" class="sr-only">Mensaje</label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          rows="4"
          placeholder="Cuéntanos sobre tu proyecto..."
          class="w-full border border-navy-mid/20 rounded-lg px-4 py-3 text-sm text-navy-darkest placeholder:text-navy-dark/40 focus:outline-none focus:border-teal transition-colors resize-none"
        ></textarea>
      </div>
      <button
        type="submit"
        class="w-full bg-teal text-cream font-semibold py-3 rounded-lg hover:bg-teal/90 transition-colors"
      >
        Enviar mensaje →
      </button>
      <p id="form-feedback" class="text-sm text-center hidden"></p>
    </form>

  </div>
</section>

<script>
  const form = document.getElementById('contact-form') as HTMLFormElement;
  const feedback = document.getElementById('form-feedback') as HTMLParagraphElement;

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // Demo: mostrar feedback (reemplazar con integración real: Resend, Formspree, etc.)
    feedback.textContent = '¡Mensaje enviado! Te contactaremos pronto.';
    feedback.className = 'text-sm text-center text-teal';
    feedback.classList.remove('hidden');
    form.reset();
  });
</script>
```

- [ ] **Step 3: Agregar CTABand y Contacto a index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import Servicios from '../components/Servicios.astro';
import Proceso from '../components/Proceso.astro';
import Proyectos from '../components/Proyectos.astro';
import Testimonios from '../components/Testimonios.astro';
import CTABand from '../components/CTABand.astro';
import Contacto from '../components/Contacto.astro';
---
<BaseLayout>
  <Navbar />
  <main>
    <Hero />
    <Servicios />
    <Proceso />
    <Proyectos />
    <Testimonios />
    <CTABand />
    <Contacto />
  </main>
</BaseLayout>
```

- [ ] **Step 4: Verificar**

```bash
npm run dev
```

Verificar: CTA band con fondo oscuro y botón teal. Formulario con validación HTML5. Al enviar aparece mensaje de confirmación en verde teal.

- [ ] **Step 5: Commit**

```bash
git add src/components/CTABand.astro src/components/Contacto.astro src/pages/index.astro
git commit -m "feat: add CTABand and Contacto sections with form validation"
```

---

## Task 10: Footer

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear src/components/Footer.astro**

```astro
---
// src/components/Footer.astro
import { Linkedin, Github, Instagram } from 'lucide-astro';

const year = new Date().getFullYear();
---
<footer class="bg-navy-darkest py-8 px-6">
  <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

    <!-- Logo (versión blanca para fondo oscuro) -->
    <a href="/" aria-label="CodeaLab inicio">
      <img
        src="/img/Negativo B Texto.svg"
        alt="CodeaLab"
        width="110"
        height="40"
        class="h-7 w-auto opacity-90"
      />
    </a>

    <p class="text-cream/30 text-xs text-center">
      © {year} CodeaLab. Todos los derechos reservados.
    </p>

    <!-- Redes sociales -->
    <div class="flex items-center gap-3">
      <a
        href="https://linkedin.com/company/codealab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn de CodeaLab"
        class="w-8 h-8 border border-cream/20 rounded-full flex items-center justify-center text-cream/50 hover:text-cream hover:border-cream/50 transition-colors"
      >
        <Linkedin size={14} />
      </a>
      <a
        href="https://github.com/codealab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub de CodeaLab"
        class="w-8 h-8 border border-cream/20 rounded-full flex items-center justify-center text-cream/50 hover:text-cream hover:border-cream/50 transition-colors"
      >
        <Github size={14} />
      </a>
      <a
        href="https://instagram.com/codealab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram de CodeaLab"
        class="w-8 h-8 border border-cream/20 rounded-full flex items-center justify-center text-cream/50 hover:text-cream hover:border-cream/50 transition-colors"
      >
        <Instagram size={14} />
      </a>
    </div>

  </div>
</footer>
```

- [ ] **Step 2: Agregar Footer a index.astro (versión final)**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import Servicios from '../components/Servicios.astro';
import Proceso from '../components/Proceso.astro';
import Proyectos from '../components/Proyectos.astro';
import Testimonios from '../components/Testimonios.astro';
import CTABand from '../components/CTABand.astro';
import Contacto from '../components/Contacto.astro';
import Footer from '../components/Footer.astro';
---
<BaseLayout>
  <Navbar />
  <main>
    <Hero />
    <Servicios />
    <Proceso />
    <Proyectos />
    <Testimonios />
    <CTABand />
    <Contacto />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 3: Verificar**

```bash
npm run dev
```

Verificar: footer oscuro con logo blanco, copyright dinámico y 3 iconos de redes sociales.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add Footer with logo, copyright and social links"
```

---

## Task 11: Build final y verificación

**Files:** ninguno nuevo

- [ ] **Step 1: Build de producción**

```bash
npm run build
```

Esperado: sin errores ni warnings críticos. Carpeta `dist/` generada.

- [ ] **Step 2: Preview del build**

```bash
npm run preview
```

Abrir `http://localhost:4321` y recorrer visualmente las 9 secciones completas.

- [ ] **Step 3: Verificar responsive**

En DevTools del navegador (F12), probar con:
- 375px (iPhone SE)
- 768px (iPad)
- 1280px (desktop)

Verificar que todos los grids colapsan correctamente y el texto es legible.

- [ ] **Step 4: Verificar links de proyectos**

Hacer click en los 3 links de proyectos y confirmar que abren en nueva pestaña:
- https://pimbalu.vercel.app/
- https://webpeluqueria.vercel.app/
- https://indicadores-bc.vercel.app/

- [ ] **Step 5: Verificar formulario de contacto**

Completar el formulario y verificar:
1. El botón no envía si hay campos vacíos
2. Al enviar con datos válidos aparece "¡Mensaje enviado! Te contactaremos pronto."
3. El formulario se resetea después de enviar

- [ ] **Step 6: Verificar SEO básico**

En el preview, abrir DevTools → Elements y verificar que existan en `<head>`:
- `<title>CodeaLab — Desarrollo Web y Software a Medida</title>`
- `<meta name="description" ...>`
- `<meta property="og:title" ...>`
- `<script type="application/ld+json">` con el schema de Organization

- [ ] **Step 7: Commit final**

```bash
git add -A
git commit -m "chore: final build verification — CodeaLab landing complete"
```
