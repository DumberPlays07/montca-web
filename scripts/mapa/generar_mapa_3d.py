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
"""Vista 3D de la Serra de Mariola en estilo diorama de recortes de papel.

Usa los mismos datos, recorte y picos que generar_mapa.py (las primeras cinco
dependencias son las suyas, porque se importa). Renderiza sin ventana con pyvista.
Uso:  uv run scripts/mapa/generar_mapa_3d.py
"""

import json
import shutil
import sys
import urllib.request
from pathlib import Path

import matplotlib
import numpy as np
import pyvista as pv
import rasterio
from PIL import Image, ImageDraw, ImageFont
from rasterio.windows import from_bounds
from scipy.ndimage import gaussian_filter, median_filter, zoom

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generar_mapa import (  # noqa: E402  (va después de ajustar sys.path)
    DATOS, LAT_NORTE, LAT_SUR, LON_ESTE, LON_OESTE, RUTA_DEM, SALIDA,
    descargar_datos, elegir_picos, leer_picos,
)

# ---------- constantes ajustables ----------

NUM_ESCALONES = 7
EXAGERACION = 1.7  # vertical; entre 1,5 y 2
SUAVIZADO_SIGMA = 2.0  # en píxeles del DEM (~30 m); más alto = bordes de capa más redondeados
AMPLIACION = 2  # interpola el DEM x2 (de 30 m a 15 m) para que los bordes no salgan en escalera
LIMPIEZA_ISLAS = 7  # en celdas de 15 m; quita manchas de capa más pequeñas que esto (0 = no limpiar)
SUAVIZADO_CANTOS = 2.5  # en celdas; suaviza la luz de los cantos para que no salgan rayados

# Un color por escalón, del valle a las cumbres. Pocos tonos: tres verdes, ocre y caliza.
VERDE_CLARO, VERDE_MEDIO, VERDE_OSCURO = "#cdd9a5", "#a3bf86", "#76996b"
OCRE, CALIZA = "#cfac6c", "#eee9dc"
COLORES_ESCALONES = [VERDE_CLARO, VERDE_CLARO, VERDE_MEDIO, VERDE_MEDIO, VERDE_OSCURO, OCRE, CALIZA]
COLOR_CANTO = "#a8946f"  # laterales del bloque (el canto de las cartulinas)
CIELO_ARRIBA, CIELO_HORIZONTE = "#c9dcea", "#eef3f4"

# Luz (fija para las tres cámaras): de dónde viene y cuánto marca.
LUZ_ACIMUT = 235  # grados desde el norte, en sentido horario (235 = suroeste)
LUZ_ELEVACION = 38  # grados sobre el horizonte
LUZ_AMBIENTE = 0.55  # 1 = sin sombreado; más bajo = bordes más contrastados
SOMBRA_OPACIDAD = 0.22  # oscurecimiento máximo de la sombra arrojada
SOMBRA_DIFUMINADO = 2.0  # en celdas; suaviza el borde de la sombra
GROSOR_BASE = 160  # m (ya exagerados) de bloque por debajo del valle

# Cámaras: acimut = desde dónde mira (180 = desde el sur), elevación en grados sobre
# el horizonte, zoom sobre el encuadre automático y desplazamiento vertical del
# punto de mira (fracción del alto del recorte; positivo = la sierra baja en la imagen).
CAMARAS = {
    "sur": {"acimut": 180, "elevacion": 24, "angulo": 28, "zoom": 1.8, "desplazamiento": 0.16},
    "sureste": {"acimut": 135, "elevacion": 24, "angulo": 28, "zoom": 1.6, "desplazamiento": 0.0},
    "este": {"acimut": 90, "elevacion": 24, "angulo": 28, "zoom": 1.7, "desplazamiento": 0.05},
}
CAMARA_PRINCIPAL = "sur"  # la que se copia como mapa-3d.png/.webp, picos-3d.json y pueblos-3d.json

