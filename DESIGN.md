---
name: Montca Actiu
description: La web de las actividades de Montca en la Serra de Mariola, señalizada como un sendero.
colors:
  boira: "#f1f6ef"
  herba-clara: "#dff3d7"
  pedra: "#f3e6c8"
  verd-prat: "#99b561"
  verd-fulla: "#527742"
  verd-bosc: "#375639"
  tinta: "#1f3324"
  teula: "#9c5530"
  teula-fosca: "#743d21"
  teula-clara: "#f0b890"
  blanco: "#ffffff"
  linea: "rgb(55 86 57 / 0.18)"
  linea-sobre-verde: "rgb(241 246 239 / 0.16)"
  hover-sobre-verde: "rgb(241 246 239 / 0.08)"
typography:
  headline:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontWeight: 800
    lineHeight: 1.15
  marca:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    letterSpacing: "-0.01em"
  marca-pie:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
  body:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  nav-escritorio:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
  label:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "0.02em"
  label-barra:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.02em"
rounded:
  senal: "4px"
  boton: "6px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "12": "48px"
components:
  button-primary:
    backgroundColor: "{colors.teula}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.boton}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.teula-fosca}"
    textColor: "{colors.blanco}"
  button-secundario:
    backgroundColor: "{colors.verd-bosc}"
    textColor: "{colors.boira}"
    rounded: "{rounded.boton}"
    padding: "0 24px"
    height: "44px"
  button-secundario-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.boira}"
  button-senal:
    backgroundColor: "{colors.boira}"
    textColor: "{colors.verd-bosc}"
    rounded: "{rounded.senal}"
    padding: "0 12px"
    height: "44px"
  button-senal-hover:
    backgroundColor: "{colors.herba-clara}"
  nav-cabecera:
    backgroundColor: "{colors.boira}"
    textColor: "{colors.tinta}"
    height: "56px"
  nav-barra-inferior:
    backgroundColor: "{colors.verd-bosc}"
    textColor: "{colors.boira}"
    typography: "{typography.label-barra}"
    height: "64px"
  pie:
    backgroundColor: "{colors.verd-bosc}"
    textColor: "{colors.boira}"
---

# Design System: Montca Actiu

> Acordado con Pablo en la B-09 (2026-11-22) y recogido de lo construido con `/impeccable document`. Los colores salen medidos de la ilustración `src/assets/mapa/mapa-mariola.png`. Los tokens del frontmatter son las variables CSS de `src/styles/global.css` (`--color-*`, `--espacio-*`, `--radio-*`): si cambia uno, se cambian los dos. Los detalles que el formato no admite (foco, movimiento, puntos de corte) están en `.impeccable/design.json`.

## Overview

**Creative North Star: "Senda senyalitzada"**

La web funciona como un sendero bien marcado de la Serra de Mariola. Quien llega desde un reel no tiene que pensar por dónde ir: en cada pantalla hay una señal clara que dice "por aquí", y esa señal lleva a apuntarse o a pedir la actividad para un grupo. El menú, la barra inferior y los botones son la señalética del camino. El color teja hace de **marca de pintura**: aparece donde hay que actuar y en ningún otro sitio.

El territorio pone el resto. El fondo es la neblina verde clara del cielo del mapa y los verdes son los de sus bancales, del prado al bosque. La teja sale de los tejados de Cocentaina y la crema, de la piedra de la torre. La interfaz es plana y tranquila, con poca densidad y mucho aire. La ilustración del mapa y las fotos de las actividades se llevan la atención, y la interfaz se limita a orientar.

El tono visual es igual que el de los textos: **cercano pero serio**. Es lo bastante amable para un chaval de 16 años y lo bastante ordenado para que un padre o una profesora confíen.

**Key Characteristics:**

- Móvil primero (375 px); el escritorio amplía, no reordena.
- Una sola señal de acción por pantalla en color teja.
- Superficies planas por planos de color, como los bancales del mapa; casi sin sombras.
- Tipografía de señalética (Overpass): legible a primera vista y con peso en los titulares.
- Zonas táctiles de al menos 44 px y foco siempre visible.

## Colors

Paleta medida sobre la ilustración del mapa. Verdes de bancal en una base de neblina, con teja como única nota cálida de acción.

### Primary

