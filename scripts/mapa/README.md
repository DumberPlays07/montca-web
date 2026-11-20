# Mapa de la Serra de Mariola (tarea A-05)

Genera el mapa de la Serra de Mariola a partir de datos reales, sin dibujarlo a mano. El mapa que usa la web es una imagen con un botón encima de cada pico: ver [Versión definitiva](#versión-definitiva). Los SVG de `generar_mapa.py` se quedan como pruebas de estilo.

## Cómo se ejecuta

Solo hace falta [uv](https://docs.astral.sh/uv/). No hay que instalar Python ni añadir nada al `package.json`: las dependencias están declaradas dentro del propio script (metadatos PEP 723) y `uv` las instala en un entorno temporal.

```sh
uv run scripts/mapa/generar_mapa.py
```

En Windows, si la consola muestra mal las tildes: `$env:PYTHONIOENCODING="utf-8"` (PowerShell) antes de ejecutarlo.

La primera vez descarga los datos en `scripts/mapa/datos/` (unos 33 MB). Esa carpeta está en `.gitignore` y no se sube. Para volver a descargarlos, borra la carpeta.

Resultado, en `scripts/mapa/salida/`:

| Archivo | Estilo |
| --- | --- |
| `mapa-a-franjas.svg` | Franjas de altura con colores planos (ilustración) |
| `mapa-b-sombreado.svg` | Las mismas franjas con sombreado suave (luz del noroeste) |
| `mapa-c-curvas.svg` | Curvas de nivel finas cada 50 m, más gruesas cada 250 m |
| `comparar.html` | Las tres juntas, a ancho de móvil (375 px) y de escritorio |

El script avisa si algún SVG pasa de 150 KB y muestra, para cada pico rotulado, su altura en OpenStreetMap frente a la del modelo de elevación, para comprobar que cae donde toca.

Lo que se puede ajustar está en las constantes del principio de `generar_mapa.py`: el recorte (`LAT_*`, `LON_*`), las franjas (`NIVELES`), los colores (provisionales hasta que exista `DESIGN.md`) y cuántos picos se rotulan (`MAX_PICOS`, `ALTURA_MINIMA_PICO`, `SEPARACION_MINIMA`). Los picos rotulados son provisionales: la lista de los 5 cims la dará Montca (A-09).

## Vista 3D (diorama de papel)

```sh
uv run scripts/mapa/generar_mapa_3d.py
```

Usa los mismos datos, el mismo recorte y los mismos picos que `generar_mapa.py` (los importa de él). Agrupa las alturas en escalones planos, como capas de cartulina, y renderiza sin ventana con [pyvista](https://docs.pyvista.org/) (VTK). La luz y la sombra arrojada se calculan en el script con numpy y se pintan como color de cada celda, así que la imagen sale igual en cualquier ordenador, sin depender de la tarjeta gráfica. Tarda alrededor de un minuto y medio.

Genera una variante por cámara (`sur`, `sureste`, `este`) y copia la de `CAMARA_PRINCIPAL` con los nombres sin sufijo:

| Archivo | Qué es |
| --- | --- |
| `mapa-3d.png` / `mapa-3d-<cámara>.png` | Imagen de 2400 × 1350 px |
| `mapa-3d.webp` / `mapa-3d-<cámara>.webp` | Versión web; el script avisa si pasa de 250 KB |
| `mapa-3d-nombres.png/.webp` / `mapa-3d-<cámara>-nombres.png/.webp` | La misma imagen con el punto, el nombre y la altura de cada pico dibujados encima (para usarla sin botones) |
| `picos-3d.json` / `picos-3d-<cámara>.json` | Nombre, altura, posición en la imagen (`x`, `y` en % del ancho y del alto) y si el pico se ve o lo tapa otra montaña |
| `comparar-3d.html` | Las tres cámaras con un botón por pico, a 375 px y a ancho de escritorio |

La posición de cada pico se calcula proyectando su coordenada real, a la altura de la capa en la que cae, con la misma cámara que hace la imagen.

`comparar-3d.html` lee los JSON con `fetch`, así que hay que abrirla desde un servidor local, no con doble clic:

```sh
cd scripts/mapa/salida
uv run python -m http.server 8765
# y abrir http://127.0.0.1:8765/comparar-3d.html
```

Todo lo ajustable está en las constantes del principio de `generar_mapa_3d.py`: `NUM_ESCALONES`, `EXAGERACION`, `COLORES_ESCALONES` (uno por escalón), los colores del cielo y del canto, la luz (`LUZ_*`, `SOMBRA_*`) y las cámaras (`CAMARAS`: acimut, elevación, ángulo de visión, zoom y desplazamiento vertical).

## Castillo de Cocentaina sobre el mapa

```sh
uv run scripts/mapa/colocar_castillo.py
```

Coloca la torre del castillo sobre la versión del mapa retocada con Gemini, sin volver a pasar por Gemini. Quita el fondo blanco de la torre (sin dejar halo), la reduce y la achata, borra el punto azul que marcaba su sitio y los árboles que quedan bajo su base, y la apoya con una sombra suave. Escribe `salida/mapa-con-castillo.png`. Tarda unos segundos.

Lo ajustable está al principio del script: la posición del centro de la base (`POSICION_X`, `POSICION_Y`, en % de la imagen), el tamaño (`ANCHO_TORRE`, en % del ancho), el achatamiento vertical (`ACHATAMIENTO`) y la sombra (`SOMBRA_*`). La posición está 2 puntos a la izquierda del punto azul para que la base quede entera sobre el escalón de terreno; más a la izquierda el escalón se estrecha y la base pisa la pared del escalón de detrás.

Posiciones de referencia (OpenStreetMap, proyectadas con la cámara `sur` de `generar_mapa_3d.py`, en % de la imagen del render):

| Lugar | OSM | Lat, lon | En el render |
| --- | --- | --- | --- |
| Cocentaina (`place=town`, 436 m) | node 1470838222 | 38,744158, −0,4400707 | 82,46 %, 68,80 % |
| Castell de Cocentaina (`historic=castle`) | way 376877218 | 38,7459185, −0,4475344 | 80,05 %, 65,25 % |

Las versiones de Gemini desplazan algo el relieve: en `mapa-base-pueblo.jpg` el terreno está unos 30-40 px a la derecha y 10 px más abajo que en el render, así que esas posiciones hay que corregirlas a ojo comparando con el render. Gemini dibujó el pueblo unos 90 px por debajo de donde está Cocentaina de verdad (que caería hacia 83,9 %, 69,5 % en esa imagen).

## Versión definitiva

**Qué es.** La imagen del mapa que usa la web: el diorama 3D de la cámara `sur` (render de `generar_mapa_3d.py` a partir del relieve real), retocado con Gemini a partir de `mapa-base-pueblo.jpg`, con el pueblo y el castillo de Cocentaina. Encima, la web pone un botón HTML por pico, colocado en % de la imagen, que se adapta a cualquier ancho.

**Dónde está.**

| Archivo | Qué es |
| --- | --- |
| `src/assets/mapa/mapa-mariola.png` | La imagen que usa la web (1024 × 572 px). |
| `fuentes/mapa-definitivo.png` | El original, igual que el anterior, guardado junto a las demás fuentes de Gemini. |
| `src/data/picos-mapa.json` | Un objeto por pico: `nombre`, `altura` (m), `x`, `y` (en % del ancho y del alto de la imagen, desde arriba a la izquierda) y `visible`. La lista de picos es provisional hasta que Montca dé los 5 cims (A-09). |

**Cómo se recalculan los picos.** Gemini desplaza algo el relieve, así que las posiciones de `picos-3d.json` no caen exactas sobre esta imagen. Para recolocarlas:

```sh
uv run scripts/mapa/generar_mapa_3d.py        # si no existe salida/ (render y picos-3d.json)
uv run scripts/mapa/colocar_picos_definitivo.py
cd scripts/mapa/salida && uv run python -m http.server 8765
# y abrir http://127.0.0.1:8765/previa-definitiva.html (también funciona con doble clic)
```

`colocar_picos_definitivo.py` lleva cada pico del render a la imagen con una transformación global (`Y_RENDER`, `Y_DEFINITIVA`, `ESCALA_Y`, medidas con el alto del bloque en las dos imágenes) y lo afina buscando dónde encajan mejor los bordes de los escalones del render sobre los de la imagen. Si un pico sale con un desplazamiento muy distinto al del resto (la coincidencia falla donde Gemini cambió más el dibujo), le aplica el desplazamiento mediano y lo avisa. En `previa-definitiva.html` cada botón se puede arrastrar si no cae en su cumbre; la página muestra el JSON final, que se copia a `src/data/picos-mapa.json`. La plantilla de la página es `previa-definitiva.plantilla.html`.

**Falta.** La imagen es provisional en tamaño: hay que sustituirla por una versión en alta resolución (≥ 2400 px de ancho) con el mismo encuadre antes de publicar (tarea A-29). Al cambiarla, copia la nueva a los dos sitios de la tabla y vuelve a ejecutar `colocar_picos_definitivo.py`: si el encuadre es el mismo, las posiciones en % no deberían moverse; si cambia, hay que volver a medir la transformación global.

**Variantes con más relieve.** Las versiones con exageración vertical x3 y x4 (`VARIANTES_RELIEVE`, con los JSON de picos y de Cocentaina y su castillo) están en la rama `experimento/mapa-relieve-x3-x4`. No se usan de momento.

## Fuentes hechas con Gemini (`fuentes/`)

Estas imágenes no salen de ningún script: se hicieron con Gemini a partir del render y no se pueden regenerar, por eso son lo único de imágenes que se sube al repositorio. Las de Gemini por pasos están en JPG de calidad alta y ninguna pasa de 400 KB; `mapa-definitivo.png` va en PNG tal como salió (530 KB).

| Archivo | Qué es |
| --- | --- |
| `mapa-base-pueblo.jpg` | El diorama retocado con el pueblo de Cocentaina dibujado y un punto azul donde va el castillo (2752 × 1536 px). |
| `castillo.jpg` | La torre del castillo suelta sobre fondo blanco (recortada con margen blanco; el script quita el fondo). |
| `mapa-definitivo.png` | El mapa definitivo, retocado con Gemini a partir de `mapa-base-pueblo.jpg` (1024 × 572 px, PNG). Ver [Versión definitiva](#versión-definitiva). |

**`mapa-base-pueblo.jpg`.** Hecha con Gemini (Nano Banana Pro) en varias vueltas, partiendo de `mapa-3d.png` (render de `generar_mapa_3d.py`). Resumen de lo que se pidió en cada vuelta:

1. Estilo: ilustración amable para niños, jóvenes y familias, solo en tonos verdes (oscuros en los valles, claros en las zonas altas), vista desde arriba inclinada, cumbres más luminosas para poder poner botones encima, sin texto. Podía estilizar las formas, pero cada cumbre debía quedarse en su sitio, sin añadir ni quitar cumbres y con el mismo encuadre.
2. Elevar de forma moderada las 6 cumbres más altas, sin desplazarlas.
3. Pueblo: sobre una copia con un punto rojo en Cocentaina (proyectado desde OpenStreetMap con la cámara del render), un grupo compacto de casitas con tejados marrón teja y terracota y fachadas crema, a escala de los pinos. Es la única zona no verde, junto al castillo. Gemini dejó el punto azul del castillo, que después usa `colocar_castillo.py` para colocarlo (y lo borra).

**`castillo.jpg`.** Hecha con Gemini aparte, sobre fondo blanco: castillo de planta cuadrada con almenas, compacto y más alto que ancho, como una torre, en piedra beige amarillenta, vista inclinada unos 45 grados, estilo diorama de papel y sin texto. Se pega con `colocar_castillo.py` porque Gemini no respetaba la posición en la ladera.

## Orden de ejecución

1. `generar_mapa.py`: descarga los datos (relieve y picos) y genera los SVG 2D de prueba.
2. `generar_mapa_3d.py`: usa los mismos datos y genera los renders 3D y los JSON con la posición de los picos. El render de la cámara `sur` es la base que se retocó con Gemini.
3. (A mano, ya hecho) retoque con Gemini: el resultado está en `fuentes/`.
4. `colocar_castillo.py`: solo necesita `fuentes/`; se puede ejecutar sin haber ejecutado los anteriores.
5. `colocar_picos_definitivo.py`: necesita el render y `picos-3d.json` del paso 2 y `fuentes/mapa-definitivo.png`; escribe la vista previa para revisar las posiciones de los picos.

Todo lo que generan los scripts va a `salida/`, que está en `.gitignore` igual que `datos/`.

## De dónde salen los datos

- **Relieve:** Copernicus DEM GLO-30 (modelo digital de superficie, resolución de 30 m), tesela `N38_00_W001_00`, descargada de [AWS Open Data](https://registry.opendata.aws/copernicus-dem/). El script recorta la Serra de Mariola, de Bocairent y Banyeres a Cocentaina (38,69–38,81 N, 0,67–0,41 O).
- **Picos:** nodos `natural=peak` con nombre de [OpenStreetMap](https://www.openstreetmap.org/), consultados con la API de Overpass dentro de la caja `(38.64,-0.72,38.84,-0.38)`.

## Atribución obligatoria

El mapa tiene que mostrar estos créditos en una esquina o justo al lado. Los SVG llevan una versión corta y `comparar.html` lleva el texto completo; el componente final de la web tendrá que llevar el texto completo.

**Copernicus DEM.** Como el mapa modifica los datos (recorte, suavizado, franjas), la licencia exige esta nota literal:

> produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved

Fuente: apartado *User Obligations* de la [página del COP-DEM en Copernicus Data Space](https://dataspace.copernicus.eu/explore-data/data-collections/copernicus-contributing-missions/collections-description/COP-DEM). La licencia es la *ESA-User license for the use of CCM*, enlazada desde esa misma página.

**OpenStreetMap.** Datos bajo licencia [ODbL](https://opendatacommons.org/licenses/odbl/). Según las [Attribution Guidelines](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines), el crédito tiene que nombrar "OpenStreetMap" y dejar claro que los datos están bajo la ODbL, por ejemplo enlazando el texto a <https://www.openstreetmap.org/copyright>. La forma "© OpenStreetMap contributors" también se acepta:

> © OpenStreetMap contributors

Textos consultados el 17/11/2026.
