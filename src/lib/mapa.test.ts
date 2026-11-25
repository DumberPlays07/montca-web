import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	CENTRO_INICIAL_MARCO,
	RECORTE_INFERIOR,
	RECORTE_SUPERIOR,
	colocarFicha,
	formatoAltura,
	idDePico,
	ordenarPorAltura,
	proporcionRecortada,
	vecinoMasCercano,
	yEnRecorte,
	zonaPulsable,
} from './mapa.ts';

/** Medidas de `src/assets/mapa/mapa-mariola.webp`. */
const ANCHO_IMAGEN = 2560;
const ALTO_IMAGEN = 1430;

describe('recorte de la imagen', () => {
	it('el recorte deja una parte visible y está entre 0 y 1', () => {
		assert.ok(RECORTE_SUPERIOR >= 0 && RECORTE_INFERIOR >= 0);
		assert.ok(RECORTE_SUPERIOR + RECORTE_INFERIOR < 1);
	});

	it('el recorte es del 30 % por arriba y del 5 % por abajo', () => {
		assert.equal(RECORTE_SUPERIOR, 0.3);
		assert.equal(RECORTE_INFERIOR, 0.05);
	});

	it('yEnRecorte pone el borde superior visible en 0 % y el inferior en 100 %', () => {
		assert.equal(yEnRecorte(30), 0);
		assert.equal(yEnRecorte(95), 100);
		assert.equal(Number(yEnRecorte(62.5).toFixed(4)), 50);
	});

	it('un pico a la altura del 49,5 % de la imagen queda al 30 % del recorte', () => {
		assert.equal(Number(yEnRecorte(49.5).toFixed(1)), 30);
	});

	it('la proporción recortada es más ancha que la de la imagen entera', () => {
		const entera = ANCHO_IMAGEN / ALTO_IMAGEN;
		const recortada = proporcionRecortada(ANCHO_IMAGEN, ALTO_IMAGEN);
		assert.ok(recortada > entera);
		assert.equal(Number((recortada * (1 - RECORTE_SUPERIOR - RECORTE_INFERIOR)).toFixed(6)), Number(entera.toFixed(6)));
	});

	it('cambiando el recorte se mueven todos los picos de forma coherente', () => {
		assert.equal(yEnRecorte(50, { superior: 0.5, inferior: 0 }), 0);
		assert.equal(yEnRecorte(100, { superior: 0.5, inferior: 0 }), 100);
	});
});

describe('marco del móvil', () => {
	it('empieza centrado en el 76 % del ancho del mapa', () => {
		assert.equal(CENTRO_INICIAL_MARCO, 0.76);
	});

	it('a 320 px de pantalla se ve de 521 a 841 px de un mapa de 896 px', () => {
		const ancho = 896;
		const izquierda = CENTRO_INICIAL_MARCO * ancho - 320 / 2;
		assert.equal(Math.round(izquierda), 521);
		assert.equal(Math.round(izquierda + 320), 841);
	});
});

describe('idDePico', () => {
	it('quita mayúsculas, tildes y signos', () => {
		assert.equal(idDePico('Montcabrer'), 'montcabrer');
		assert.equal(idDePico('Alt de la Codolla'), 'alt-de-la-codolla');
		assert.equal(idDePico("el Portell de Just d'Alfafara"), 'el-portell-de-just-d-alfafara');
		assert.equal(idDePico('Tossal Redó'), 'tossal-redo');
	});

	it('no deja guiones al principio ni al final ni repetidos', () => {
		assert.equal(idDePico('  Mola -- Alta!  '), 'mola-alta');
	});

});

describe('formatoAltura', () => {
	it('separa los miles con un punto y añade la unidad', () => {
		assert.equal(formatoAltura(1390), '1.390 m');
		assert.equal(formatoAltura(987), '987 m');
	});
});

describe('ordenarPorAltura', () => {
	it('va del más alto al más bajo y no cambia la lista original', () => {
		const original = [{ altura: 900 }, { altura: 1200 }, { altura: 1000 }];
		assert.deepEqual(ordenarPorAltura(original).map((p) => p.altura), [1200, 1000, 900]);
		assert.deepEqual(original.map((p) => p.altura), [900, 1200, 1000]);
	});
});

