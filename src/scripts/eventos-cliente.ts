/**
 * Script de la página de un evento, de la sección Eventos y de la franja de la portada (C-04). La web es estática:
 * la página trae el estado del día en que se construyó, y este script lo vuelve a calcular
 * con la hora del momento para que cambie en su fecha sin volver a publicar (FR-012, research R1).
 *
 * En la página del evento, además, pide los recuentos de equipos por categoría a la fuente
 * elegida (`FuentePlazas`) y rellena las plazas de cada categoría: los textos salen del HTML,
 * no de aquí (HU-19). La parte pública solo conoce números, nunca equipos ni jugadores.
 */
import {
	type EquiposPorCategoria,
	type EstadoInscripcion,
	type EventoParaCalcularEstado,
	calcularEstado,
	equiposPorCategoria,
	plazasCategoria,
} from '../lib/eventos/estado';
import { elegirFuente } from '../lib/eventos/fuente-plazas';
import { rellenar } from '../components/textos-eventos';

/** Cada minuto basta para que el estado cambie a su hora si la página se queda abierta. */
const INTERVALO_COMPROBACION_MS = 60_000;

/** Sin lista de espera, solo se puede apuntar un equipo con las inscripciones abiertas. */
const ESTADOS_CON_BOTON: EstadoInscripcion[] = ['obertes'];

/** Variables públicas que dejó el build en el navegador. Una por una, para que Vite las sustituya. */
const ENTORNO_FUENTE = {
	PUBLIC_FUENTE_PLAZAS: import.meta.env.PUBLIC_FUENTE_PLAZAS,
	PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
};

function leerEvento(raiz: HTMLElement): EventoParaCalcularEstado | null {
	const { apertura, cierre, cerradaAMano } = raiz.dataset;
	if (apertura === undefined || cierre === undefined) {
		return null;
	}
	// Las categorías solo están en la página del evento, no en la franja.
	const categorias = Array.from(raiz.querySelectorAll<HTMLElement>('[data-categoria]')).map((bloque) => ({
		id: bloque.dataset.categoria ?? '',
		maxEquipos: Number(bloque.dataset.maxEquipos),
	}));
	return {
		categorias,
		inscripcion: { apertura, cierre, cerradaAMano: cerradaAMano === 'true' },
	};
}

function pintarEstado(raiz: HTMLElement, estado: EstadoInscripcion): void {
	raiz.querySelectorAll<HTMLElement>('[data-estat]').forEach((linea) => {
		if (linea.dataset.estado === estado) {
			return;
		}
		const texto = linea.querySelector<HTMLElement>('[data-texto-estat]');
		// Los textos los deja la página en `data-texto-<estado>`, en su idioma.
		const nuevoTexto = linea.getAttribute(`data-texto-${estado}`);
		if (texto !== null && nuevoTexto !== null) {
			linea.dataset.estado = estado;
			texto.textContent = nuevoTexto;
		}
	});
	raiz.querySelectorAll<HTMLElement>('[data-boto-inscripcio]').forEach((boton) => {
		boton.hidden = !ESTADOS_CON_BOTON.includes(estado);
	});
}

/** La franja de la portada solo se ve con las inscripciones abiertas (FR-029). */
function pintarFranja(franja: HTMLElement, estado: EstadoInscripcion): void {
	franja.hidden = estado !== 'obertes';
}

/**
 * Recalcula el estado de `raiz` ahora y cada minuto, y lo pinta con `pintar`.
 * `obtenerRecuento` da los equipos por categoría cuando ya se conocen (para `completes`).
 * @returns la función que vuelve a calcular y pintar, para llamarla cuando llegue el recuento.
 */
function vigilarEstado(
	raiz: HTMLElement,
	pintar: (raiz: HTMLElement, estado: EstadoInscripcion) => void,
	obtenerRecuento: () => EquiposPorCategoria | undefined = () => undefined,
): (() => void) | null {
	const evento = leerEvento(raiz);
	if (evento === null) {
		return null;
	}
	const actualizar = () => pintar(raiz, calcularEstado(evento, new Date(), obtenerRecuento()));
	actualizar();
	window.setInterval(actualizar, INTERVALO_COMPROBACION_MS);
	return actualizar;
}

