# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "numpy>=1.26",
#     "scipy>=1.11",
#     "pillow>=10.0",
# ]
# ///
"""Genera las piezas PNG del logo de Montca Actiu a partir de las imágenes originales.

No redibuja ni cambia colores: solo quita el fondo (transparencia), recorta al contenido y
separa el símbolo del texto. Lee de fuentes/ y escribe en src/assets/logo/ (más el favicon
en public/). No modifica las fuentes.
Uso:  uv run scripts/logo/generar_piezas.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

RAIZ = Path(__file__).resolve().parents[2]
FUENTES = RAIZ / "scripts" / "logo" / "fuentes"
SALIDA = RAIZ / "src" / "assets" / "logo"
PUBLIC = RAIZ / "public"

# ---------- constantes ajustables ----------

# Un componente cuyo borde inferior pase de esta fila (en píxeles de la fuente a color)
# es del texto; el resto es el símbolo. El hexágono acaba en y≈609 y el texto llega a y≈715.
FILA_LIMITE_SIMBOLO = 615
UMBRAL_TINTA_VIVA = 0.95  # por encima, el píxel es tinta pura y conserva su color
UMBRAL_RUIDO = 0.06  # por debajo, es el halo blanco del JPG y se descarta
MARGEN_RECORTE = 4  # px de aire alrededor del contenido
ANCHO_COMPARTIR = 1200
ALTO_COMPARTIR = 630
PROPORCION_LOGO_COMPARTIR = 0.62  # el logo ocupa este % del alto de la imagen para compartir
LADO_FAVICON = 512
COLOR_FONDO_FAVICON = "#f1f6ef"  # Boira (DESIGN.md): se ve igual en pestañas claras y oscuras
RADIO_FAVICON = 0.2  # esquinas redondeadas, como fracción del lado
RELLENO_FAVICON = 0.1  # aire entre el símbolo y el borde del cuadrado, como fracción del lado


def quitar_fondo_blanco(imagen: Image.Image) -> Image.Image:
    """Pasa un logo sobre fondo blanco a RGBA con transparencia, sin cambiar los colores.

    La opacidad de cada píxel sale de lo lejos que está del blanco respecto al color de
    la tinta de su zona; el color de salida es el de la tinta más cercana, así los bordes
    suavizados del JPG no dejan halo claro ni oscurecen el verde.
    """
    rgb = np.asarray(imagen.convert("RGB")).astype(float)
    distancia_blanco = 255 - rgb
    # Intensidad aproximada de tinta (0 = blanco): el canal más oscuro manda.
    intensidad = distancia_blanco.max(axis=2) / 255
    es_tinta_viva = intensidad > 0.55
    # Color de tinta más cercano para cada píxel (índices del transform de distancias).
    indices = ndimage.distance_transform_edt(
        ~es_tinta_viva, return_distances=False, return_indices=True
    )
    tinta = rgb[indices[0], indices[1]]
    eje = 255 - tinta
    alfa = (distancia_blanco * eje).sum(axis=2) / np.maximum((eje * eje).sum(axis=2), 1)
    alfa = np.clip(alfa, 0, 1)
    alfa[alfa < UMBRAL_RUIDO] = 0
    alfa[alfa > UMBRAL_TINTA_VIVA] = 1
    salida = np.dstack([tinta, alfa * 255]).astype(np.uint8)
    # Donde la tinta es pura se conserva el píxel original (textura del degradado).
    pura = alfa == 1
    salida[pura, :3] = rgb[pura].astype(np.uint8)
    return Image.fromarray(salida, "RGBA")


def blanco_sobre_negro_a_transparente(imagen: Image.Image) -> Image.Image:
    """Símbolo blanco sobre fondo negro → blanco puro con la luminosidad como opacidad."""
    gris = np.asarray(imagen.convert("L")).astype(float) / 255
    alfa = np.clip((gris - 0.04) / 0.9, 0, 1)
    alfa[alfa < UMBRAL_RUIDO] = 0
    salida = np.zeros((*gris.shape, 4), dtype=np.uint8)
    salida[..., :3] = 255
    salida[..., 3] = (alfa * 255).astype(np.uint8)
    return Image.fromarray(salida, "RGBA")


def recortar(imagen: Image.Image, margen: int = MARGEN_RECORTE) -> Image.Image:
    """Recorta al contenido visible (opacidad > 0) dejando un margen."""
    caja = imagen.getchannel("A").point(lambda valor: 255 if valor > 8 else 0).getbbox()
    if caja is None:
        raise ValueError("La imagen no tiene contenido visible; revisa la fuente.")
    izq, arriba, der, abajo = caja
    return imagen.crop(
        (
            max(izq - margen, 0),
            max(arriba - margen, 0),
            min(der + margen, imagen.width),
            min(abajo + margen, imagen.height),
        )
    )


def separar_simbolo_y_texto(logo: Image.Image) -> tuple[Image.Image, Image.Image]:
    """Divide el logo en símbolo (hexágono) y línea de texto con sus componentes conexos."""
    alfa = np.asarray(logo.getchannel("A")) > 40
    etiquetas, cantidad = ndimage.label(alfa, structure=np.ones((3, 3)))
    simbolo = np.zeros_like(alfa)
    texto = np.zeros_like(alfa)
    for numero, zona in enumerate(ndimage.find_objects(etiquetas), start=1):
        destino = texto if zona[0].stop > FILA_LIMITE_SIMBOLO else simbolo
        destino |= etiquetas == numero

    def aplicar(mascara: np.ndarray) -> Image.Image:
        # Se dilata un poco la máscara para no comerse el borde suavizado de la tinta.
        ampliada = ndimage.binary_dilation(mascara, iterations=3)
        pieza = np.asarray(logo).copy()
        pieza[~ampliada, 3] = 0
        return recortar(Image.fromarray(pieza, "RGBA"))

    return aplicar(simbolo), aplicar(texto)


def a_blanco(imagen: Image.Image) -> Image.Image:
    """Pone el contenido en blanco manteniendo la forma (la opacidad no cambia)."""
    datos = np.asarray(imagen).copy()
    datos[..., :3] = 255
    return Image.fromarray(datos, "RGBA")


def imagen_compartir(logo: Image.Image) -> Image.Image:
    """Logo completo centrado sobre fondo blanco, en la proporción 1200 × 630."""
    lienzo = Image.new("RGB", (ANCHO_COMPARTIR, ALTO_COMPARTIR), "white")
    alto = round(ALTO_COMPARTIR * PROPORCION_LOGO_COMPARTIR)
    ancho = round(logo.width * alto / logo.height)
    pieza = logo.resize((ancho, alto), Image.LANCZOS)
    lienzo.paste(pieza, ((ANCHO_COMPARTIR - ancho) // 2, (ALTO_COMPARTIR - alto) // 2), pieza)
    return lienzo


def favicon(simbolo: Image.Image) -> Image.Image:
    """Símbolo sobre un cuadrado claro de esquinas redondeadas.

    El verde oscuro del símbolo sobre transparente casi no se ve en las pestañas del
    navegador en modo oscuro; sobre Boira se lee en los dos modos.
    """
    # Se dibuja al doble y se reduce para que las esquinas no salgan con dientes.
    lado = LADO_FAVICON * 2
    cuadrado = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    ImageDraw.Draw(cuadrado).rounded_rectangle(
        (0, 0, lado - 1, lado - 1), radius=round(lado * RADIO_FAVICON), fill=COLOR_FONDO_FAVICON
    )
    hueco = round(lado * (1 - 2 * RELLENO_FAVICON))
    escala = min(hueco / simbolo.width, hueco / simbolo.height)
    pieza = simbolo.resize((round(simbolo.width * escala), round(simbolo.height * escala)), Image.LANCZOS)
    cuadrado.alpha_composite(pieza, ((lado - pieza.width) // 2, (lado - pieza.height) // 2))
    return cuadrado.resize((LADO_FAVICON, LADO_FAVICON), Image.LANCZOS)


def main() -> None:
    SALIDA.mkdir(parents=True, exist_ok=True)
    color = quitar_fondo_blanco(Image.open(FUENTES / "logo-montca-actiu-color.jpg"))
    logo = recortar(color)
    simbolo, texto = separar_simbolo_y_texto(color)
    simbolo_blanco = recortar(
        blanco_sobre_negro_a_transparente(Image.open(FUENTES / "simbolo-blanco-sobre-negro.jpg"))
    )
    piezas = {
        "logo-completo.png": logo,
        "linea-texto.png": texto,
        "simbolo.png": simbolo,
        "simbolo-blanco.png": simbolo_blanco,
        "linea-texto-blanca.png": a_blanco(texto),
    }
    for nombre, pieza in piezas.items():
        pieza.save(SALIDA / nombre, optimize=True)
        print(f"{nombre}: {pieza.width} × {pieza.height}")
    imagen_compartir(logo).save(SALIDA / "imagen-compartir.png", optimize=True)
    icono = favicon(simbolo)
    PUBLIC.mkdir(exist_ok=True)
    icono.resize((192, 192), Image.LANCZOS).save(PUBLIC / "favicon.png", optimize=True)
    icono.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("favicon.png y favicon.ico en public/")


if __name__ == "__main__":
    main()
