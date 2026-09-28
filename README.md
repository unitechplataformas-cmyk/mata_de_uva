# Mata de Uva

Sitio estático responsive basado en la referencia completa `C:\cs\docs\WEB_MDU_02.pdf` (una página vertical de 1920 × 7002.83 puntos). No requiere instalación ni compilación. Abrir `dist/index.html` o servir `dist` con un servidor HTTP.

## Archivos

- `dist/index.html`: contenido semántico y secciones.
- `dist/styles.css`: sistema visual, estados y composiciones responsive.
- `dist/app.js`: menú móvil, tarjetas y selección de experiencias.
- `dist/assets/`: fotografías y recursos originales recuperados del PDF; fuentes web locales.

## Interpretación de la referencia

Identidad cálida, editorial y elegante. Paleta vino `#971353`, acento magenta `#c91a6d`, crema `#fbf5ed`, arena `#f3e8d6`, blanco y texto carbón. Títulos Cormorant Garamond, cuerpos sans serif, pequeños acentos manuscritos Sunday April. Fotografías de atardeceres, tierra, vides y celebraciones; formas orgánicas onduladas; imágenes de esquinas redondeadas; botones pequeños de forma ovalada; composición amplia y centrada.

Se preservaron las fotografías originales y el logotipo. Los cinco acentos manuscritos son recursos gráficos recortados del PDF con texto alternativo; la página, títulos editoriales, párrafos, navegación e interacciones son HTML real. Las fuentes Cormorant completas se obtuvieron de Google Fonts porque los subconjuntos internos del PDF no son fuentes web completas. Arial/Helvetica es la alternativa local a Neue Haas Grotesk del PDF.

El sistema usa un contenedor máximo de 1160 px, cuerpo de 16 px, títulos fluidos, radios de 20 px, botones con alto mínimo de 44 px, tres columnas de tarjetas en escritorio y una en móvil. Menú desplegable hasta 700 px, foco visible, enlace para saltar al contenido y respeto de `prefers-reduced-motion`.

## Recursos y contenido pendientes de origen

- El PDF muestra una captura de video, pero no incluye un archivo reproducible. La sección de paisaje utiliza la fotografía recuperada, con el encuadre ocultando los controles de la captura. No se simula un reproductor. Sustituirla por video real si se proporciona.
- Los enlaces de teléfono y WhatsApp usan el número del PDF: +52 55 1285 2160. El usuario inicia el contacto; no se envían mensajes automáticamente.
- La ubicación abre una búsqueda de Maps, ya que no se proporcionaron coordenadas o dirección precisa.
- No se inventaron cuentas de redes sociales ni formularios sin servicio de recepción.

## Verificación

Vista previa HTTP correcta; JavaScript validado sintácticamente; navegación móvil, tarjeta mediante teclado y cambio de imagen de experiencias comprobados. Anchos inspeccionados: 390, 768 y 1440 px; sin desbordamiento horizontal ni imágenes rotas. Revisión visual y corrección de tipografía, recortes y fondos.

La configuración de Sites contiene un proyecto registrado, pero no se completó la publicación: los archivos de la integración Sites dejaron de estar disponibles durante el proceso. El sitio completo permanece utilizable localmente.
