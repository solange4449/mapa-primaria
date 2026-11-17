# Mapa interactivo de Primaria · Escuela Precursora 2025 / 2026

1. Descomprimí el ZIP y abrí `index.html` con doble clic. El mapa funciona sin internet.
2. Si tenés la carpeta `assets` de la versión original, copiala junto a `index.html`. Así se restauran las ilustraciones, fuentes, fotos y videos originales. Sin esa carpeta podés recorrer el mapa y leer todos los ítems.
3. Usá **Siguiente** para pasar por 2025, el mapa de 2026, los proyectos de 2026, Comunidad y el cierre. Los títulos con el símbolo de reproducción abren el material asociado o indican que está pendiente. En una pantalla chica, usá **Ampliar mapa** o girá el dispositivo.

## Actualizar textos y materiales

`contenido.js` contiene las pantallas. Las secciones nuevas se editan en `columns` (Proyectos y actividades de 2026) y `activities` (Comunidad). Cada entrada puede llevar un texto, un detalle y subítems. `evidence: true` indica que falta el material asociado. Para vincular un archivo, agregá una pantalla de actividad siguiendo el formato de las pantallas 5 a 11. Dale un identificador único, fijá la ruta en `media`, agregá el enlace de vuelta y asigná su identificador a `target` en la actividad correspondiente. Para la Muestra Institucional, asigná `target` al bloque `texto-53` de la pantalla 2.

Las pantallas originales conservan sus coordenadas en un lienzo de 1920 × 1080. En ellas, `texts` contiene los bloques de texto, `links` las áreas clickeables, `arrows` las flechas y `media` las rutas a fotos y videos. El nombre y la ubicación de cada recurso deben coincidir con su ruta en `assets`.
