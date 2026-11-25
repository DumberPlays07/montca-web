/**
 * PROVISIONAL (C-04, T028): fuente de equipos de Supabase. Todavía no hay base de datos
 * (A-14), así que no pide nada y devuelve "sin fuente": con `PUBLIC_FUENTE_EQUIPOS=supabase`
 * la página no enseña ni lista ni plazas.
 *
 * TODO (Saúl, T036): sustituir por el `fetch` real a
 * `{url}/rest/v1/equipos_publicos?evento=eq.<evento>` con `apikey` y `Authorization`, un tiempo
 * máximo de 8 s, la conversión a `EquipoPublico` y `{ tipo: 'error' }` ante cualquier fallo.
 * El contrato está en `specs/001-eventos-torneo/contracts/fuente-equipos.md`.
 */
import type { FuenteEquipos } from './fuente-equipos.ts';

export interface ConfiguracionSupabase {
	url: string;
	clavePublica: string;
}

export function fuenteSupabase(_configuracion: ConfiguracionSupabase): FuenteEquipos {
	return {
		async obtenerEquipos() {
			return { tipo: 'sin-fuente' };
		},
	};
}
