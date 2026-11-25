/**
 * Cuenta atrás hasta la primera jornada de un evento, para la portada (B-13, #102).
 *
 * Lógica pura, sin Astro: la usa la portada al construirse y el script del navegador, que la
 * vuelve a calcular con la hora del visitante, igual que el estado de los eventos.
 *
 * Cuenta el tiempo real (milisegundos) hasta el instante de inicio, así la noche del cambio de
 * hora sale exacta. El inicio es la `hora` de la primera jornada o, si no la trae, las 00:00 de
 * Madrid de ese día.
 */
import { fechaEnMadrid } from './estado.ts';

/** Lo mínimo de un evento que hace falta: sus jornadas, por orden. */
export interface EventoConJornadas {
	jornadas: {
		/** `AAAA-MM-DD`. */
		fecha: string;
		/** Hora de inicio de la jornada en Madrid (`HH:MM`). Sin ella, se cuenta hasta las 00:00. */
		hora?: string;
	}[];
}

export type CuentaAtras =
	/** Falta tiempo para el inicio. */
	| { tipo: 'cuenta'; dias: number; horas: number; minutos: number; segundos: number }
	/** Hoy es la primera jornada y ya ha llegado su hora de inicio. */
	| { tipo: 'hoy' }
	/** La primera jornada ya pasó y el evento no ha terminado. */
	| { tipo: 'en-curso' }
	/** No hay evento con fecha por venir. */
	| { tipo: 'proximament' };

/** Cada casilla de la cuenta como texto, con dos cifras como mínimo. */
export interface CasillasCuenta {
	dias: string;
	horas: string;
	minutos: string;
	segundos: string;
}

const ZONA_HORARIA_EVENTOS = 'Europe/Madrid';
const MS_POR_SEGUNDO = 1000;
const SEGUNDOS_POR_MINUTO = 60;
const SEGUNDOS_POR_HORA = 60 * SEGUNDOS_POR_MINUTO;
const SEGUNDOS_POR_DIA = 24 * SEGUNDOS_POR_HORA;
const CIFRAS_MINIMAS = 2;
const HORA_SIN_ESPECIFICAR = '00:00';

/**
 * Cuenta atrás del evento en el instante `ahora`, o `proximament` si no hay evento, no tiene
 * jornadas o ya terminó (el día de su última jornada acaba a medianoche en Madrid, FR-004).
 */
export function calcularCuentaAtras(evento: EventoConJornadas | null, ahora: Date): CuentaAtras {
	if (evento === null || evento.jornadas.length === 0) {
		return { tipo: 'proximament' };
	}
	const primera = evento.jornadas[0];
	const hoy = fechaEnMadrid(ahora);
	if (hoy > evento.jornadas[evento.jornadas.length - 1].fecha) {
		return { tipo: 'proximament' };
	}
	const faltanMs = instanteInicio(primera.fecha, primera.hora ?? HORA_SIN_ESPECIFICAR) - ahora.getTime();
	if (faltanMs > 0) {
		// Hacia arriba: la cuenta llega a 1 segundo y de ahí pasa a "hoy", nunca enseña 0 antes de empezar.
		return { tipo: 'cuenta', ...desglosar(Math.ceil(faltanMs / MS_POR_SEGUNDO)) };
	}
	return { tipo: hoy === primera.fecha ? 'hoy' : 'en-curso' };
}

/** Las casillas de una cuenta como texto: dos cifras como mínimo para que el ancho no cambie. */
export function casillasCuenta(cuenta: Extract<CuentaAtras, { tipo: 'cuenta' }>): CasillasCuenta {
	const dosCifras = (valor: number) => String(valor).padStart(CIFRAS_MINIMAS, '0');
	return {
		dias: dosCifras(cuenta.dias),
		horas: dosCifras(cuenta.horas),
		minutos: dosCifras(cuenta.minutos),
		segundos: dosCifras(cuenta.segundos),
	};
}

function desglosar(segundosTotales: number) {
	return {
		dias: Math.floor(segundosTotales / SEGUNDOS_POR_DIA),
		horas: Math.floor((segundosTotales % SEGUNDOS_POR_DIA) / SEGUNDOS_POR_HORA),
		minutos: Math.floor((segundosTotales % SEGUNDOS_POR_HORA) / SEGUNDOS_POR_MINUTO),
		segundos: segundosTotales % SEGUNDOS_POR_MINUTO,
	};
}

/** Instante (ms) en que el reloj de Madrid marca `hora` del día `fecha` (`AAAA-MM-DD`, `HH:MM`). */
function instanteInicio(fecha: string, hora: string): number {
	const [anio, mes, dia] = fecha.split('-').map(Number);
	const [horas, minutos] = hora.split(':').map(Number);
	// La hora de pared tomada como si fuera UTC; se le resta lo que Madrid se adelanta a UTC en ese momento.
	const comoUtc = Date.UTC(anio, mes - 1, dia, horas, minutos);
	const primerIntento = comoUtc - desfaseMadrid(comoUtc);
	// Segunda pasada: el desfase se mide en el instante ya corregido, por si cae al otro lado de un cambio de hora.
	return comoUtc - desfaseMadrid(primerIntento);
}

/** Milisegundos que el reloj de Madrid se adelanta a UTC en el instante `instante` (3 600 000 o 7 200 000). */
function desfaseMadrid(instante: number): number {
	const partes = new Intl.DateTimeFormat('en-GB', {
		timeZone: ZONA_HORARIA_EVENTOS,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hourCycle: 'h23',
	}).formatToParts(instante);
	const valor = (tipo: string) => Number(partes.find((parte) => parte.type === tipo)?.value);
	const segundosExactos = instante - (instante % MS_POR_SEGUNDO);
	const comoUtc = Date.UTC(valor('year'), valor('month') - 1, valor('day'), valor('hour'), valor('minute'), valor('second'));
	return comoUtc - segundosExactos;
}
