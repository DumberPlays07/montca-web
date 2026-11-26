# /// script
# requires-python = ">=3.11,<3.14"
# dependencies = [
#     "numpy>=1.26",
#     "scipy>=1.11",
#     "rasterio>=1.3",
#     "contourpy>=1.2",
#     "shapely>=2.0",
#     "pyvista>=0.44",
#     "pillow>=10.0",
#     "matplotlib>=3.8",
# ]
# ///
"""Versión x4 del mapa hecha con código, imitando la x3 retocada con Gemini (fuentes/mapa-x3-pc-clase.jpg).

Pinta el render x4 con la paleta de la x3 y coloca pinos, pueblo y castillo recortados de ella.
Uso:
  uv run scripts/mapa/componer_x4.py --recortar   # recorta pueblo y pinos de la x3 a fuentes/
  uv run scripts/mapa/componer_x4.py              # compone salida/mapa-x4.png
Necesita los JSON de la x4 (uv run scripts/mapa/generar_mapa_3d.py --relieve).
"""

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parent))
import colocar_castillo as castillo  # noqa: E402  (va después de ajustar sys.path)
import generar_mapa_3d as g  # noqa: E402

# ---------- constantes ajustables ----------

EXAGERACION_MODELO = 3  # la de la x3 que se imita
EXAGERACION = 4

# Sombras suaves como en la x3: más luz ambiente y sombra arrojada más difuminada que en el render.
LUZ_AMBIENTE = 0.62
SOMBRA_OPACIDAD = 0.22
SOMBRA_DIFUMINADO = 6

# Recortes en la x3, en px de una imagen de ANCHO_REFERENCIA de ancho: (izquierda, arriba, derecha,
# abajo). Si se cambia la x3 por una de más resolución con el mismo encuadre, las cajas se escalan solas.
ANCHO_REFERENCIA = 1024
CAJA_PUEBLO = (770, 402, 900, 482)
# Solo dos: los demás pinos de la x3 están sobre terreno oscuro o junto al cielo y no se separan bien.
CAJAS_PINOS = [(372, 326, 391, 358), (876, 450, 892, 479)]
CAJA_TORRE_MODELO = (776, 338, 816, 386)  # solo para medir a qué escala dibujó Gemini la torre
# Pueblo: es lo que no es verde (rojo > verde). Rampa de transparencia entre estos dos valores de rojo - verde.
PUEBLO_ROJO_MENOS_VERDE = (-4, 10)
# Pinos: lo que es más oscuro que el terreno de alrededor. Rampa de transparencia en luminancia.
PINO_MAS_OSCURO = (10, 30)

# Pinos repartidos: grupos pequeños en las laderas, como en la x3 (unos 18 grupos y ~40 pinos).
PINOS_SEMILLA = 7
PINOS_GRUPOS = 18
PINOS_POR_GRUPO = (1, 3)
PINOS_SEPARACION = 8  # px de la x3 entre los pinos de un grupo
PINOS_SEPARACION_GRUPOS = 45  # px de la x3 entre los centros de dos grupos
PINOS_DISTANCIA_BORDE = (3, 30)  # px de la x3 a la pared más cercana: en la ladera, junto al borde
PINOS_NIVELES = (1, 2, 3, 4)  # escalones donde puede haber pinos (0 = valle; 5 y 6 = cumbres)
PINOS_ESCALA = (0.85, 1.1)  # variación de tamaño entre pinos
NIVELES_CUMBRE = (5, 6)  # ningún pino puede tapar estos escalones
# Puntos de % que se suman a la x del castillo de pueblos-3d.json (negativo = izquierda): en su
# posición exacta la base queda en el borde del escalón; más a la izquierda queda entera encima.
DESPLAZAMIENTO_CASTILLO_X = -2
RADIO_PICO = 40  # px del mapa x4: alrededor de cada pico no se pone ningún pino (ahí van botones)
ALFA_MINIMO = 0.4  # al recortar, los píxeles del borde con menos opacidad que esto se descartan
ENDURECER_BORDE = 2.5  # contraste de la transparencia al ampliar sprites (1 = sin cambio)
SOMBRA_SPRITE = 0.3  # opacidad de la sombra que dejan pinos y pueblo
COLOR_SOMBRA = (35, 55, 25)
EROSION_PALETA = 6  # px que se descartan junto a los bordes al medir colores (Gemini desplaza algo el relieve)
CUMBRE_PERCENTIL = (75, 92)  # tono de cada escalón de NIVELES_CUMBRE dentro de la zona de cumbre (más alto = más claro)

