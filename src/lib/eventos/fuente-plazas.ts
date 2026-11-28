/**
 * Frontera entre la interfaz de la página del evento y los datos de las plazas (C-04, HU-19).
 * Contrato en `specs/001-eventos-torneo/contracts/fuente-plazas.md`.
 *
 * La interfaz solo conoce `FuentePlazas`. Qué implementación se usa lo decide la variable
 * `PUBLIC_FUENTE_PLAZAS`, que vale `ninguna` por defecto:
 *
 * - `ninguna`: producción antes de que exista la consulta pública. No hay fuente y el bloque
 *   de plazas no sale.
 * - `prueba`: recuentos inventados que la página incrusta al construirse (solo local y vistas previas).
 * - `supabase`: la consulta pública `plazas_por_categoria` (ver `fuente-supabase.ts`).
 *
 * Este archivo lo carga el navegador, así que no importa `datos-prueba.ts`: los datos de prueba
 * solo existen en el servidor, al construir.
 */
import { fuenteSupabase } from './fuente-supabase.ts';

/** Equipos que ocupan plaza en una categoría. Es todo lo que la parte pública sabe de los equipos. */
export interface PlazasCategoria {
	categoria: string;
	equiposActuales: number;
}

export type ResultadoPlazas =
	| { tipo: 'sin-fuente' }
	| { tipo: 'ok'; plazas: PlazasCategoria[] }
	| { tipo: 'error' };

export interface FuentePlazas {
	/** Equipos que ocupan plaza por categoría. Nunca lanza: los fallos vuelven como `{ tipo: 'error' }`. */
	obtenerPlazas(evento: string): Promise<ResultadoPlazas>;
}

export type NombreFuente = 'ninguna' | 'prueba' | 'supabase';

/** Variables de entorno que miran estas funciones. `CONTEXT` solo existe al construir en Netlify. */
export interface EntornoFuente {
	PUBLIC_FUENTE_PLAZAS?: string;
	PUBLIC_SUPABASE_URL?: string;
	PUBLIC_SUPABASE_ANON_KEY?: string;
	CONTEXT?: string;
}

/** Lo único que necesita `fuenteIncrustada` de la página (el `document` del navegador lo cumple). */
export interface PaginaConPlazas {
	querySelector(selector: string): { textContent: string | null } | null;
}

const FUENTES: NombreFuente[] = ['ninguna', 'prueba', 'supabase'];

/** Valor de `CONTEXT` con el que Netlify construye la web publicada. */
const CONTEXTO_PRODUCCION = 'production';

export const fuenteNinguna: FuentePlazas = {
	async obtenerPlazas() {
		return { tipo: 'sin-fuente' };
	},
};

/**
 * Lee los recuentos de `<script type="application/json" data-plazas-publicas="<evento>">`,
 * que la página deja al construirse solo con la fuente `prueba`.
 */
export function fuenteIncrustada(pagina: PaginaConPlazas): FuentePlazas {
	return {
		async obtenerPlazas(evento) {
			const etiqueta = pagina.querySelector(`script[data-plazas-publicas="${evento}"]`);
			if (etiqueta === null) {
				return { tipo: 'sin-fuente' };
			}
			try {
				const datos: unknown = JSON.parse(etiqueta.textContent ?? '');
				if (!Array.isArray(datos) || !datos.every(esPlazasCategoria)) {
					return { tipo: 'error' };
				}
				return { tipo: 'ok', plazas: datos };
			} catch {
				// Un JSON roto no debe romper la página: se avisa con una línea (FR-028).
				return { tipo: 'error' };
			}
		},
	};
}

/** Verdadero si `dato` tiene la forma de `PlazasCategoria`, con un recuento entero y no negativo. */
function esPlazasCategoria(dato: unknown): dato is PlazasCategoria {
	if (typeof dato !== 'object' || dato === null) {
		return false;
	}
	const plazas = dato as Record<string, unknown>;
	return (
		typeof plazas.categoria === 'string' &&
		typeof plazas.equiposActuales === 'number' &&
		Number.isInteger(plazas.equiposActuales) &&
		plazas.equiposActuales >= 0
	);
}

/**
 * Fuente que pide el entorno. Sin variable, `ninguna`.
 * @throws Error si el valor no es una fuente conocida: un fallo al escribirlo no debe pasar en silencio.
 */
export function nombreDeFuente(entorno: EntornoFuente): NombreFuente {
	const valor = (entorno.PUBLIC_FUENTE_PLAZAS ?? '').trim();
	if (valor === '') {
		return 'ninguna';
	}
	if (!FUENTES.includes(valor as NombreFuente)) {
		throw new Error(
			`PUBLIC_FUENTE_PLAZAS vale "${valor}" y solo puede ser ${FUENTES.join(', ')}. ` +
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
			'PUBLIC_FUENTE_PLAZAS=prueba no se puede usar al construir la web de producción ' +
				`(CONTEXT=${CONTEXTO_PRODUCCION}): los datos de prueba nunca se publican. ` +
				'Quita la variable en Netlify o ponla en "ninguna".',
		);
	}
	if (nombre === 'supabase') {
		for (const variable of ['PUBLIC_SUPABASE_URL', 'PUBLIC_SUPABASE_ANON_KEY'] as const) {
			if ((entorno[variable] ?? '').trim() === '') {
				throw new Error(`PUBLIC_FUENTE_PLAZAS=supabase necesita ${variable}. Se configura en Netlify, no en el repositorio.`);
			}
		}
	}
	return nombre;
}

/** La implementación de `FuentePlazas` que pide el entorno. Con una fuente desconocida, lanza (ver `nombreDeFuente`). */
export function elegirFuente(entorno: EntornoFuente, pagina: PaginaConPlazas): FuentePlazas {
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
