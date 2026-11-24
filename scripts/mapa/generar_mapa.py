# /// script
# requires-python = ">=3.11,<3.14"
# dependencies = [
#     "numpy>=1.26",
#     "scipy>=1.11",
#     "rasterio>=1.3",
#     "contourpy>=1.2",
#     "shapely>=2.0",
# ]
# ///
"""Genera tres SVG de prueba del mapa de la Serra de Mariola a partir de datos reales.

Relieve: Copernicus DEM GLO-30. Picos: nodos natural=peak de OpenStreetMap.
Uso:  uv run scripts/mapa/generar_mapa.py
Si faltan los datos en scripts/mapa/datos/, los descarga.
"""

import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from xml.sax.saxutils import escape

import numpy as np
import rasterio
from contourpy import contour_generator
from rasterio.windows import from_bounds
from scipy.ndimage import gaussian_filter, maximum_filter
from shapely.geometry import LineString, Polygon

CARPETA = Path(__file__).resolve().parent
DATOS = CARPETA / "datos"
SALIDA = CARPETA / "salida"
RUTA_DEM = DATOS / "copernicus_N38_W001.tif"
RUTA_PICOS = DATOS / "picos_osm.json"

URL_DEM = (
    "https://copernicus-dem-30m.s3.amazonaws.com/"
    "Copernicus_DSM_COG_10_N38_00_W001_00_DEM/Copernicus_DSM_COG_10_N38_00_W001_00_DEM.tif"
)
SERVIDORES_OVERPASS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
]
CAJA_OVERPASS = (38.64, -0.72, 38.84, -0.38)  # sur, oeste, norte, este
CONSULTA_OVERPASS = (
    '[out:json][timeout:60];node["natural"="peak"]["name"]'
    "({},{},{},{});out body;".format(*CAJA_OVERPASS)
)

# Recorte del mapa: Serra de Mariola de Bocairent/Banyeres a Cocentaina (lon -0.44).
LAT_NORTE, LAT_SUR = 38.81, 38.69
LON_OESTE, LON_ESTE = -0.67, -0.41
ANCHO = 1000  # unidades del viewBox

PASO_MUESTREO = 2  # 1 de cada 2 píxeles: de ~30 m a ~55 m
SUAVIZADO_SIGMA = 0.7  # en píxeles muestreados; más alto redondea las crestas
TOLERANCIA_SIMPLIFICAR = 1.3  # en unidades del viewBox (~30 m)
AREA_MINIMA = 40  # descarta manchas más pequeñas (unidades²)
PESO_MAXIMO_KB = 150

# Franjas de altura (m). La primera franja (por debajo de 500 m, los valles) es el fondo.
NIVELES = [500, 700, 900, 1100, 1250]
# Paleta PROVISIONAL: no hay DESIGN.md todavía. Del llano a las cumbres.
COLOR_FONDO = "#efe7d4"
COLORES_FRANJA = ["#e2e4c6", "#c8d6a7", "#a2bb86", "#77996a", "#4f7853"]
COLOR_PUNTO = "#b4452f"
COLOR_TEXTO = "#26261f"

# Curvas de nivel (estilo c)
EQUIDISTANCIA = 50
CURVA_MAESTRA = 250
COLOR_CURVA = "#a3866a"
COLOR_MAESTRA = "#6f5238"

# Picos que se rotulan
MAX_PICOS = 12
ALTURA_MINIMA_PICO = 900
SEPARACION_MINIMA = 80  # unidades del viewBox (~1,8 km)
TAMANO_TEXTO = 13


# ---------- datos ----------

def descargar_datos():
    """Descarga el DEM y los picos si no están en scripts/mapa/datos/."""
    DATOS.mkdir(parents=True, exist_ok=True)
    if not RUTA_DEM.exists():
        print("Descargando DEM Copernicus GLO-30 (~33 MB)…")
        urllib.request.urlretrieve(URL_DEM, RUTA_DEM)
    if not RUTA_PICOS.exists():
        print("Consultando picos en Overpass…")
        RUTA_PICOS.write_bytes(consultar_overpass())


def consultar_overpass():
    """Prueba cada servidor hasta dos veces; Overpass devuelve 502/504 cuando va cargado."""
    cuerpo = urllib.parse.urlencode({"data": CONSULTA_OVERPASS}).encode()
    errores = []
    for intento in range(2):
        for url in SERVIDORES_OVERPASS:
            peticion = urllib.request.Request(url, data=cuerpo, headers={"User-Agent": "mapa-mariola/1.0"})
            try:
                with urllib.request.urlopen(peticion, timeout=90) as respuesta:
                    return respuesta.read()
            except (urllib.error.URLError, TimeoutError) as error:
                errores.append(f"{url}: {error}")
        time.sleep(5)
    sys.exit("No se pudo consultar Overpass. Prueba más tarde.\n" + "\n".join(errores))