FUENTES = castillo.FUENTES
SALIDA = g.SALIDA
MODELO = FUENTES / "mapa-x3-pc-clase.jpg"
RENDER_MODELO = SALIDA / f"mapa-3d-relieve-x{EXAGERACION_MODELO:g}.png"
PUEBLO = FUENTES / "pueblo.png"
PINOS = [FUENTES / f"pino-{i}.png" for i in range(1, len(CAJAS_PINOS) + 1)]
JSON_PICOS = SALIDA / f"picos-3d-relieve-x{EXAGERACION:g}.json"
JSON_PUEBLOS = SALIDA / f"pueblos-3d-relieve-x{EXAGERACION:g}.json"
RESULTADO = SALIDA / f"mapa-x{EXAGERACION:g}.png"

# Clases de la imagen de etiquetas (qué parte del bloque se ve en cada píxel).
PARED = 10  # PARED + escalón = pared vertical de ese escalón
LATERAL = 20  # laterales del bloque (el canto de las cartulinas)
CIELO = 255


# ---------- qué se ve en cada píxel ----------

def etiquetas(x, y, alturas, exageracion):
    """Imagen (alto x ancho) con la clase de cada píxel: escalón 0-6, PARED + escalón, LATERAL o CIELO.

    Renderiza la misma malla y cámara que generar_mapa_3d.py, pero con un color plano por clase
    y sin suavizado de bordes, para poder leer la clase en el color del píxel.
    """
    malla, z, _ = g.construir_malla(x, y, alturas, exageracion)
    indice, _ = g.escalonar(alturas)
    escalon = np.maximum.reduce([indice[:-1, :-1], indice[1:, :-1], indice[:-1, 1:], indice[1:, 1:]])
    es_pared = (z[:-1, :-1] != z[1:, :-1]) | (z[:-1, :-1] != z[:-1, 1:]) | (z[:-1, :-1] != z[1:, 1:])
    clase = np.full((z.shape[0] + 1, z.shape[1] + 1), LATERAL, dtype=np.uint8)
    clase[1:-1, 1:-1] = escalon + PARED * es_pared
    rgb = np.zeros(clase.shape + (3,), dtype=np.uint8)
    rgb[..., 0] = clase
    malla.cell_data["rgb"] = rgb.transpose(1, 0, 2).reshape(-1, 3)
    centro = np.array([x.mean(), y.mean(), z.max() * 0.3])
    escena = g.preparar_escena(malla, g.CAMARAS[g.CAMARA_PRINCIPAL], centro)
    escena.disable_anti_aliasing()
    escena.set_background((0.0, 0.0, 1.0))
    imagen = escena.screenshot(return_img=True)
    escena.close()
    resultado = imagen[..., 0].astype(int)
    resultado[(imagen[..., 2] == 255) & (imagen[..., 0] == 0)] = CIELO
    return resultado


# ---------- paleta de la x3 ----------