# Variantes con más relieve: solo con la cámara principal y con exactamente el mismo encuadre
# que la versión de EXAGERACION (se reutiliza su cámara, no se reencuadra). Los bordes de cada
# escalón se marcan algo más bajando la luz ambiente y subiendo la sombra arrojada.
VARIANTES_RELIEVE = {
    "x3": {"exageracion": 3.0, "luz_ambiente": 0.45, "sombra_opacidad": 0.30},
    "x4": {"exageracion": 4.0, "luz_ambiente": 0.40, "sombra_opacidad": 0.34},
}

# Lugares sacados de OpenStreetMap (API 0.6; se guardan en datos/ la primera vez): (nombre, tipo, id).
API_OSM = "https://api.openstreetmap.org/api/0.6"
RUTA_LUGARES = DATOS / "lugares_osm.json"
LUGARES_OSM = [
    ("Cocentaina", "node", 1470838222),  # place=town
    ("Castell de Cocentaina", "way", 376877218),  # historic=castle
]

ANCHO_IMAGEN, ALTO_IMAGEN = 2400, 1350

# Versión con nombres (mapa-3d-*-nombres): punto y rótulo de cada pico dibujados en la imagen.
TAMANO_NOMBRE = 28  # px sobre la imagen de 2400 px
FUENTE_NOMBRE = "DejaVuSans-Bold.ttf"  # de las que trae matplotlib
RADIO_PUNTO = 11
GROSOR_HALO = 5  # contorno claro alrededor del texto para que se lea sobre cualquier capa
COLOR_PUNTO, COLOR_NOMBRE, COLOR_HALO = "#b4452f", "#26261f", "#fffdf6"
PESO_MAXIMO_WEBP_KB = 250
COCENTAINA = (38.7449, -0.4399)  # (lat, lon): solo para comprobar que entra en el encuadre
METROS_GRADO = 111_320


# ---------- relieve ----------

def leer_alturas():
    """Alturas suavizadas y ampliadas del recorte, con sus coordenadas en metros (x este, y norte)."""
    with rasterio.open(RUTA_DEM) as fuente:
        ventana = from_bounds(LON_OESTE, LAT_SUR, LON_ESTE, LAT_NORTE, fuente.transform)
        alturas = fuente.read(1, window=ventana).astype("float64")
    alturas = zoom(gaussian_filter(alturas, SUAVIZADO_SIGMA), AMPLIACION, order=1)
    filas, columnas = alturas.shape
    ancho_m, alto_m = metros(LON_ESTE, LAT_SUR)
    # La fila 0 es el norte; la volteamos para que y crezca hacia el norte.
    alturas = alturas[::-1]
    x = np.linspace(0, ancho_m, columnas)
    y = np.linspace(0, alto_m, filas)
    return x, y, alturas


def metros(lon, lat):
    """(x, y) en metros desde la esquina noroeste del recorte: x hacia el este, y hacia el sur."""
    factor = np.cos(np.radians((LAT_NORTE + LAT_SUR) / 2))
    return (lon - LON_OESTE) * factor * METROS_GRADO, (LAT_NORTE - lat) * METROS_GRADO


def escalonar(alturas):
    """Devuelve el índice de escalón (0..N-1) y la altura de cada umbral."""
    umbrales = np.linspace(alturas.min(), alturas.max(), NUM_ESCALONES + 1)[:-1]
    indice = np.clip(np.searchsorted(umbrales, alturas, side="right") - 1, 0, NUM_ESCALONES - 1)
    if LIMPIEZA_ISLAS:
        indice = median_filter(indice, size=LIMPIEZA_ISLAS)
    return indice, umbrales


