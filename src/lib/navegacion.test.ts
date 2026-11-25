import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { rutaEnOtroIdioma } from '../components/textos-navegacion.ts';

describe('rutaEnOtroIdioma', () => {
	it('de valenciano a castellano añade el prefijo /es', () => {
		assert.equal(rutaEnOtroIdioma('ca', '/activitats/'), '/es/activitats/');
		assert.equal(rutaEnOtroIdioma('ca', '/'), '/es/');
	});

	it('de castellano a valenciano quita el prefijo', () => {
		assert.equal(rutaEnOtroIdioma('es', '/es/activitats/'), '/activitats/');
		assert.equal(rutaEnOtroIdioma('es', '/es/'), '/');
		assert.equal(rutaEnOtroIdioma('es', '/es'), '/');
	});

	it('la 404 no tiene traducción: lleva a la portada del otro idioma', () => {
		for (const ruta404 of ['/404', '/404/', '/404.html']) {
			assert.equal(rutaEnOtroIdioma('ca', ruta404), '/es/', ruta404);
			assert.equal(rutaEnOtroIdioma('es', ruta404), '/', ruta404);
		}
	});

	it('una página cuyo nombre solo empieza por 404 no es la 404', () => {
		assert.equal(rutaEnOtroIdioma('ca', '/404-mapa/'), '/es/404-mapa/');
	});
});
