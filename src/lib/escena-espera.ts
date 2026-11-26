/**
 * La escena de entrada del mapa (B-22) espera a que la imagen del mapa esté pintada. Sin esto, con la red
 * lenta la boira, la brisa y los excursionistas corren sobre un mapa vacío (issue #120).
 *
 * El estado vive en `data-estado` de `.escena` y lo lee `EscenaMapa.astro`:
 * - **sin atributo** (sin JavaScript): la escena corre como siempre.
 * - **`esperando`**: sin animaciones y sin excursionistas, hasta que llegue el mapa.
 * - **`listo`**: el mapa está pintado y las animaciones arrancan desde cero.
 * - **`omitida`**: el mapa no llegó en `limiteMs` desde que empezó la carga de la página, o falló. No se
 *   arranca tarde: los excursionistas se quedan quietos en su sitio, como con movimiento reducido.
 *
 * `esperarMapa` se escribe aquí para poder probarla (`escena-espera.test.ts`), pero se publica serializada
 * con `.toString()` en un `<script is:inline>` justo después de `.escena` en `MapaMariola.astro`: así
 * cambia el estado antes del primer pintado, que un módulo (diferido) no garantiza. Por eso no puede usar
 * nada de fuera de su propio cuerpo. No guarda nada en el navegador.
 */

/** Cuánto se espera al mapa, contado desde que empieza la carga de la página (ms). */
export const LIMITE_ESPERA_MAPA_MS = 4000;

export interface ImagenEspera {
	complete: boolean;
	naturalWidth: number;
	addEventListener: (tipo: string, oyente: () => void) => void;
}

export interface EscenaEspera {
	dataset: Record<string, string | undefined>;
}

/** La parte de `window` que usamos: así las pruebas pasan una ventana falsa. */
export interface VentanaEspera {
	performance: { now: () => number };
	setTimeout: (accion: () => void, ms: number) => unknown;
	clearTimeout: (temporizador: unknown) => void;
	requestAnimationFrame: (accion: () => void) => unknown;
}

/**
 * Pone `data-estado` en la escena: `esperando` ahora y `listo` u `omitida` cuando se sepa. Solo el primer
 * desenlace cuenta: un mapa que llega después del límite no despierta una escena ya omitida.
 */
export function esperarMapa(escena: EscenaEspera, imagen: ImagenEspera, ventana: VentanaEspera, limiteMs: number): void {
	let resuelto = false;
	let temporizador: unknown = null;

	const resolver = (estado: 'listo' | 'omitida'): void => {
		if (resuelto) {
			return;
		}
		resuelto = true;
		if (temporizador !== null) {
			ventana.clearTimeout(temporizador);
		}
		escena.dataset.estado = estado;
	};

	// Un fotograma después de `load`: la imagen ya está decodificada y pintada, y la escena arranca sobre ella.
	const alCargar = (): void => {
		ventana.requestAnimationFrame(() => resolver('listo'));
	};

	escena.dataset.estado = 'esperando';

	if (imagen.complete) {
		// Ya llegó (caché) o falló: `naturalWidth` es 0 si la imagen está rota.
		if (imagen.naturalWidth > 0) {
			alCargar();
		} else {
			resolver('omitida');
		}
		return;
	}

	const restante = limiteMs - ventana.performance.now();
	if (restante <= 0) {
		resolver('omitida');
		return;
	}
	temporizador = ventana.setTimeout(() => resolver('omitida'), restante);
	imagen.addEventListener('load', alCargar);
	// Sin mapa no hay escena que enseñar sobre él.
	imagen.addEventListener('error', () => resolver('omitida'));
}