def leer_lugares():
    """Cocentaina y su castillo desde OpenStreetMap.

    De una vía se usa el centro de su caja, como el `out center` de Overpass.
    """
    if not RUTA_LUGARES.exists():
        print("Consultando Cocentaina y el castillo en la API de OpenStreetMap…")
        elementos = []
        for _, tipo, ident in LUGARES_OSM:
            url = f"{API_OSM}/{tipo}/{ident}{'/full' if tipo == 'way' else ''}.json"
            peticion = urllib.request.Request(url, headers={"User-Agent": "mapa-mariola/1.0"})
            with urllib.request.urlopen(peticion, timeout=60) as respuesta:
                elementos += json.load(respuesta)["elements"]
        RUTA_LUGARES.write_text(json.dumps({"elements": elementos}, ensure_ascii=False), encoding="utf-8")
    elementos = {(e["type"], e["id"]): e for e in json.loads(RUTA_LUGARES.read_text(encoding="utf-8"))["elements"]}
    lugares = []
    for nombre, tipo, ident in LUGARES_OSM:
        elemento = elementos.get((tipo, ident))
        if elemento is None:
            sys.exit(f"OpenStreetMap no devolvió {tipo} {ident} ({nombre}). Borra {RUTA_LUGARES} y vuelve a probar.")
        if tipo == "node":
            lat, lon = elemento["lat"], elemento["lon"]
        else:
            nodos = [elementos[("node", n)] for n in elemento["nodes"]]
            lats, lons = [n["lat"] for n in nodos], [n["lon"] for n in nodos]
            lat, lon = (min(lats) + max(lats)) / 2, (min(lons) + max(lons)) / 2
        lugares.append({"osm": f"{tipo}/{ident}", "nombre": nombre, "lat": lat, "lon": lon})
    return lugares


# ---------- iluminación (calculada aquí, no en la GPU) ----------

def direccion_luz():
    acimut, elevacion = np.radians(LUZ_ACIMUT), np.radians(LUZ_ELEVACION)
    return np.array([np.sin(acimut) * np.cos(elevacion), np.cos(acimut) * np.cos(elevacion), np.sin(elevacion)])


def sombra_arrojada(z, paso):
    """1 donde el punto queda a la sombra de otra capa, recorriendo el relieve hacia la luz."""
    luz = direccion_luz()
    horizontal = luz[:2] / np.hypot(*luz[:2])
    subida = np.tan(np.radians(LUZ_ELEVACION)) * paso
    pasos = int((z.max() - z.min()) / subida) + 2
    sombra = np.zeros(z.shape, dtype=bool)
    filas, columnas = z.shape
    for k in range(1, pasos):
        dc, df = np.rint(horizontal * k).astype(int)  # columnas = este, filas = norte
        if abs(df) >= filas or abs(dc) >= columnas:
            break
        desplazado = np.full(z.shape, -np.inf)
        destino_f = slice(max(0, -df), filas - max(0, df))
        destino_c = slice(max(0, -dc), columnas - max(0, dc))
        origen_f = slice(max(0, df), filas - max(0, -df))
        origen_c = slice(max(0, dc), columnas - max(0, -dc))
        desplazado[destino_f, destino_c] = z[origen_f, origen_c]
        sombra |= desplazado > z + k * subida + 1
    return sombra.astype(float)


def sombreado_celdas(z, paso, luz_ambiente):
    """Factor de luz por celda: 1 en los techos planos, más claro u oscuro en los cantos.

    Los cantos usan la orientación del relieve suavizado: la de la propia celda va
    en dientes de sierra (la malla es una rejilla) y deja el canto rayado.
    """
    suave = gaussian_filter(z, SUAVIZADO_CANTOS)
    dz_x = (np.diff(suave, axis=1)[:-1] + np.diff(suave, axis=1)[1:]) / (2 * paso)
    dz_y = (np.diff(suave, axis=0)[:, :-1] + np.diff(suave, axis=0)[:, 1:]) / (2 * paso)
    horizontal = np.hypot(dz_x, dz_y) + 1e-9
    # En un canto la pared es vertical: solo importa hacia dónde mira, no la pendiente suavizada.
    normal = np.stack([-dz_x / horizontal, -dz_y / horizontal, np.zeros_like(dz_x)])
    luz = direccion_luz()
    lambert_canto = np.clip(np.tensordot(luz, normal, axes=1), 0, 1)
    es_canto = (z[:-1, :-1] != z[1:, :-1]) | (z[:-1, :-1] != z[:-1, 1:]) | (z[:-1, :-1] != z[1:, 1:])
    lambert = np.where(es_canto, lambert_canto, luz[2])
    plano = luz_ambiente + (1 - luz_ambiente) * luz[2]
    return (luz_ambiente + (1 - luz_ambiente) * lambert) / plano


def en_celdas(valores):
    """Media de las cuatro esquinas de cada celda."""
    return (valores[:-1, :-1] + valores[1:, :-1] + valores[:-1, 1:] + valores[1:, 1:]) / 4