def leer_relieve():
    """Devuelve (x, y, z): rejillas en unidades del viewBox y alturas suavizadas en metros."""
    with rasterio.open(RUTA_DEM) as fuente:
        ventana = from_bounds(LON_OESTE, LAT_SUR, LON_ESTE, LAT_NORTE, fuente.transform)
        alturas = fuente.read(1, window=ventana).astype("float64")
        transformada = fuente.window_transform(ventana)
    filas, columnas = np.indices(alturas.shape)
    lon = transformada.c + (columnas + 0.5) * transformada.a
    lat = transformada.f + (filas + 0.5) * transformada.e
    z = gaussian_filter(alturas, SUAVIZADO_SIGMA * PASO_MUESTREO)[::PASO_MUESTREO, ::PASO_MUESTREO]
    x, y = proyectar(lon[::PASO_MUESTREO, ::PASO_MUESTREO], lat[::PASO_MUESTREO, ::PASO_MUESTREO])
    return x, y, z, (alturas, transformada)


def escala():
    return ANCHO / ((LON_ESTE - LON_OESTE) * np.cos(np.radians((LAT_NORTE + LAT_SUR) / 2)))


def alto_mapa():
    return round((LAT_NORTE - LAT_SUR) * escala())


def proyectar(lon, lat):
    """Equirectangular con corrección de latitud: a esta escala la deformación es despreciable."""
    factor_lon = np.cos(np.radians((LAT_NORTE + LAT_SUR) / 2))
    return (lon - LON_OESTE) * factor_lon * escala(), (LAT_NORTE - lat) * escala()


def leer_altura_osm(texto):
    """'1355.90', '1.390 m' o '1390' -> float; None si no se entiende."""
    if not texto:
        return None
    limpio = texto.lower().replace("m", "").strip()
    if limpio.count(".") == 1 and len(limpio.split(".")[1]) == 3:
        limpio = limpio.replace(".", "")  # separador de miles
    try:
        return float(limpio.replace(",", "."))
    except ValueError:
        return None


def leer_picos():
    datos = json.loads(RUTA_PICOS.read_text(encoding="utf-8"))
    picos = []
    for nodo in datos["elements"]:
        altura = leer_altura_osm(nodo["tags"].get("ele"))
        dentro = LAT_SUR < nodo["lat"] < LAT_NORTE and LON_OESTE < nodo["lon"] < LON_ESTE
        if altura is None or not dentro:
            continue
        x, y = proyectar(nodo["lon"], nodo["lat"])
        picos.append({"id": nodo["id"], "nombre": nodo["tags"]["name"], "altura": altura,
                      "lat": nodo["lat"], "lon": nodo["lon"], "x": float(x), "y": float(y)})
    return sorted(picos, key=lambda p: -p["altura"])


def elegir_picos(picos):
    """Los más altos, saltando los que quedan pegados a otro más alto ya elegido."""
    elegidos = []
    for pico in picos:
        if pico["altura"] < ALTURA_MINIMA_PICO or len(elegidos) == MAX_PICOS:
            break
        cerca = any(np.hypot(pico["x"] - e["x"], pico["y"] - e["y"]) < SEPARACION_MINIMA for e in elegidos)
        if not cerca:
            elegidos.append(pico)
    return elegidos


# ---------- geometría ----------

def ruta_svg(anillos):
    partes = []
    for anillo in anillos:
        puntos = " ".join(f"{x:.1f} {y:.1f}" for x, y in anillo[:-1])
        partes.append(f"M{puntos}Z")
    return "".join(partes)


def poligonos_por_encima(generador, nivel, techo):
    """Regiones con valor >= nivel, simplificadas, como cadena 'd' de un path."""
    puntos, desplazamientos = generador.filled(nivel, techo)
    anillos = []
    for grupo, cortes in zip(puntos, desplazamientos):
        rings = [grupo[cortes[i]:cortes[i + 1]] for i in range(len(cortes) - 1)]
        if len(rings[0]) < 4:
            continue
        poligono = Polygon(rings[0], [r for r in rings[1:] if len(r) >= 4])
        poligono = poligono.simplify(TOLERANCIA_SIMPLIFICAR, preserve_topology=True)
        if poligono.is_empty or poligono.area < AREA_MINIMA:
            continue
        anillos.append(list(poligono.exterior.coords))
        anillos += [list(h.coords) for h in poligono.interiors if Polygon(h).area >= AREA_MINIMA]
    return ruta_svg(anillos)


