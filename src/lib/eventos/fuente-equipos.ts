/**
 * Frontera entre la interfaz de la página del evento y los datos de los equipos (C-04, T028).
 * Contrato en `specs/001-eventos-torneo/contracts/fuente-equipos.md`.
 *
 * La interfaz solo conoce `FuenteEquipos`. Qué implementación se usa lo decide la variable
 * `PUBLIC_FUENTE_EQUIPOS`, que vale `ninguna` por defecto:
 *
 * - `ninguna`: producción antes de A-14. No hay fuente y el bloque "Places i equips" no sale.
 * - `prueba`: datos inventados que la página incrusta al construirse (solo local y vistas previas).
 * - `supabase`: la vista pública de Supabase (Saúl, A-14; ver `fuente-supabase.ts`).
 *
 * Este archivo lo carga el navegador, así que no importa `datos-prueba.ts`: los datos de prueba
 * solo existen en el servidor, al construir.
 */
import { fuenteSupabase } from './fuente-supabase.ts';
import type { EquipoPublico } from './vista-publica.ts';

export type { EquipoPublico, JugadorPublico } from './vista-publica.ts';

export type ResultadoEquipos =
	| { tipo: 'sin-fuente' }
	| { tipo: 'ok'; equipos: EquipoPublico[] }
	| { tipo: 'error' };

export interface FuenteEquipos {
	/** Equipos confirmados del evento, ya en forma pública. Nunca lanza: los fallos vuelven como `{ tipo: 'error' }`. */
	obtenerEquipos(evento: string): Promise<ResultadoEquipos>;
}

export type NombreFuente = 'ninguna' | 'prueba' | 'supabase';

/** Variables de entorno que miran estas funciones. `CONTEXT` solo existe al construir en Netlify. */
export interface EntornoFuente {
	PUBLIC_FUENTE_EQUIPOS?: string;
	PUBLIC_SUPABASE_URL?: string;
	PUBLIC_SUPABASE_ANON_KEY?: string;
	CONTEXT?: string;
}

/** Lo único que necesita `fuenteIncrustada` de la página (el `document` del navegador lo cumple). */
export interface PaginaConEquipos {
	querySelector(selector: string): { textContent: string | null } | null;
}

const FUENTES: NombreFuente[] = ['ninguna', 'prueba', 'supabase'];

/** Valor de `CONTEXT` con el que Netlify construye la web publicada. */
const CONTEXTO_PRODUCCION = 'production';

export const fuenteNinguna: FuenteEquipos = {
	async obtenerEquipos() {
		return { tipo: 'sin-fuente' };
	},
};

/**
 * Lee los equipos de `<script type="application/json" data-equipos-publicos="<evento>">`,
 * que la página deja al construirse solo con la fuente `prueba`.
 */
export function fuenteIncrustada(pagina: PaginaConEquipos): FuenteEquipos {
	return {
		async obtenerEquipos(evento) {
			const etiqueta = pagina.querySelector(`script[data-equipos-publicos="${evento}"]`);
			if (etiqueta === null) {
				return { tipo: 'sin-fuente' };
			}
			try {
				const datos: unknown = JSON.parse(etiqueta.textContent ?? '');
				if (!Array.isArray(datos) || !datos.every(esEquipoPublico)) {
					return { tipo: 'error' };
				}
				return { tipo: 'ok', equipos: datos };
			} catch {
				// Un JSON roto no debe romper la página: se avisa con una línea (FR-028).
				return { tipo: 'error' };
			}
		},
	};
}

function esEquipoPublico(dato: unknown): dato is EquipoPublico {
	if (typeof dato !== 'object' || dato === null) {
		return false;
	}
	const equipo = dato as Record<string, unknown>;
	return (
		typeof equipo.categoria === 'string' &&
		typeof equipo.nombre === 'string' &&
		typeof equipo.jugadoresOcultos === 'boolean' &&
		Array.isArray(equipo.jugadores)
	);
}

/**
 * Fuente que pide el entorno. Sin variable, `ninguna`.
 * @throws Error si el valor no es una fuente conocida: un fallo al escribirlo no debe pasar en silencio.
 */
export function nombreDeFuente(entorno: EntornoFuente): NombreFuente {
	const valor = (entorno.PUBLIC_FUENTE_EQUIPOS ?? '').trim();
	if (valor === '') {
		return 'ninguna';
	}
	if (!FUENTES.includes(valor as NombreFuente)) {
		throw new Error(
			`PUBLIC_FUENTE_EQUIPOS vale "${valor}" y solo puede ser ${FUENTES.join(', ')}. ` +
				'Sin definirla vale "ninguna".',
		);
	}
	return valor as NombreFuente;
}

/**
 * Comprueba el entorno al construir la web y devuelve la fuente elegida.
 * @throws Error con `prueba` en producción (los datos de prueba nunca se publican, FR-035) o
 *   con `supabase` sin URL o sin clave pública.
 */
export function validarEntornoFuente(entorno: EntornoFuente): NombreFuente {
	const nombre = nombreDeFuente(entorno);
	if (nombre === 'prueba' && entorno.CONTEXT === CONTEXTO_PRODUCCION) {
		throw new Error(
			'PUBLIC_FUENTE_EQUIPOS=prueba no se puede usar al construir la web de producción ' +
				`(CONTEXT=${CONTEXTO_PRODUCCION}): los datos de prueba nunca se publican. ` +
				'Quita la variable en Netlify o ponla en "ninguna".',
		);
	}
	if (nombre === 'supabase') {
		for (const variable of ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_ANON_KEY'] as const) {
			if ((entorno[variable] ?? '').trim() === '') {
				throw new Error(`PUBLIC_FUENTE_EQUIPOS=supabase necesita ${variable}. Se configura en Netlify, no en el repositorio.`);
			}
		}
	}
	return nombre;
}

/** La implementación de `FuenteEquipos` que pide el entorno. Con una fuente desconocida, lanza (ver `nombreDeFuente`). */
export function elegirFuente(entorno: EntornoFuente, pagina: PaginaConEquipos): FuenteEquipos {
	switch (nombreDeFuente(entorno)) {
		case 'prueba':
			return fuenteIncrustada(pagina);
		case 'supabase':
			return fuenteSupabase({
				url: entorno.PUBLIC_SUPABASE_URL ?? '',
				clavePublica: entorno.PUBLIC_SUPABASE_ANON_KEY ?? '',
			});
		default:
			return fuenteNinguna;
	}
}