def hex_a_rgb(color):
    return np.array([int(color[i:i + 2], 16) for i in (1, 3, 5)], dtype=float)


# ---------- malla ----------

def construir_malla(x, y, alturas, exageracion=EXAGERACION, luz_ambiente=LUZ_AMBIENTE,
                    sombra_opacidad=SOMBRA_OPACIDAD):
    """Superficie escalonada con faldón hasta la base, coloreada por celda (RGB ya iluminado)."""
    indice, umbrales = escalonar(alturas)
    grosor_capa = (umbrales[1] - umbrales[0]) * exageracion
    z = indice * grosor_capa + GROSOR_BASE
    paso = x[1] - x[0]

    colores = np.array([hex_a_rgb(c) for c in COLORES_ESCALONES])
    # Cada celda toma el color de su esquina más alta: el canto pertenece a la capa de arriba.
    escalon_celda = np.maximum.reduce([indice[:-1, :-1], indice[1:, :-1], indice[:-1, 1:], indice[1:, 1:]])
    sombra = gaussian_filter(sombra_arrojada(z, paso), SOMBRA_DIFUMINADO)
    luz = sombreado_celdas(z, paso, luz_ambiente) * (1 - sombra_opacidad * en_celdas(sombra))
    rgb = colores[escalon_celda] * luz[..., None]

    # Faldón: una fila/columna más en cada borde, a altura 0, con las mismas x/y.
    xs = np.concatenate([[x[0]], x, [x[-1]]])
    ys = np.concatenate([[y[0]], y, [y[-1]]])
    zs = np.pad(z, 1, constant_values=0.0)
    malla_x, malla_y = np.meshgrid(xs, ys)
    canto = hex_a_rgb(COLOR_CANTO)
    rgb_total = np.empty((zs.shape[0] - 1, zs.shape[1] - 1, 3))
    rgb_total[:] = canto
    rgb_total[1:-1, 1:-1] = rgb
    # Laterales: el canto se ilumina según hacia dónde mira (sur, norte, este, oeste).
    luz_dir = direccion_luz()
    for lado, normal in (((0, slice(None)), (0, -1)), ((-1, slice(None)), (0, 1)),
                         ((slice(None), 0), (-1, 0)), ((slice(None), -1), (1, 0))):
        factor = luz_ambiente + (1 - luz_ambiente) * max(0.0, luz_dir[0] * normal[0] + luz_dir[1] * normal[1])
        rgb_total[lado] = canto * factor

    malla = pv.StructuredGrid(malla_x, malla_y, zs)
    # VTK recorre las celdas en orden Fortran (primero el eje x).
    malla.cell_data["rgb"] = np.clip(rgb_total, 0, 255).astype(np.uint8).transpose(1, 0, 2).reshape(-1, 3)
    return malla, z, umbrales


def altura_renderizada(z, x, y, px, py):
    """Altura del techo de la capa en la que cae el punto (máximo en ~45 m alrededor)."""
    columna = int(np.clip(np.searchsorted(x, px), 0, len(x) - 1))
    fila = int(np.clip(np.searchsorted(y, py), 0, len(y) - 1))
    return float(z[max(0, fila - 3):fila + 4, max(0, columna - 3):columna + 4].max())


# ---------- cámara y proyección ----------

