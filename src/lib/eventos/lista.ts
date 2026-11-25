/**
 * Qué eventos salen en la sección Eventos y en qué orden (C-04, historia 4, FR-001 y FR-004).
 *
 * Lógica pura: la usa la página de la lista al construirse.
 */
import { type EventoParaEstado, esEventoPasado } from './estado.ts';

/**
 * Los eventos próximos (los que aún no han terminado), por orden de su primera jornada.
 * Un evento sale hasta el final del día de su última jornada; su página sigue accesible
 * después, aunque ya no salga aquí.
 * No modifica la lista que recibe.
 */
export function eventosProximos<T extends EventoParaEstado>(eventos: T[], ahora: Date): T[] {
	return eventos
		.filter((evento) => !esEventoPasado(evento, ahora))
		.sort((a, b) => a.jornadas[0].fecha.localeCompare(b.jornadas[0].fecha));
}
