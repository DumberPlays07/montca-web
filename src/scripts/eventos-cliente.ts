/**
 * Script de la página de un evento y de la franja de la portada (C-04). La web es estática:
 * la página trae el estado del día en que se construyó, y este script lo vuelve a calcular
 * con la hora del momento para que cambie en su fecha sin volver a publicar (FR-012, research R1).
 *
 * En la página del evento, además, pide los equipos a la fuente elegida (`FuenteEquipos`) y
 * rellena "Places i equips" con las plantillas `<template>` de la página: los textos salen del
 * HTML, no de aquí (T030). Con la lista retirada (FR-040) no pide nada (T031).
 */
import {
	type ConfirmadosPorCategoria,
	type EstadoInscripcion,
	type EventoParaEstado,
	calcularEstado,
	confirmadosPorCategoria,
	listaRetirada,
	plazasCategoria,
} from '../lib/eventos/estado';
import { type EquipoPublico, type JugadorPublico, elegirFuente } from '../lib/eventos/fuente-equipos';
import { rellenar } from '../components/textos-eventos';

/** Cada minuto basta para que el estado cambie a su hora si la página se queda abierta. */
const INTERVALO_COMPROBACION_MS = 60_000;

const ESTADOS_CON_BOTON: EstadoInscripcion[] = ['obertes', 'completes'];

/** Variables públicas que dejó el build en el navegador. Una por una, para que Vite las sustituya. */
const ENTORNO_FUENTE = {
	PUBLIC_FUENTE_EQUIPOS: import.meta.env.PUBLIC_FUENTE_EQUIPOS,
	PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
};