def preparar_escena(malla, ajustes, centro, camara_fija=None):
    """Escena con la cámara de `ajustes`; con `camara_fija` (de leer_camara) copia esa cámara tal cual."""
    escena = pv.Plotter(off_screen=True, window_size=(ANCHO_IMAGEN, ALTO_IMAGEN))
    escena.add_mesh(malla, scalars="rgb", rgb=True, lighting=False)
    escena.set_background(CIELO_HORIZONTE, top=CIELO_ARRIBA)
    escena.enable_anti_aliasing("ssaa")
    if camara_fija is not None:
        escena.camera.position = camara_fija["posicion"]
        escena.camera.focal_point = camara_fija["foco"]
        escena.camera.up = camara_fija["arriba"]
        escena.camera.view_angle = camara_fija["angulo"]
        escena.renderer.ResetCameraClippingRange()
        return escena
    acimut, elevacion = np.radians(ajustes["acimut"]), np.radians(ajustes["elevacion"])
    direccion = np.array([np.sin(acimut) * np.cos(elevacion), np.cos(acimut) * np.cos(elevacion), np.sin(elevacion)])
    escena.camera.focal_point = centro
    escena.camera.position = centro + direccion * 50_000
    escena.camera.up = (0, 0, 1)
    escena.camera.view_angle = ajustes["angulo"]
    escena.reset_camera()
    escena.camera.zoom(ajustes["zoom"])
    # Subir el punto de mira hace que la sierra baje en la imagen y deje más cielo.
    subida = np.array([0, 0, ajustes["desplazamiento"] * (malla.bounds[3] - malla.bounds[2])])
    escena.camera.focal_point = np.array(escena.camera.focal_point) + subida
    escena.camera.position = np.array(escena.camera.position) + subida
    return escena


def leer_camara(escena):
    camara = escena.camera
    return {"posicion": tuple(camara.position), "foco": tuple(camara.focal_point),
            "arriba": tuple(camara.up), "angulo": camara.view_angle}


def proyectar(escena, punto):
    """Posición en la imagen (en % desde arriba a la izquierda) de un punto 3D."""
    renderer = escena.renderer
    renderer.SetWorldPoint(*punto, 1.0)
    renderer.WorldToDisplay()
    px, py, _ = renderer.GetDisplayPoint()
    ancho, alto = escena.window_size
    return 100 * px / ancho, 100 * (1 - py / alto)


def esta_visible(superficie, camara, punto):
    """Lanza un rayo desde la cámara; el pico está tapado si el rayo choca bastante antes."""
    puntos, _ = superficie.ray_trace(camara, punto, first_point=True)
    if len(puntos) == 0:
        return True
    return np.linalg.norm(np.array(puntos) - punto) < 120


# ---------- salida ----------

def guardar_webp(imagen, ruta):
    """Baja la calidad hasta que pese menos del objetivo; si no basta, reduce a 1600 px."""
    for ancho in (ANCHO_IMAGEN, 1600):
        reducida = imagen if ancho == imagen.width else imagen.resize(
            (ancho, round(imagen.height * ancho / imagen.width)), Image.LANCZOS)
        for calidad in (85, 80, 75, 70, 65, 60):
            reducida.save(ruta, "WEBP", quality=calidad, method=6)
            peso = ruta.stat().st_size / 1024
            if peso <= PESO_MAXIMO_WEBP_KB:
                return peso, calidad, ancho
    return peso, calidad, ancho


def colocar_etiqueta(dibujo, fuente, texto, cx, cy, ocupadas, tamano):
    """Prueba derecha, izquierda, arriba y abajo del punto; se queda con la primera que no choca."""
    izq, arr, der, aba = dibujo.textbbox((0, 0), texto, font=fuente, stroke_width=GROSOR_HALO)
    ancho, alto = der - izq, aba - arr
    separacion = RADIO_PUNTO + 8
    opciones = [(cx + separacion, cy - alto / 2), (cx - separacion - ancho, cy - alto / 2),
                (cx - ancho / 2, cy - separacion - alto), (cx - ancho / 2, cy + separacion)]
    for ox, oy in opciones:
        caja = (ox, oy, ox + ancho, oy + alto)
        dentro = caja[0] > 4 and caja[1] > 4 and caja[2] < tamano[0] - 4 and caja[3] < tamano[1] - 4
        if dentro and not any(c[0] < caja[2] and caja[0] < c[2] and c[1] < caja[3] and caja[1] < c[3]
                              for c in ocupadas):
            ocupadas.append(caja)
            return ox - izq, oy - arr
    return opciones[0][0] - izq, opciones[0][1] - arr