def alinear(modelo, render):
    """La x3 de Gemini escalada al tamaño del render y desplazada para que su relieve coincida.

    Gemini cambia un poco el tamaño y mueve el relieve; el desplazamiento se mide por correlación
    de fase entre los bordes de las dos imágenes.
    """
    escalada = modelo.resize(render.size, Image.LANCZOS)

    def bordes(imagen):
        gris = np.asarray(imagen.convert("L"), dtype=float)
        gy, gx = np.gradient(gris)
        magnitud = np.hypot(gx, gy)
        return (magnitud - magnitud.mean()) * np.outer(np.hanning(gris.shape[0]), np.hanning(gris.shape[1]))

    cruzada = np.fft.fft2(bordes(render)) * np.conj(np.fft.fft2(bordes(escalada)))
    pico = np.real(np.fft.ifft2(cruzada / (np.abs(cruzada) + 1e-9)))
    dy, dx = np.unravel_index(np.argmax(pico), pico.shape)
    dy = dy - pico.shape[0] if dy > pico.shape[0] // 2 else dy
    dx = dx - pico.shape[1] if dx > pico.shape[1] // 2 else dx
    pixeles = np.asarray(escalada, dtype=float)
    return ndimage.shift(pixeles, (dy, dx, 0), order=0, mode="nearest"), (dx, dy)


def mediana(pixeles, mascara):
    mascara = ndimage.binary_erosion(mascara, iterations=EROSION_PALETA)
    return np.median(pixeles[mascara], axis=0) if mascara.any() else None


def a_hex(color):
    return "#" + "".join(f"{round(c):02x}" for c in np.clip(color, 0, 255))


def paleta(clases, pixeles):
    """Colores de la x3: uno por escalón (su techo), el lateral del bloque y el cielo arriba y en el horizonte."""
    escalones = [mediana(pixeles, clases == nivel) for nivel in range(g.NUM_ESCALONES)]
    # En la cumbre Gemini redibujó el relieve y las manchas de los escalones altos caen sobre
    # paredes: ahí se toma el tono claro de toda la zona de cumbre (percentil CUMBRE_PERCENTIL).
    zona_cumbre = np.isin(clases, NIVELES_CUMBRE)
    for posicion, nivel in enumerate(NIVELES_CUMBRE):
        percentil = CUMBRE_PERCENTIL[posicion]
        escalones[nivel] = np.percentile(pixeles[zona_cumbre], percentil, axis=0)
    lateral = mediana(pixeles, clases == LATERAL)
    # El render ilumina el lateral delantero; se divide por esa luz para que salga el color medido.
    luz = g.direccion_luz()
    luz_frente = LUZ_AMBIENTE + (1 - LUZ_AMBIENTE) * max(0.0, -luz[1])
    filas_bloque = np.flatnonzero((clases != CIELO).any(axis=1))
    arriba = np.median(pixeles[:20].reshape(-1, 3), axis=0)
    horizonte = np.median(pixeles[max(0, filas_bloque[0] - 40):filas_bloque[0] - 20].reshape(-1, 3), axis=0)
    return escalones, lateral / luz_frente, arriba, horizonte


# ---------- recortes de la x3 ----------

def recorte(modelo, caja):
    """Recorte de la x3 con una caja dada para ANCHO_REFERENCIA px de ancho, como array RGB."""
    factor = modelo.width / ANCHO_REFERENCIA
    return np.asarray(modelo.crop(tuple(round(v * factor) for v in caja)).convert("RGB"), dtype=float)


def descontaminar(pixeles, alfa, fondo):
    """Quita el color del fondo mezclado en los bordes semitransparentes."""
    con_alfa = np.maximum(alfa, 1e-3)[..., None]
    return np.clip((pixeles - (1 - alfa[..., None]) * fondo) / con_alfa, 0, 255)


def mayor_mancha(alfa):
    manchas, cuantas = ndimage.label(alfa > 0.5)
    if cuantas <= 1:
        return alfa
    tamanos = ndimage.sum(np.ones_like(alfa), manchas, range(1, cuantas + 1))
    principal = ndimage.binary_dilation(manchas == np.argmax(tamanos) + 1, iterations=2)
    return np.where(principal, alfa, 0)


def a_sprite(pixeles, alfa):
    # Los píxeles del borde que son casi todo fondo dan colores raros al descontaminarlos: fuera.
    alfa = np.where(alfa < ALFA_MINIMO, 0, alfa)
    rgba = np.dstack([pixeles, alfa * 255]).astype(np.uint8)
    sprite = Image.fromarray(rgba, "RGBA")
    return sprite.crop(sprite.getbbox())


