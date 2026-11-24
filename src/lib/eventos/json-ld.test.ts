import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { type EventoParaJsonLd, eventoJsonLd, jsonLdComoTexto } from './json-ld.ts';

function torneo(precio: EventoParaJsonLd['precio'] = { confirmado: false }): EventoParaJsonLd {
	return {
		nombre: 'Torneig de Nadal',
		resumen: 'Futbol sala, bàsquet i pàdel.',
		jornadas: [
			{ fecha: '2026-12-27', nombre: '1a jornada' },
			{ fecha: '2027-01-03', nombre: '2a jornada' },
		],
		lugar: { nombre: 'Poliesportiu Municipal de Cocentaina', direccion: '', localidad: 'Cocentaina' },
		precio,
	};
}

describe('eventoJsonLd', () => {
	it('es un SportsEvent con nombre, fechas, estado y modo presencial', () => {
		const datos = eventoJsonLd(torneo());
		assert.equal(datos['@context'], 'https://schema.org');
		assert.equal(datos['@type'], 'SportsEvent');
		assert.equal(datos.name, 'Torneig de Nadal');
		assert.equal(datos.description, 'Futbol sala, bàsquet i pàdel.');
		assert.equal(datos.startDate, '2026-12-27');
		assert.equal(datos.endDate, '2027-01-03');
		assert.equal(datos.eventStatus, 'https://schema.org/EventScheduled');
		assert.equal(datos.eventAttendanceMode, 'https://schema.org/OfflineEventAttendanceMode');
	});

	it('el lugar lleva la localidad y no inventa la dirección', () => {
		const { location } = eventoJsonLd(torneo());
		assert.deepEqual(location, {
			'@type': 'Place',
			name: 'Poliesportiu Municipal de Cocentaina',
			address: { '@type': 'PostalAddress', addressLocality: 'Cocentaina', addressCountry: 'ES' },
		});
	});

	it('añade la calle cuando el YAML la trae', () => {
		const evento = torneo();
		evento.lugar.direccion = 'Carrer Major, 1';
		assert.equal(eventoJsonLd(evento).location.address.streetAddress, 'Carrer Major, 1');
	});

	it('el organizador es Montca Actiu', () => {
		assert.deepEqual(eventoJsonLd(torneo()).organizer, { '@type': 'SportsOrganization', name: 'Montca Actiu' });
	});

	it('una subjornada por día', () => {
		const { subEvent } = eventoJsonLd(torneo());
		assert.equal(subEvent.length, 2);
		assert.equal(subEvent[1].name, 'Torneig de Nadal · 2a jornada');
		assert.equal(subEvent[1].startDate, '2027-01-03');
		assert.equal(subEvent[1].endDate, '2027-01-03');
	});

	it('sin precio confirmado no lleva offers', () => {
		assert.equal('offers' in eventoJsonLd(torneo()), false);
	});

	it('con precio confirmado lleva offers en euros', () => {
		const datos = eventoJsonLd(torneo({ confirmado: true, importe: 10 }));
		assert.deepEqual(datos.offers, { '@type': 'Offer', price: 10, priceCurrency: 'EUR' });
	});
});

describe('jsonLdComoTexto', () => {
	it('no deja cerrar la etiqueta script desde un texto', () => {
		const texto = jsonLdComoTexto({ name: '</script><b>' });
		assert.equal(texto.includes('</script>'), false);
		assert.deepEqual(JSON.parse(texto), { name: '</script><b>' });
	});
});
