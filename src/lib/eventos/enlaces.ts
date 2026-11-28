/**
 * Enlaces de la página de un evento: "Com arribar" e "Inscriure's" (C-04).
 */

export interface LugarEvento {
	nombre: string;
	direccion: string;
	localidad: string;
}

export interface EventoParaInscripcion {
	inscripcion: {
		url: string;
	};
}

const URL_BUSQUEDA_MAPS = 'https://www.google.com/maps/search/?api=1&query=';

/**
 * Enlace universal de Google Maps que busca el lugar (research R10). No carga nada de
 * Google en la página: solo se abre al pulsarlo.
 */
export function urlComArribar(lugar: LugarEvento): string {
	const partes = [lugar.nombre, lugar.direccion, lugar.localidad]
		.map((parte) => parte.trim())
		.filter((parte) => parte !== '');
	return URL_BUSQUEDA_MAPS + encodeURIComponent(partes.join(', '));
}

/**
 * A dónde lleva "Inscriure's": la dirección configurada del evento, la página de inscripción
 * de la web (C-05). Devuelve `null` si no hay dirección: entonces la página muestra el
 * contacto (FR-017, FR-019).
 */
export function destinoInscripcion(evento: EventoParaInscripcion): string | null {
	const url = evento.inscripcion.url.trim();
	return url === '' ? null : url;
}
