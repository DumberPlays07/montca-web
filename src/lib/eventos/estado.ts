/**
 * Estado de las inscripciones de un evento y fechas que dependen de sus jornadas (C-04).
 *
 * Lógica pura, sin Astro: la usan las páginas al construirse y el script del navegador,
 * que la vuelve a calcular con la hora del visitante (FR-012). Reglas en
 * `specs/001-eventos-torneo/data-model.md` §2.
 */

export type EstadoInscripcion = 'proximament' | 'obertes' | 'completes' | 'tancades';

/** Lo mínimo de un evento que hace falta para calcular su estado y sus fechas. */
export interface EventoParaEstado {
	jornadas: { fecha: string }[];
	inscripcion: {
		/** Instante ISO con diferencia horaria. */
		apertura: string;
		/** Instante ISO con diferencia horaria. */
		cierre: string;
		cerradaAMano: boolean;
	};
	categorias: CategoriaParaPlazas[];
}

export interface CategoriaParaPlazas {
	id: string;
	maxEquipos: number;
}

/** Equipos confirmados por `id` de categoría. */
export type ConfirmadosPorCategoria = Record<string, number>;

/**
 * Equipos confirmados por categoría. Cuenta una por una las categorías del evento (con cero si
 * no hay ninguno) y se salta las que el evento no tiene.
 */
export function confirmadosPorCategoria(
	equipos: { categoria: string }[],
	idsCategorias: string[],
): ConfirmadosPorCategoria {
	const recuento: ConfirmadosPorCategoria = Object.fromEntries(idsCategorias.map((id) => [id, 0]));
	for (const equipo of equipos) {
		if (equipo.categoria in recuento) {
			recuento[equipo.categoria] += 1;
		}
	}
	return recuento;
}

/** La lista de equipos se retira una semana después de la última jornada (FR-040). */
const DIAS_HASTA_RETIRAR_LISTA = 7;

const ZONA_HORARIA_EVENTOS = 'Europe/Madrid';

/**
 * Calcula el estado de las inscripciones en el instante `ahora`.
 * Sin `confirmadosPorCategoria` (sin fuente de equipos) nunca devuelve `completes`.
 */
export function calcularEstado(
	evento: EventoParaEstado,
	ahora: Date,
	confirmadosPorCategoria?: ConfirmadosPorCategoria,
): EstadoInscripcion {
	const { inscripcion } = evento;
	if (inscripcion.cerradaAMano) {
		return 'tancades';
	}
	const instante = ahora.getTime();
	if (instante < Date.parse(inscripcion.apertura)) {
		return 'proximament';
	}
	if (instante > Date.parse(inscripcion.cierre)) {
		return 'tancades';
	}
	if (confirmadosPorCategoria !== undefined && todasCompletas(evento.categorias, confirmadosPorCategoria)) {
		return 'completes';
	}
	return 'obertes';
}

function todasCompletas(categorias: CategoriaParaPlazas[], confirmados: ConfirmadosPorCategoria): boolean {
	return categorias.every((categoria) => {
		const recuento = confirmados[categoria.id];
		// Una categoría de la que no llega recuento no se da por llena.
		return recuento !== undefined && plazasCategoria(categoria, recuento).completa;
	});
}

/** Plazas libres de una categoría: máximo menos confirmados, nunca negativo. */
export function plazasCategoria(
	categoria: CategoriaParaPlazas,
	confirmados: number,
): { libres: number; completa: boolean } {
	const libres = Math.max(0, categoria.maxEquipos - confirmados);
	return { libres, completa: libres === 0 };
}

/** Verdadero cuando en Madrid ya ha terminado el día de la última jornada (FR-004). */
export function esEventoPasado(evento: EventoParaEstado, ahora: Date): boolean {
	return fechaEnMadrid(ahora) > ultimaJornada(evento);
}

/**
 * Verdadero desde las 00:00 (Madrid) del día que cae 7 días después de la última jornada:
 * desde entonces no se muestran ni la lista de equipos ni las plazas (FR-040).
 */
export function listaRetirada(evento: EventoParaEstado, ahora: Date): boolean {
	return fechaEnMadrid(ahora) >= sumarDias(ultimaJornada(evento), DIAS_HASTA_RETIRAR_LISTA);
}

/** Fecha de la última jornada (`AAAA-MM-DD`). El esquema garantiza que hay al menos una. */
export function ultimaJornada(evento: EventoParaEstado): string {
	return evento.jornadas[evento.jornadas.length - 1].fecha;
}

/** Fecha `AAAA-MM-DD` que marca el calendario de Madrid en el instante `ahora`. */
export function fechaEnMadrid(ahora: Date): string {
	// El formato "en-CA" escribe las fechas como AAAA-MM-DD.
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: ZONA_HORARIA_EVENTOS,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(ahora);
}

/** Suma `dias` a una fecha `AAAA-MM-DD`. Se hace en UTC para que no influya el horario de verano. */
function sumarDias(fecha: string, dias: number): string {
	const [anio, mes, dia] = fecha.split('-').map(Number);
	return new Date(Date.UTC(anio, mes - 1, dia + dias)).toISOString().slice(0, 10);
}
