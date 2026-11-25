import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ruta, t as tNavegacion } from '../components/textos-navegacion.ts';
import destinosEnCrudo from '../data/destinos-mapa.json' with { type: 'json' };
import picosEnCrudo from '../data/picos-mapa.json' with { type: 'json' };
import {
	ANCHO_MINIMO_MAPA_REM,
	LADO_ZONA_BOTON,
	type DestinoEnCrudo,
	prepararDestinos,
	proporcionRecortada,
	rectanguloPlaca,
	sePisan,
	yEnRecorte,
	zonaDeBoton,
} from './mapa.ts';

/** Medidas de `src/assets/mapa/mapa-mariola.webp`. */
const ANCHO_IMAGEN = 2560;
const ALTO_IMAGEN = 1430;
const IDIOMAS = ['ca', 'es'] as const;

const crudos = destinosEnCrudo as DestinoEnCrudo[];
const destinos = prepararDestinos(crudos, picosEnCrudo);

/** Lo que mide cada placa (px) con el texto de la tabla del issue #108, a 896 px de mapa: [valenciano, castellano]. */
const ANCHO_PLACA: Record<string, [number, number]> = {
	montcabrer: [131, 131],
	castell: [108, 122],
	cocentaina: [95, 144],
	'alt-de-la-codolla': [140, 140],
	'alt-de-santa-maria': [132, 132],
	'alt-de-la-replana': [145, 159],
	'morro-del-porc': [135, 135],
};

const ANCHO_MAPA = 16 * ANCHO_MINIMO_MAPA_REM;
const ALTO_MAPA = ANCHO_MAPA / proporcionRecortada(ANCHO_IMAGEN, ALTO_IMAGEN);
const centroEnPx = (id: string) => {
	const destino = destinos.find((d) => d.id === id);
	assert.ok(destino, id);
	return { x: (destino.izquierda / 100) * ANCHO_MAPA, y: (destino.arriba / 100) * ALTO_MAPA };
};

describe('destinos del mapa-menú', () => {
	it('son siete, de abajo arriba, con el orden 0 a 6', () => {
		assert.deepEqual(
			destinos.map((d) => d.id),
			['cocentaina', 'castell', 'alt-de-la-replana', 'morro-del-porc', 'alt-de-santa-maria', 'alt-de-la-codolla', 'montcabrer'],
		);
		assert.deepEqual(destinos.map((d) => d.orden), [0, 1, 2, 3, 4, 5, 6]);
	});

	it('cada destino lleva al apartado acordado el 25/11', () => {
		const rutaDe = Object.fromEntries(destinos.map((d) => [d.id, ruta('ca', d.ruta as never)]));
		assert.deepEqual(rutaDe, {
			cocentaina: '/qui-som/',
			castell: '/activitats/',
			'alt-de-la-replana': '/escoles-i-ampa/',
			'morro-del-porc': '/rutes/',
			'alt-de-santa-maria': '/agenda/',
			'alt-de-la-codolla': '/esdeveniments/',
			montcabrer: '/repte-5-cims/',
		});
	});

	it('las rutas existen en los dos idiomas y la castellana lleva el prefijo /es', () => {
		for (const destino of destinos) {
			assert.ok(ruta('ca', destino.ruta as never).startsWith('/'), destino.id);
			assert.ok(ruta('es', destino.ruta as never).startsWith('/es/'), destino.id);
			assert.notEqual(tNavegacion('ca', destino.ruta as never).trim(), '', destino.id);
		}
	});

	it('todos los textos están rellenos en valenciano y en castellano', () => {
		for (const destino of destinos) {
			for (const lang of IDIOMAS) {
				for (const [clave, texto] of Object.entries(destino.textos[lang])) {
					assert.notEqual(texto.trim(), '', `${destino.id} ${lang} ${clave}`);
				}
			}
		}
	});

	it('los ids no se repiten y cada destino tiene su ancho de placa en la tabla', () => {
		assert.equal(new Set(destinos.map((d) => d.id)).size, destinos.length);
		assert.deepEqual(Object.keys(ANCHO_PLACA).sort(), destinos.map((d) => d.id).sort());
	});

	it('los picos toman sus coordenadas de picos-mapa.json', () => {
		const montcabrer = picosEnCrudo.find((p) => p.nombre === 'Montcabrer');
		assert.ok(montcabrer);
		const destino = destinos.find((d) => d.id === 'montcabrer');
		assert.equal(destino?.izquierda, montcabrer.x);
		assert.equal(destino?.arriba, Number(yEnRecorte(montcabrer.y).toFixed(3)));
	});

	it('Castell y Cocentaina llevan sus propias coordenadas', () => {
		const castell = destinos.find((d) => d.id === 'castell');
		assert.equal(castell?.izquierda, 77.9);
		assert.equal(Math.round((castell?.arriba ?? 0) * 10) / 10, 44.9);
		const cocentaina = destinos.find((d) => d.id === 'cocentaina');
		assert.equal(cocentaina?.izquierda, 81.8);
		assert.equal(Math.round((cocentaina?.arriba ?? 0) * 10) / 10, 68.5);
	});

	it('todos caen dentro del recorte, a más del 5 % de los lados que difumina la máscara', () => {
		for (const destino of destinos) {
			assert.ok(destino.arriba > 0 && destino.arriba < 100, destino.id);
			assert.ok(destino.izquierda > 5 && destino.izquierda < 95, destino.id);
		}
	});

	it('un pico que no existe es un error con el nombre del destino', () => {
		const malo: DestinoEnCrudo[] = [{ ...crudos[2], pico: 'No Existe' }];
		assert.throws(() => prepararDestinos(malo, picosEnCrudo), /alt-de-la-replana.*No Existe/);
	});

	it('un destino sin pico ni coordenadas es un error', () => {
		const malo: DestinoEnCrudo[] = [{ ...crudos[0], x: undefined, y: undefined }];
		assert.throws(() => prepararDestinos(malo, picosEnCrudo), /cocentaina/);
	});
});