- **Teula de Cocentaina** (#9c5530): botones de acción (Apunta't, Reserva, Demana pressupost), marca de pintura de la página actual en el menú y anillo de foco sobre fondos claros. Es el tono de los tejados del mapa (#ae7349) oscurecido para que el texto blanco encima llegue a 5.6:1. Sobre la neblina mide 5.1:1, así que también sirve como color de enlace.
- **Teula fosca** (#743d21): estado `hover` y `active` de los botones teja (blanco encima: 8.6:1). Se distingue de la teula 1.54:1, y el `hover` además subraya el texto del botón, así que el cambio no depende solo del color.
- **Teula clara** (#f0b890): la marca de pintura y el anillo de foco **sobre fondos verde bosque**, donde la teja normal no se ve (1.5:1). Sobre verde bosque mide 4.7:1.

### Secondary

- **Verd bosc** (#375639): el verde más presente del mapa (las caras de los bancales). Es el fondo de la barra inferior del móvil y del pie, y el color de los titulares. Blanco o neblina encima: 7.5–8.2:1.
- **Verd fulla** (#527742): iconos, bordes activos y texto grande. Mide 4.7:1 sobre la neblina; no se usa para texto pequeño sobre crema (4.2:1).

### Tertiary

- **Pedra de la torre** (#f3e6c8): la crema, sacada de la piedra de la torre (#dcc291) y aclarada. Se usa en superficies cálidas puntuales: tarjetas destacadas, avisos de "Properament" y franjas de confianza. No es el fondo general.

### Neutral

- **Boira de Mariola** (#f1f6ef): el fondo de toda la web, que es el cielo del mapa. Se elige en lugar de un blanco o una crema para que la ilustración se funda con la página.
- **Herba clara** (#dff3d7): superficies teñidas, `hover` de los enlaces del menú y separación de bloques sin usar líneas.
- **Tinta de bosc** (#1f3324): el texto de cuerpo. Mide 12.3:1 sobre la neblina y 10.9:1 sobre crema.
- **Verd prat** (#99b561): solo decoración (ilustración, detalles gráficos). **Nunca texto ni borde funcional** (2.1:1).

### Named Rules

**The Paint Mark Rule.** La teja es la pintura del sendero: marca la acción y el "estás aquí", nada más. Nunca se usa como fondo de una sección, en titulares ni como decoración. Si en una pantalla hay más de dos elementos en teja, uno sobra.

**The Dark Ground Rule.** La teula (#9c5530) nunca va sobre Verd bosc ni sobre otro verde oscuro: el contraste se queda en 1.5:1 y la marca desaparece. Sobre fondos verdes oscuros (barra inferior, pie), la marca de pintura y el anillo de foco son siempre Teula clara (#f0b890, 4.7:1).

**The Mist Ground Rule.** El fondo es siempre Boira de Mariola (#f1f6ef), nunca blanco puro ni crema. La crema se reserva para superficies puntuales.

**The Contrast Floor Rule.** El texto pequeño mide al menos 4.5:1 y los iconos, bordes funcionales y anillos de foco, al menos 3:1. Verd prat y la teja original del mapa (#ae7349) no llevan texto.

## Typography

**Display Font:** Overpass (con system-ui, sans-serif)
**Body Font:** Overpass (con system-ui, sans-serif)

**Character:** Overpass viene de la rotulación de las señales de carretera, así que es la voz natural de una web que se lee como un sendero señalizado. Es clara de lejos y en pantallas pequeñas, seria sin ser fría, y su peso 800 da a los titulares la energía que piden Montca Sports y el público joven.

La fuente se sirve desde la propia web con la API de fuentes de Astro (proveedor Fontsource): sin peticiones a Google Fonts y sin datos del visitante enviados fuera. Pesos: 400, 600 y 800.

### Hierarchy

Tamaños pensados para 375 px. Lo que ya está construido lleva su valor; Display y los tamaños de Headline se fijan con la primera página con contenido (portada), y en escritorio crecen con `clamp()`.

- **Display** (800, ~2.25rem → ~3.5rem, interlineado 1.05): nombres grandes de portada y de cada sección (Montca Sports, Repte 5 Cims). *Pendiente de construir.*
- **Headline** (800, interlineado 1.15, `text-wrap: balance`; tamaño ~1.5rem → ~2rem pendiente): `h1`–`h3`, en Verd bosc.
- **Marca** (800, 1.25rem en la cabecera y 1.5rem en el pie, espaciado -0.01em): el nombre "Montca Actiu" mientras no llegue el logo (A-07).
- **Title** (600, 1.125rem): enlaces del menú desplegable del móvil; también nombres de actividad en tarjetas y fichas.
- **Body** (400, 1rem, 1.55): texto corrido, con un máximo de 65–70 caracteres por línea.
- **Label** (600, 0.875rem, espaciado 0.02em): selector VAL / CAST y avisos legales. Los enlaces del menú de escritorio van a 0.9375rem y la barra inferior a 0.8125rem. Sin mayúsculas forzadas: los textos en valenciano se leen mejor en minúscula (VAL / CAST son abreviaturas, no mayúsculas forzadas).

### Named Rules

**The Signpost Rule.** Las etiquetas de navegación y los botones dicen a dónde llevan con una o dos palabras (Agenda, Activitats, Apunta't). Si una etiqueta necesita una frase, la señal está mal puesta.

**The 16px Floor Rule.** Ningún texto de lectura baja de 1rem en el móvil, y ninguna etiqueta baja de 0.8125rem.

## Layout

Móvil primero. Se diseña para 375 px y se amplía:

- **Móvil (base, desde 320 px):** una columna con un margen lateral de 16 px. Cabecera fija arriba (`position: sticky`, 56 px), con la marca, el selector VAL/CAST y el botón de menú; por debajo de 360 px el botón se queda solo con el icono, y si el texto está muy ampliado las acciones bajan a una segunda línea. **Barra fija abajo** (64 px) con Agenda · Activitats · WhatsApp al alcance del pulgar. El `body` reserva ese alto más `env(safe-area-inset-bottom)` para que la barra no tape nada.
- **Tableta (desde 48rem):** el margen lateral pasa a 32 px y el pie se reparte en tres columnas; la barra inferior se mantiene.
- **Escritorio (desde 64rem):** la barra inferior desaparece y sus destinos pasan al menú horizontal de la cabecera, con el botón Reserva en teja a la derecha (como en el wireframe). El contenido se centra con un ancho máximo de 72rem.

Ritmo de espaciado sobre una base de 8 px (4 px para ajustes finos), con más aire encima de un título que debajo. La densidad es baja: cada bloque de la portada respira como un bancal del mapa.

## Elevation & Depth

La web es plana. La profundidad sale de **planos de color**, igual que en el mapa los bancales se separan por tono y no por sombra: neblina → herba clara → crema → verde bosque. Las barras fijas se separan del contenido con una línea de 1 px en un verde translúcido, no con una sombra.

El menú desplegable del móvil tampoco lleva sombra: ocupa toda la pantalla entre la cabecera y la barra, con fondo Boira, así que no flota sobre nada. La única excepción prevista es el panel de ficha que sube desde abajo en el móvil (otra tarea), que puede llevar una sombra suave hacia arriba para leerse como una capa encima del mapa.

### Named Rules

**The Terrace Rule.** Lo que está más cerca se distingue por el color de su plano, no por una sombra. Las sombras solo aparecen en capas que flotan de verdad (paneles que suben y menús desplegados).

## Shapes

Formas de señal de sendero: rectángulos con esquinas ligeramente suavizadas (4–6 px), nunca píldoras ni círculos en los controles principales. La **marca de pintura** es la forma propia de la web: una franja rectangular corta y gruesa en teja (o teja clara sobre verde), como las marcas pintadas en las rocas de los senderos. Marca la página actual en el menú y en la barra inferior. Los iconos son de trazo, de 24 px, con los extremos redondeados para que hagan juego con Overpass.

## Components

Señales del camino: pocas, claras y siempre en el mismo sitio. Todas viven en `src/components/` y se montan en `src/layouts/BaseLayout.astro`.

### Buttons

- **Shape:** rectángulo con esquinas suaves: 6 px en los botones de acción y 4 px en los controles de señal.
- **Primary (teja):** fondo Teula, texto blanco en peso 600, 44 px de alto y 24 px de relleno lateral. Es el botón Reserva de la cabecera y del menú móvil, y será Apunta't y Demana pressupost.
- **Hover / Active:** fondo Teula fosca (#743d21) **y** texto subrayado de 2 px. Transición de color de 160 ms.
- **Secundario (verde):** fondo Verd bosc, texto Boira en peso 600 (7.5:1), 6 px de radio, 44 px de alto y 24 px de relleno lateral. Para acciones que importan pero no son la principal de la pantalla, así que nunca lleva teja. En `hover` y `active` el fondo pasa a Tinta (12.3:1) y el texto se subraya 2 px. Es el botón de WhatsApp.
- **Señal:** fondo transparente sobre Boira, texto Verd bosc en peso 600, borde de 1 px `linea` y 44 px de alto. Son el selector VAL / CAST y el botón Menú. En `hover` y con el menú abierto el fondo pasa a Herba clara.
- **Focus:** contorno de 3 px a 2 px de distancia, en Teula sobre fondos claros y en Teula clara sobre Verd bosc.

### Botón de WhatsApp (escritorio)

- **Qué es:** el botón secundario (verde) con el icono de WhatsApp y la etiqueta "WhatsApp", abajo a la derecha (`BotonWhatsApp.astro`). Abre `wa.me` con el mensaje ya escrito en otra pestaña, y su `aria-label` avisa de que se abre en una pestaña nueva.
- **Cuándo sale:** solo desde 64rem y solo si hay número de WhatsApp. En móvil y tableta WhatsApp ya está en la barra inferior, así que no se repite.
- **Posición:** `sticky` justo antes del pie, a 24 px del borde inferior. Mientras se baja se queda en la esquina, y al final de la página se para encima del pie en vez de taparlo. No lleva sombra.

### Navigation

- **Cabecera:** fija arriba, fondo Boira y línea inferior de 1 px. En escritorio, los enlaces van en horizontal (600, 0.9375rem, Tinta) y la página actual lleva la marca de pintura debajo del texto: una franja Teula de 20 × 5 px.
- **Menú móvil:** botón Menú con `aria-expanded` y `aria-controls` (patrón disclosure). Al abrirlo, el panel ocupa desde la cabecera hasta la barra inferior, tapa la página y bloquea su desplazamiento. Cada enlace mide 52 px de alto, va separado por líneas de 1 px y la página actual lleva la marca de pintura a la izquierda (14 × 6 px). Al final está el botón Reserva a todo el ancho. Escape lo cierra y devuelve el foco al botón.
- **Barra inferior (móvil y tableta):** fondo Verd bosc, tres huecos iguales con icono de 24 px y etiqueta (600, 0.8125rem, Boira). La página actual lleva la marca de pintura en Teula clara arriba del hueco (24 × 5 px). Sin número de WhatsApp, el tercer hueco es Contacte.
- **Selector de idioma:** enlace a la misma página en el otro idioma, con `lang`, `hreflang` y `aria-label` con el nombre del idioma (Castellano / Valencià).
- **Saltar al contenido:** primer elemento de la página, visible solo con el foco.
- **Enlace "← Tornar":** Verd bosc en peso 600 con la flecha en SVG (Overpass no tiene "←"). Va en fichas y eventos.

### Pie

- **Fondo:** Verd bosc, con todos los enlaces en Boira y subrayado de 2 px al pasar el ratón.
- **Contenido:** marca y lema, correo de contacto (y WhatsApp cuando haya número), todas las secciones en dos columnas y, separados por una línea, los avisos legales y el ©. Lleva todas las secciones para que la web se pueda recorrer sin JavaScript.
- **Densidad:** compacto en el móvil (huecos de 16 px) y con más aire desde 48rem (huecos de 32 px, tres columnas).

### Iconos

Trazo de 2 px, 24 × 24, extremos y uniones redondeados, en `currentColor` y decorativos (`aria-hidden`): siempre van con texto. Están en `Icono.astro`: menú, cerrar, agenda, actividades (dos picos de Mariola), WhatsApp, correo y volver.

### Imágenes y fotos

Toda imagen de contenido (fotos, el mapa, ilustraciones) se pone con **`Foto.astro`**; nunca con `<img>` a mano ni con una foto incrustada en el HTML (B-12).

```astro
import Foto from '../components/Foto.astro';
import foto from '../assets/fotos/actividades/nom-de-la-foto.jpg';

<Foto src={foto} alt={{ ca: '…', es: '…' }} lang={lang} />
```

- **Texto alternativo obligatorio en VAL y CAST** (`alt={{ ca, es }}`). El build falla si falta uno de los dos o está vacío, aunque la página esté en un solo idioma. Describe lo que se ve, no "foto de…". No hay imágenes decorativas sin `alt`: lo decorativo se hace con CSS o con SVG en línea.
- **Formatos**: AVIF y WebP, con el formato original como respaldo (JPG para las fotos).
- **Tamaños**: se generan varios anchos (los puntos de corte de Astro: 640, 750, 828, 1080, 1280… hasta el doble del ancho mostrado, sin pasar del original). La foto ocupa el ancho de su contenedor sin pasar de su ancho propio ni de 72rem. Lleva `width` y `height`, así la página no salta mientras carga.
- **`ancho`**: ancho máximo en pantalla, en px, si debe verse más estrecha que el contenido.
- **`sizes`**: solo si en el móvil la foto ocupa menos que el ancho de la pantalla (una rejilla de tarjetas). Ejemplo: `sizes="(min-width: 48rem) 33vw, 100vw"`.
- **Carga**: todas se cargan al acercarse a la pantalla, salvo la que lleve **`principal`**: la imagen grande de la primera pantalla, una por página como mucho.

**Dónde se guardan**

- En `src/assets/`: el mapa en `src/assets/mapa/` y las fotos en `src/assets/fotos/<sección>/` (`actividades/`, `sports/`, `equip/`…), con nombres en minúsculas, sin espacios ni tildes.
- **Nunca en `public/`**: lo que va ahí se sirve tal cual, sin optimizar. `public/` es solo para el favicon y archivos que tengan que servirse sin cambios.
- **El repositorio es público.** Antes de subir una foto:
  - que tenga permiso de imagen de quien sale en ella; nunca nada de la carpeta "Fotos scape room salesianos" (decisión del 2026-11-18);
  - quitarle los metadatos (EXIF, GPS): las versiones que genera la web salen sin ellos, pero el original que se sube al repo los conserva, y una foto de móvil puede llevar la ubicación;
  - reducir el original a 2560 px de ancho como máximo.

**Imagen para compartir**

- `BaseLayout` exige `image` (importada de `src/assets`) e `imageAlt` (`{ ca, es }`). Genera un JPG con la proporción de las redes (1200 × 630, 1,91:1) **sin ampliar**: con una imagen más estrecha usa su ancho (el mapa actual da 1024 × 538).
- Si la página no tiene una propia, usa `IMAGEN_COMPARTIR_POR_DEFECTO` (`src/components/imagen-compartir.ts`), que de momento es el mapa (hasta A-07 y B-14).

## Do's and Don'ts

### Do:

- **Do** poner toda imagen con `Foto.astro`, con su texto alternativo en VAL y CAST, y guardarla en `src/assets/`.
- **Do** sacar todo color nuevo del mapa (`src/assets/mapa/mapa-mariola.png`) y comprobar su contraste antes de usarlo.
- **Do** reservar la teja (#9c5530) para la acción principal y la marca de "estás aquí".
- **Do** mantener cada zona táctil en al menos 44 × 44 px y el foco visible: anillo teja sobre fondos claros y teja clara (#f0b890) sobre verde bosque.
- **Do** diseñar cada pieza primero a 375 px y comprobarla después en escritorio.
- **Do** mantener las transiciones cortas (160 ms) y solo de color u opacidad; si un componente añade desplazamientos o animaciones, ofrece su alternativa con `prefers-reduced-motion`.

### Don't:

- **Don't** poner fotos en `public/`, ni con `<img>` a mano, ni subir originales con metadatos de ubicación.
- **Don't** usar el amarillo del wireframe: era un color de boceto y no forma parte de la paleta.
- **Don't** poner la teula (#9c5530) sobre Verd bosc u otro verde oscuro, ni como marca ni como foco: ahí va Teula clara (#f0b890).
- **Don't** marcar el `hover` de un botón teja solo con el cambio de color: va con subrayado.
- **Don't** poner texto en Verd prat (#99b561) ni en la teja original del mapa (#ae7349); no llegan al contraste mínimo.
- **Don't** usar blanco puro ni crema como fondo general de la página.
- **Don't** añadir sombras, degradados ni efectos de cristal para separar zonas; se separan por planos de color.
- **Don't** cargar fuentes desde servidores externos (Google Fonts u otros).
- **Don't** inventar datos para rellenar la interfaz (precios, plazas, fechas, certificados): los textos de prueba se marcan como tales (ver `PRODUCT.md`).
