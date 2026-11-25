/**
 * PROVISIONAL: textos de las páginas "Pròximament" (`Proximament.astro`), que ocupan el sitio de
 * las secciones del menú que aún no existen.
 *
 * Vive aquí, como `textos-navegacion.ts` y `textos-eventos.ts`, porque `src/i18n` es zona de Saúl
 * y la B-07 todavía no está hecha. Al hacer la B-07 se mueve a `src/i18n`.
 *
 * **Montca tiene que revisar estos textos antes de publicar**, igual que el castellano: lo que
 * dicen de cada sección es una promesa de qué habrá, no un dato. No inventan fechas, precios ni
 * actividades.
 *
 * Las páginas legales (aviso legal, privacidad y cookies) usan la misma pieza con un texto fijo,
 * "en revisión": sus textos reales los hace B-08 y los borradores de `docs/legal/` no se publican.
 */
import type { Idioma } from './textos-navegacion';

/** Las secciones del menú y del pie que todavía no tienen página propia (claves de `ClaveRuta`). */
export const SECCIONES_PROXIMAMENT = [
	'actividades',
	'agenda',
	'rutas',
	'repte',
	'escuelas',
	'galeria',
	'quienesSomos',
	'contacto',
	'avisoLegal',
	'privacidad',
	'cookies',
] as const;

/** Las que son textos legales: dicen "en revisión" en vez de qué habrá. */
export const SECCIONES_LEGALES = ['avisoLegal', 'privacidad', 'cookies'] as const;

export type SeccionProximament = (typeof SECCIONES_PROXIMAMENT)[number];

const textos = {
	ca: {
		proximament: 'Pròximament',
		escribenosWhatsapp: 'Escriu-nos per WhatsApp',
		nuevaPestana: "s'obri en una pestanya nova",
		verEventos: 'Mira els esdeveniments',
		enRevision: 'Aquest text legal està en revisió.',
		actividades:
			'Ací trobaràs les activitats de Montca a la Serra de Mariola, cadascuna amb la seua fitxa i com apuntar-te.',
		agenda: 'Les pròximes dates de les activitats de Montca, amb les places lliures per a apuntar-te.',
		rutas: 'Les rutes temàtiques de Montca per la Serra de Mariola, cadascuna amb la seua fitxa i com apuntar-te.',
		repte: 'El Repte 5 Cims i el seu Passaport de segells.',
		escuelas: 'Activitats a mida per a escoles, AMPA i grups: ací podràs demanar-nos pressupost.',
		galeria: 'Aviat hi haurà fotos de les nostres activitats.',
		quienesSomos: "Qui hi ha darrere de Montca Actiu, l'associació juvenil i esportiva de Cocentaina.",
		contacto: 'Ací tindràs totes les maneres de contactar amb Montca. Mentrestant, escriu-nos per WhatsApp.',
	},
	es: {
		proximament: 'Próximamente',
		escribenosWhatsapp: 'Escríbenos por WhatsApp',
		nuevaPestana: 'se abre en una pestaña nueva',
		verEventos: 'Mira los eventos',
		enRevision: 'Este texto legal está en revisión.',
		actividades:
			'Aquí encontrarás las actividades de Montca en la Serra de Mariola, cada una con su ficha y cómo apuntarte.',
		agenda: 'Las próximas fechas de las actividades de Montca, con las plazas libres para apuntarte.',
		rutas: 'Las rutas temáticas de Montca por la Serra de Mariola, cada una con su ficha y cómo apuntarte.',
		repte: 'El Repte 5 Cims y su Pasaporte de sellos.',
		escuelas: 'Actividades a medida para escuelas, AMPA y grupos: aquí podrás pedirnos presupuesto.',
		galeria: 'Pronto habrá fotos de nuestras actividades.',
		quienesSomos: 'Quién está detrás de Montca Actiu, la asociación juvenil y deportiva de Cocentaina.',
		contacto: 'Aquí tendrás todas las formas de contactar con Montca. Mientras tanto, escríbenos por WhatsApp.',
	},
} as const;

export type ClaveTextoProximament = keyof (typeof textos)['ca'];

/** Devuelve el texto de `clave` en el idioma pedido. */
export function t(lang: Idioma, clave: ClaveTextoProximament): string {
	return textos[lang][clave];
}

/** La frase de una sección: qué habrá, o "en revisión" si es un texto legal. */
export function fraseDe(lang: Idioma, seccion: SeccionProximament): string {
	if ((SECCIONES_LEGALES as readonly string[]).includes(seccion)) {
		return t(lang, 'enRevision');
	}
	return t(lang, seccion as Exclude<SeccionProximament, (typeof SECCIONES_LEGALES)[number]>);
}
