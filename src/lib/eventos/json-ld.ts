/**
 * Datos estructurados `SportsEvent` de la página de un evento (FR-009, research R8).
 * Recibe los textos ya en el idioma de la página.
 */

export interface EventoParaJsonLd {
	nombre: string;
	resumen: string;
	jornadas: { fecha: string; nombre: string }[];
	lugar: { nombre: string; direccion: string; localidad: string };
	precio: { confirmado: boolean; importe?: number };
}

const ORGANIZADOR = 'Montca Actiu';
const PAIS = 'ES';
const MONEDA = 'EUR';

/**
 * Construye el `SportsEvent`. Sin precio confirmado no lleva `offers` (constitución III):
 * Google puede avisar de que falta, pero no es un error.
 */
export function eventoJsonLd(evento: EventoParaJsonLd) {
	const primera = evento.jornadas[0];
	const ultima = evento.jornadas[evento.jornadas.length - 1];
	const location = lugarJsonLd(evento.lugar);

	const datos = {
		'@context': 'https://schema.org',
		'@type': 'SportsEvent',
		name: evento.nombre,
		description: evento.resumen,
		startDate: primera.fecha,
		endDate: ultima.fecha,
		eventStatus: 'https://schema.org/EventScheduled',
		eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
		location,
		organizer: { '@type': 'SportsOrganization', name: ORGANIZADOR },
		// Las jornadas no son seguidas: cada una es su propio evento, sin afirmar los días de en medio.
		subEvent: evento.jornadas.map((jornada) => ({
			'@type': 'SportsEvent',
			name: `${evento.nombre} · ${jornada.nombre}`,
			startDate: jornada.fecha,
			endDate: jornada.fecha,
			location,
		})),
	};

	if (evento.precio.confirmado && evento.precio.importe !== undefined) {
		return { ...datos, offers: { '@type': 'Offer', price: evento.precio.importe, priceCurrency: MONEDA } };
	}
	return datos;
}

function lugarJsonLd(lugar: EventoParaJsonLd['lugar']) {
	const direccion = lugar.direccion.trim();
	return {
		'@type': 'Place',
		name: lugar.nombre,
		address: {
			'@type': 'PostalAddress',
			...(direccion === '' ? {} : { streetAddress: direccion }),
			addressLocality: lugar.localidad,
			addressCountry: PAIS,
		},
	};
}

/**
 * JSON listo para ir dentro de `<script type="application/ld+json">`. Escapa "<" para que
 * ningún texto del evento pueda cerrar la etiqueta.
 */
export function jsonLdComoTexto(datos: unknown): string {
	return JSON.stringify(datos).replace(/</g, '\\u003c');
}
