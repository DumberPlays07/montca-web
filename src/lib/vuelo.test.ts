import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TIPO_VUELO, type VentanaVuelo, activarVuelo, vieneDelMapa } from './vuelo.ts';

const INICIOS = ['/', '/es/'];

type Oyente = (evento: Record<string, unknown>) => void;

/** Un punto falso que apunta los nombres de transición que se le ponen y quitan. */
function crearPunto() {
	const nombres: string[] = [];
	return {
		nombres,
		style: {
			setProperty: (propiedad: string, valor: string) => {
				assert.equal(propiedad, 'view-transition-name');
				nombres.push(valor);
			},
			removeProperty: (propiedad: string) => {
				assert.equal(propiedad, 'view-transition-name');
				nombres.length = 0;
			},
		},
	};
}

/** Una transición falsa que apunta si se canceló y qué tipos se le añadieron. */
function crearTransicion(conTipos = true) {
	const transicion = {
		cancelada: false,
		types: conTipos ? new Set<string>() : undefined,
		skipTransition: () => {
			transicion.cancelada = true;
		},
	};
	return transicion;
}

interface OpcionesVentana {
	/** Botón del mapa con la viñeta abierta (su punto). */
	puntoAbierto?: ReturnType<typeof crearPunto> | null;
	/** Dirección de la página anterior según la Navigation API; `null` si la API no existe. */
	origen?: string | null;
	puntosEnPagina?: ReturnType<typeof crearPunto>[];
}

/** Una ventana falsa: guarda los oyentes para dispararlos a mano. No tiene `sessionStorage` ni cookies. */
function crearVentana({ puntoAbierto = null, origen = null, puntosEnPagina = [] }: OpcionesVentana = {}) {
	const enVentana = new Map<string, Oyente>();
	const enDocumento = new Map<string, Oyente>();
	const ventana = {
		addEventListener: (tipo: string, oyente: Oyente) => enVentana.set(tipo, oyente),
		document: {
			addEventListener: (tipo: string, oyente: Oyente) => enDocumento.set(tipo, oyente),
			querySelector: () => puntoAbierto,
			querySelectorAll: () => puntosEnPagina,
		},
		navigation: origen === null ? undefined : { activation: { from: { url: origen } } },
	} as unknown as VentanaVuelo;
	activarVuelo(ventana, { tipo: TIPO_VUELO, inicios: INICIOS }, vieneDelMapa);
	return {
		clic: (opciones: Record<string, unknown> = {}, dentroDeEntra = true) =>
			enDocumento.get('click')?.({
				target: { closest: (selector: string) => (dentroDeEntra && selector === '[data-vineta-enlace]' ? {} : null) },
				...opciones,
			}),
		disparar: (tipo: string, evento: Record<string, unknown>) => enVentana.get(tipo)?.(evento),
	};
}

describe('vieneDelMapa', () => {
	it('vieneDelMapa_conLaPortadaEnValenciano_devuelveVerdadero', () => {
		assert.equal(vieneDelMapa('https://montca.test/', INICIOS), true);
	});

	it('vieneDelMapa_conLaPortadaEnCastellano_devuelveVerdadero', () => {
		assert.equal(vieneDelMapa('https://montca.test/es/', INICIOS), true);
	});

	it('vieneDelMapa_sinBarraFinalNiQueryNiHash_devuelveVerdadero', () => {
		assert.equal(vieneDelMapa('https://montca.test/es', INICIOS), true);
		assert.equal(vieneDelMapa('https://montca.test/?utm_source=ig#mapa', INICIOS), true);
	});

	it('vieneDelMapa_conOtraPagina_devuelveFalso', () => {
		assert.equal(vieneDelMapa('https://montca.test/agenda/', INICIOS), false);
		assert.equal(vieneDelMapa('https://montca.test/es/agenda/', INICIOS), false);
	});

	it('vieneDelMapa_sinOrigenOVacio_devuelveFalso', () => {
		assert.equal(vieneDelMapa(undefined, INICIOS), false);
		assert.equal(vieneDelMapa('', INICIOS), false);
	});

	it('vieneDelMapa_conUnaDireccionQueNoSePuedeLeer_devuelveFalso', () => {
		assert.equal(vieneDelMapa('/es/', INICIOS), false);
		assert.equal(vieneDelMapa('no es una url', INICIOS), false);
	});
});