def rotular(imagen, picos):
    """Copia de la imagen con un punto y el nombre de cada pico dibujados encima."""
    rotulada = imagen.copy()
    dibujo = ImageDraw.Draw(rotulada)
    # DejaVu viene con matplotlib: igual en cualquier equipo y, a diferencia de la de Pillow, tiene tildes.
    ruta_fuente = Path(matplotlib.get_data_path()) / "fonts" / "ttf" / FUENTE_NOMBRE
    fuente = ImageFont.truetype(str(ruta_fuente), TAMANO_NOMBRE)
    puntos = [(p["x"] / 100 * imagen.width, p["y"] / 100 * imagen.height) for p in picos]
    ocupadas = [(cx - RADIO_PUNTO, cy - RADIO_PUNTO, cx + RADIO_PUNTO, cy + RADIO_PUNTO) for cx, cy in puntos]
    for pico, (cx, cy) in zip(picos, puntos):
        caja = (cx - RADIO_PUNTO, cy - RADIO_PUNTO, cx + RADIO_PUNTO, cy + RADIO_PUNTO)
        relleno = COLOR_PUNTO if pico["visible"] else COLOR_HALO  # hueco = tapado por otra montaña
        dibujo.ellipse(caja, fill=relleno, outline=COLOR_HALO if pico["visible"] else COLOR_PUNTO, width=4)
        texto = f"{pico['nombre']} {pico['altura']}"
        tx, ty = colocar_etiqueta(dibujo, fuente, texto, cx, cy, ocupadas, imagen.size)
        dibujo.text((tx, ty), texto, font=fuente, fill=COLOR_NOMBRE,
                    stroke_width=GROSOR_HALO, stroke_fill=COLOR_HALO)
    return rotulada


def guardar_imagenes(imagen, base):
    """Guarda base.png y base.webp; devuelve (peso, calidad, ancho) del webp."""
    imagen.save(SALIDA / f"{base}.png", optimize=True)
    return guardar_webp(imagen, SALIDA / f"{base}.webp")


def situar(escena, superficie, camara, z, x, y, lat, lon):
    """Posición en la imagen (%) de una coordenada real, a la altura de su capa, y si se ve."""
    px, py = metros(lon, lat)
    py = -py + y[-1]  # mismo eje y que la malla (norte arriba)
    punto = np.array([px, py, altura_renderizada(z, x, y, px, py)])
    izquierda, arriba = proyectar(escena, punto)
    return {"x": round(izquierda, 2), "y": round(arriba, 2),
            "visible": bool(esta_visible(superficie, camara, punto))}


def guardar_json(datos, archivo):
    (SALIDA / archivo).write_text(json.dumps(datos, ensure_ascii=False, indent=2), encoding="utf-8")


def generar_variante(nombre, ajustes, malla, superficie, z, x, y, picos, lugares, centro, camara_fija=None):
    """Imagen, versión con nombres, picos-3d-<nombre>.json y pueblos-3d-<nombre>.json.

    Devuelve el peso del WebP mayor y la cámara usada (para repetirla en otra variante).
    """
    escena = preparar_escena(malla, ajustes, centro, camara_fija)
    imagen = Image.fromarray(escena.screenshot(return_img=True)).convert("RGB")
    camara_usada = leer_camara(escena)
    camara = np.array(escena.camera.position)

    resultado = [{"osm": pico["id"], "nombre": pico["nombre"], "altura": round(pico["altura"]),
                  **situar(escena, superficie, camara, z, x, y, pico["lat"], pico["lon"])} for pico in picos]
    pueblos = [{"osm": lugar["osm"], "nombre": lugar["nombre"],
                **situar(escena, superficie, camara, z, x, y, lugar["lat"], lugar["lon"])} for lugar in lugares]
    cx, cy = metros(COCENTAINA[1], COCENTAINA[0])
    cocentaina = proyectar(escena, np.array([cx, -cy + y[-1], GROSOR_BASE]))
    escena.close()

    peso, calidad, ancho = guardar_imagenes(imagen, f"mapa-3d-{nombre}")
    peso_nombres, _, _ = guardar_imagenes(rotular(imagen, resultado), f"mapa-3d-{nombre}-nombres")
    peso = max(peso, peso_nombres)
    comun = {"camara": ajustes["nombre_camara"], "imagen": f"mapa-3d-{nombre}.webp",
             "exageracion": ajustes["exageracion"], "ancho": imagen.width, "alto": imagen.height}
    guardar_json({**comun, "picos": resultado}, f"picos-3d-{nombre}.json")
    guardar_json({**comun, "lugares": pueblos}, f"pueblos-3d-{nombre}.json")

    aviso = "" if peso <= PESO_MAXIMO_WEBP_KB else f"  ¡SUPERA {PESO_MAXIMO_WEBP_KB} KB!"
    print(f"\n[{nombre}] webp sin nombres y con nombres: el mayor pesa {peso:.0f} KB "
          f"(calidad {calidad}, {ancho} px){aviso}")
    dentro = 0 <= cocentaina[0] <= 100 and 0 <= cocentaina[1] <= 100
    print(f"  Cocentaina en ({cocentaina[0]:.1f} %, {cocentaina[1]:.1f} %): {'dentro' if dentro else 'FUERA'}")
    for pico in resultado + pueblos:
        estado = "" if pico["visible"] else "  (tapado por otra montaña)"
        print(f"  {pico['nombre']:<28} {pico['x']:6.1f} %  {pico['y']:6.1f} %{estado}")
    return peso, camara_usada


