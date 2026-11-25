/**
 * Qué evento sale en la franja de la portada (C-04, historia 3).
 *
 * Lógica pura: la usa la portada al construirse. La franja solo sale con las inscripciones
 * "obertes" (FR-029) y, si hay más de un evento abierto, muestra el que cierra antes (FR-030).
 */
import { type EventoParaEstado, calcularEstado } from './estado.ts';

/**
 * Devuelve el evento abierto en `ahora` cuyo cierre de inscripciones llega antes,
 * o `null` si no hay ninguno abierto.
 */
export function eventoParaFranja<T extends EventoParaEstado>(eventos: T[], ahora: Date): T | null {
	const abiertos = eventos.filter((evento) => calcularEstado(evento, ahora) === 'obertes');
	if (abiertos.length === 0) {
		return null;
	}
	return abiertos.reduce((elegido, evento) =>
		Date.parse(evento.inscripcion.cierre) < Date.parse(elegido.inscripcion.cierre) ? evento : elegido,
	);
}
