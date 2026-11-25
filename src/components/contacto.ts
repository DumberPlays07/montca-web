/**
 * Datos de contacto que usan la cabecera, el pie, la barra inferior, el botón de
 * WhatsApp y la 404.
 */

import { type Idioma, t } from './textos-navegacion';

/**
 * Números de WhatsApp de Montca (A-24), en formato internacional sin "+" ni espacios.
 * Montca acepta que estén en la web y en el repositorio (docs/decisiones.md, 2026-11-24).
 *
 * - `WHATSAPP_NUMERO`: el principal. Lo usan el botón flotante, la barra inferior y la 404.
 * - `WHATSAPP_NUMERO_SECUNDARIO`: el segundo número de Montca; sale en el pie junto al principal.
 *
 * Si `WHATSAPP_NUMERO` se deja vacío, la barra inferior enseña "Contacte" en lugar de
 * WhatsApp y el botón flotante no aparece.
 */
export const WHATSAPP_NUMERO = '34722796066';
export const WHATSAPP_NUMERO_SECUNDARIO = '34657394701';

/** Los números que se enseñan en el pie, por orden. Los vacíos no salen. */
export const WHATSAPP_NUMEROS_PIE = [WHATSAPP_NUMERO, WHATSAPP_NUMERO_SECUNDARIO].filter(
	(numero) => numero !== '',
);

const PREFIJO_ESPANYA = '34';

/** Correo de contacto público, según `docs/info-montca.md`. */
export const CORREO_CONTACTO = 'montcaadventure@gmail.com';

/**
 * Devuelve el enlace `wa.me` con el mensaje por defecto ya escrito en el idioma
 * pedido, o `null` si no hay número. Todos los enlaces de WhatsApp salen de aquí.
 * Por defecto usa el número principal y el mensaje general; quien necesite otro mensaje
 * (por ejemplo, la inscripción a un evento) lo pasa ya escrito en el idioma de la página.
 */
export function urlWhatsapp(
	lang: Idioma,
	numero: string = WHATSAPP_NUMERO,
	mensaje: string = t(lang, 'mensajeWhatsapp'),
): string | null {
	if (numero === '') {
		return null;
	}
	return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Devuelve el número como se lee en España, sin el prefijo 34 y en grupos de
 * 3-2-2-2 (por ejemplo, "722 79 60 66"). Si no es un número español de 9 cifras,
 * lo devuelve tal cual.
 */
export function numeroLegible(numero: string): string {
	const sinPrefijo = numero.startsWith(PREFIJO_ESPANYA) ? numero.slice(PREFIJO_ESPANYA.length) : numero;
	const grupos = sinPrefijo.match(/^(\d{3})(\d{2})(\d{2})(\d{2})$/);
	if (grupos === null) {
		return numero;
	}
	return grupos.slice(1).join(' ');
}