def main():
    if CAMARA_PRINCIPAL not in CAMARAS:
        sys.exit(f"CAMARA_PRINCIPAL '{CAMARA_PRINCIPAL}' no está en CAMARAS.")
    if len(COLORES_ESCALONES) != NUM_ESCALONES:
        sys.exit(f"COLORES_ESCALONES tiene {len(COLORES_ESCALONES)} colores y NUM_ESCALONES es {NUM_ESCALONES}.")
    descargar_datos()
    lugares = leer_lugares()
    x, y, alturas = leer_alturas()
    malla, z, umbrales = construir_malla(x, y, alturas)
    print(f"Malla: {malla.n_cells:,} celdas; escalones desde " + ", ".join(f"{u:.0f}" for u in umbrales) + " m")
    superficie = malla.extract_surface().triangulate()
    centro = np.array([x.mean(), y.mean(), z.max() * 0.3])
    picos = elegir_picos(leer_picos())
    SALIDA.mkdir(exist_ok=True)

    pesos, camaras_usadas = {}, {}
    for nombre, ajustes in CAMARAS.items():
        ajustes = {**ajustes, "nombre_camara": nombre, "exageracion": EXAGERACION}
        pesos[nombre], camaras_usadas[nombre] = generar_variante(
            nombre, ajustes, malla, superficie, z, x, y, picos, lugares, centro)
    for sufijo in ("", "-nombres"):
        for extension in ("png", "webp"):
            shutil.copyfile(SALIDA / f"mapa-3d-{CAMARA_PRINCIPAL}{sufijo}.{extension}",
                            SALIDA / f"mapa-3d{sufijo}.{extension}")
    for prefijo in ("picos", "pueblos"):
        principal = json.loads((SALIDA / f"{prefijo}-3d-{CAMARA_PRINCIPAL}.json").read_text(encoding="utf-8"))
        principal["imagen"] = "mapa-3d.webp"
        guardar_json(principal, f"{prefijo}-3d.json")
    print(f"\nPrincipal ({CAMARA_PRINCIPAL}) copiada como mapa-3d.png, mapa-3d.webp, picos-3d.json y pueblos-3d.json.")

    # Más relieve con la misma cámara y el mismo encuadre que la principal.
    for nombre, variante in VARIANTES_RELIEVE.items():
        malla_v, z_v, _ = construir_malla(x, y, alturas, variante["exageracion"],
                                          variante["luz_ambiente"], variante["sombra_opacidad"])
        ajustes = {**CAMARAS[CAMARA_PRINCIPAL], "nombre_camara": CAMARA_PRINCIPAL,
                   "exageracion": variante["exageracion"]}
        pesos[nombre], _ = generar_variante(nombre, ajustes, malla_v, malla_v.extract_surface().triangulate(),
                                            z_v, x, y, picos, lugares, centro, camaras_usadas[CAMARA_PRINCIPAL])
    if any(peso > PESO_MAXIMO_WEBP_KB for peso in pesos.values()):
        sys.exit(f"\nAlgún WebP supera {PESO_MAXIMO_WEBP_KB} KB.")


if __name__ == "__main__":
    main()