function leerEvento(raiz: HTMLElement): EventoParaEstado | null {
	const { apertura, cierre, cerradaAMano } = raiz.dataset;
	if (apertura === undefined || cierre === undefined) {
		return null;
	}
	// Las categorías y la última jornada solo están en la página del evento, no en la franja.
	const categorias = Array.from(raiz.querySelectorAll<HTMLElement>('[data-categoria]')).map((bloque) => ({
		id: bloque.dataset.categoria ?? '',
		maxEquipos: Number(bloque.dataset.maxEquipos),
	}));
	const ultimaJornada = raiz.querySelector<HTMLElement>('[data-equipos]')?.dataset.ultimaJornada;
	return {
		jornadas: ultimaJornada === undefined ? [] : [{ fecha: ultimaJornada }],
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
 * `obtenerRecuento` da los equipos confirmados por categoría cuando ya se conocen (para `completes`).
 * @returns la función que vuelve a calcular y pintar, para llamarla cuando llegue el recuento.
 */
function vigilarEstado(
	raiz: HTMLElement,
	pintar: (raiz: HTMLElement, estado: EstadoInscripcion) => void,
	obtenerRecuento: () => ConfirmadosPorCategoria | undefined = () => undefined,
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

function clonarPlantilla(bloque: HTMLElement, selector: string): DocumentFragment {
	return elemento<HTMLTemplateElement>(bloque, selector).content.cloneNode(true) as DocumentFragment;
}

function crearJugador(bloque: HTMLElement, jugador: JugadorPublico): DocumentFragment {
	const fila = clonarPlantilla(bloque, '[data-plantilla-jugador]');
	elemento(fila, '[data-nombre]').textContent = jugador.nombrePublico;
	// Sin dorsal, el jugador sale sin hueco ni guion (FR-022).
	if (jugador.dorsal === null) {
		elemento(fila, '[data-dorsal]').remove();
	} else {
		elemento(fila, '[data-valor-dorsal]').textContent = String(jugador.dorsal);
	}
	if (!jugador.esCapitan) {
		elemento(fila, '[data-capita]').remove();
	}
	return fila;
}

/**
 * Un equipo con jugadores es un desplegable. Uno con los jugadores ocultos (FR-041) o sin ninguno
 * visible sale solo con su nombre: sin desplegable, sin número de jugadores y sin capitán (T032).
 */
function crearEquipo(bloque: HTMLElement, equipo: EquipoPublico): DocumentFragment {
	const soloNombre = equipo.jugadoresOcultos || equipo.jugadores.length === 0;
	const fila = clonarPlantilla(bloque, soloNombre ? '[data-plantilla-equipo-simple]' : '[data-plantilla-equipo]');
	elemento(fila, '[data-nombre]').textContent = equipo.nombre;
	if (!soloNombre) {
		const { textoUnJugador = '', textoNJugadores = '' } = elemento<HTMLElement>(bloque, '[data-textos]').dataset;
		elemento(fila, '[data-num-jugadores]').textContent =
			equipo.jugadores.length === 1 ? textoUnJugador : rellenar(textoNJugadores, { n: equipo.jugadores.length });
		elemento(fila, '[data-jugadores]').replaceChildren(
			...equipo.jugadores.map((jugador) => crearJugador(bloque, jugador)),
		);
	}
	return fila;
}

/** Pinta plazas y equipos de cada categoría y enseña el bloque. Devuelve el recuento de confirmados. */
function pintarEquipos(bloque: HTMLElement, evento: EventoParaEstado, equipos: EquipoPublico[]): ConfirmadosPorCategoria {
	const ids = evento.categorias.map((categoria) => categoria.id);
	const conocidos = equipos.filter((equipo) => ids.includes(equipo.categoria));
	if (import.meta.env.DEV && conocidos.length !== equipos.length) {
		// Contrato de FuenteEquipos: una categoría desconocida se ignora y se avisa en desarrollo.
		console.warn('Equipos con una categoría que el evento no tiene; se han ignorado.');
	}
	const recuento = confirmadosPorCategoria(conocidos, ids);
	const { textoPlazas = '', textoCompleta = '' } = elemento<HTMLElement>(bloque, '[data-textos]').dataset;

	// FR-021: la lista sale cuando hay al menos un equipo confirmado en el evento; si no, se anima a ser el primero.
	elemento(bloque, '[data-sin-equipos]').hidden = conocidos.length > 0;

	bloque.querySelectorAll<HTMLElement>('[data-categoria]').forEach((bloqueCategoria) => {
		const id = bloqueCategoria.dataset.categoria ?? '';
		const maxEquipos = Number(bloqueCategoria.dataset.maxEquipos);
		const plazas = plazasCategoria({ id, maxEquipos }, recuento[id]);
		const deLaCategoria = conocidos.filter((equipo) => equipo.categoria === id);

		elemento(bloqueCategoria, '[data-plazas]').textContent = plazas.completa
			? textoCompleta
			: rellenar(textoPlazas, { libres: plazas.libres, max: maxEquipos });
		elemento(bloqueCategoria, '[data-espera]').hidden = !plazas.completa;
		elemento(bloqueCategoria, '[data-rotulo]').hidden = deLaCategoria.length === 0;
		elemento(bloqueCategoria, '[data-lista-equipos]').replaceChildren(
			...deLaCategoria.map((equipo) => crearEquipo(bloque, equipo)),
		);
	});

	bloque.hidden = false;
	return recuento;
}

/** Una línea de aviso en lugar de las plazas y la lista; el resto de la página sigue (FR-028). */
function pintarError(bloque: HTMLElement): void {
	elemento<HTMLElement>(bloque, '[data-error]').hidden = false;
	elemento<HTMLElement>(bloque, '[data-categorias]').hidden = true;
	bloque.hidden = false;
}

/**
 * Pide los equipos a la fuente elegida y rellena el bloque.
 * @returns el recuento de confirmados por categoría, o `undefined` si no hay equipos que contar.
 */
async function cargarEquipos(bloque: HTMLElement, evento: EventoParaEstado): Promise<ConfirmadosPorCategoria | undefined> {
	// Con la lista retirada no se pide nada ni se enseña nada, aunque la página se construyera antes (FR-040).
	if (evento.jornadas.length > 0 && listaRetirada(evento, new Date())) {
		bloque.remove();
		return undefined;
	}
	try {
		const fuente = elegirFuente(ENTORNO_FUENTE, document);
		const resultado = await fuente.obtenerEquipos(bloque.dataset.eventoId ?? '');
		if (resultado.tipo === 'sin-fuente') {
			// Sin fuente no sale nada, ni el segundo Inscriure's (FR-015).
			bloque.remove();
			return undefined;
		}
		if (resultado.tipo === 'error') {
			pintarError(bloque);
			return undefined;
		}
		return pintarEquipos(bloque, evento, resultado.equipos);
	} catch (error) {
		// La fuente no lanza por contrato; si algo falla igualmente, la página sigue con el aviso.
		console.error('No se han podido mostrar los equipos inscritos.', error);
		pintarError(bloque);
		return undefined;
	}
}

function iniciarPaginaEvento(raiz: HTMLElement): void {
	let recuento: ConfirmadosPorCategoria | undefined;
	const actualizar = vigilarEstado(raiz, pintarEstado, () => recuento);
	const evento = leerEvento(raiz);
	const bloque = raiz.querySelector<HTMLElement>('[data-equipos]');
	if (actualizar === null || evento === null || bloque === null) {
		return;
	}
	void cargarEquipos(bloque, evento).then((confirmados) => {
		recuento = confirmados;
		// Con todas las categorías llenas, el estado pasa a "completes" (FR-014).
		actualizar();
	});
}

const paginaEvento = document.querySelector<HTMLElement>('[data-evento]');
if (paginaEvento) {
	iniciarPaginaEvento(paginaEvento);
}

const franja = document.querySelector<HTMLElement>('[data-franja-evento]');
if (franja) {
	vigilarEstado(franja, pintarFranja);
}
