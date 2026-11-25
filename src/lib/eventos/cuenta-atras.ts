/**
 * Cuenta atrás hasta la primera jornada de un evento, para la portada (B-13).
 *
 * Lógica pura, sin Astro: la usa la portada al construirse y el script del navegador, que la
 * vuelve a calcular con la hora del visitante, igual que el estado de los eventos.
 *
 * Las jornadas solo traen la fecha, no la hora de inicio: se cuenta hasta las 00:00 de Madrid
 * del primer día. Si Montca da la hora de inicio, es lo único que cambia aquí.
 */
import { fechaEnMadrid } from './estado.ts';

/** Lo mínimo de un evento que hace falta: sus jornadas, por orden, con la fecha `AAAA-MM-DD`. */
export interface EventoConJornadas {
	jornadas: { fecha: string }[];
}

export type CuentaAtras =
	/** Faltan dos días o más. */
	| { tipo: 'dias'; dias: number }
	/** Es la víspera: quedan de 1 a 24 horas hasta las 00:00 de la primera jornada. */
	| { tipo: 'horas'; horas: number }
	/** Hoy es la primera jornada. */
	| { tipo: 'hoy' }
	/** La primera jornada ya pasó y el evento no ha terminado. */
	| { tipo: 'en-curso' }
	/** No hay evento con fecha por venir. */
	| { tipo: 'proximament' };

const MINUTOS_POR_HORA = 60;
const HORAS_POR_DIA = 24;
const MINUTOS_POR_DIA = HORAS_POR_DIA * MINUTOS_POR_HORA;
const MS_POR_DIA = MINUTOS_POR_DIA * 60_000;

/**
 * Cuenta atrás del evento en el instante `ahora`, o `proximament` si no hay evento, no tiene
 * jornadas o ya terminó (el día de su última jornada acaba a medianoche en Madrid, FR-004).
 */
export function calcularCuentaAtras(evento: EventoConJornadas | null, ahora: Date): CuentaAtras {
	if (evento === null || evento.jornadas.length === 0) {
		return { tipo: 'proximament' };
	}
	const hoy = fechaEnMadrid(ahora);
	if (hoy > evento.jornadas[evento.jornadas.length - 1].fecha) {
		return { tipo: 'proximament' };
	}
	const dias = diasEntre(hoy, evento.jornadas[0].fecha);
	if (dias < 0) {
		return { tipo: 'en-curso' };
	}
	if (dias === 0) {
		return { tipo: 'hoy' };
	}
	if (dias === 1) {
		return { tipo: 'horas', horas: horasHastaMedianoche(ahora) };
	}
	return { tipo: 'dias', dias };
}

/** Días de calendario de `desde` a `hasta` (`AAAA-MM-DD`). En UTC, para que no influya el horario de verano. */
function diasEntre(desde: string, hasta: string): number {
	return Math.round((fechaUtc(hasta) - fechaUtc(desde)) / MS_POR_DIA);
}

function fechaUtc(fecha: string): number {
	const [anio, mes, dia] = fecha.split('-').map(Number);
	return Date.UTC(anio, mes - 1, dia);
}

/**
 * Horas que faltan para las 00:00 de mañana en Madrid, redondeadas hacia arriba (de 1 a 24).
 * Se cuenta con el reloj de pared: en la noche del cambio de hora saldría una hora de más o de menos.
 */
function horasHastaMedianoche(ahora: Date): number {
	const partes = new Intl.DateTimeFormat('en-GB', {
		timeZone: 'Europe/Madrid',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	}).formatToParts(ahora);
	const hora = Number(partes.find((parte) => parte.type === 'hour')?.value);
	const minutos = Number(partes.find((parte) => parte.type === 'minute')?.value);
	const minutosRestantes = MINUTOS_POR_DIA - (hora * MINUTOS_POR_HORA + minutos);
	return Math.ceil(minutosRestantes / MINUTOS_POR_HORA);
}