def recortar_pueblo(modelo):
    pixeles = recorte(modelo, CAJA_PUEBLO)
    rojo_menos_verde = pixeles[..., 0] - pixeles[..., 1]
    bajo, alto = PUEBLO_ROJO_MENOS_VERDE
    alfa = np.clip((rojo_menos_verde - bajo) / (alto - bajo), 0, 1)
    # Huecos dentro del pueblo (ventanas, sombras verdosas entre casas) quedan opacos.
    alfa[ndimage.binary_fill_holes(alfa > 0.5)] = np.maximum(alfa[ndimage.binary_fill_holes(alfa > 0.5)], 1)
    alfa = mayor_mancha(alfa)
    fondo = np.median(pixeles[alfa == 0], axis=0)
    return a_sprite(descontaminar(pixeles, alfa, fondo), alfa)


def recortar_pino(modelo, caja):
    pixeles = recorte(modelo, caja)
    luminancia = pixeles @ np.array([0.299, 0.587, 0.114])
    borde = np.concatenate([pixeles[0], pixeles[-1], pixeles[:, 0], pixeles[:, -1]])
    fondo = np.median(borde, axis=0)
    bajo, alto = PINO_MAS_OSCURO
    alfa = np.clip((fondo @ np.array([0.299, 0.587, 0.114]) - luminancia - bajo) / (alto - bajo), 0, 1)
    alfa = mayor_mancha(alfa)
    return a_sprite(descontaminar(pixeles, alfa, fondo), alfa)


def medir_torre(modelo):
    """Ancho de la torre de la x3 en % del ancho de la imagen (lo que no es verde en CAJA_TORRE_MODELO)."""
    pixeles = recorte(modelo, CAJA_TORRE_MODELO)
    torre = mayor_mancha(((pixeles[..., 0] - pixeles[..., 1]) > 4).astype(float)) > 0.5
    columnas = np.flatnonzero(torre.any(axis=0))
    return 100 * (columnas[-1] - columnas[0] + 1) / modelo.width


def recortar():
    modelo = Image.open(MODELO)
    recortar_pueblo(modelo).save(PUEBLO)
    print(f"{PUEBLO.name}: {Image.open(PUEBLO).size} px")
    for caja, ruta in zip(CAJAS_PINOS, PINOS):
        recortar_pino(modelo, caja).save(ruta)
        print(f"{ruta.name}: {Image.open(ruta).size} px")


# ---------- composición ----------

def pegar_con_sombra(mapa, sprite, esquina, desplazamiento):
    """Pega el sprite con una sombra suave (su silueta oscurecida, desplazada y difuminada) debajo."""
    alfa = sprite.getchannel("A").point(lambda valor: round(valor * SOMBRA_SPRITE))
    hueco = max(4, round(desplazamiento * 3))
    mascara = Image.new("L", (sprite.width + 2 * hueco, sprite.height + 2 * hueco), 0)
    mascara.paste(alfa, (hueco, hueco))
    mascara = mascara.filter(ImageFilter.GaussianBlur(max(1, desplazamiento)))
    origen = (esquina[0] - hueco + round(desplazamiento), esquina[1] - hueco + round(desplazamiento * 0.6))
    mapa.paste(Image.new("RGB", mascara.size, COLOR_SOMBRA), origen, mascara)
    mapa.paste(sprite, esquina, sprite)


def escalar(sprite, factor):
    """Reescala el sprite. Al ampliar, endurece el borde: si no, la transparencia se estira y queda borroso."""
    tamano = (max(1, round(sprite.width * factor)), max(1, round(sprite.height * factor)))
    escalado = sprite.convert("RGBa").resize(tamano, Image.LANCZOS).convert("RGBA")
    if factor > 1:
        alfa = escalado.getchannel("A").point(lambda valor: max(0, min(255, round((valor - 128) * ENDURECER_BORDE + 128))))
        escalado.putalpha(alfa)
    return escalado


