import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ruta, t as tNavegacion } from '../components/textos-navegacion.ts';
import destinosEnCrudo from '../data/destinos-mapa.json' with { type: 'json' };
import picosEnCrudo from '../data/picos-mapa.json' with { type: 'json' };
import {
	ESQUINAS_DESDE,
	ESQUINAS_HASTA,
	FUNDIDO_INFERIOR_DESDE,
	FUNDIDO_INFERIOR_HASTA,
	LADO_ZONA_BOTON,
	type DestinoEnCrudo,
	prepararDestinos,
	prepararPicos,
	proporcionRecortada,
	rectanguloPlaca,
	sePisan,
	yEnRecorte,
	zonaDeBoton,
	zonaPulsable,
} from './mapa.ts';

/** Medidas de `src/assets/mapa/mapa-mariola.webp`. */
const ANCHO_IMAGEN = 2560;
const ALTO_IMAGEN = 1430;
const IDIOMAS = ['ca', 'es'] as const;

/**
 * Lo que se deja de los lados del mapa, como fracción del ancho. La máscara difumina el 5 %, pero con
 * ocho botones y cinco picos la placa de Morro del Porc (a la izquierda: arriba y abajo estorban a Alt de
 * Sant Jaume y a la Replana) entra hasta 3 % del borde a 896 px. La placa lleva su propio fondo Boira,
 * así que se lee igual. Por eso el límite es el 2,5 % y no el 5 %.
 */
const MARGEN_LATERAL = 0.025;

/** Lado de la parte visible de un pico (el punto de 14 px): ninguna placa la cubre. */
const PUNTO_PICO = 14;

const crudos = destinosEnCrudo as DestinoEnCrudo[];
const destinos = prepararDestinos(crudos, picosEnCrudo);

/**
 * Lo que mide cada placa (px) medida en el navegador con la placa de una línea (marca de sendero y
 * destino en Label): [valenciano, castellano]. Si cambia un texto o el estilo de la placa, hay que volver
 * a medirla (ver docs/decisiones.md y el PR #112).
 */
