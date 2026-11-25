import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { destinoInscripcion, urlComArribar } from './enlaces.ts';

describe('urlComArribar', () => {
	it('busca por nombre y localidad cuando no hay dirección', () => {
		const url = urlComArribar({ nombre: 'Poliesportiu Municipal de Cocentaina', direccion: '', localidad: 'Cocentaina' });
		assert.equal(
			url,
			'https://www.google.com/maps/search/?api=1&query=Poliesportiu%20Municipal%20de%20Cocentaina%2C%20Cocentaina',
		);
	});

	it('añade la dirección cuando la hay', () => {
		const url = urlComArribar({ nombre: 'Poliesportiu', direccion: 'Carrer Major, 1', localidad: 'Cocentaina' });
		assert.equal(url, 'https://www.google.com/maps/search/?api=1&query=Poliesportiu%2C%20Carrer%20Major%2C%201%2C%20Cocentaina');
	});

	it('codifica tildes y caracteres especiales', () => {
		const url = urlComArribar({ nombre: 'Pavelló & Pàdel', direccion: '  ', localidad: 'Muro' });
		assert.equal(url, 'https://www.google.com/maps/search/?api=1&query=Pavell%C3%B3%20%26%20P%C3%A0del%2C%20Muro');
	});
});

describe('destinoInscripcion', () => {
	const FORMS = 'https://forms.gle/prova';

	it('canal de Montca con url: lleva a la url', () => {
		assert.equal(destinoInscripcion({ inscripcion: { modo: 'canal-montca', url: FORMS } }), FORMS);
	});

	it('canal de Montca sin url: null (se muestra el contacto)', () => {
		assert.equal(destinoInscripcion({ inscripcion: { modo: 'canal-montca', url: '' } }), null);
	});

	it('url con solo espacios cuenta como vacía', () => {
		assert.equal(destinoInscripcion({ inscripcion: { modo: 'canal-montca', url: '   ' } }), null);
	});

	it('modo web con url: lleva a la página de inscripción', () => {
		assert.equal(destinoInscripcion({ inscripcion: { modo: 'web', url: '/inscripcio/' } }), '/inscripcio/');
	});

	it('modo web sin url: null, nunca un botón roto', () => {
		assert.equal(destinoInscripcion({ inscripcion: { modo: 'web', url: '' } }), null);
	});
});