describe('zonas y placas con el mapa a su ancho mínimo (896 px)', () => {
	it('los botones más cercanos están a más de 44 px: ninguna zona pisa a otra (principio V)', () => {
		for (const a of destinos) {
			for (const b of destinos) {
				if (a.id < b.id) {
					assert.equal(sePisan(zonaDeBoton(centroEnPx(a.id)), zonaDeBoton(centroEnPx(b.id))), false, `${a.id} ${b.id}`);
				}
			}
		}
		assert.equal(LADO_ZONA_BOTON, 44);
	});

	it('la placa de Montcabrer cae donde dice la tabla: x 532–663, y 61–105', () => {
		const placa = rectanguloPlaca('arriba', centroEnPx('montcabrer'), 131);
		assert.equal(Math.round(placa.izquierda), 532);
		assert.equal(Math.round(placa.izquierda + placa.ancho), 663);
		assert.equal(Math.round(placa.arriba), 61);
		assert.equal(Math.round(placa.arriba + placa.alto), 105);
	});

	for (const [indice, lang] of IDIOMAS.entries()) {
		it(`ninguna placa pisa a otra placa ni a la zona de otro botón (${lang})`, () => {
			for (const a of destinos) {
				const placa = rectanguloPlaca(a.lado, centroEnPx(a.id), ANCHO_PLACA[a.id][indice]);
				for (const b of destinos) {
					if (b.id === a.id) {
						continue;
					}
					assert.equal(sePisan(placa, zonaDeBoton(centroEnPx(b.id))), false, `placa de ${a.id} y zona de ${b.id}`);
					const otra = rectanguloPlaca(b.lado, centroEnPx(b.id), ANCHO_PLACA[b.id][indice]);
					assert.equal(sePisan(placa, otra), false, `placa de ${a.id} y placa de ${b.id}`);
				}
			}
		});

		it(`ninguna placa se sale del 5 % de los lados que difumina la máscara (${lang})`, () => {
			for (const destino of destinos) {
				const placa = rectanguloPlaca(destino.lado, centroEnPx(destino.id), ANCHO_PLACA[destino.id][indice]);
				assert.ok(placa.izquierda >= 0.05 * ANCHO_MAPA, `${destino.id} por la izquierda`);
				assert.ok(placa.izquierda + placa.ancho <= 0.95 * ANCHO_MAPA, `${destino.id} por la derecha`);
				assert.ok(placa.arriba >= 0 && placa.arriba + placa.alto <= ALTO_MAPA, `${destino.id} en vertical`);
			}
		});
	}
});
