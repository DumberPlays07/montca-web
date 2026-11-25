import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ruta, t as tNavegacion } from '../components/textos-navegacion.ts';
import { SECCIONES_LEGALES, SECCIONES_PROXIMAMENT, fraseDe, t } from '../components/textos-proximament.ts';

const IDIOMAS = ['ca', 'es'] as const;

describe('páginas Pròximament', () => {
	it('cada sección tiene una frase no vacía en valenciano y en castellano', () => {
		for (const lang of IDIOMAS) {
			for (const seccion of SECCIONES_PROXIMAMENT) {
				assert.notEqual(fraseDe(lang, seccion).trim(), '', `${lang} ${seccion}`);
			}
		}
	});

	it('cada sección es una ruta del menú o del pie con su título', () => {
		for (const lang of IDIOMAS) {
			for (const seccion of SECCIONES_PROXIMAMENT) {
				assert.ok(ruta(lang, seccion).startsWith(lang === 'ca' ? '/' : '/es/'), `${lang} ${seccion}`);
				assert.notEqual(tNavegacion(lang, seccion).trim(), '', `${lang} ${seccion}`);
			}
		}
	});

	it('las tres legales son avís legal, privacitat y cookies', () => {
		assert.deepEqual([...SECCIONES_LEGALES], ['avisoLegal', 'privacidad', 'cookies']);
		for (const legal of SECCIONES_LEGALES) {
			assert.ok(SECCIONES_PROXIMAMENT.includes(legal));
		}
	});

	it('los textos legales dicen que están en revisión, sin prometer contenido', () => {
		assert.equal(fraseDe('ca', 'privacidad'), 'Aquest text legal està en revisió.');
		assert.equal(fraseDe('es', 'privacidad'), 'Este texto legal está en revisión.');
		for (const lang of IDIOMAS) {
			assert.equal(fraseDe(lang, 'avisoLegal'), fraseDe(lang, 'cookies'));
			assert.equal(fraseDe(lang, 'avisoLegal'), t(lang, 'enRevision'));
		}
	});

	it('las secciones que no son legales siguen con su propia frase', () => {
		assert.notEqual(fraseDe('ca', 'actividades'), t('ca', 'enRevision'));
		assert.equal(fraseDe('es', 'agenda'), t('es', 'agenda'));
	});

	it('Montca Rutes tiene su propia página en /rutes/ y /es/rutes/', () => {
		assert.ok(SECCIONES_PROXIMAMENT.includes('rutas'));
		assert.equal(ruta('ca', 'rutas'), '/rutes/');
		assert.equal(ruta('es', 'rutas'), '/es/rutes/');
		assert.equal(tNavegacion('ca', 'rutas'), 'Montca Rutes');
		assert.equal(tNavegacion('es', 'rutas'), 'Montca Rutes');
	});

	it('Galeria tiene su página en /galeria/ y /es/galeria/, y va en el pie', () => {
		assert.ok(SECCIONES_PROXIMAMENT.includes('galeria'));
		assert.equal(ruta('ca', 'galeria'), '/galeria/');
		assert.equal(ruta('es', 'galeria'), '/es/galeria/');
		assert.equal(tNavegacion('ca', 'galeria'), 'Galeria');
		assert.equal(tNavegacion('es', 'galeria'), 'Galería');
	});

	it('no hay secciones repetidas', () => {
		assert.equal(new Set(SECCIONES_PROXIMAMENT).size, SECCIONES_PROXIMAMENT.length);
	});
});