/** Un elemento que la página tiene que traer; si falta, es un fallo de la página, no del usuario. */
function elemento<T extends Element>(raiz: ParentNode, selector: string): T {
	const encontrado = raiz.querySelector<T>(selector);
	if (encontrado === null) {
		throw new Error(`Falta ${selector} en la página del evento.`);
	}
	return encontrado;
}

/**
 * Escribe "N de M equips" o "Completa" en cada categoría y enseña el bloque.
 * Si falta el recuento de alguna categoría, no inventa un número: enseña el aviso de error.
 * @returns el recuento por categoría, o `undefined` si faltaba alguno.
 */
function pintarPlazas(
	bloque: HTMLElement,
	evento: EventoParaCalcularEstado,
	plazas: { categoria: string; equiposActuales: number }[],
): EquiposPorCategoria | undefined {
	const ids = evento.categorias.map((categoria) => categoria.id);
	const conocidas = plazas.filter((fila) => ids.includes(fila.categoria));
	if (import.meta.env.DEV && conocidas.length !== plazas.length) {
		// Contrato de FuentePlazas: una categoría desconocida se ignora y se avisa en desarrollo.
		console.warn('Plazas con una categoría que el evento no tiene; se han ignorado.');
	}
	const recuento = equiposPorCategoria(conocidas, ids);
	if (ids.some((id) => recuento[id] === undefined)) {
		pintarError(bloque);
		return undefined;
	}
	const { textoOcupados = '', textoCompleta = '' } = elemento<HTMLElement>(bloque, '[data-textos]').dataset;

	bloque.querySelectorAll<HTMLElement>('[data-categoria]').forEach((bloqueCategoria) => {
		const id = bloqueCategoria.dataset.categoria ?? '';
		const maxEquipos = Number(bloqueCategoria.dataset.maxEquipos);
		const plazasCategoriaActual = plazasCategoria({ id, maxEquipos }, recuento[id]);
		elemento(bloqueCategoria, '[data-plazas]').textContent = plazasCategoriaActual.completa
			? textoCompleta
			: rellenar(textoOcupados, { n: recuento[id], max: maxEquipos });
	});

	bloque.hidden = false;
	return recuento;
}

/** Una línea de aviso en lugar de los números; el resto de la página sigue (FR-028). */
function pintarError(bloque: HTMLElement): void {
	elemento<HTMLElement>(bloque, '[data-error]').hidden = false;
	elemento<HTMLElement>(bloque, '[data-categorias]').hidden = true;
	bloque.hidden = false;
}

/**
 * Pide los recuentos a la fuente elegida y rellena el bloque.
 * @returns el recuento por categoría, o `undefined` si no hay datos que contar.
 */
async function cargarPlazas(bloque: HTMLElement, evento: EventoParaCalcularEstado): Promise<EquiposPorCategoria | undefined> {
	try {
		const fuente = elegirFuente(ENTORNO_FUENTE, document);
		const resultado = await fuente.obtenerPlazas(bloque.dataset.eventoId ?? '');
		if (resultado.tipo === 'sin-fuente') {
			// Sin fuente no sale nada, ni el segundo Inscriure's (FR-015).
			bloque.remove();
			return undefined;
		}
		if (resultado.tipo === 'error') {
			pintarError(bloque);
			return undefined;
		}
		return pintarPlazas(bloque, evento, resultado.plazas);
	} catch (error) {
		// La fuente no lanza por contrato; si algo falla igualmente, la página sigue con el aviso.
		console.error('No se han podido mostrar las plazas.', error);
		pintarError(bloque);
		return undefined;
	}
}

function iniciarPaginaEvento(raiz: HTMLElement): void {
	let recuento: EquiposPorCategoria | undefined;
	const actualizar = vigilarEstado(raiz, pintarEstado, () => recuento);
	const evento = leerEvento(raiz);
	const bloque = raiz.querySelector<HTMLElement>('[data-plazas-evento]');
	if (actualizar === null || evento === null || bloque === null) {
		return;
	}
	void cargarPlazas(bloque, evento).then((equipos) => {
		recuento = equipos;
		// Con todas las categorías llenas, el estado pasa a "completes" (FR-014).
		actualizar();
	});
}

// Una página de evento o, en la sección Eventos, una tarjeta por evento.
document.querySelectorAll<HTMLElement>('[data-evento]').forEach(iniciarPaginaEvento);

const franja = document.querySelector<HTMLElement>('[data-franja-evento]');
if (franja) {
	vigilarEstado(franja, pintarFranja);
}