def se_cruzan(caja, otra):
    return caja[0] < otra[2] and otra[0] < caja[2] and caja[1] < otra[3] and otra[1] < caja[3]


def repartir_pinos(clases, escala, sprites, prohibidas, escala_sprite):
    """Lista de (sprite, esquina) de los pinos, de atrás adelante. Semilla fija: siempre igual.

    `escala` pasa las distancias de PINOS_* (px de ANCHO_REFERENCIA) al mapa; `escala_sprite`, los sprites.
    """
    rng = np.random.default_rng(PINOS_SEMILLA)
    pared = (clases >= PARED) & (clases < PARED + g.NUM_ESCALONES)
    distancia = ndimage.distance_transform_edt(~pared)
    cerca, lejos = (d * escala for d in PINOS_DISTANCIA_BORDE)
    apto = np.isin(clases, PINOS_NIVELES) & (distancia >= cerca) & (distancia <= lejos)
    cumbre = np.isin(clases, NIVELES_CUMBRE + tuple(PARED + n for n in NIVELES_CUMBRE))
    candidatos = np.argwhere(apto)
    pinos, centros = [], []
    for _ in range(4000):
        if len(centros) == PINOS_GRUPOS or len(candidatos) == 0:
            break
        fila, columna = candidatos[rng.integers(len(candidatos))]
        if any(np.hypot(columna - cx, fila - cy) < PINOS_SEPARACION_GRUPOS * escala for cx, cy in centros):
            continue
        grupo = []
        for numero in range(rng.integers(PINOS_POR_GRUPO[0], PINOS_POR_GRUPO[1] + 1)):
            angulo = rng.uniform(0, 2 * np.pi)
            radio = 0 if numero == 0 else PINOS_SEPARACION * escala * rng.uniform(0.8, 1.3)
            bx, by = round(columna + radio * np.cos(angulo)), round(fila + radio * np.sin(angulo) * 0.5)
            if not (0 <= by < clases.shape[0] and 0 <= bx < clases.shape[1]) or not apto[by, bx]:
                continue
            sprite = escalar(sprites[rng.integers(len(sprites))], escala_sprite * rng.uniform(*PINOS_ESCALA))
            esquina = (bx - sprite.width // 2, by - sprite.height + 1)
            caja = (esquina[0], esquina[1], esquina[0] + sprite.width, esquina[1] + sprite.height)
            if any(se_cruzan(caja, zona) for zona in prohibidas):
                continue
            if cumbre[max(0, caja[1]):caja[3], max(0, caja[0]):caja[2]].any():
                continue
            grupo.append((by, sprite, esquina))
        if grupo:
            centros.append((columna, fila))
            pinos.extend(grupo)
    return [(sprite, esquina) for _, sprite, esquina in sorted(pinos, key=lambda pino: pino[0])], len(centros)


def pintar_render(x, y, alturas, colores, lateral, cielo_arriba, cielo_horizonte):
    """Render x4 con la paleta de la x3. Cambia las constantes de color de generar_mapa_3d solo aquí."""
    g.COLORES_ESCALONES = [a_hex(color) for color in colores]
    g.COLOR_CANTO = a_hex(lateral)
    g.CIELO_ARRIBA, g.CIELO_HORIZONTE = a_hex(cielo_arriba), a_hex(cielo_horizonte)
    g.SOMBRA_DIFUMINADO = SOMBRA_DIFUMINADO
    malla, z, _ = g.construir_malla(x, y, alturas, EXAGERACION, LUZ_AMBIENTE, SOMBRA_OPACIDAD)
    centro = np.array([x.mean(), y.mean(), z.max() * 0.3])
    escena = g.preparar_escena(malla, g.CAMARAS[g.CAMARA_PRINCIPAL], centro)
    imagen = Image.fromarray(escena.screenshot(return_img=True)).convert("RGB")
    escena.close()
    return imagen


def zona_sprite(sprite, cx, cy):
    """Esquina y caja de un sprite centrado en (cx, cy)."""
    esquina = (round(cx - sprite.width / 2), round(cy - sprite.height / 2))
    return esquina, (esquina[0], esquina[1], esquina[0] + sprite.width, esquina[1] + sprite.height)


def componer():
    for ruta in [MODELO, RENDER_MODELO, PUEBLO, JSON_PICOS, JSON_PUEBLOS, castillo.TORRE] + PINOS:
        if not ruta.exists():
            sys.exit(f"Falta {ruta}. Genera las variantes con 'generar_mapa_3d.py --relieve' "
                     "y los recortes con 'componer_x4.py --recortar'.")
    modelo = Image.open(MODELO).convert("RGB")
    picos = json.loads(JSON_PICOS.read_text(encoding="utf-8"))["picos"]
    pueblos = {lugar["tipo"]: lugar for lugar in json.loads(JSON_PUEBLOS.read_text(encoding="utf-8"))["pueblos"]}

    x, y, alturas = g.leer_alturas()
    pixeles, (dx, dy) = alinear(modelo, Image.open(RENDER_MODELO).convert("RGB"))
    colores, lateral, cielo_arriba, cielo_horizonte = paleta(etiquetas(x, y, alturas, EXAGERACION_MODELO), pixeles)
    print(f"x3 desplazada {dx}, {dy} px respecto a su render. Paleta:")
    for nivel, color in enumerate(colores):
        print(f"  escalón {nivel}: {a_hex(color)}")
    print(f"  lateral: {a_hex(lateral)}  cielo: {a_hex(cielo_arriba)} → {a_hex(cielo_horizonte)}")

    mapa = pintar_render(x, y, alturas, colores, lateral, cielo_arriba, cielo_horizonte)
    clases = etiquetas(x, y, alturas, EXAGERACION)
    escala = mapa.width / modelo.width  # misma escala relativa que en la x3

    pueblo = escalar(Image.open(PUEBLO), escala)
    pueblo_x = pueblos["place=town"]["x"] / 100 * mapa.width
    pueblo_y = pueblos["place=town"]["y"] / 100 * mapa.height
    esquina_pueblo, caja_pueblo = zona_sprite(pueblo, pueblo_x, pueblo_y)
    castillo_x = (pueblos["historic=castle"]["x"] + DESPLAZAMIENTO_CASTILLO_X) / 100 * mapa.width
    castillo_y = pueblos["historic=castle"]["y"] / 100 * mapa.height
    ancho_torre = round(mapa.width * medir_torre(modelo) / 100)
    caja_castillo = (castillo_x - ancho_torre, castillo_y - 1.6 * ancho_torre,
                     castillo_x + ancho_torre, castillo_y + 0.5 * ancho_torre)
    cajas_picos = [(p["x"] / 100 * mapa.width - RADIO_PICO, p["y"] / 100 * mapa.height - RADIO_PICO,
                    p["x"] / 100 * mapa.width + RADIO_PICO, p["y"] / 100 * mapa.height + RADIO_PICO) for p in picos]

    sprites = [Image.open(ruta) for ruta in PINOS]
    pinos, grupos = repartir_pinos(clases, mapa.width / ANCHO_REFERENCIA, sprites,
                                   [caja_pueblo, caja_castillo] + cajas_picos, escala)
    for sprite, esquina in pinos:
        pegar_con_sombra(mapa, sprite, esquina, escala)
    pegar_con_sombra(mapa, pueblo, esquina_pueblo, escala * 1.5)
    mapa, torre = castillo.pegar_torre(mapa, castillo_x, castillo_y, ancho_torre, quitar=False)

    mapa.save(RESULTADO, optimize=True)
    print(f"Pinos: {len(pinos)} en {grupos} grupos. Pueblo {pueblo.size} px en ({pueblo_x:.0f}, {pueblo_y:.0f}). "
          f"Torre {torre} px en ({castillo_x:.0f}, {castillo_y:.0f}).")
    print(f"Guardado {RESULTADO.name}.")


if __name__ == "__main__":
    if "--recortar" in sys.argv:
        recortar()
    else:
        componer()