describe('activarVuelo: página que se abandona', () => {
	it('pageswap_conClicEnEntraYBotonAbierto_nombraElPuntoYNoCancela', () => {
		const punto = crearPunto();
		const ventana = crearVentana({ puntoAbierto: punto, origen: 'https://montca.test/' });
		const transicion = crearTransicion();

		ventana.clic();
		ventana.disparar('pageswap', { viewTransition: transicion });

		assert.deepEqual(punto.nombres, [TIPO_VUELO]);
		assert.equal(transicion.cancelada, false);
	});

	it('pageswap_conClicEnEntraYModificador_cancelaLaTransicion', () => {
		for (const modificador of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey']) {
			const punto = crearPunto();
			const ventana = crearVentana({ puntoAbierto: punto, origen: 'https://montca.test/' });
			const transicion = crearTransicion();

			ventana.clic({ [modificador]: true });
			ventana.disparar('pageswap', { viewTransition: transicion });

			assert.equal(transicion.cancelada, true, modificador);
			assert.deepEqual(punto.nombres, [], modificador);
		}
	});

	it('pageswap_conClicFueraDeEntra_cancelaLaTransicion', () => {
		const punto = crearPunto();
		const ventana = crearVentana({ puntoAbierto: punto, origen: 'https://montca.test/' });
		const transicion = crearTransicion();

		ventana.clic({}, false);
		ventana.disparar('pageswap', { viewTransition: transicion });

		assert.equal(transicion.cancelada, true);
		assert.deepEqual(punto.nombres, []);
	});

	it('pageswap_sinClicPrevio_cancelaLaTransicion', () => {
		// Por ejemplo, "Atrás" o "Adelante" del navegador.
		const ventana = crearVentana({ puntoAbierto: crearPunto(), origen: 'https://montca.test/' });
		const transicion = crearTransicion();

		ventana.disparar('pageswap', { viewTransition: transicion });

		assert.equal(transicion.cancelada, true);
	});

	it('pageswap_sinBotonAbierto_cancelaLaTransicion', () => {
		const ventana = crearVentana({ puntoAbierto: null, origen: 'https://montca.test/' });
		const transicion = crearTransicion();

		ventana.clic();
		ventana.disparar('pageswap', { viewTransition: transicion });

		assert.equal(transicion.cancelada, true);
	});

	it('pageswap_sinNavigationApi_cancelaLaTransicionYNoNombraElPunto', () => {
		const punto = crearPunto();
		const ventana = crearVentana({ puntoAbierto: punto, origen: null });
		const transicion = crearTransicion();

		ventana.clic();
		ventana.disparar('pageswap', { viewTransition: transicion });

		assert.equal(transicion.cancelada, true);
		assert.deepEqual(punto.nombres, []);
	});

	it('pageswap_sinTiposDeTransicion_cancelaLaTransicionYNoNombraElPunto', () => {
		const punto = crearPunto();
		const ventana = crearVentana({ puntoAbierto: punto, origen: 'https://montca.test/' });
		const transicion = crearTransicion(false);

		ventana.clic();
		ventana.disparar('pageswap', { viewTransition: transicion });

		assert.equal(transicion.cancelada, true);
		assert.deepEqual(punto.nombres, []);
	});

	it('pageswap_sinTransicion_noHaceNada', () => {
		// Con movimiento reducido el navegador no crea transición: el evento llega con `null`.
		const punto = crearPunto();
		const ventana = crearVentana({ puntoAbierto: punto, origen: 'https://montca.test/' });

		ventana.clic();
		assert.doesNotThrow(() => ventana.disparar('pageswap', { viewTransition: null }));
		assert.deepEqual(punto.nombres, []);
	});
});

describe('activarVuelo: página nueva', () => {
	it('pagereveal_llegandoDeLaPortada_anadeElTipoVuelo', () => {
		const ventana = crearVentana({ origen: 'https://montca.test/' });
		const transicion = crearTransicion();

		ventana.disparar('pagereveal', { viewTransition: transicion });

		assert.deepEqual([...(transicion.types ?? [])], [TIPO_VUELO]);
	});

	it('pagereveal_llegandoDeLaPortadaEnCastellano_anadeElTipoVuelo', () => {
		const ventana = crearVentana({ origen: 'https://montca.test/es/' });
		const transicion = crearTransicion();

		ventana.disparar('pagereveal', { viewTransition: transicion });

		assert.deepEqual([...(transicion.types ?? [])], [TIPO_VUELO]);
	});

	it('pagereveal_llegandoDeOtraPagina_noAnadeTipos', () => {
		const ventana = crearVentana({ origen: 'https://montca.test/agenda/' });
		const transicion = crearTransicion();

		ventana.disparar('pagereveal', { viewTransition: transicion });

		assert.equal(transicion.types?.size, 0);
	});

	it('pagereveal_sinNavigationApi_noAnadeTipos', () => {
		const ventana = crearVentana({ origen: null });
		const transicion = crearTransicion();

		ventana.disparar('pagereveal', { viewTransition: transicion });

		assert.equal(transicion.types?.size, 0);
	});

	it('pagereveal_sinTransicion_noHaceNada', () => {
		const ventana = crearVentana({ origen: 'https://montca.test/' });

		assert.doesNotThrow(() => ventana.disparar('pagereveal', { viewTransition: null }));
	});
});

describe('activarVuelo: vuelta atrás', () => {
	it('pageshow_conPaginaRestauradaDeLaCache_quitaElNombreDeLosPuntos', () => {
		const punto = crearPunto();
		punto.style.setProperty('view-transition-name', TIPO_VUELO);
		const ventana = crearVentana({ puntosEnPagina: [punto] });

		ventana.disparar('pageshow', { persisted: true });

		assert.deepEqual(punto.nombres, []);
	});

	it('pageshow_conCargaNormal_noTocaLosPuntos', () => {
		const punto = crearPunto();
		punto.style.setProperty('view-transition-name', TIPO_VUELO);
		const ventana = crearVentana({ puntosEnPagina: [punto] });

		ventana.disparar('pageshow', { persisted: false });

		assert.deepEqual(punto.nombres, [TIPO_VUELO]);
	});

	it('pageshow_olvidaUnClicAnterior_ysiguienteNavegacionNoVuela', () => {
		const ventana = crearVentana({ puntoAbierto: crearPunto(), origen: 'https://montca.test/' });
		const transicion = crearTransicion();

		ventana.clic();
		ventana.disparar('pageshow', { persisted: true });
		ventana.disparar('pageswap', { viewTransition: transicion });

		assert.equal(transicion.cancelada, true);
	});
});

describe('privacidad', () => {
	it('activarVuelo_noGuardaNadaEnElNavegador', () => {
		// La web no guarda datos en el dispositivo (decisiones.md, B-07 y B-17; docs/legal/cookies.md).
		const codigo = `${activarVuelo}${vieneDelMapa}`;

		assert.doesNotMatch(codigo, /storage|cookie|indexeddb/i);
	});
});