def curvas(generador, nivel):
    trazos = []
    for linea in generador.lines(nivel):
        simple = LineString(linea).simplify(TOLERANCIA_SIMPLIFICAR)
        if simple.length < 20:
            continue
        coords = list(simple.coords)
        trazos.append("M" + " ".join(f"{x:.1f} {y:.1f}" for x, y in coords))
    return "".join(trazos)


def sombreado(z):
    """Sombreado (0 a 1) con luz del noroeste; exagera el relieve x2 para que se lea suave."""
    paso_y = 30.9 * PASO_MUESTREO
    paso_x = 30.9 * PASO_MUESTREO * np.cos(np.radians((LAT_NORTE + LAT_SUR) / 2))
    dz_fila, dz_col = np.gradient(gaussian_filter(z, 1.5) * 2, paso_y, paso_x)
    pendiente = np.pi / 2 - np.arctan(np.hypot(dz_col, dz_fila))
    orientacion = np.arctan2(-dz_col, dz_fila)
    acimut, elevacion = np.radians(360 - 315), np.radians(45)
    return np.sin(elevacion) * np.sin(pendiente) + np.cos(elevacion) * np.cos(pendiente) * np.cos(acimut - orientacion)


# ---------- capas SVG ----------

def capa_franjas(x, y, z, borde):
    generador = contour_generator(x, y, z, fill_type="OuterOffset")
    techo = float(z.max()) + 1
    trazo = ' stroke="#00000022" stroke-width="0.8"' if borde else ""
    capas = [f'<path fill="{color}"{trazo} d="{poligonos_por_encima(generador, nivel, techo)}"/>'
             for nivel, color in zip(NIVELES, COLORES_FRANJA)]
    return "\n".join(capas)


def capa_sombras(x, y, z):
    luz = sombreado(z)
    generador = contour_generator(x, y, -luz, fill_type="OuterOffset")  # invertido: oscuro = alto
    capas = []
    for percentil, opacidad in ((22, 0.10), (7, 0.12)):
        umbral = -np.percentile(luz, percentil)
        capas.append(f'<path fill="#2a2a1a" fill-opacity="{opacidad}" '
                     f'd="{poligonos_por_encima(generador, umbral, 2.0)}"/>')
    generador_luz = contour_generator(x, y, luz, fill_type="OuterOffset")
    capas.append(f'<path fill="#ffffff" fill-opacity="0.22" '
                 f'd="{poligonos_por_encima(generador_luz, np.percentile(luz, 88), 2.0)}"/>')
    return '<g filter="url(#difuminar)">\n' + "\n".join(capas) + "\n</g>"


