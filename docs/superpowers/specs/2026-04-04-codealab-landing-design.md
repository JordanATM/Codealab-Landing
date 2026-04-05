# CodeaLab Landing — Diseño del sitio web

**Fecha:** 2026-04-04  
**Estado:** Aprobado

---

## Contexto

El sitio actual de CodeaLab es una landing en HTML/CSS/JS vanilla construida en febrero 2026. El objetivo es reescribirlo completamente en **Astro** con SEO optimizado, arquitectura de componentes, y un diseño minimalista y moderno usando la paleta de colores oficial de la empresa.

---

## Decisiones de diseño

### Stack
- **Framework:** Astro (sitio estático, SSG)
- **Estilos:** Tailwind CSS v4
- **Iconos:** Lucide (paquete `lucide-astro` o SVG inline via `@lucide-icons/astro`)
- **Fuentes:** Inter (cuerpo) + Space Grotesk (títulos) — via Google Fonts o `@fontsource`
- **Imagen de logo:** `img/Negativo B Texto.svg` (SVG con flask + wordmark)
- **Imagen hero:** `img/hero.jpg`

### Paleta de colores
| Variable | Hex | Uso |
|---|---|---|
| `--navy-darkest` | `#0A1128` | Fondo oscuro, proceso, footer |
| `--navy-dark` | `#001F54` | Texto body, gradientes |
| `--navy-mid` | `#034078` | Botones, iconos, bordes |
| `--teal` | `#1282A2` | Acento principal, links, highlights |
| `--cream` | `#FEFCFB` | Fondo claro, navbar, texto sobre oscuro |

### Estilo visual: Duality
- **Navbar y secciones de contenido:** fondo claro (`#FEFCFB`)
- **Hero, Proceso y CTA band:** fondo navy oscuro (`#0A1128` → `#034078` gradiente)
- Tipografía grande y contundente en headings
- Cards con bordes sutiles (`#03407820`) y hover con sombra teal
- Sin animaciones de partículas ni efectos pesados — scroll reveal suave

---

## Estructura de la página (single-page)

| # | Sección | Fondo | Descripción |
|---|---|---|---|
| 1 | **Navbar** | Claro | Logo SVG + links + CTA button. Fixed, blur en scroll |
| 2 | **Hero** | Oscuro (gradiente) | Split: texto izquierda + `img/hero.jpg` derecha |
| 3 | **Servicios** | Claro | Grid 3×2 con Lucide icons, tags de tecnologías |
| 4 | **Proceso** | Oscuro | 4 pasos con números circulares y conectores |
| 5 | **Proyectos** | Claro | 3 cards con thumbnail, descripción y link |
| 6 | **Testimonios** | Gris tenue | 3 cards con cita, avatar iniciales y rol |
| 7 | **CTA Band** | Oscuro (gradiente) | Headline + subtítulo + botón principal |
| 8 | **Contacto** | Claro | Split: info izquierda + formulario derecha |
| 9 | **Footer** | Oscuro | Logo + copyright + redes sociales |

---

## Secciones — detalle de contenido

### Hero
- Eyebrow: "Desarrollo de software a medida"
- Título: "Código que **transforma** negocios."
- Subtítulo: "Construimos aplicaciones web, apps móviles y APIs robustas que escalan con tu empresa."
- CTAs: "Ver proyectos →" (primario, teal) | "Hablar con nosotros" (outline)
- Imagen: `img/hero.jpg` con border-radius, aspect-ratio 1:1

### Servicios (6 cards)
1. Desarrollo Web — `monitor` icon — React, Next.js, Vue
2. Apps Móviles — `smartphone` icon — React Native, Flutter
3. Backend & APIs — `server` icon — Node, Python, AWS
4. UI/UX Design — `pen-tool` icon — Figma, Design Systems
5. E-commerce — `shopping-bag` icon — Shopify, WooCommerce
6. Consultoría Tech — `lightbulb` icon — DevOps, Code Review

### Proceso (4 pasos)
1. Descubrimiento
2. Diseño
3. Desarrollo
4. Lanzamiento

### Proyectos (3 reales)
| Nombre | URL | Stack | Descripción |
|---|---|---|---|
| Pimbalú Delicias Caseras | https://pimbalu.vercel.app/ | Astro, E-commerce | Sitio para negocio de dulces artesanales con catálogo y pedidos via WhatsApp |
| Lumière — Peluquería | https://webpeluqueria.vercel.app/ | Next.js, Tailwind | Sitio premium para salón de belleza con servicios y reserva online |
| Indicadores BC | https://indicadores-bc.vercel.app/ | Web App, API | Calculadora de divisas con tasas del Banco Central de Chile |

### Testimonios (3 ejemplos)
- Martín Rodríguez — CTO, PlataformaPro
- Sofía López — Fundadora, ShopLux
- Andrés Castillo — CEO, HealthTrack

### Contacto
- Email: hola@codealab.dev
- Ubicación: Buenos Aires, Argentina · Trabajo remoto global
- Formulario: Nombre, Email, Asunto, Mensaje, botón enviar

---

## Arquitectura de componentes Astro

```
src/
├── layouts/
│   └── BaseLayout.astro       # Head con SEO, fonts, meta tags
├── components/
│   ├── Navbar.astro
│   ├── Hero.astro
│   ├── Servicios.astro
│   ├── Proceso.astro
│   ├── Proyectos.astro
│   ├── Testimonios.astro
│   ├── CTABand.astro
│   ├── Contacto.astro
│   └── Footer.astro
├── pages/
│   └── index.astro            # Ensambla todos los componentes
└── styles/
    └── global.css             # Variables CSS de la paleta + reset
```

---

## SEO

- `<title>`: "CodeaLab — Desarrollo Web y Software a Medida"
- `<meta name="description">`: ~155 caracteres describiendo servicios
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`
- Twitter Card: `summary_large_image`
- `lang="es"` en `<html>`
- Structured data: `Organization` schema (JSON-LD)
- Sitemap automático con `@astrojs/sitemap`
- Robots.txt
- Imágenes con `<Image />` de Astro para optimización automática (WebP, lazy load, width/height)
- Fuentes con `font-display: swap`

---

## Interacciones y animaciones

- Navbar: `backdrop-filter: blur` al hacer scroll (IntersectionObserver o scroll event)
- Secciones: fade-in + slide-up al entrar en viewport (CSS `@keyframes` + IntersectionObserver)
- Cards de servicios y proyectos: hover con `transform: translateY(-4px)` y sombra
- Formulario: validación HTML5 nativa, feedback visual en submit

---

## Assets

| Archivo | Uso |
|---|---|
| `img/Negativo B Texto.svg` | Logo en footer (blanco). En navbar usar versión dark con CSS filter o segunda versión |
| `img/hero.jpg` | Imagen lado derecho del hero |

> **Nota:** El SVG del logo tiene `fill:#fff` (versión negativa). Para el navbar claro se aplicará `filter` CSS para invertirlo a navy, o se creará una segunda versión con `fill:#034078`.

---

## Verificación

1. `npm run build` sin errores
2. Lighthouse score ≥ 90 en Performance, Accessibility, SEO, Best Practices
3. Verificar meta tags con [https://metatags.io](https://metatags.io)
4. Responsive en 375px, 768px y 1280px
5. Formulario de contacto envía y muestra feedback
6. Links de proyectos abren correctamente en nueva pestaña