describe('vecinoMasCercano', () => {
	it('es la distancia al otro punto más cercano, no al primero de la lista', () => {
		const lista = [
			{ x: 10, y: 50 },
			{ x: 90, y: 50 },
			{ x: 12, y: 50 },
		];
		assert.equal(Number(vecinoMasCercano(lista[0], lista, ANCHO_IMAGEN, ALTO_IMAGEN).toFixed(4)), 0.02);
	});

	it('un punto solo no tiene vecino: no limita su zona', () => {
		const solo = [{ x: 10, y: 50 }];
		assert.equal(vecinoMasCercano(solo[0], solo, ANCHO_IMAGEN, ALTO_IMAGEN), 1);
	});
});

describe('zonaPulsable', () => {
	it('mide 44 px si los vecinos están lejos', () => {
		assert.equal(zonaPulsable(0.1, 0.1, 900), 44);
	});

	it('se encoge hasta la distancia al pico vecino', () => {
		assert.equal(zonaPulsable(31 / 1152, 1, 1152), 31);
	});

	it('se encoge para dejar libre la mitad de la zona de 44 px de un botón vecino', () => {
		// A 30 px de un botón, la zona del pico puede medir 2 × (30 − 22) = 16 px... pero no baja de 24.
		assert.equal(zonaPulsable(1, 30 / 900, 900), 24);
		// A 40 px: 2 × (40 − 22) = 36 px.
		assert.equal(zonaPulsable(1, 40 / 900, 900), 36);
	});

	it('nunca baja de 24 px (WCAG 2.2, 2.5.8): excepción del principio V', () => {
		assert.equal(zonaPulsable(10 / 375, 10 / 375, 375), 24);
	});
});

describe('colocarFicha', () => {
	const caja = { ancho: 1000, alto: 400 };
	const ficha = { ancho: 256, alto: 150 };

	it('va a la derecha del pico si cabe', () => {
		const sitio = colocarFicha({ pico: { x: 300, y: 200 }, caja, ficha, margen: 12 });
		assert.equal(sitio.izquierda, 300 + 12);
	});

	it('pasa a la izquierda si a la derecha se saldría de la caja', () => {
		const sitio = colocarFicha({ pico: { x: 900, y: 200 }, caja, ficha, margen: 12 });
		assert.equal(sitio.izquierda, 900 - 12 - 256);
	});

	it('se centra en vertical con el pico', () => {
		const sitio = colocarFicha({ pico: { x: 300, y: 200 }, caja, ficha, margen: 12 });
		assert.equal(sitio.arriba, 200 - 75);
	});

	it('no se sale por arriba ni por abajo', () => {
		const arriba = colocarFicha({ pico: { x: 300, y: 10 }, caja, ficha, margen: 12 });
		assert.equal(arriba.arriba, 0);
		const abajo = colocarFicha({ pico: { x: 300, y: 395 }, caja, ficha, margen: 12 });
		assert.equal(abajo.arriba, 400 - 150);
	});

	it('dice de qué lado queda respecto al pico', () => {
		assert.equal(colocarFicha({ pico: { x: 300, y: 200 }, caja, ficha, margen: 12 }).lado, 'derecha');
		assert.equal(colocarFicha({ pico: { x: 900, y: 200 }, caja, ficha, margen: 12 }).lado, 'izquierda');
	});

	it('el piquito apunta a la altura del pico dentro de la tarjeta', () => {
		const centrada = colocarFicha({ pico: { x: 300, y: 200 }, caja, ficha, margen: 12 });
		assert.equal(centrada.colaY, 75);
		// La tarjeta se ha subido a 0 para no salirse: el pico queda a 10 px del borde, pero el piquito no baja de 16.
		const arriba = colocarFicha({ pico: { x: 300, y: 10 }, caja, ficha, margen: 12 });
		assert.equal(arriba.colaY, 16);
		// Más abajo del límite: la tarjeta queda a 250 px y el pico a 145 px dentro de ella.
		const abajo = colocarFicha({ pico: { x: 300, y: 395 }, caja, ficha, margen: 12 });
		assert.equal(abajo.colaY, 134);
	});

	it('si la ficha es más ancha que la caja, se pega a la izquierda', () => {
		const sitio = colocarFicha({ pico: { x: 50, y: 50 }, caja: { ancho: 200, alto: 400 }, ficha, margen: 12 });
		assert.equal(sitio.izquierda, 0);
	});
});
