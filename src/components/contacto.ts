/**
 * Datos de contacto que usan la cabecera, el pie y la barra inferior.
 */

/**
 * PROVISIONAL (A-24): número de WhatsApp de Montca en formato internacional, sin "+"
 * ni espacios (por ejemplo, 34600000000). Todavía no está decidido y no se inventa:
 * mientras esté vacío, la barra inferior enseña "Contacte" en lugar de WhatsApp.
 * Es la única constante que hay que rellenar.
 */
export const WHATSAPP_NUMERO = '';

/** Correo de contacto público, según `docs/info-montca.md`. */
export const CORREO_CONTACTO = 'montcaadventure@gmail.com';

/** Devuelve el enlace `wa.me` con el mensaje escrito, o `null` si aún no hay número. */
export function urlWhatsapp(mensaje: string): string | null {
	if (WHATSAPP_NUMERO === '') {
		return null;
	}
	return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
}
