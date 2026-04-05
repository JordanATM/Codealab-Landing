---
title: Proyectos — Thumbnails reales con Puppeteer
date: 2026-04-05
status: approved
---

## Objetivo

Reemplazar el área de thumbnail de cada card en la sección Portafolio (gradiente + emoji) por una captura de pantalla real del proyecto correspondiente, optimizada con el componente `<Image>` de Astro.

## Componentes

### `scripts/screenshots.js`

Script Node.js standalone que:
- Usa `puppeteer` para abrir un navegador headless
- Visita cada URL de proyecto con viewport 1280×800
- Espera 2 segundos para que la página cargue completamente
- Captura screenshot y lo guarda como PNG en `src/assets/proyectos/`
- Proyectos:
  - `pimbalu.png` → `https://pimbalu.vercel.app/`
  - `lumiere.png` → `https://webpeluqueria.vercel.app/`
  - `indicadores-bc.png` → `https://indicadores-bc.vercel.app/`

Se ejecuta manualmente con: `node scripts/screenshots.js`

### `src/components/Proyectos.astro`

- Agregar imports estáticos de las 3 imágenes desde `src/assets/proyectos/`
- Agregar campo `img` a cada objeto en el array `proyectos`
- Reemplazar el `<div>` de thumbnail (gradiente + emoji) por `<Image src={p.img} alt={p.nombre} width={640} height={360} format="webp" quality={85} class="w-full h-40 object-cover object-top" />`
- Eliminar campos `gradientFrom`, `gradientTo` y `emoji` del array

## Dependencia

```
puppeteer (devDependency)
```

## Flujo de actualización

Cuando se agregue o cambie un proyecto: editar las URLs en `scripts/screenshots.js`, correr el script, hacer commit de los PNG nuevos.
