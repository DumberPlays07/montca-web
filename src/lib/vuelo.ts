/**
 * Vuelo del mapa (B-19): al pulsar "Entra" en la viñeta, el punto del botón seleccionado viaja hasta el
 * título de la página de destino mediante una View Transition entre páginas. Las reglas visuales están
 * en `src/styles/global.css`; aquí se decide, en las dos páginas, si una navegación es un vuelo.
 *
 * - **Página que se abandona (`pageswap`):** es un vuelo si el clic salió del enlace "Entra" (sin Ctrl,
 *   Cmd, Mayús ni Alt) y hay un botón seleccionado. Entonces el punto recibe el nombre `vuelo`.
 *   Cualquier otra navegación cancela la transición: cambiar de página no se anima (DESIGN.md).
 * - **Página nueva (`pagereveal`):** pone a la transición el tipo `vuelo` si llega desde la portada
 *   (`navigation.activation.from`, de la Navigation API), y `global.css` lo usa para colocar la marca
 *   de aterrizaje en el título. Los tipos no pasan de una página a otra por sí solos.
 * - **No se guarda nada en el navegador** (ni `sessionStorage` ni cookies: decisiones.md, B-07 y B-17).
 * - Con `prefers-reduced-motion: reduce` no hay transición (`@view-transition` está en una media query),
 *   así que `viewTransition` llega vacío y no se hace nada.
 *
 * `activarVuelo` y `vieneDelMapa` se escriben aquí para poder probarlas (`vuelo.test.ts`), pero se
 * publican serializadas con `.toString()` en un `<script is:inline>` de la cabecera de `BaseLayout.astro`:
 * `pagereveal` se dispara antes del primer pintado de la página nueva y un módulo (diferido) podría
 * llegar tarde. Por eso las dos funciones no pueden usar nada de fuera de su propio cuerpo.
 */

/** Nombre del tipo de transición y del `view-transition-name` del punto. Tiene que coincidir con `global.css`. */
export const TIPO_VUELO = 'vuelo';

/** Lo que usamos de `ViewTransition` (los tipos de DOM del proyecto aún no traen `types`). */
interface TransicionVuelo {
	types?: Set<string>;
	skipTransition: () => void;
}

interface PuntoVuelo {
	style: {
		setProperty: (nombre: string, valor: string) => void;
		removeProperty: (nombre: string) => void;
	};
}

/** Los eventos que escuchamos, con solo los campos que leemos. */
interface EventoVuelo {
	viewTransition?: TransicionVuelo | null;
	persisted?: boolean;
	target?: { closest?: (selector: string) => unknown } | null;
	ctrlKey?: boolean;
	metaKey?: boolean;
	shiftKey?: boolean;
	altKey?: boolean;
}

/** La parte de `window` que usamos: así las pruebas pueden pasar una ventana falsa. */
export interface VentanaVuelo {
	addEventListener: (tipo: string, oyente: (evento: EventoVuelo) => void) => void;
	document: {
		addEventListener: (tipo: string, oyente: (evento: EventoVuelo) => void, captura?: boolean) => void;
		querySelector: (selector: string) => PuntoVuelo | null;
		querySelectorAll: (selector: string) => Iterable<PuntoVuelo>;
	};
	navigation?: { activation?: { from?: { url?: string } | null } | null };
}

export interface ConfiguracionVuelo {
	tipo: string;
	/** Rutas de la portada en cada idioma (`/` y `/es/`): donde está el mapa. */
	inicios: string[];
}

/**
 * ¿Llega la navegación desde la portada? Compara la ruta de la página de origen con las portadas, sin
 * mirar la barra final, la query ni el hash. Sin origen o con una dirección que no se puede leer, no.
 */
export function vieneDelMapa(urlOrigen: string | undefined, inicios: string[]): boolean {
	if (urlOrigen === undefined || urlOrigen === '') {
		return false;
	}
	let rutaOrigen: string;
	try {
		rutaOrigen = new URL(urlOrigen).pathname;
	} catch {
		// No es una dirección completa: sin origen fiable no hay vuelo.
		return false;
	}
	const sinBarraFinal = (ruta: string): string => (ruta.length > 1 && ruta.endsWith('/') ? ruta.slice(0, -1) : ruta);
	return inicios.some((inicio) => sinBarraFinal(inicio) === sinBarraFinal(rutaOrigen));
}

/** Registra los cuatro oyentes del vuelo. Se llama una vez por página, desde la cabecera. */
export function activarVuelo(
	ventana: VentanaVuelo,
	configuracion: ConfiguracionVuelo,
	vieneDelMapaDesde: (urlOrigen: string | undefined, inicios: string[]) => boolean,
): void {
	const { tipo, inicios } = configuracion;
	let desdeLaVineta = false;

	// En captura y antes de navegar: `pageswap` ya no sabe qué se pulsó.
	ventana.document.addEventListener(
		'click',
		(evento) => {
			const sinModificador = !(evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey);
			const objetivo = evento.target;
			desdeLaVineta =
				sinModificador &&
				objetivo !== null &&
				objetivo !== undefined &&
				typeof objetivo.closest === 'function' &&
				objetivo.closest('[data-vineta-enlace]') !== null;
		},
		true,
	);

	ventana.addEventListener('pageswap', (evento) => {
		const transicion = evento.viewTransition;
		if (transicion === null || transicion === undefined) {
			return;
		}
		const punto = desdeLaVineta
			? ventana.document.querySelector('[data-mapa-mariola] a.boton[aria-expanded="true"] .punto')
			: null;
		// Sin tipos de transición o sin Navigation API, la página nueva no sabría dónde aterrizar el punto.
		if (punto === null || transicion.types === undefined || ventana.navigation === undefined) {
			transicion.skipTransition();
			return;
		}
		punto.style.setProperty('view-transition-name', tipo);
	});

	ventana.addEventListener('pagereveal', (evento) => {
		const transicion = evento.viewTransition;
		if (transicion === null || transicion === undefined || transicion.types === undefined) {
			return;
		}
		if (vieneDelMapaDesde(ventana.navigation?.activation?.from?.url, inicios)) {
			transicion.types.add(tipo);
		}
	});

	// Al volver con "Atrás" la página puede salir de la caché con el nombre aún puesto; dos elementos con
	// el mismo nombre anulan la siguiente transición.
	ventana.addEventListener('pageshow', (evento) => {
		desdeLaVineta = false;
		if (evento.persisted === true) {
			for (const punto of ventana.document.querySelectorAll('[data-mapa-mariola] .punto')) {
				punto.style.removeProperty('view-transition-name');
			}
		}
	});
}
