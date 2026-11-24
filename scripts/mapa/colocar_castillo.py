# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "numpy>=1.26",
#     "scipy>=1.11",
#     "pillow>=10.0",
# ]
# ///
"""Coloca la torre del castillo de Cocentaina sobre el mapa retocado, sin pasar por Gemini.

Quita el fondo blanco de la torre, la reduce y la achata, borra el punto azul que marca
su sitio y la apoya ahí con una sombra suave. Lee de fuentes/ y escribe en salida/;
no modifica las fuentes.
Uso:  uv run scripts/mapa/colocar_castillo.py
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

# ---------- constantes ajustables ----------

# Centro de la base de la torre, en % del ancho y del alto del mapa. El punto azul estaba en
# 81,59 %; se mueve un 2 % a la izquierda para que la base quede entera sobre el escalón.
POSICION_X = 79.59
POSICION_Y = 65.78
ANCHO_TORRE = 3.0  # % del ancho del mapa (3 % ≈ 83 px, como dos casas del pueblo)
ACHATAMIENTO = 0.85  # escala vertical: 1 = sin achatar; menos = más plana

SOMBRA_OPACIDAD = 0.35  # oscurecimiento máximo bajo la base
SOMBRA_DIFUMINADO = 4  # px del mapa
SOMBRA_TAMANO = 1.3  # radio de la sombra respecto a media anchura de la base
SOMBRA_DESPLAZAMIENTO = 0.25  # hacia la derecha, en medias anchuras (las sombras del mapa caen a la derecha)
COLOR_SOMBRA = (35, 55, 25)

# Fondo de la torre: "blancura" = 255 - el canal más oscuro. Por debajo de BLANCO_FONDO es fondo;
# por encima de BLANCO_OPACO es torre; en medio, borde semitransparente.
BLANCO_FONDO, BLANCO_OPACO = 18, 45
MARGEN_PUNTO = 4  # px que se borran alrededor del punto azul (se lleva el borde suavizado)
# Árboles: se borra lo más oscuro que esta luminancia (0-255) dentro de la planta de la torre,
# agrandada en MARGEN_ARBOLES (0,15 = un 15 %). El escalón ronda 105 y los árboles 60-80.
OSCURO_ARBOL = 88
MARGEN_ARBOLES = 0.15

CARPETA = Path(__file__).resolve().parent
FUENTES = CARPETA / "fuentes"  # imágenes hechas con Gemini: no se pueden regenerar, van en el repo
SALIDA = CARPETA / "salida"  # lo generado: está en .gitignore
MAPA = FUENTES / "mapa-base-pueblo.jpg"
TORRE = FUENTES / "castillo.jpg"
RESULTADO = SALIDA / "mapa-con-castillo.png"


# ---------- torre ----------

def recortar_torre(ruta):
    """Torre con el fondo transparente, sin halo blanco y recortada a su contenido."""
    rgb = np.asarray(Image.open(ruta).convert("RGB"), dtype=float)
    blancura = 255 - rgb.min(axis=2)
    alfa = np.clip((blancura - BLANCO_FONDO) / (BLANCO_OPACO - BLANCO_FONDO), 0, 1)
    # Solo es fondo lo claro que toca el borde de la imagen: así no se agujerea el interior de la torre.
    claro, _ = ndimage.label(alfa < 1)
    bordes = np.unique(np.concatenate([claro[0], claro[-1], claro[:, 0], claro[:, -1]]))
    es_fondo = np.isin(claro, bordes[bordes > 0])
    alfa = np.where(es_fondo, alfa, 1.0)
    # Quita el blanco mezclado en los píxeles del borde (si no, queda un halo claro).
    con_alfa = np.maximum(alfa, 1e-3)[..., None]
    rgb = np.clip((rgb - (1 - alfa[..., None]) * 255) / con_alfa, 0, 255)
    rgba = np.dstack([rgb, alfa * 255]).astype(np.uint8)
    torre = Image.fromarray(rgba, "RGBA")
    return torre.crop(torre.getbbox())


def escalar_torre(torre, ancho):
    alto = round(torre.height * ancho / torre.width * ACHATAMIENTO)
    # En modo premultiplicado (RGBa) el reescalado no mezcla el color del fondo transparente.
    return torre.convert("RGBa").resize((ancho, alto), Image.LANCZOS).convert("RGBA")


def centro_base(torre):
    """(x, y, media anchura) del centro de la planta de la torre, en px de la imagen de la torre.

    La planta es un rombo: su vértice delantero es el punto más bajo y el centro queda
    tan arriba de él como sube el borde inferior de la pared hasta la esquina lateral.
    """
    opaco = np.asarray(torre)[..., 3] > 128
    columnas = np.flatnonzero(opaco.any(axis=0))
    fondo = np.array([np.flatnonzero(opaco[:, c]).max() for c in columnas])
    delante = columnas[fondo == fondo.max()].mean()
    izquierda = columnas[0]
    # La pendiente del borde inferior se mide en un tramo seguro de la pared izquierda.
    tramo = (columnas > izquierda + 0.4 * (delante - izquierda)) & (columnas < delante - 0.1 * (delante - izquierda))
    pendiente = np.polyfit(columnas[tramo], fondo[tramo], 1)[0]
    recta = fondo.max() - pendiente * (delante - columnas)
    sobre_recta = columnas[(np.abs(fondo - recta) < 3) & (columnas <= delante)]
    media_anchura = delante - sobre_recta.min()
    return delante, fondo.max() - pendiente * media_anchura, media_anchura


# ---------- mapa ----------

def rellenar(mapa, hueco):
    """Rellena los píxeles de `hueco` con el color del terreno que los rodea.

    Media de los píxeles conocidos cercanos (convolución normalizada). Sin grano añadido:
    el terreno del mapa es casi liso y el ruido se notaba como motas.
    """
    rgb = np.asarray(mapa, dtype=float).copy()
    conocido = (~hueco).astype(float)
    suave = np.stack([ndimage.gaussian_filter(rgb[..., c] * conocido, 6) for c in range(3)], axis=2)
    relleno = suave / np.maximum(ndimage.gaussian_filter(conocido, 6), 1e-6)[..., None]
    rgb[hueco] = np.clip(relleno, 0, 255)[hueco]
    return Image.fromarray(rgb.astype(np.uint8))


def borrar_punto_azul(mapa):
    """Rellena el punto azul con el color del terreno de alrededor. Devuelve (mapa, centro) o None."""
    rgb = np.asarray(mapa, dtype=float)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    azul = (b > 120) & (b - g > 60) & (b - r > 60)
    manchas, cuantas = ndimage.label(azul)
    if cuantas == 0:
        return None
    tamanos = ndimage.sum(azul, manchas, range(1, cuantas + 1))
    punto = manchas == (np.argmax(tamanos) + 1)
    cy, cx = ndimage.center_of_mass(punto)
    return rellenar(mapa, ndimage.binary_dilation(punto, iterations=MARGEN_PUNTO)), (cx, cy)


def quitar_arboles(mapa, cx, cy, media_anchura, inclinacion):
    """Borra lo oscuro (árboles y matas) en la planta de la torre, para que no asome por la base.

    Solo mira la planta (un rombo algo más grande que la base): lo que queda más arriba lo
    tapa la torre, y así no se toca la pared oscura del escalón de detrás.
    """
    r = media_anchura * (1 + MARGEN_ARBOLES)
    planta = Image.new("L", mapa.size, 0)
    ImageDraw.Draw(planta).polygon([(cx - r, cy), (cx, cy - r * inclinacion), (cx + r, cy),
                                    (cx, cy + r * inclinacion)], fill=1)
    luminancia = np.asarray(mapa.convert("L"), dtype=float)
    oscuro = np.asarray(planta, dtype=bool) & (luminancia < OSCURO_ARBOL)
    if not oscuro.any():
        return mapa
    return rellenar(mapa, ndimage.binary_dilation(oscuro, iterations=2))


def sombra(mapa, cx, cy, media_anchura, inclinacion):
    """Oscurece una elipse difuminada bajo la base."""
    rx = media_anchura * SOMBRA_TAMANO
    ry = rx * inclinacion
    cx += media_anchura * SOMBRA_DESPLAZAMIENTO
    mascara = Image.new("L", mapa.size, 0)
    ImageDraw.Draw(mascara).ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=round(255 * SOMBRA_OPACIDAD))
    mascara = mascara.filter(ImageFilter.GaussianBlur(SOMBRA_DIFUMINADO))
    return Image.composite(Image.new("RGB", mapa.size, COLOR_SOMBRA), mapa, mascara)


def main():
    for ruta in (MAPA, TORRE):
        if not ruta.exists():
            sys.exit(f"No existe {ruta}. Comprueba el nombre en las constantes del script.")
    mapa = Image.open(MAPA).convert("RGB")
    borrado = borrar_punto_azul(mapa)
    if borrado is None:
        print("Aviso: no he encontrado el punto azul; coloco la torre solo con POSICION_X/Y.")
    else:
        mapa, (px, py) = borrado
        print(f"Punto azul encontrado en {100 * px / mapa.width:.2f} %, {100 * py / mapa.height:.2f} % "
              f"(constantes: {POSICION_X} %, {POSICION_Y} %).")

    torre = escalar_torre(recortar_torre(TORRE), round(mapa.width * ANCHO_TORRE / 100))
    bx, by, media_anchura = centro_base(torre)
    destino_x = mapa.width * POSICION_X / 100
    destino_y = mapa.height * POSICION_Y / 100
    inclinacion = (torre.height - by) / media_anchura if media_anchura else 0.5  # alto/ancho del rombo de la base

    esquina = (round(destino_x - bx), round(destino_y - by))
    mapa = quitar_arboles(mapa, destino_x, destino_y, media_anchura, inclinacion)
    mapa = sombra(mapa, destino_x, destino_y, media_anchura, inclinacion)
    mapa.paste(torre, esquina, torre)
    SALIDA.mkdir(exist_ok=True)
    mapa.save(RESULTADO, optimize=True)
    print(f"Torre de {torre.width} x {torre.height} px con la base en ({destino_x:.0f}, {destino_y:.0f}) px.")
    print(f"Guardado {RESULTADO.name}.")


if __name__ == "__main__":
    main()
