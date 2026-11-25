import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ruta, t as tNavegacion } from '../components/textos-navegacion.ts';
import destinosEnCrudo from '../data/destinos-mapa.json' with { type: 'json' };
import picosEnCrudo from '../data/picos-mapa.json' with { type: 'json' };
import {
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

/**
 * Lo que se deja de los lados del mapa, como fracción del ancho. La máscara difumina el 5 %, pero con
 * ocho botones la placa de Morro del Porc (a la izquierda, la única posición que no pisa a Alt de Sant
 * Jaume ni a Alt de Santa Maria) entra hasta 18 px (3 %) en ese borde a 896 px: la placa lleva su
 * propio fondo Boira, así que se lee igual. Por eso el límite es el 2,5 % y no el 5 %.
 */
const MARGEN_LATERAL = 0.025;

const crudos = destinosEnCrudo as DestinoEnCrudo[];
const destinos = prepararDestinos(crudos, picosEnCrudo);

/** Lo que mide cada placa (px) medida en el navegador (la tabla del issue #108 y, para Alt de Sant Jaume, la medición de #112), a 896 px de mapa: [valenciano, castellano]. */
const ANCHO_PLACA: Record<string, [number, number]> = {
	montcabrer: [131, 131],
	castell: [108, 122],
	cocentaina: [95, 144],
	'alt-de-la-codolla': [140, 140],
	'alt-de-santa-maria': [132, 132],
	'alt-de-la-replana': [145, 159],
	'morro-del-porc': [135, 135],
	'alt-de-sant-jaume': [132, 132],
};

/**
 * Anchos a los que se enseña el mapa: 56rem (896 px) es el mínimo; la placa mide siempre lo mismo y el
 * mapa crece hasta 1088 px (72rem menos los márgenes), así que cada ancho separa los botones de otra
 * forma y hay que comprobarlos todos.
 */
const ANCHOS_MAPA = [896, 928, 960, 1024, 1088];
const PROPORCION = proporcionRecortada(ANCHO_IMAGEN, ALTO_IMAGEN);
const centroEnPx = (id: string, anchoMapa: number) => {
	const destino = destinos.find((d) => d.id === id);
	assert.ok(destino, id);
	return { x: (destino.izquierda / 100) * anchoMapa, y: (destino.arriba / 100) * (anchoMapa / PROPORCION) };
};

describe('destinos del mapa-menú', () => {
	it('son ocho, de abajo arriba, con el orden 0 a 7', () => {
		assert.deepEqual(
			destinos.map((d) => d.id),
			['cocentaina', 'castell', 'alt-de-la-replana', 'morro-del-porc', 'alt-de-sant-jaume', 'alt-de-santa-maria', 'alt-de-la-codolla', 'montcabrer'],
		);
		assert.deepEqual(destinos.map((d) => d.orden), [0, 1, 2, 3, 4, 5, 6, 7]);
	});

	it('cada destino lleva al apartado acordado el 25/11', () => {
		const rutaDe = Object.fromEntries(destinos.map((d) => [d.id, ruta('ca', d.ruta as never)]));
		assert.deepEqual(rutaDe, {
			cocentaina: '/qui-som/',
			castell: '/activitats/',
			'alt-de-la-replana': '/escoles-i-ampa/',
			'morro-del-porc': '/rutes/',
			'alt-de-sant-jaume': '/galeria/',
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

describe('zonas y placas con el mapa a todos sus anchos (896 a 1088 px)', () => {
	it('los botones más cercanos están a más de 44 px: ninguna zona pisa a otra (principio V)', () => {
		for (const ancho of ANCHOS_MAPA) {
			for (const a of destinos) {
				for (const b of destinos) {
					if (a.id < b.id) {
						const pisan = sePisan(zonaDeBoton(centroEnPx(a.id, ancho)), zonaDeBoton(centroEnPx(b.id, ancho)));
						assert.equal(pisan, false, `${a.id} ${b.id} a ${ancho} px`);
					}
				}
			}
		}
		assert.equal(LADO_ZONA_BOTON, 44);
	});

	it('la placa de Montcabrer cae donde dice la tabla a 896 px: x 532–663, y 61–105', () => {
		const placa = rectanguloPlaca('arriba', centroEnPx('montcabrer', 896), 131);
		assert.equal(Math.round(placa.izquierda), 532);
		assert.equal(Math.round(placa.izquierda + placa.ancho), 663);
		assert.equal(Math.round(placa.arriba), 61);
		assert.equal(Math.round(placa.arriba + placa.alto), 105);
	});

	for (const [indice, lang] of IDIOMAS.entries()) {
		it(`ninguna placa pisa a otra placa ni a la zona de otro botón, a ningún ancho (${lang})`, () => {
			for (const ancho of ANCHOS_MAPA) {
				for (const a of destinos) {
					const placa = rectanguloPlaca(a.lado, centroEnPx(a.id, ancho), ANCHO_PLACA[a.id][indice]);
					for (const b of destinos) {
						if (b.id === a.id) {
							continue;
						}
						const zona = zonaDeBoton(centroEnPx(b.id, ancho));
						assert.equal(sePisan(placa, zona), false, `placa de ${a.id} y zona de ${b.id} a ${ancho} px`);
						const otra = rectanguloPlaca(b.lado, centroEnPx(b.id, ancho), ANCHO_PLACA[b.id][indice]);
						assert.equal(sePisan(placa, otra), false, `placa de ${a.id} y placa de ${b.id} a ${ancho} px`);
					}
				}
			}
		});

		it(`ninguna placa se sale del mapa ni del ${MARGEN_LATERAL * 100} % de los lados (${lang})`, () => {
			for (const ancho of ANCHOS_MAPA) {
				const alto = ancho / PROPORCION;
				for (const destino of destinos) {
					const placa = rectanguloPlaca(destino.lado, centroEnPx(destino.id, ancho), ANCHO_PLACA[destino.id][indice]);
					assert.ok(placa.izquierda >= MARGEN_LATERAL * ancho, `${destino.id} por la izquierda a ${ancho} px`);
					assert.ok(placa.izquierda + placa.ancho <= (1 - MARGEN_LATERAL) * ancho, `${destino.id} por la derecha a ${ancho} px`);
					assert.ok(placa.arriba >= 0 && placa.arriba + placa.alto <= alto, `${destino.id} en vertical a ${ancho} px`);
				}
			}
		});
	}
});
