# Portafolio Full Stack & Web3

Portafolio estático con una introducción animada de agujero negro, presentación profesional, servicios, tecnologías, proyectos de muestra y contacto.

## Archivos
- `index.html`: estructura y contenido.
- `style.css`: diseño visual, animaciones y estilos responsive.
- `script.js`: intro, escena Three.js, navegación móvil y alternativa 2D.
- `assets/logo.png`: reemplaza este archivo con tu logo.

## Personalización antes de publicar
1. En `index.html`, cambia `DEV/STUDIO` por tu marca si quieres.
2. Sustituye `TU-CORREO@EJEMPLO.COM` por tu correo profesional.
3. Añade `assets/logo.png` (preferiblemente PNG transparente o SVG adaptado a `index.html`).
4. Sustituye las tarjetas de ejemplo por proyectos reales y enlaces verificados.
5. Revisa que las tecnologías mencionadas representen honestamente tu experiencia.

Three.js se carga desde CDN y Google Fonts también usa un servicio externo. Si esos servicios no están disponibles, la página conserva el contenido y la intro tiene una alternativa visual 2D cuando Three.js no carga.

## Publicar en GitHub Pages
1. Crea un repositorio público llamado `portfolio-fullstack-web3`.
2. Sube todos los archivos y carpetas manteniendo la estructura.
3. Abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/(root)`, luego guarda.
6. Espera a que GitHub termine el despliegue y abre la URL que aparece en Pages.

GitHub Pages publica sitios estáticos; no ejecuta un backend de servidor. El enlace `mailto:` abre el programa de correo del visitante, no envía el mensaje por sí solo.
