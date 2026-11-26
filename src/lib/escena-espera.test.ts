import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { LIMITE_ESPERA_MAPA_MS, esperarMapa } from './escena-espera.ts';

type Oyente = () => void;

function crearImagen(complete: boolean, naturalWidth: number) {
	const oyentes = new Map<string, Oyente>();
	return {
		complete,
		naturalWidth,
		addEventListener: (tipo: string, oyente: Oyente) => {
			oyentes.set(tipo, oyente);
		},
		disparar: (tipo: string) => oyentes.get(tipo)?.(),
	};
}

/** Una ventana falsa con reloj, un temporizador y fotogramas que se ejecutan a mano. */
function crearVentana(ahora: number) {
	let temporizador: { accion: () => void; ms: number } | null = null;
	let fotogramas: Array<() => void> = [];
	let cancelados = 0;
	return {
		performance: { now: () => ahora },
		setTimeout: (accion: () => void, ms: number) => {
			temporizador = { accion, ms };
			return temporizador;
		},
		clearTimeout: () => {
			cancelados++;
			temporizador = null;
		},
		requestAnimationFrame: (accion: () => void) => {
			fotogramas.push(accion);
			return fotogramas.length;
		},
		vencerTemporizador: () => temporizador?.accion(),
		pasarFotograma: () => {
			const pendientes = fotogramas;
			fotogramas = [];
			pendientes.forEach((accion) => accion());
		},
		get msDelTemporizador() {
			return temporizador?.ms;
		},
		get cancelados() {
			return cancelados;
		},
	};
}

function crearEscena() {
	return { dataset: {} as Record<string, string | undefined> };
}

describe('esperarMapa', () => {
	it('pone esperando mientras la imagen no ha llegado', () => {
		const escena = crearEscena();
		esperarMapa(escena, crearImagen(false, 0), crearVentana(300), LIMITE_ESPERA_MAPA_MS);
		assert.equal(escena.dataset.estado, 'esperando');
	});

	it('pasa a listo un fotograma después de load y cancela el temporizador', () => {
		const escena = crearEscena();
		const imagen = crearImagen(false, 0);
		const ventana = crearVentana(300);
		esperarMapa(escena, imagen, ventana, LIMITE_ESPERA_MAPA_MS);

		imagen.disparar('load');
		assert.equal(escena.dataset.estado, 'esperando');
		ventana.pasarFotograma();

		assert.equal(escena.dataset.estado, 'listo');
		assert.equal(ventana.cancelados, 1);
	});

	it('espera solo lo que queda de los 4 s desde que empezó la carga', () => {
		const ventana = crearVentana(1500);
		esperarMapa(crearEscena(), crearImagen(false, 0), ventana, LIMITE_ESPERA_MAPA_MS);
		assert.equal(ventana.msDelTemporizador, 2500);
	});

	it('pasa a omitida si el mapa no llega en 4 s, y un load tardío no la despierta', () => {
		const escena = crearEscena();
		const imagen = crearImagen(false, 0);
		const ventana = crearVentana(300);
		esperarMapa(escena, imagen, ventana, LIMITE_ESPERA_MAPA_MS);

		ventana.vencerTemporizador();
		assert.equal(escena.dataset.estado, 'omitida');

		imagen.disparar('load');
		ventana.pasarFotograma();
		assert.equal(escena.dataset.estado, 'omitida');
	});

	it('un load cuyo fotograma llega después del límite tampoco revive la escena omitida', () => {
		const escena = crearEscena();
		const imagen = crearImagen(false, 0);
		const ventana = crearVentana(300);
		esperarMapa(escena, imagen, ventana, LIMITE_ESPERA_MAPA_MS);

		imagen.disparar('load');
		ventana.vencerTemporizador();
		ventana.pasarFotograma();
		assert.equal(escena.dataset.estado, 'omitida');
	});

	it('pasa a omitida si la imagen falla', () => {
		const escena = crearEscena();
		const imagen = crearImagen(false, 0);
		esperarMapa(escena, imagen, crearVentana(300), LIMITE_ESPERA_MAPA_MS);

		imagen.disparar('error');
		assert.equal(escena.dataset.estado, 'omitida');
	});

	it('una imagen que ya está completa (caché) pasa a listo sin temporizador', () => {
		const escena = crearEscena();
		const ventana = crearVentana(50);
		esperarMapa(escena, crearImagen(true, 2560), ventana, LIMITE_ESPERA_MAPA_MS);

		assert.equal(escena.dataset.estado, 'esperando');
		ventana.pasarFotograma();
		assert.equal(escena.dataset.estado, 'listo');
		assert.equal(ventana.msDelTemporizador, undefined);
	});

	it('una imagen completa pero rota (ancho 0) pasa a omitida', () => {
		const escena = crearEscena();
		esperarMapa(escena, crearImagen(true, 0), crearVentana(50), LIMITE_ESPERA_MAPA_MS);
		assert.equal(escena.dataset.estado, 'omitida');
	});

	it('si ya han pasado 4 s al ejecutarse y la imagen sigue sin llegar, la omite sin esperar', () => {
		const escena = crearEscena();
		const ventana = crearVentana(4200);
		esperarMapa(escena, crearImagen(false, 0), ventana, LIMITE_ESPERA_MAPA_MS);

		assert.equal(escena.dataset.estado, 'omitida');
		assert.equal(ventana.msDelTemporizador, undefined);
	});
});
