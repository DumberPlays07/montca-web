/**
 * Fuente de plazas de Supabase (C-04, HU-19): lee la consulta pública `plazas_por_categoria`,
 * que solo devuelve `{ categoria, equipos_actuales }` por categoría y evento
 * (`specs/001-eventos-torneo/contracts/vista-publica.md`).
 *
 * Esa consulta todavía no existe: la crea la spec de inscripciones (A-14). Hasta entonces,
 * `PUBLIC_FUENTE_PLAZAS` vale `ninguna` y esta fuente no se usa. Si Saúl prefiere una RPC en
 * lugar de una vista, solo cambia la petición de este archivo.
 */
import type { FuentePlazas, PlazasCategoria } from './fuente-plazas.ts';

export interface ConfiguracionSupabase {
	url: string;
	clavePublica: string;
	/** Solo para las pruebas: por defecto, el `fetch` del entorno. */
	peticion?: typeof fetch;
}

/** Nombre previsto de la vista pública (la crea la spec de inscripciones). */
const CONSULTA_PLAZAS = 'plazas_por_categoria';

/** Tiempo máximo de la petición: pasado, la página muestra el aviso en vez de esperar (FR-028). */
const TIEMPO_MAXIMO_MS = 8_000;

export function fuenteSupabase(configuracion: ConfiguracionSupabase): FuentePlazas {
	return {
		async obtenerPlazas(evento) {
			const peticion = configuracion.peticion ?? fetch;
			const base = configuracion.url.trim().replace(/\/+$/, '');
			const direccion = `${base}/rest/v1/${CONSULTA_PLAZAS}?evento=eq.${encodeURIComponent(evento)}&select=categoria,equipos_actuales`;
			try {
				const respuesta = await peticion(direccion, {
					headers: {
						apikey: configuracion.clavePublica,
						Authorization: `Bearer ${configuracion.clavePublica}`,
					},
					signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
				});
				if (!respuesta.ok) {
					return { tipo: 'error' };
				}
				const plazas = aPlazas(await respuesta.json());
				return plazas === null ? { tipo: 'error' } : { tipo: 'ok', plazas };
			} catch {
				// Sin red, tiempo agotado o JSON roto: el contrato dice que la fuente no lanza (FR-028).
				return { tipo: 'error' };
			}
		},
	};
}

/** Las filas de la consulta como `PlazasCategoria[]`, o `null` si alguna no tiene la forma esperada. */
function aPlazas(filas: unknown): PlazasCategoria[] | null {
	if (!Array.isArray(filas)) {
		return null;
	}
	const plazas: PlazasCategoria[] = [];
	for (const fila of filas) {
		if (typeof fila !== 'object' || fila === null) {
			return null;
		}
		const { categoria, equipos_actuales: equiposActuales } = fila as Record<string, unknown>;
		if (typeof categoria !== 'string' || !Number.isInteger(equiposActuales) || (equiposActuales as number) < 0) {
			return null;
		}
		plazas.push({ categoria, equiposActuales: equiposActuales as number });
	}
	return plazas;
}
