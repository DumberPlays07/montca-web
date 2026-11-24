# /// script
# requires-python = ">=3.11,<3.14"
# dependencies = [
#     "numpy>=1.26",
#     "scipy>=1.11",
#     "pillow>=10.0",
# ]
# ///
"""Coloca los picos sobre el mapa definitivo y genera una vista previa para revisarlos.

Gemini desplaza algo el relieve al retocar el render, así que las posiciones de
salida/picos-3d.json (render "sur" de generar_mapa_3d.py) no caen exactas en la
imagen definitiva. Este script:

1. Lleva cada pico del render a la imagen definitiva con una transformación global
   (el bloque ocupa casi el mismo ancho; en vertical está desplazado y algo estirado).
2. Afina cada pico buscando, en una ventana pequeña, dónde encajan mejor los bordes de
   los escalones del render sobre los de la imagen definitiva.
3. Si un pico sale con un desplazamiento muy distinto al del resto (la coincidencia
   falló), le aplica el desplazamiento mediano.
4. Escribe salida/picos-definitivo.json y salida/previa-definitiva.html, con un botón
   por pico que se puede arrastrar para corregirlo a mano; la página muestra el JSON
   resultante, que es el que se copia a src/data/picos-mapa.json.

Necesita haber ejecutado antes generar_mapa_3d.py (usa su render y su picos-3d.json).
Uso:  uv run scripts/mapa/colocar_picos_definitivo.py
"""

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, map_coordinates, sobel

CARPETA = Path(__file__).resolve().parent
SALIDA = CARPETA / "salida"
IMAGEN_DEFINITIVA = CARPETA / "fuentes" / "mapa-definitivo.webp"
# Las medidas en px de abajo están pensadas para la imagen a 1024 px de ancho; la
# definitiva (2560 px) se reduce a este ancho antes de buscar los picos.
ANCHO_TRABAJO = 1024
RENDER = SALIDA / "mapa-3d.png"
PICOS_RENDER = SALIDA / "picos-3d.json"

# Transformación global render -> definitiva, en % de cada imagen: x se queda igual y
# y = Y_DEFINITIVA + (y_render - Y_RENDER) * ESCALA_Y. Medida con el alto del bloque:
# en el render va del 46,0 % al 90,3 %; en la definitiva, del 46,9 % al 94,1 %.
Y_RENDER, Y_DEFINITIVA, ESCALA_Y = 46.0, 46.9, 1.065

MEDIO_PARCHE = 45  # px de la imagen definitiva alrededor de cada pico que se comparan
MEDIA_BUSQUEDA = 30  # px que se prueba a mover cada pico en cada dirección
MAX_DESVIO = 8  # px; si un pico se aparta más que esto del desplazamiento mediano, se usa el mediano


def bordes(gris):
    """Intensidad de los bordes (cambios de escalón), suavizada para tolerar el retoque."""
    suave = gaussian_filter(gris, 1.2)
    return gaussian_filter(np.hypot(sobel(suave, 0), sobel(suave, 1)), 1.5)


def render_en_marco_definitivo(render, alto, ancho):
    """El render remuestreado con la transformación global al tamaño de la definitiva."""
    filas, columnas = np.mgrid[0:alto, 0:ancho]
    x_pct = columnas / ancho * 100
    y_pct_render = Y_RENDER + (filas / alto * 100 - Y_DEFINITIVA) / ESCALA_Y
    return map_coordinates(render, [y_pct_render / 100 * render.shape[0], x_pct / 100 * render.shape[1]], order=1)


def mejor_desplazamiento(bordes_render, bordes_definitiva, cx, cy):
    """(dx, dy) en px que mejor encaja el entorno del pico, por correlación normalizada."""
    r = MEDIO_PARCHE
    patron = bordes_render[cy - r:cy + r, cx - r:cx + r]
    patron = (patron - patron.mean()) / (patron.std() + 1e-9)
    mejor = (-np.inf, 0, 0)
    for dy in range(-MEDIA_BUSQUEDA, MEDIA_BUSQUEDA + 1):
        for dx in range(-MEDIA_BUSQUEDA, MEDIA_BUSQUEDA + 1):
            ventana = bordes_definitiva[cy + dy - r:cy + dy + r, cx + dx - r:cx + dx + r]
            if ventana.shape != patron.shape:
                continue
            ventana = (ventana - ventana.mean()) / (ventana.std() + 1e-9)
            correlacion = float((patron * ventana).mean())
            if correlacion > mejor[0]:
                mejor = (correlacion, dx, dy)
    return mejor


def main():
    for ruta in (IMAGEN_DEFINITIVA, RENDER, PICOS_RENDER):
        if not ruta.exists():
            sys.exit(f"Falta {ruta}. Ejecuta antes generar_mapa_3d.py.")
    imagen = Image.open(IMAGEN_DEFINITIVA).convert("L")
    alto_trabajo = round(imagen.height * ANCHO_TRABAJO / imagen.width)
    definitiva = np.asarray(imagen.resize((ANCHO_TRABAJO, alto_trabajo), Image.LANCZOS)).astype(float)
    alto, ancho = definitiva.shape
    render = np.asarray(Image.open(RENDER).convert("L")).astype(float)
    bordes_render = bordes(render_en_marco_definitivo(render, alto, ancho))
    bordes_definitiva = bordes(definitiva)

    picos = json.loads(PICOS_RENDER.read_text(encoding="utf-8"))["picos"]
    medidas = []
    for pico in picos:
        cx = round(pico["x"] / 100 * ancho)
        cy = round((Y_DEFINITIVA + (pico["y"] - Y_RENDER) * ESCALA_Y) / 100 * alto)
        medidas.append((pico, cx, cy, *mejor_desplazamiento(bordes_render, bordes_definitiva, cx, cy)))

    mediano_dx = float(np.median([m[4] for m in medidas]))
    mediano_dy = float(np.median([m[5] for m in medidas]))
    print(f"Desplazamiento mediano: {mediano_dx:+.0f} px, {mediano_dy:+.0f} px")
    resultado = []
    for pico, cx, cy, correlacion, dx, dy in medidas:
        corregido = abs(dx - mediano_dx) > MAX_DESVIO or abs(dy - mediano_dy) > MAX_DESVIO
        if corregido:
            dx, dy = mediano_dx, mediano_dy
        x, y = round(100 * (cx + dx) / ancho, 2), round(100 * (cy + dy) / alto, 2)
        resultado.append({"nombre": pico["nombre"], "altura": pico["altura"], "x": x, "y": y,
                          "visible": pico["visible"]})
        nota = "  (no encajaba: desplazamiento mediano)" if corregido else ""
        print(f"  {pico['nombre']:<30} {x:6.2f} %  {y:6.2f} %  correlación {correlacion:.2f}{nota}")

    texto = json.dumps(resultado, ensure_ascii=False, indent=2)
    (SALIDA / "picos-definitivo.json").write_text(texto + "\n", encoding="utf-8")
    plantilla = (CARPETA / "previa-definitiva.plantilla.html").read_text(encoding="utf-8")
    (SALIDA / "previa-definitiva.html").write_text(plantilla.replace("__PICOS__", texto), encoding="utf-8")
    print(f"\nEscrito salida/picos-definitivo.json y salida/previa-definitiva.html ({ancho} × {alto}).")


if __name__ == "__main__":
    main()