const ANCHO_PLACA: Record<string, [number, number]> = {
	montcabrer: [120.4, 120.4],
	castell: [97, 110.6],
	cocentaina: [86.1, 132.7],
	'alt-de-la-codolla': [128.7, 128.7],
	'alt-de-santa-maria': [83, 83],
	'alt-de-la-replana': [132.9, 145],
	'morro-del-porc': [123.3, 123.3],
	'alt-de-sant-jaume': [80, 80.1],
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
const picos = prepararPicos(picosEnCrudo, destinos, ANCHO_IMAGEN, ALTO_IMAGEN, crudos);
const centroPicoEnPx = (pico: { izquierda: number; arriba: number }, anchoMapa: number) => ({
	x: (pico.izquierda / 100) * anchoMapa,
	y: (pico.arriba / 100) * (anchoMapa / PROPORCION),
});
/** La placa de un destino en un idioma, con su lado y su desplazamiento. */
const placaDe = (id: string, indiceIdioma: number, anchoMapa: number) => {
	const destino = destinos.find((d) => d.id === id);
	assert.ok(destino, id);
	return rectanguloPlaca(destino.lado, centroEnPx(id, anchoMapa), ANCHO_PLACA[id][indiceIdioma], destino.desplazamiento);
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

	it('los picos llevan su altura en el título de la viñeta y Castell y Cocentaina no', () => {
		const alturaDe = Object.fromEntries(destinos.map((d) => [d.id, d.altura]));
		assert.deepEqual(alturaDe, {
			cocentaina: undefined,
			castell: undefined,
			'alt-de-la-replana': 1086,
			'morro-del-porc': 964,
			'alt-de-sant-jaume': 957,
			'alt-de-santa-maria': 965,
			'alt-de-la-codolla': 1167,
			montcabrer: 1390,
		});
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

describe('los demás picos', () => {
	it('son los cinco que no son destino, de más alto a más bajo', () => {
		assert.deepEqual(
			picos.map((p) => p.nombre),
			['Alt de la Reja', 'Mola Alta de Serelles', "el Portell de Just d'Alfafara", 'Tossal Redó', 'Tossal del Mas de Miró'],
		);
	});

	it('ningún pico es a la vez un destino', () => {
		const nombresDeDestino = crudos.map((c) => c.pico);
		for (const pico of picos) {
			assert.ok(!nombresDeDestino.includes(pico.nombre), pico.nombre);
		}
	});

	it('Alt de la Reja es el único que baja de 44 px (excepción del principio V): 24 px, junto a Montcabrer', () => {
		for (const ancho of ANCHOS_MAPA) {
			const menores = picos
				.filter((p) => zonaPulsable(p.vecino, p.vecinoBoton, ancho) < LADO_ZONA_BOTON)
				.map((p) => p.nombre);
			assert.deepEqual(menores, ['Alt de la Reja'], `a ${ancho} px`);
		}
		const reja = picos.find((p) => p.nombre === 'Alt de la Reja');
		assert.ok(reja);
		assert.equal(zonaPulsable(reja.vecino, reja.vecinoBoton, 896), 24);
	});

	it('ninguna zona de pico baja de 24 px (WCAG 2.2, 2.5.8)', () => {
		for (const ancho of ANCHOS_MAPA) {
			for (const pico of picos) {
				assert.ok(zonaPulsable(pico.vecino, pico.vecinoBoton, ancho) >= 24, `${pico.nombre} a ${ancho} px`);
			}
		}
	});

	it('la zona de un pico solo se solapa con la de un botón en el par Alt de la Reja / Montcabrer', () => {
		for (const ancho of ANCHOS_MAPA) {
			for (const pico of picos) {
				const lado = zonaPulsable(pico.vecino, pico.vecinoBoton, ancho);
				const c = centroPicoEnPx(pico, ancho);
				const zonaPico = { izquierda: c.x - lado / 2, arriba: c.y - lado / 2, ancho: lado, alto: lado };
				for (const destino of destinos) {
					const choca = sePisan(zonaPico, zonaDeBoton(centroEnPx(destino.id, ancho)));
					const permitido = pico.nombre === 'Alt de la Reja' && destino.id === 'montcabrer';
					assert.equal(choca && !permitido, false, `${pico.nombre} y ${destino.id} a ${ancho} px`);
				}
			}
		}
	});

	it('las zonas de dos picos no se pisan', () => {
		for (const ancho of ANCHOS_MAPA) {
			for (const a of picos) {
				for (const b of picos) {
					if (a.id < b.id) {
						const la = zonaPulsable(a.vecino, a.vecinoBoton, ancho);
						const lb = zonaPulsable(b.vecino, b.vecinoBoton, ancho);
						const ca = centroPicoEnPx(a, ancho);
						const cb = centroPicoEnPx(b, ancho);
						const pisan = sePisan(
							{ izquierda: ca.x - la / 2, arriba: ca.y - la / 2, ancho: la, alto: la },
							{ izquierda: cb.x - lb / 2, arriba: cb.y - lb / 2, ancho: lb, alto: lb },
						);
						assert.equal(pisan, false, `${a.nombre} y ${b.nombre} a ${ancho} px`);
					}
				}
			}
		}
	});
});

describe('fundido del borde de abajo del mapa', () => {
	it('el fundido empieza antes de que empiece el grosor del frente del bloque (83,8 % del recorte)', () => {
		const frenteDelBloque = (84.5 - 30) / 65;
		assert.ok(1 - FUNDIDO_INFERIOR_DESDE < frenteDelBloque);
	});

	it('las esquinas se desvanecen entre el 74 % y el 90 % del alto, antes de que acabe el fundido de abajo', () => {
		assert.equal(ESQUINAS_DESDE, 0.74);
		assert.ok(ESQUINAS_HASTA > ESQUINAS_DESDE && ESQUINAS_HASTA <= 1 - FUNDIDO_INFERIOR_HASTA);
	});

	it('llega a transparente antes del canto inferior del diorama (98,7 % del recorte)', () => {
		const cantoDelDiorama = (94.13 - 30) / 65;
		assert.ok(1 - FUNDIDO_INFERIOR_HASTA < cantoDelDiorama);
		assert.ok(FUNDIDO_INFERIOR_DESDE > FUNDIDO_INFERIOR_HASTA);
	});

	it('ningún botón, placa ni pico llega a la franja que difumina la máscara', () => {
		for (const ancho of ANCHOS_MAPA) {
			const alto = ancho / PROPORCION;
			const limite = (1 - FUNDIDO_INFERIOR_DESDE) * alto;
			let masBajo = 0;
			for (const destino of destinos) {
				masBajo = Math.max(masBajo, zonaDeBoton(centroEnPx(destino.id, ancho)).arriba + LADO_ZONA_BOTON);
				for (const [indice] of IDIOMAS.entries()) {
					const placa = placaDe(destino.id, indice, ancho);
					masBajo = Math.max(masBajo, placa.arriba + placa.alto);
				}
			}
			for (const pico of picos) {
				const lado = zonaPulsable(pico.vecino, pico.vecinoBoton, ancho);
				masBajo = Math.max(masBajo, centroPicoEnPx(pico, ancho).y + lado / 2);
			}
			assert.ok(masBajo <= limite, `a ${ancho} px lo más bajo llega a ${masBajo.toFixed(1)} px y el fundido empieza en ${limite.toFixed(1)} px`);
		}
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

	it('la placa mide 24 px de alto y la de Montcabrer queda debajo de su punto', () => {
		const placa = placaDe('montcabrer', 0, 896);
		const centro = centroEnPx('montcabrer', 896);
		assert.equal(placa.alto, 24);
		assert.equal(placa.arriba, centro.y + 16);
		assert.equal(placa.izquierda + placa.ancho / 2, centro.x);
	});

	for (const [indice, lang] of IDIOMAS.entries()) {
		it(`ninguna placa pisa a otra placa ni a la zona de otro botón, a ningún ancho (${lang})`, () => {
			for (const ancho of ANCHOS_MAPA) {
				for (const a of destinos) {
					const placa = placaDe(a.id, indice, ancho);
					for (const b of destinos) {
						if (b.id === a.id) {
							continue;
						}
						assert.equal(sePisan(placa, zonaDeBoton(centroEnPx(b.id, ancho))), false, `placa de ${a.id} y zona de ${b.id} a ${ancho} px`);
						assert.equal(sePisan(placa, placaDe(b.id, indice, ancho)), false, `placa de ${a.id} y placa de ${b.id} a ${ancho} px`);
					}
				}
			}
		});

		it(`ninguna placa cubre el punto de un pico (${lang})`, () => {
			for (const ancho of ANCHOS_MAPA) {
				for (const destino of destinos) {
					const placa = placaDe(destino.id, indice, ancho);
					for (const pico of picos) {
						const c = centroPicoEnPx(pico, ancho);
						const punto = { izquierda: c.x - PUNTO_PICO / 2, arriba: c.y - PUNTO_PICO / 2, ancho: PUNTO_PICO, alto: PUNTO_PICO };
						assert.equal(sePisan(placa, punto), false, `placa de ${destino.id} y ${pico.nombre} a ${ancho} px`);
					}
				}
			}
		});

		it(`ninguna placa se sale del mapa ni del ${MARGEN_LATERAL * 100} % de los lados (${lang})`, () => {
			for (const ancho of ANCHOS_MAPA) {
				const alto = ancho / PROPORCION;
				for (const destino of destinos) {
					const placa = placaDe(destino.id, indice, ancho);
					assert.ok(placa.izquierda >= MARGEN_LATERAL * ancho, `${destino.id} por la izquierda a ${ancho} px`);
					assert.ok(placa.izquierda + placa.ancho <= (1 - MARGEN_LATERAL) * ancho, `${destino.id} por la derecha a ${ancho} px`);
					assert.ok(placa.arriba >= 0 && placa.arriba + placa.alto <= alto, `${destino.id} en vertical a ${ancho} px`);
				}
			}
		});
	}
});