def capa_curvas(x, y, z):
    generador = contour_generator(x, y, z, line_type="Separate")
    finas, maestras = [], []
    for nivel in range(int(z.min() // EQUIDISTANCIA + 1) * EQUIDISTANCIA, int(z.max()) + 1, EQUIDISTANCIA):
        (maestras if nivel % CURVA_MAESTRA == 0 else finas).append(curvas(generador, nivel))
    return (f'<path fill="none" stroke="{COLOR_CURVA}" stroke-width="0.6" d="{"".join(finas)}"/>\n'
            f'<path fill="none" stroke="{COLOR_MAESTRA}" stroke-width="1.1" d="{"".join(maestras)}"/>')


def ancho_texto(texto):
    return len(texto) * TAMANO_TEXTO * 0.56


def colocar_etiqueta(pico, texto, ocupadas, alto):
    """Prueba derecha, izquierda, arriba y abajo; se queda con la primera que no choca."""
    ancho = ancho_texto(texto)
    opciones = [("start", 8, 4), ("end", -8, 4), ("middle", 0, -9), ("middle", 0, 18)]
    for ancla, dx, dy in opciones:
        izquierda = {"start": pico["x"] + dx, "end": pico["x"] + dx - ancho, "middle": pico["x"] - ancho / 2}[ancla]
        caja = (izquierda, pico["y"] + dy - TAMANO_TEXTO, izquierda + ancho, pico["y"] + dy + 3)
        dentro = caja[0] > 4 and caja[2] < ANCHO - 4 and caja[1] > 4 and caja[3] < alto - 4
        if dentro and not any(se_solapan(caja, otra) for otra in ocupadas):
            ocupadas.append(caja)
            return ancla, pico["x"] + dx, pico["y"] + dy
    return "start", pico["x"] + 8, pico["y"] + 4


def se_solapan(a, b):
    return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]


def capa_picos(picos, alto):
    ocupadas = [(p["x"] - 5, p["y"] - 5, p["x"] + 5, p["y"] + 5) for p in picos]
    grupos = []
    for pico in picos:
        altura = f"{pico['altura']:.0f}"
        ancla, tx, ty = colocar_etiqueta(pico, f"{pico['nombre']} {altura}", ocupadas, alto)
        grupos.append(
            f'<g class="pico" data-osm="{pico["id"]}">'
            f'<circle cx="{pico["x"]:.1f}" cy="{pico["y"]:.1f}" r="4.5"/>'
            f'<text x="{tx:.1f}" y="{ty:.1f}" text-anchor="{ancla}">{escape(pico["nombre"])}'
            f' <tspan class="altura">{altura}</tspan></text></g>')
    return "\n".join(grupos)


def documento(fondo, capas, picos, alto, titulo):
    estilo = (f".pico circle{{fill:{COLOR_PUNTO};stroke:#fff;stroke-width:1.5}}"
              f".pico text{{font:600 {TAMANO_TEXTO}px system-ui,sans-serif;fill:{COLOR_TEXTO};"
              "paint-order:stroke;stroke:#fffdf6;stroke-width:3px;stroke-linejoin:round}"
              ".pico .altura{font-weight:400;opacity:.7}"
              ".credito{font:9px system-ui,sans-serif;fill:#26261f;opacity:.75}")
    credito = "Relleu: Copernicus WorldDEM-30 (DLR, Airbus, UE, ESA) · Cims: © OpenStreetMap"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ANCHO} {alto}" role="img" '
            f'aria-labelledby="titol">\n<title id="titol">{titulo}</title>\n'
            f'<defs><filter id="difuminar" x="0" y="0" width="1" height="1">'
            f'<feGaussianBlur stdDeviation="2.5"/></filter></defs>\n'
            f"<style>{estilo}</style>\n"
            f'<rect width="{ANCHO}" height="{alto}" fill="{fondo}"/>\n{capas}\n{capa_picos(picos, alto)}\n'
            f'<text class="credito" x="{ANCHO - 6}" y="{alto - 6}" text-anchor="end">{credito}</text>\n</svg>\n')


# ---------- comprobaciones y salida ----------

def comprobar_picos(picos, relieve):
    """Compara la altura OSM con la máxima del DEM en ~150 m alrededor del punto."""
    alturas, transformada = relieve
    maximos = maximum_filter(alturas, size=11)
    print("\nPicos rotulados (OSM vs DEM):")
    for pico in picos:
        columna, fila = ~transformada * (pico["lon"], pico["lat"])
        dem = maximos[int(fila), int(columna)]
        print(f"  {pico['nombre']:<28} OSM {pico['altura']:>6.0f} m   DEM {dem:>6.0f} m   "
              f"dif {dem - pico['altura']:+5.0f}")


def escribir(nombre, contenido):
    ruta = SALIDA / nombre
    ruta.write_text(contenido, encoding="utf-8")
    peso = ruta.stat().st_size / 1024
    aviso = "" if peso <= PESO_MAXIMO_KB else f"  ¡SUPERA {PESO_MAXIMO_KB} KB!"
    print(f"  {nombre}: {peso:.0f} KB{aviso}")
    return peso


def main():
    descargar_datos()
    x, y, z, relieve = leer_relieve()
    alto = alto_mapa()
    picos = elegir_picos(leer_picos())
    print(f"Relieve: {z.shape[1]}x{z.shape[0]} puntos, de {z.min():.0f} a {z.max():.0f} m")
    SALIDA.mkdir(exist_ok=True)
    titulo = "Serra de Mariola"
    franjas = capa_franjas(x, y, z, borde=True)
    versiones = {
        "mapa-a-franjas.svg": documento(COLOR_FONDO, franjas, picos, alto, titulo),
        "mapa-b-sombreado.svg": documento(COLOR_FONDO, capa_franjas(x, y, z, borde=False) + "\n"
                                          + capa_sombras(x, y, z), picos, alto, titulo),
        "mapa-c-curvas.svg": documento("#f6f1e6", capa_curvas(x, y, z), picos, alto, titulo),
    }
    print("\nArchivos:")
    pesos = {nombre: escribir(nombre, svg) for nombre, svg in versiones.items()}
    comprobar_picos(picos, relieve)
    if any(peso > PESO_MAXIMO_KB for peso in pesos.values()):
        sys.exit(f"\nAlgún SVG supera {PESO_MAXIMO_KB} KB: sube TOLERANCIA_SIMPLIFICAR o EQUIDISTANCIA.")


if __name__ == "__main__":
    main()
