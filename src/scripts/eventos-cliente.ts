/**
 * Script de la página de un evento y de la franja de la portada (C-04). La web es estática:
 * la página trae el estado del día en que se construyó, y este script lo vuelve a calcular
 * con la hora del momento para que cambie en su fecha sin volver a publicar (FR-012, research R1).
 *
 * Por ahora solo hace el estado (T022, T041). La parte de los equipos llega con la fase 4 (T030).
 */
import { type EstadoInscripcion, type EventoParaEstado, calcularEstado } from '../lib/eventos/estado';

/** Cada minuto basta para que el estado cambie a su hora si la página se queda abierta. */
const INTERVALO_COMPROBACION_MS = 60_000;

const ESTADOS_CON_BOTON: EstadoInscripcion[] = ['obertes', 'completes'];

function leerEvento(raiz: HTMLElement): EventoParaEstado | null {
	const { apertura, cierre, cerradaAMano } = raiz.dataset;
	if (apertura === undefined || cierre === undefined) {
		return null;
	}
	// El script no necesita las jornadas ni las categorías mientras no haya recuento de equipos.
	return {
		jornadas: [],
		categorias: [],
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

/** Recalcula el estado de `raiz` ahora y cada minuto, y lo pinta con `pintar`. */
function vigilarEstado(raiz: HTMLElement, pintar: (raiz: HTMLElement, estado: EstadoInscripcion) => void): void {
	const evento = leerEvento(raiz);
	if (evento === null) {
		return;
	}
	const actualizar = () => pintar(raiz, calcularEstado(evento, new Date()));
	actualizar();
	window.setInterval(actualizar, INTERVALO_COMPROBACION_MS);
}

const paginaEvento = document.querySelector<HTMLElement>('[data-evento]');
if (paginaEvento) {
	vigilarEstado(paginaEvento, pintarEstado);
}

const franja = document.querySelector<HTMLElement>('[data-franja-evento]');
if (franja) {
	vigilarEstado(franja, pintarFranja);
}
