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
  display:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 1.5rem + 3vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  numeral:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "clamp(3rem, 2.4rem + 2.5vw, 4rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.25rem + 1vw, 2rem)"
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
  button-inscripcion:
    backgroundColor: "{colors.teula}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.boton}"
    padding: "8px 24px"
    height: "48px"
  button-inscripcion-hover:
    backgroundColor: "{colors.teula-fosca}"
    textColor: "{colors.blanco}"
  tarjeta-evento:
    backgroundColor: "{colors.herba-clara}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.boton}"
    padding: "16px"
  tarjeta-evento-abierto:
    backgroundColor: "{colors.pedra}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.boton}"
    padding: "16px"
  bloque-categoria:
    backgroundColor: "{colors.herba-clara}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.boton}"
    padding: "16px"
  franja-evento:
    backgroundColor: "{colors.verd-bosc}"
    textColor: "{colors.boira}"
    padding: "12px 16px"
  franja-evento-hover:
    backgroundColor: "{colors.tinta}"
    textColor: "{colors.boira}"
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

> Acordado con Pablo en la B-09 (2026-11-22) y recogido de lo construido con `/impeccable document`. Actualizado el 2026-11-25 con lo construido en C-04 (T047): el tamaño Display y los componentes de eventos. Los colores salen medidos de la ilustración `src/assets/mapa/mapa-mariola.webp`. Los tokens del frontmatter son las variables CSS de `src/styles/global.css` (`--color-*`, `--espacio-*`, `--radio-*`): si cambia uno, se cambian los dos. Los detalles que el formato no admite (foco, movimiento, puntos de corte) están en `.impeccable/design.json`.

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
- **Teula clara** (#f0b890): la marca de pintura y el anillo de foco **sobre fondos verde bosque**, donde la teja normal no se ve (1.5:1). Sobre verde bosque mide 4.7:1. Es el color de la marca, la flecha y el foco de la franja de evento de la portada.

### Secondary

- **Verd bosc** (#375639): el verde más presente del mapa (las caras de los bancales). Es el fondo de la barra inferior del móvil y del pie, y el color de los titulares. Blanco o neblina encima: 7.5–8.2:1.
- **Verd fulla** (#527742): iconos, bordes activos y texto grande. Mide 4.7:1 sobre la neblina; no se usa para texto pequeño sobre crema (4.2:1) ni sobre Herba clara (4.4:1): ahí el texto pequeño va en Verd bosc (la marca de la tarjeta de evento).

### Tertiary

- **Pedra de la torre** (#f3e6c8): la crema, sacada de la piedra de la torre (#dcc291) y aclarada. Se usa en superficies cálidas puntuales: tarjetas destacadas, avisos de "Properament", franjas de confianza, el plano de deportes y precio del cartel de un evento y la tarjeta de un evento con las inscripciones abiertas. No es el fondo general.

### Neutral

- **Boira de Mariola** (#f1f6ef): el fondo de toda la web, que es el cielo del mapa. Se elige en lugar de un blanco o una crema para que la ilustración se funda con la página.
- **Herba clara** (#dff3d7): superficies teñidas, `hover` de los enlaces del menú, separación de bloques sin usar líneas, los bloques de plazas por categoría y las tarjetas de evento sin inscripción abierta.
- **Tinta de bosc** (#1f3324): el texto de cuerpo. Mide 12.3:1 sobre la neblina y 10.9:1 sobre crema.
- **Verd prat** (#99b561): solo decoración (ilustración, detalles gráficos). **Nunca texto ni borde funcional** (2.1:1).

### Named Rules

**The Paint Mark Rule.** La teja es la pintura del sendero: marca la acción y el "estás aquí", nada más. Nunca se usa como fondo de una sección, en titulares ni como decoración. Si en una pantalla hay más de dos elementos en teja, uno sobra. Lo que informa no es acción: la marca de la línea de estado de un evento ("Inscripcions obertes…") va en Verd bosc, así la lista de eventos no multiplica la teja con cada evento abierto. Una misma acción repetida en la página (los dos "Inscriure's") cuenta como una sola señal.

**The Dark Ground Rule.** La teula (#9c5530) nunca va sobre Verd bosc ni sobre otro verde oscuro: el contraste se queda en 1.5:1 y la marca desaparece. Sobre fondos verdes oscuros (barra inferior, pie), la marca de pintura y el anillo de foco son siempre Teula clara (#f0b890, 4.7:1).

**The Mist Ground Rule.** El fondo es siempre Boira de Mariola (#f1f6ef), nunca blanco puro ni crema. La crema se reserva para superficies puntuales.

**The Contrast Floor Rule.** El texto pequeño mide al menos 4.5:1 y los iconos, bordes funcionales y anillos de foco, al menos 3:1. Verd prat y la teja original del mapa (#ae7349) no llevan texto.

## Typography

**Display Font:** Overpass (con system-ui, sans-serif)
**Body Font:** Overpass (con system-ui, sans-serif)

**Character:** Overpass viene de la rotulación de las señales de carretera, así que es la voz natural de una web que se lee como un sendero señalizado. Es clara de lejos y en pantallas pequeñas, seria sin ser fría, y su peso 800 da a los titulares la energía que piden Montca Sports y el público joven.

La fuente se sirve desde la propia web con la API de fuentes de Astro (proveedor Fontsource): sin peticiones a Google Fonts y sin datos del visitante enviados fuera. Pesos: 400, 600 y 800.

### Hierarchy

Tamaños pensados para 375 px, que en escritorio crecen con `clamp()`. Display, Numeral y Headline se fijaron con la página del torneo (C-04).

- **Display** (800, `clamp(2.25rem, 1.5rem + 3vw, 3.5rem)`, interlineado 1.05, espaciado -0.01em): el `h1` de la página de un evento y de la sección Eventos. Reservado para los nombres grandes de sección (Montca Sports, Repte 5 Cims) cuando existan.
- **Numeral** (800, `clamp(3rem, 2.4rem + 2.5vw, 4rem)`, interlineado 1, espaciado -0.02em, cifras tabulares): el día y el mes de cada jornada en el cartel de un evento (27·12).
- **Headline** (800, `clamp(1.5rem, 1.25rem + 1vw, 2rem)`, interlineado 1.15, `text-wrap: balance`): los `h2` de las secciones de un evento (Què cal saber, Preguntes freqüents, Places i equips) y el nombre en la tarjeta de evento. Los `h3` de las categorías van a 1.25rem. Todos en Verd bosc.
- **Marca**: el nombre "Montca Actiu" ya no se escribe con texto; lo pone el logo (ver Cabecera y Pie). Los tokens `marca` y `marca-pie` del principio quedan sin uso hasta que se retiren.
- **Title** (600, 1.125rem): enlaces del menú desplegable del móvil; también nombres de actividad en tarjetas y fichas.
- **Body** (400, 1rem, 1.55): texto corrido, con un máximo de 65–70 caracteres por línea.
- **Label** (600, 0.875rem, espaciado 0.02em): selector VAL / CAST, avisos legales y la marca de un evento ("Montca Sports" sobre el nombre). Los enlaces del menú de escritorio van a 0.9375rem y la barra inferior a 0.8125rem. Sin mayúsculas forzadas: los textos en valenciano se leen mejor en minúscula (VAL / CAST son abreviaturas, no mayúsculas forzadas).

### Named Rules

**The Signpost Rule.** Las etiquetas de navegación y los botones dicen a dónde llevan con una o dos palabras (Agenda, Activitats, Apunta't). Si una etiqueta necesita una frase, la señal está mal puesta.

**The 16px Floor Rule.** Ningún texto de lectura baja de 1rem en el móvil, y ninguna etiqueta baja de 0.8125rem.

**The Floating Dot Rule.** El "·" de Overpass se dibuja con un espaciado raro, así que el punto que separa dos datos (27·12, "Montca Sports · Esdeveniment", "Laia · 7") se dibuja con CSS: un cuadrado de 0.14em en `currentColor`, oculto a los lectores de pantalla, con un texto solo para ellos donde hace falta.

## Layout

Móvil primero. Se diseña para 375 px y se amplía:

- **Móvil (base, desde 320 px):** una columna con un margen lateral de 16 px. Cabecera fija arriba (`position: sticky`, 56 px), con la marca, el selector VAL/CAST y el botón de menú; por debajo de 360 px el botón se queda solo con el icono, y si el texto está muy ampliado las acciones bajan a una segunda línea. **Barra fija abajo** (64 px) con Agenda · Activitats · WhatsApp al alcance del pulgar. El `body` reserva ese alto más `env(safe-area-inset-bottom)` para que la barra no tape nada.
- **Tableta (desde 48rem):** el margen lateral pasa a 32 px y el pie se reparte en tres columnas; la barra inferior se mantiene.
- **Escritorio (desde 64rem):** la barra inferior desaparece y sus destinos pasan al menú horizontal de la cabecera, con el botón Reserva en teja a la derecha (como en el wireframe). El contenido se centra con un ancho máximo de 72rem.
- **Página de un evento:** en 375 px el cartel cabe entero en la primera pantalla (marca, título, jornadas, plano de deportes y precio, lugar, estado y botón). Desde 64rem se reparte en dos columnas, el cartel a la izquierda (1.15fr) y la acción a la derecha (1fr), alineadas arriba. Las categorías de plazas y las tarjetas de la lista de eventos van en rejilla de al menos 20rem por columna.

Ritmo de espaciado sobre una base de 8 px (4 px para ajustes finos), con más aire encima de un título que debajo. La densidad es baja: cada bloque de la portada respira como un bancal del mapa.

## Elevation & Depth

La web es plana. La profundidad sale de **planos de color**, igual que en el mapa los bancales se separan por tono y no por sombra: neblina → herba clara → crema → verde bosque. Las barras fijas se separan del contenido con una línea de 1 px en un verde translúcido, no con una sombra.

El menú desplegable del móvil tampoco lleva sombra: ocupa toda la pantalla entre la cabecera y la barra, con fondo Boira, así que no flota sobre nada. La única excepción prevista es el panel de ficha que sube desde abajo en el móvil (otra tarea), que puede llevar una sombra suave hacia arriba para leerse como una capa encima del mapa.

### Named Rules

**The Terrace Rule.** Lo que está más cerca se distingue por el color de su plano, no por una sombra. Las sombras solo aparecen en capas que flotan de verdad (paneles que suben y menús desplegados).

## Shapes

Formas de señal de sendero: rectángulos con esquinas ligeramente suavizadas (4–6 px), nunca píldoras ni círculos en los controles principales. La **marca de pintura** es la forma propia de la web: una franja rectangular corta y gruesa en teja (o teja clara sobre verde), como las marcas pintadas en las rocas de los senderos. Marca la página actual en el menú y en la barra inferior. Los iconos son de trazo, de 24 px, con los extremos redondeados para que hagan juego con Overpass. En el cartel de un evento, una raya Verd bosc de 5 px sobre cada fecha hace de "bancal" del mapa.

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
- **Logo (cabecera):** el logo es la **imagen original de Montca** (PNG con fondo transparente, sin redibujar ni cambiar colores), no un SVG, hasta que Montca pase el vectorial; entonces se sustituye. En el móvil se ve el símbolo (hexágono, 52 px de ancho) y desde 30rem (480 px), la línea de texto "Montca Actiu" (232 px de ancho), porque a menos ancho no cabe junto al selector de idioma y el botón Menú. Es un enlace a la portada con el nombre accesible "Montca Actiu" (el `alt` de la imagen visible; la otra va con `display: none`) y una zona táctil de al menos 44 px. Va con `Foto`, como el resto de imágenes. Las piezas salen de `scripts/logo/generar_piezas.py` y están en `src/assets/logo/`.
- **Menú móvil:** botón Menú con `aria-expanded` y `aria-controls` (patrón disclosure). Al abrirlo, el panel ocupa desde la cabecera hasta la barra inferior, tapa la página y bloquea su desplazamiento. Cada enlace mide 52 px de alto, va separado por líneas de 1 px y la página actual lleva la marca de pintura a la izquierda (14 × 6 px). Al final está el botón Reserva a todo el ancho. Escape lo cierra y devuelve el foco al botón.
- **Barra inferior (móvil y tableta):** fondo Verd bosc, tres huecos iguales con icono de 24 px y etiqueta (600, 0.8125rem, Boira). La página actual lleva la marca de pintura en Teula clara arriba del hueco (24 × 5 px). Sin número de WhatsApp, el tercer hueco es Contacte.
- **Selector de idioma:** enlace a la misma página en el otro idioma, con `lang`, `hreflang` y `aria-label` con el nombre del idioma (Castellano / Valencià).
- **Saltar al contenido:** primer elemento de la página, visible solo con el foco.
- **Enlace "← Tornar":** Verd bosc en peso 600 con la flecha en SVG (Overpass no tiene "←"). Va en fichas y eventos.

### Logo, favicon e imagen para compartir

- **Mientras no haya vectorial:** el logo es la imagen original de Montca, de 1536 px, con el fondo quitado y recortada (`scripts/logo/`). No se redibuja, no se recolorea y no se hace un SVG que solo envuelva el PNG. Cuando Montca pase el original (SVG, AI o PDF) se sustituyen las piezas y se retira esta nota.
- **Favicon:** el símbolo sobre un cuadrado Boira de esquinas redondeadas (20 %), en PNG (`public/favicon.png`, 192 px) y `public/favicon.ico`, enlazados desde `BaseLayout`. El fondo claro hace que se vea también en las pestañas en modo oscuro.
- **Imagen para compartir por defecto:** el logo completo centrado sobre blanco, de 1200 × 630 (`src/assets/logo/imagen-compartir.png`). Una página con imagen propia, como un evento, la sustituye.

### Pie

- **Fondo:** Verd bosc, con todos los enlaces en Boira y subrayado de 2 px al pasar el ratón.
- **Logo (pie):** la línea de texto en blanco (la de color pasada a blanco, misma forma), de 240 px como máximo y enlazada a la portada con el nombre "Montca Actiu". Es la imagen original de Montca, igual que en la cabecera.
- **Contenido:** logo y lema, correo de contacto (y WhatsApp cuando haya número), todas las secciones en dos columnas y, separados por una línea, los avisos legales y el ©. Lleva todas las secciones para que la web se pueda recorrer sin JavaScript.
- **Densidad:** compacto en el móvil (huecos de 16 px) y con más aire desde 48rem (huecos de 32 px, tres columnas).

### Iconos

Trazo de 2 px, 24 × 24, extremos y uniones redondeados, en `currentColor` y decorativos (`aria-hidden`): siempre van con texto. Están en `Icono.astro`: menú, cerrar, agenda, actividades (dos picos de Mariola), WhatsApp, correo, volver, seguir (la flecha → de la franja), lugar (chincheta) y externo (enlace que se abre fuera).

### Eventos

Las piezas de la sección Eventos y de la página de cada evento (C-04). Todo texto sale del contenido del evento o del diccionario por idioma, nunca escrito en el componente.

- **Botón de inscripción ("Inscriure's"):** el botón primario (teja) a todo el ancho, de 48 px de alto mínimo y 1.125rem en peso 600; `hover` y `active` en Teula fosca y subrayado, como el resto. Debajo, la nota del canal de Montca. Sin dirección de inscripción, en su lugar sale "Escriu-nos per a apuntar-te" (WhatsApp o, sin número, correo) y nunca un botón roto. No sale con "pròximament" ni "tancades". Sale dos veces en la página (en el cartel y debajo de las plazas) y cuenta como una sola señal de acción.
- **Cartel de evento:** la primera pantalla de la página. Marca en Label, `h1` en Display, cada jornada con su Numeral sobre la raya Verd bosc, el plano Pedra de deportes y precio (con "preu final pendent" mientras no esté confirmado), el lugar con "Com arribar" (enlace externo de 44 px, en Verd bosc y no en teja), la línea de estado y el botón.
- **Línea de estado:** texto en peso 600 con una marca de pintura de 20 × 6 px en **Verd bosc** que solo sale con las inscripciones abiertas. El script cambia el texto y el estado sin recargar. No es teja porque informa y no es una acción (Paint Mark Rule).
- **Plazas y equipos:** un bloque Herba clara por categoría (6 px de radio, 16 px de relleno) con el nombre, los años de nacimiento, "N de M places lliures" en 1.5rem y peso 800 (o "Completa" y "Pots apuntar-te a la llista d'espera") y la lista de equipos. Cada equipo es un desplegable de 44 px con "+" que pasa a "−", como las preguntas; dentro, "nombre · dorsal" con el punto volado, y el capitán lleva "capità" en texto sobre una etiqueta Boira. Un equipo con los jugadores ocultos sale solo con su nombre. Sin equipos confirmados, las plazas y "Sigues el primer!"; con error, una línea de aviso. Con la fuente sin datos, no sale.
- **Tarjeta de evento:** Herba clara, o Pedra si el evento tiene las inscripciones abiertas (cambia con el estado). Marca en Verd bosc, nombre en Headline, jornadas, lugar con su icono y la línea de estado. Toda la tarjeta es un enlace: el del nombre se estira por encima (`::after`), así el lector oye solo el nombre y el foco rodea la tarjeta entera. Por eso no lleva otros enlaces dentro.
- **Lista de eventos:** rejilla de tarjetas por orden de la primera jornada, sin los eventos ya pasados. Sin ninguno, un mensaje y el botón secundario (verde) "Escriu-nos" a WhatsApp o al correo.
- **Franja de evento (portada):** banda a todo el ancho en Verd bosc con el nombre (1.125rem, peso 800) y la línea de estado con su marca, todo en Boira; la marca, la flecha y el foco van en Teula clara (Dark Ground). Toda la banda es un enlace de al menos 44 px, no es fija y en `hover` pasa a Tinta con el nombre subrayado. El foco se dibuja por dentro de la banda. Solo sale con las inscripciones abiertas y la oculta el script cuando dejan de estarlo.
- **Cuenta atrás (portada):** plano Pedra con radio de 6 px, entre el mapa y los accesos, sin sombra. Lleva "Montca Sports · nombre del evento" en Label (Verd bosc) y **cuatro casillas** de ancho igual (días, horas, minutos y segundos) separadas por una línea de 1 px: cada número en 2–3rem, peso 800 y cifras tabulares con dos cifras mínimas, y debajo la unidad (`d`, `h`, `min`, `s`) en Label. Así nada se mueve al cambiar. Debajo, "Comença el 27/12" (con "a les 10:30" si la jornada trae hora). Cuando no es una cuenta ("Hui", "En marxa", "Properament") la palabra va en Headline y no hay casillas. La franja habla de las inscripciones; esta pieza, de cuándo empieza, así que no lleva botón ni plazo. Toda la pieza es un enlace de al menos 44 px a la página del evento, con flecha y `hover` en Herba clara; sin evento con fecha sale "Properament", sin enlace ni flecha. Cuenta el tiempo real hasta las 00:00 de Madrid de la primera jornada (o su hora) y el script la recalcula cada segundo. Con `prefers-reduced-motion` no hay segundos y se actualiza cada minuto. Las casillas llevan `aria-hidden`; el lector oye una frase fija ("Falten 32 dies") que solo cambia con el día, y no hay `aria-live`.
- **Contenido de un evento:** "Què cal saber" (tabla de categorías que se desplaza dentro de su caja si no cabe), "Preguntes freqüents" (desplegables de 44 px) y "Com arribar".

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
- **Do** sacar todo color nuevo del mapa (`src/assets/mapa/mapa-mariola.webp`) y comprobar su contraste antes de usarlo.
- **Do** reservar la teja (#9c5530) para la acción principal y la marca de "estás aquí"; lo que solo informa (el estado de un evento) va en Verd bosc.
- **Do** poner en Verd bosc el texto pequeño sobre Pedra y Herba clara.
- **Do** mantener cada zona táctil en al menos 44 × 44 px y el foco visible: anillo teja sobre fondos claros y teja clara (#f0b890) sobre verde bosque.
- **Do** diseñar cada pieza primero a 375 px y comprobarla después en escritorio.
- **Do** mantener las transiciones cortas (160 ms) y solo de color u opacidad; si un componente añade desplazamientos o animaciones, ofrece su alternativa con `prefers-reduced-motion`.

### Don't:

- **Don't** poner fotos en `public/`, ni con `<img>` a mano, ni subir originales con metadatos de ubicación.
- **Don't** usar el amarillo del wireframe: era un color de boceto y no forma parte de la paleta.
- **Don't** poner la teula (#9c5530) sobre Verd bosc u otro verde oscuro, ni como marca ni como foco: ahí va Teula clara (#f0b890).
- **Don't** marcar el `hover` de un botón teja solo con el cambio de color: va con subrayado.
- **Don't** poner texto en Verd prat (#99b561) ni en la teja original del mapa (#ae7349); no llegan al contraste mínimo.
- **Don't** poner Verd fulla en texto pequeño sobre Pedra ni sobre Herba clara (4.2:1 y 4.4:1).
- **Don't** escribir el "·" como carácter entre datos: se dibuja con CSS (Floating Dot Rule).
- **Don't** meter enlaces dentro de una tarjeta que ya es un enlace.
- **Don't** usar blanco puro ni crema como fondo general de la página.
- **Don't** añadir sombras, degradados ni efectos de cristal para separar zonas; se separan por planos de color.
- **Don't** cargar fuentes desde servidores externos (Google Fonts u otros).
- **Don't** inventar datos para rellenar la interfaz (precios, plazas, fechas, certificados): los textos de prueba se marcan como tales (ver `PRODUCT.md`).
