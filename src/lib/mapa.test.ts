import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import picosEnCrudo from '../data/picos-mapa.json' with { type: 'json' };
import {
	ANCHO_MINIMO_MAPA_REM,
	LADO_MAXIMO_ZONA_PULSABLE,
	LADO_MINIMO_ZONA_PULSABLE,
	RECORTE_INFERIOR,
	RECORTE_SUPERIOR,
	colocarFicha,
	formatoAltura,
	idDePico,
	ordenarPorAltura,
	preparar,
	proporcionRecortada,
	vecinoMasCercano,
	yEnRecorte,
	zonaPulsable,
} from './mapa.ts';

/** Medidas de `src/assets/mapa/mapa-mariola.webp`. */
const ANCHO_IMAGEN = 2560;
const ALTO_IMAGEN = 1430;

const picos = preparar(picosEnCrudo, ANCHO_IMAGEN, ALTO_IMAGEN);
const porNombre = (nombre: string) => {
	const pico = picos.find((p) => p.nombre === nombre);
	assert.ok(pico, nombre);
	return pico;
};

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

	it('los 11 picos tienen un id distinto', () => {
		assert.equal(new Set(picos.map((p) => p.id)).size, picos.length);
	});
});

describe('formatoAltura', () => {
	it('separa los miles con un punto y añade la unidad', () => {
		assert.equal(formatoAltura(1390), '1.390 m');
		assert.equal(formatoAltura(987), '987 m');
		assert.equal(formatoAltura(914), '914 m');
	});
});

describe('ordenarPorAltura', () => {
	it('va del más alto al más bajo y no cambia la lista original', () => {
		const original = [{ altura: 900 }, { altura: 1200 }, { altura: 1000 }];
		assert.deepEqual(ordenarPorAltura(original).map((p) => p.altura), [1200, 1000, 900]);
		assert.deepEqual(original.map((p) => p.altura), [900, 1200, 1000]);
	});

	it('con los picos reales, Montcabrer es el primero', () => {
		assert.equal(ordenarPorAltura(picos)[0].nombre, 'Montcabrer');
	});
});

describe('preparar los picos', () => {
	it('solo quedan los picos visibles', () => {
		const mezcla = [
			{ nombre: 'A', altura: 1000, x: 10, y: 60, visible: true },
			{ nombre: 'B', altura: 900, x: 20, y: 60, visible: false },
		];
		assert.deepEqual(preparar(mezcla, ANCHO_IMAGEN, ALTO_IMAGEN).map((p) => p.nombre), ['A']);
	});

	it('los 11 picos reales caen dentro del recorte', () => {
		assert.equal(picos.length, 11);
		for (const pico of picos) {
			assert.ok(pico.arriba > 0 && pico.arriba < 100, `${pico.nombre} arriba=${pico.arriba}`);
			assert.ok(pico.izquierda > 0 && pico.izquierda < 100, `${pico.nombre} izquierda=${pico.izquierda}`);
		}
	});

	it('la izquierda es la x de los datos y no depende del recorte', () => {
		assert.equal(porNombre('Montcabrer').izquierda, 66.7);
	});

	it('cada pico lleva su zona pulsable en proporción del ancho del mapa', () => {
		for (const pico of picos) {
			assert.ok(pico.vecino > 0 && pico.vecino < 1, pico.nombre);
		}
	});
});

describe('vecinoMasCercano', () => {
	it('Montcabrer y Alt de la Reja son los más cercanos entre sí (≈31 px a 1152 px de mapa)', () => {
		const montcabrer = porNombre('Montcabrer');
		const reja = porNombre('Alt de la Reja');
		assert.equal(Math.round(montcabrer.vecino * 1152), 31);
		assert.equal(Math.round(reja.vecino * 1152), 31);
	});

	it('a 375 px de ancho serían 10 px', () => {
		assert.equal(Math.round(porNombre('Montcabrer').vecino * 375), 10);
	});

	it('es la distancia al otro pico más cercano, no al primero de la lista', () => {
		const lista = [
			{ x: 10, y: 50 },
			{ x: 90, y: 50 },
			{ x: 12, y: 50 },
		];
		const vecino = vecinoMasCercano(lista[0], lista, ANCHO_IMAGEN, ALTO_IMAGEN);
		assert.equal(Number(vecino.toFixed(4)), 0.02);
	});

	it('un solo pico no tiene vecino: no limita su zona', () => {
		const solo = [{ x: 10, y: 50 }];
		assert.equal(vecinoMasCercano(solo[0], solo, ANCHO_IMAGEN, ALTO_IMAGEN), 1);
	});
});

describe('zonaPulsable', () => {
	it('mide 44 px si el vecino está lejos', () => {
		assert.equal(zonaPulsable(0.1, 900), LADO_MAXIMO_ZONA_PULSABLE);
	});

	it('se encoge hasta la distancia al vecino', () => {
		assert.equal(zonaPulsable(31 / 1152, 1152), 31);
	});

	it('nunca baja de 24 px (WCAG 2.2, 2.5.8)', () => {
		assert.equal(zonaPulsable(10 / 375, 375), LADO_MINIMO_ZONA_PULSABLE);
		assert.equal(LADO_MINIMO_ZONA_PULSABLE, 24);
	});

	it('con el mapa a 900 px, solo el par Montcabrer / Alt de la Reja queda por debajo de 44 px', () => {
		const menores = picos.filter((p) => zonaPulsable(p.vecino, 900) < LADO_MAXIMO_ZONA_PULSABLE).map((p) => p.nombre);
		assert.deepEqual(menores.sort(), ['Alt de la Reja', 'Montcabrer']);
	});

	it('con el mapa a 900 px, todas las zonas miden 24 px o más y ninguna pasa de 44 px', () => {
		for (const pico of picos) {
			const lado = zonaPulsable(pico.vecino, 900);
			assert.ok(lado >= 24 && lado <= 44, `${pico.nombre}: ${lado}`);
		}
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

	it('si la ficha es más ancha que la caja, se pega a la izquierda', () => {
		const sitio = colocarFicha({ pico: { x: 50, y: 50 }, caja: { ancho: 200, alto: 400 }, ficha, margen: 12 });
		assert.equal(sitio.izquierda, 0);
	});
});

describe('ancho mínimo del mapa', () => {
	it('con el ancho mínimo, ninguna zona pulsable baja de 24 px y solo un par baja de 44 px', () => {
		const ancho = 16 * ANCHO_MINIMO_MAPA_REM;
		const menores = picos.filter((p) => zonaPulsable(p.vecino, ancho) < LADO_MAXIMO_ZONA_PULSABLE).map((p) => p.nombre);
		assert.deepEqual(menores.sort(), ['Alt de la Reja', 'Montcabrer']);
		for (const pico of picos) {
			assert.ok(zonaPulsable(pico.vecino, ancho) >= LADO_MINIMO_ZONA_PULSABLE, pico.nombre);
		}
	});
});
