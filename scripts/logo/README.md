# Logo de Montca Actiu

Fuentes del logo para la tarea B-20. Las dos imágenes vienen de la carpeta **WEB** del Drive
de Montca (`montcaadventure`), sin metadatos:

| Archivo | Qué es | Origen en Drive |
| --- | --- | --- |
| `fuentes/logo-montca-actiu-color.jpg` | Logo completo en color: hexágono con la montaña y el castillo, y el texto "Montca Actiu" | `fd30b3db-6380-40cc-ab18-ef9b339af4d0 3.JPG` |
| `fuentes/simbolo-blanco-sobre-negro.jpg` | Solo el símbolo (hexágono), en blanco sobre negro | `WhatsApp Image 2026-06-10 at 09.58.20.jpeg` |

Son JPG de 1536 px, uno sacado de WhatsApp: sirven para vectorizar, no para usarlos tal cual.
Si Montca pasa el original (SVG, AI o PDF), sustituye a estas fuentes.

## Piezas del logo (B-20)

Hasta que Montca pase el original vectorial, **el logo de la web es la imagen original**, sin
redibujar y sin cambiar los colores. Se genera con:

```
uv run scripts/logo/generar_piezas.py
```

El script (Pillow, numpy y scipy, con metadatos PEP 723 como los de `scripts/mapa/`) lee de
`fuentes/` y no las modifica. Para cada pieza:

1. **Fondo transparente.** La opacidad de cada píxel sale de lo lejos que está del blanco
   respecto al color de la tinta de su zona; el color es el de la tinta, así los bordes
   suavizados del JPG no dejan halo. El símbolo blanco sale del JPG blanco sobre negro, con
   la luminosidad como opacidad.
2. **Recorte** al contenido con 4 px de margen.
3. **Separación** del símbolo y el texto con los componentes conexos: lo que baja de la fila
   615 es texto; el resto, símbolo.
4. **Versión blanca** de la línea de texto: la de color con el RGB a blanco, misma forma.

| Archivo (`src/assets/logo/`) | Qué es | Dónde se usa |
| --- | --- | --- |
| `logo-completo.png` | símbolo + texto | base de la imagen para compartir |
| `linea-texto.png` | solo "Montca Actiu" | cabecera desde 480 px |
| `simbolo.png` | solo el hexágono | cabecera en móvil y favicon |
| `linea-texto-blanca.png` | línea de texto en blanco | pie (fondo Verd bosc) |
| `simbolo-blanco.png` | símbolo del JPG blanco sobre negro | sin uso por ahora |
| `imagen-compartir.png` | logo completo sobre blanco, 1200 × 630 | imagen para compartir por defecto |

El favicon se escribe en `public/` (`favicon.png` de 192 px y `favicon.ico`). Las fuentes miden
1536 px: sirven para la web, pero se pixelan si se amplían. **Cuando Montca pase el vectorial,
se sustituyen las piezas y este script deja de hacer falta.**
