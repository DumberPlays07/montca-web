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

/** Lo que usa `calcularEstado`: las jornadas solo importan para saber si el evento ya pasó. */
export type EventoParaCalcularEstado = Pick<EventoParaEstado, 'inscripcion' | 'categorias'>;

export interface CategoriaParaPlazas {
	id: string;
	maxEquipos: number;
}

/** Equipos que ocupan plaza por `id` de categoría. */
export type EquiposPorCategoria = Record<string, number>;

/**
 * Recuentos de la fuente de plazas en un registro por categoría. Se salta las categorías que el
 * evento no tiene. Una categoría de la que no llega recuento no aparece: no se da por vacía.
 */
export function equiposPorCategoria(
	plazas: { categoria: string; equiposActuales: number }[],
	idsCategorias: string[],
): EquiposPorCategoria {
	const recuento: EquiposPorCategoria = {};
	for (const { categoria, equiposActuales } of plazas) {
		if (idsCategorias.includes(categoria)) {
			recuento[categoria] = equiposActuales;
		}
	}
	return recuento;
}

const ZONA_HORARIA_EVENTOS = 'Europe/Madrid';

/**
 * Calcula el estado de las inscripciones en el instante `ahora`.
 * Sin `equiposPorCategoria` (sin fuente de plazas) nunca devuelve `completes`.
 */
export function calcularEstado(
	evento: EventoParaCalcularEstado,
	ahora: Date,
	equiposPorCategoria?: EquiposPorCategoria,
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
	if (equiposPorCategoria !== undefined && todasCompletas(evento.categorias, equiposPorCategoria)) {
		return 'completes';
	}
	return 'obertes';
}

function todasCompletas(categorias: CategoriaParaPlazas[], equipos: EquiposPorCategoria): boolean {
	return categorias.every((categoria) => {
		const recuento = equipos[categoria.id];
		// Una categoría de la que no llega recuento no se da por llena.
		return recuento !== undefined && plazasCategoria(categoria, recuento).completa;
	});
}

/** Plazas libres de una categoría: máximo menos equipos que ocupan plaza, nunca negativo. */
export function plazasCategoria(
	categoria: CategoriaParaPlazas,
	equiposActuales: number,
): { libres: number; completa: boolean } {
	const libres = Math.max(0, categoria.maxEquipos - equiposActuales);
	return { libres, completa: libres === 0 };
}

/** Verdadero cuando en Madrid ya ha terminado el día de la última jornada (FR-004). */
export function esEventoPasado(evento: EventoParaEstado, ahora: Date): boolean {
	return fechaEnMadrid(ahora) > ultimaJornada(evento);
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
