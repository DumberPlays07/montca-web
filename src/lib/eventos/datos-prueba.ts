/**
 * DATOS DE PRUEBA de las plazas por categoría (C-04, HU-19, FR-035). Son recuentos inventados:
 * no hay ningún equipo ni persona detrás.
 *
 * Nunca se publican en producción: solo los usa la fuente `prueba` (local y vistas previas),
 * que el build rechaza con `CONTEXT=production` (`fuente-plazas.ts`). Este archivo no lo
 * importa ningún script del navegador.
 */
import type { PlazasCategoria } from './fuente-plazas.ts';

/** `id` del evento al que pertenecen: el del YAML del torneo. */
export const EVENTO_PRUEBA = 'torneig-nadal-2026';

/** Con los máximos del torneo (8 y 6) dan "5 de 8 equips" y "2 de 6 equips". */
export const plazasPrueba: PlazasCategoria[] = [
	{ categoria: 'infantil-cadet', equiposActuales: 5 },
	{ categoria: 'juvenil-senior', equiposActuales: 2 },
];
