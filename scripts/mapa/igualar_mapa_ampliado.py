# /// script
# requires-python = ">=3.11,<3.14"
# dependencies = [
#     "numpy>=1.26",
#     "pillow>=10.0",
# ]
# ///
"""Reduce el mapa ampliado con Real-ESRGAN, le devuelve los colores del original y lo guarda en WebP.

Real-ESRGAN (modelo realesrgan-x4plus) amplía fuentes/mapa-definitivo-1024.png ×4
(4096 × 2288) y desvía un poco el tono: el cielo sale más claro y el conjunto algo
más apagado. Como los colores de DESIGN.md se midieron sobre el original, este script:

1. Reduce la ampliación con Lanczos a ANCHO × ALTO (×2,5 del original, mismo encuadre).
2. Iguala el histograma de cada canal (R, G, B) con el del original: cada valor pasa
   a tener el mismo percentil que tenía en el original. Corrige el desvío global de
   tono sin tocar el dibujo.
3. Guarda el resultado en WebP con CALIDAD_WEBP y muestra la diferencia de color
   media con el original (reduciendo el resultado a su tamaño).

Uso:  uv run scripts/mapa/igualar_mapa_ampliado.py <ampliada-x4.png>
Escribe fuentes/mapa-definitivo.webp; se copia a mano a src/assets/mapa/mapa-mariola.webp.
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image

CARPETA = Path(__file__).resolve().parent
ORIGINAL = CARPETA / "fuentes" / "mapa-definitivo-1024.png"
RESULTADO = CARPETA / "fuentes" / "mapa-definitivo.webp"
ANCHO, ALTO = 2560, 1430  # 1024 × 572 multiplicado por 2,5
CALIDAD_WEBP = 90


def igualar_histograma(imagen, referencia):
    """Copia de `imagen` (uint8, RGB) con la distribución de cada canal de `referencia`."""
    salida = np.empty_like(imagen)
    for canal in range(3):
        valores, indices, cuentas = np.unique(imagen[..., canal].ravel(), return_inverse=True, return_counts=True)
        valores_ref, cuentas_ref = np.unique(referencia[..., canal].ravel(), return_counts=True)
        percentiles = np.cumsum(cuentas) / imagen[..., canal].size
        percentiles_ref = np.cumsum(cuentas_ref) / referencia[..., canal].size
        nuevos = np.interp(percentiles, percentiles_ref, valores_ref)
        salida[..., canal] = np.round(nuevos[indices]).reshape(imagen.shape[:2]).astype(np.uint8)
    return salida


def main():
    if len(sys.argv) != 2:
        sys.exit("Uso: uv run scripts/mapa/igualar_mapa_ampliado.py <ampliada-x4.png>")
    ampliada_ruta = Path(sys.argv[1])
    for ruta in (ampliada_ruta, ORIGINAL):
        if not ruta.exists():
            sys.exit(f"No existe {ruta}.")

    original = Image.open(ORIGINAL).convert("RGB")
    ampliada = Image.open(ampliada_ruta).convert("RGB")
    proporcion_original = original.width / original.height
    proporcion_ampliada = ampliada.width / ampliada.height
    if abs(proporcion_ampliada - proporcion_original) > 0.01:
        sys.exit(f"La ampliada no tiene el encuadre del original ({proporcion_ampliada:.4f} frente a "
                 f"{proporcion_original:.4f}). ¿Es la salida de Real-ESRGAN de {ORIGINAL.name}?")
    if np.asarray(ampliada).max() == 0:
        sys.exit("La ampliada es negra: vuelve a ejecutar Real-ESRGAN con -t 128 (ver README).")

    reducida = np.asarray(ampliada.resize((ANCHO, ALTO), Image.LANCZOS))
    igualada = Image.fromarray(igualar_histograma(reducida, np.asarray(original)))
    igualada.save(RESULTADO, "WEBP", quality=CALIDAD_WEBP, method=6)

    comprobacion = np.asarray(Image.open(RESULTADO).convert("RGB").resize(original.size, Image.LANCZOS), float)
    diferencia = np.abs(comprobacion - np.asarray(original, float)).mean()
    peso = RESULTADO.stat().st_size / 1024
    print(f"Escrito {RESULTADO.relative_to(CARPETA)} ({ANCHO} × {ALTO}, {peso:.0f} KB).")
    print(f"Diferencia de color media con el original: {diferencia:.2f}/255.")


if __name__ == "__main__":
    main()
