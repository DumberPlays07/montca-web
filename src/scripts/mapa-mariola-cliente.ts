/**
 * Script del mapa de Mariola (B-19): abre y cierra la ficha de un pico, coloca el mapa al empezar y
 * enseña el aviso y los degradados de deslizar en el móvil. Sin animaciones.
 *
 * Los picos y los botones de la lista comparten `data-pico`: los dos abren la misma ficha.
 */
import { colocarFicha } from '../lib/mapa';

/** Hueco entre el pico y la ficha en escritorio: la mitad de la zona pulsable más un margen. */
const HUECO_FICHA_PX = 30;

/** Lo que hay que deslizar para dar el aviso por visto y quitarlo. */
const UMBRAL_DESLIZAMIENTO_PX = 8;

/** Margen para saber si queda mapa a un lado. */
const MARGEN_BORDE_PX = 4;

function elemento<T extends Element>(raiz: ParentNode, selector: string): T {
	const encontrado = raiz.querySelector<T>(selector);
	if (encontrado === null) {
		throw new Error(`Falta ${selector} en el mapa.`);
	}
	return encontrado;
}

function iniciar(raiz: HTMLElement): void {
	const caja = elemento<HTMLElement>(raiz, '[data-caja]');
	const marco = elemento<HTMLElement>(raiz, '[data-marco]');
	const ficha = elemento<HTMLElement>(raiz, '[data-ficha]');
	const pista = elemento<HTMLElement>(raiz, '[data-pista]');
	const botones = Array.from(raiz.querySelectorAll<HTMLButtonElement>('button[data-pico]'));
	const escritorio = window.matchMedia('(min-width: 48rem)');

	let abierto: { id: string; origen: HTMLElement } | null = null;

	// ---- Ficha ----

	function marcarAbierto(id: string | null): void {
		for (const boton of botones) {
			boton.setAttribute('aria-expanded', String(boton.dataset.pico === id));
		}
	}

	/** Pone la ficha junto al pico (escritorio). En el móvil es un panel fijo y no se coloca. */
	function colocar(id: string): void {
		if (!escritorio.matches) {
			return;
		}
		const pico = raiz.querySelector<HTMLElement>(`.pico[data-pico="${id}"]`);
		if (pico === null) {
			return;
		}
		const cajaRect = caja.getBoundingClientRect();
		const picoRect = pico.getBoundingClientRect();
		const sitio = colocarFicha({
			pico: {
				x: picoRect.left + picoRect.width / 2 - cajaRect.left,
				y: picoRect.top + picoRect.height / 2 - cajaRect.top,
			},
			caja: { ancho: cajaRect.width, alto: cajaRect.height },
			ficha: { ancho: ficha.offsetWidth, alto: ficha.offsetHeight },
			margen: HUECO_FICHA_PX,
		});
		ficha.style.setProperty('--ficha-izquierda', `${sitio.izquierda}px`);
		ficha.style.setProperty('--ficha-arriba', `${sitio.arriba}px`);
	}

	function abrir(desde: HTMLButtonElement): void {
		const id = desde.dataset.pico ?? '';
		elemento<HTMLElement>(ficha, '[data-ficha-nombre]').textContent = desde.dataset.nombre ?? '';
		elemento<HTMLElement>(ficha, '[data-ficha-altura]').textContent = desde.dataset.altura ?? '';
		const enlace = elemento<HTMLAnchorElement>(ficha, '[data-ficha-whatsapp]');
		if (desde.dataset.whatsapp) {
			enlace.href = desde.dataset.whatsapp;
		}
		// C-01 leerá este id para enseñar las actividades de la cima.
		ficha.dataset.picoAbierto = id;

		ficha.hidden = false;
		marcarAbierto(id);
		abierto = { id, origen: desde };

		const pico = raiz.querySelector<HTMLElement>(`.pico[data-pico="${id}"]`);
		const desdeLaLista = !desde.classList.contains('pico');
		// Desde la lista, el pico puede quedar fuera del trozo de mapa que se ve: se centra en el marco
		// (solo en horizontal; la página no se mueve).
		if (desdeLaLista && pico !== null && desliza()) {
			marco.scrollLeft = pico.offsetLeft - marco.clientWidth / 2;
		}
		colocar(id);
		// En escritorio la ficha sale junto al pico, que puede estar muy arriba de la lista: se trae a la vista.
		if (desdeLaLista && escritorio.matches) {
			ficha.scrollIntoView({ block: 'center', inline: 'nearest' });
		}
		ficha.focus({ preventScroll: true });
	}

	/** Cierra la ficha y devuelve el foco al botón que la abrió. */
	function cerrar(): void {
		if (abierto === null) {
			return;
		}
		const { origen } = abierto;
		ficha.hidden = true;
		marcarAbierto(null);
		abierto = null;
		// Un pico ya está a la vista; un botón de la lista puede haber quedado lejos y se vuelve a él.
		origen.focus({ preventScroll: origen.classList.contains('pico') });
	}

	for (const boton of botones) {
		boton.addEventListener('click', () => {
			if (abierto !== null && abierto.id === boton.dataset.pico && abierto.origen === boton) {
				cerrar();
				return;
			}
			abrir(boton);
		});
	}

	elemento<HTMLElement>(ficha, '[data-cerrar]').addEventListener('click', cerrar);

	document.addEventListener('keydown', (evento) => {
		if (evento.key === 'Escape' && abierto !== null) {
			cerrar();
		}
	});

	// Un clic fuera la cierra y el foco vuelve al botón que la abrió. Se hace al terminar el clic y no
	// al empezarlo: así el foco que el navegador mueve al pulsar no se lo lleva otro elemento.
	// Los botones de pico y de la lista se encargan de sí mismos. Deslizar el mapa no cierra la ficha.
	document.addEventListener('click', (evento) => {
		if (abierto === null || !(evento.target instanceof Node)) {
			return;
		}
		const dentro = ficha.contains(evento.target);
		const enUnPico = botones.some((boton) => boton.contains(evento.target as Node));
		if (!dentro && !enUnPico) {
			cerrar();
		}
	});

	// Al cambiar el tamaño, la ficha ya no estaría bien colocada.
	escritorio.addEventListener('change', cerrar);
	window.addEventListener('resize', () => {
		if (abierto !== null) {
			colocar(abierto.id);
		}
	});

	// ---- Mapa que se desliza (móvil) ----

	const desliza = () => marco.scrollWidth > marco.clientWidth + 1;
	let avisoVisto = false;

	function actualizarBordes(): void {
		const maximo = marco.scrollWidth - marco.clientWidth;
		caja.dataset.bordeIzquierdo = marco.scrollLeft > MARGEN_BORDE_PX ? 'si' : 'no';
		caja.dataset.bordeDerecho = marco.scrollLeft < maximo - MARGEN_BORDE_PX ? 'si' : 'no';
	}

	// Empieza centrado en los picos, no en el borde izquierdo del mapa.
	let inicial = 0;
	if (desliza()) {
		const centro = Number(marco.dataset.centroX) / 100;
		marco.scrollLeft = centro * marco.scrollWidth - marco.clientWidth / 2;
		inicial = marco.scrollLeft;
		pista.hidden = false;
	}
	actualizarBordes();

	marco.addEventListener(
		'scroll',
		() => {
			actualizarBordes();
			// Al primer deslizamiento el aviso ya no hace falta.
			if (!avisoVisto && Math.abs(marco.scrollLeft - inicial) > UMBRAL_DESLIZAMIENTO_PX) {
				avisoVisto = true;
				pista.hidden = true;
			}
		},
		{ passive: true },
	);

	window.addEventListener('resize', () => {
		actualizarBordes();
		pista.hidden = avisoVisto || !desliza();
	});
}

const raiz = document.querySelector<HTMLElement>('[data-mapa-mariola]');
if (raiz) {
	try {
		iniciar(raiz);
	} catch (error) {
		// Si algo falla, el mapa y la lista siguen a la vista; solo falta la ficha.
		console.error('No se ha podido iniciar el mapa de Mariola.', error);
	}
}
