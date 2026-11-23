/**
 * Datos de contacto que usan la cabecera, el pie, la barra inferior, el botón de
 * WhatsApp y la 404.
 */

import { type Idioma, t } from './textos-navegacion';

/**
 * PROVISIONAL (A-24): número de WhatsApp de Montca en formato internacional, sin "+"
 * ni espacios (por ejemplo, 34600000000). Todavía no está decidido y no se inventa:
 * mientras esté vacío, la barra inferior enseña "Contacte" en lugar de WhatsApp y el
 * botón flotante no aparece.
 * Es la única constante que hay que rellenar.
 */
export const WHATSAPP_NUMERO = '';

/** Correo de contacto público, según `docs/info-montca.md`. */
export const CORREO_CONTACTO = 'montcaadventure@gmail.com';

/**
 * Devuelve el enlace `wa.me` con el mensaje por defecto ya escrito en el idioma
 * pedido, o `null` si aún no hay número. Todos los enlaces de WhatsApp salen de aquí.
 */
export function urlWhatsapp(lang: Idioma): string | null {
	if (WHATSAPP_NUMERO === '') {
		return null;
	}
	const mensaje = t(lang, 'mensajeWhatsapp');
	return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
