/**
 * Script del mapa de Mariola (B-21): abre y cierra la viñeta de un botón, coloca el mapa al empezar y
 * enseña el aviso y los degradados de deslizar en el móvil. Sin animaciones.
 *
 * Sin este script cada botón del mapa es un enlace (`<a href>`) directo a su apartado. Al cargar, el
 * script los convierte en botones que abren la viñeta (role, aria-expanded y aria-controls) y deja de
 * seguir el enlace.
 *
 * Los botones del mapa llevan en `data-*` lo que la viñeta enseña (lugar, título, frase y enlace). La
 * viñeta es una sola: al pulsar otro botón se rellena con el suyo.
 */
import { colocarFicha } from '../lib/mapa';

/** Hueco entre el punto y la viñeta en escritorio: la mitad de la zona pulsable más un margen. */
const HUECO_VINETA_PX = 30;

/** Aire entre el botón elegido y el panel de la viñeta en el móvil. */
const BOTON_SOBRE_PANEL_PX = 16;

/** Alto de la cabecera fija (3,5rem): el botón no debe subir por debajo de ella. */
const ALTO_CABECERA_PX = 56;

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
	const vineta = elemento<HTMLElement>(raiz, '[data-vineta]');
	const pista = elemento<HTMLElement>(raiz, '[data-pista]');
	const enlace = elemento<HTMLAnchorElement>(vineta, '[data-vineta-enlace]');
	const botones = Array.from(raiz.querySelectorAll<HTMLAnchorElement>('a.boton'));
	const escritorio = window.matchMedia('(min-width: 48rem)');

	let abierto: HTMLAnchorElement | null = null;

	// ---- Viñeta ----

	function marcarAbierto(boton: HTMLAnchorElement | null): void {
		for (const otro of botones) {
			otro.setAttribute('aria-expanded', String(otro === boton));
		}
	}

	/** Pone la viñeta junto al botón (escritorio). En el móvil es un panel fijo y no se coloca. */
	function colocar(boton: HTMLAnchorElement): void {
		if (!escritorio.matches) {
			return;
		}
		const cajaRect = caja.getBoundingClientRect();
		const botonRect = boton.getBoundingClientRect();
		const sitio = colocarFicha({
			pico: {
				x: botonRect.left + botonRect.width / 2 - cajaRect.left,
				y: botonRect.top + botonRect.height / 2 - cajaRect.top,
			},
			caja: { ancho: cajaRect.width, alto: cajaRect.height },
			ficha: { ancho: vineta.offsetWidth, alto: vineta.offsetHeight },
			margen: HUECO_VINETA_PX,
		});
		vineta.style.setProperty('--vineta-izquierda', `${sitio.izquierda}px`);
		vineta.style.setProperty('--vineta-arriba', `${sitio.arriba}px`);
		vineta.style.setProperty('--cola-y', `${sitio.colaY}px`);
		vineta.dataset.lado = sitio.lado;
	}

	/**
	 * En el móvil el panel es fijo y puede tapar el botón elegido: si es así, sube la página lo justo
	 * para dejarlo a la vista encima del panel, sin pasarse de la cabecera (sin animación).
	 */
	function dejarBotonALaVista(boton: HTMLAnchorElement): void {
		if (escritorio.matches) {
			return;
		}
		const botonRect = boton.getBoundingClientRect();
		const hueco = vineta.getBoundingClientRect().top - botonRect.bottom - BOTON_SOBRE_PANEL_PX;
		const margenCabecera = botonRect.top - ALTO_CABECERA_PX - BOTON_SOBRE_PANEL_PX;
		if (hueco < 0) {
			window.scrollBy({ top: Math.min(-hueco, Math.max(0, margenCabecera)), behavior: 'instant' });
		}
	}

	function abrir(desde: HTMLAnchorElement): void {
		const titulo = desde.dataset.titulo ?? '';
		elemento<HTMLElement>(vineta, '[data-vineta-lugar]').textContent = desde.dataset.lugar ?? '';
		elemento<HTMLElement>(vineta, '[data-vineta-titulo]').textContent = titulo;
		elemento<HTMLElement>(vineta, '[data-vineta-frase]').textContent = desde.dataset.frase ?? '';
		enlace.href = desde.getAttribute('href') ?? enlace.href;
		// B-19 lee este atributo para saber a qué apartado va el enlace e interceptar el clic.
		enlace.dataset.destino = desde.dataset.destino ?? '';
		// Para el lector de pantalla el enlace dice "Entra a Repte 5 Cims", no solo "Entra".
		elemento<HTMLElement>(enlace, '[data-vineta-solo-lector]').textContent =
			` ${enlace.dataset.conector ?? ''} ${titulo}`;

		vineta.hidden = false;
		marcarAbierto(desde);
		abierto = desde;
		colocar(desde);
		dejarBotonALaVista(desde);
		vineta.focus({ preventScroll: true });
	}

	/** Cierra la viñeta y devuelve el foco al botón que la abrió. */
	function cerrar(): void {
		if (abierto === null) {
			return;
		}
		const origen = abierto;
		vineta.hidden = true;
		marcarAbierto(null);
		abierto = null;
		origen.focus({ preventScroll: true });
	}

	// Los enlaces pasan a ser botones. El `href` se queda (copiar el enlace, abrirlo en otra pestaña),
	// pero un clic normal ya no lo sigue.
	for (const boton of botones) {
		boton.setAttribute('role', 'button');
		boton.setAttribute('aria-haspopup', 'dialog');
		boton.setAttribute('aria-expanded', 'false');
		boton.setAttribute('aria-controls', vineta.id);
		boton.addEventListener('click', (evento) => {
			// Con Ctrl, Cmd, Mayús o botón del medio, el navegador abre el apartado como un enlace normal.
			if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) {
				return;
			}
			evento.preventDefault();
			if (abierto === boton) {
				cerrar();
				return;
			}
			abrir(boton);
		});
	}

	// Un enlace solo se activa con Intro; un botón también con la barra espaciadora.
	for (const boton of botones) {
		boton.addEventListener('keydown', (evento) => {
			if (evento.key === ' ') {
				evento.preventDefault();
				boton.click();
			}
		});
	}

	elemento<HTMLElement>(vineta, '[data-cerrar]').addEventListener('click', cerrar);

	document.addEventListener('keydown', (evento) => {
		if (evento.key === 'Escape' && abierto !== null) {
			cerrar();
		}
	});

	// Un clic fuera la cierra y el foco vuelve al botón que la abrió. Se hace al terminar el clic y no
	// al empezarlo: así el foco que el navegador mueve al pulsar no se lo lleva otro elemento.
	// Los botones se encargan de sí mismos. Deslizar el mapa no cierra la viñeta.
	document.addEventListener('click', (evento) => {
		if (abierto === null || !(evento.target instanceof Node)) {
			return;
		}
		const dentro = vineta.contains(evento.target);
		const enUnBoton = botones.some((boton) => boton.contains(evento.target as Node));
		if (!dentro && !enUnBoton) {
			cerrar();
		}
	});

	// Al cambiar el tamaño, la viñeta ya no estaría bien colocada.
	escritorio.addEventListener('change', cerrar);
	window.addEventListener('resize', () => {
		if (abierto !== null) {
			colocar(abierto);
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

	// Empieza en el 76 % del ancho (CENTRO_INICIAL_MARCO), no en el borde izquierdo del mapa.
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
		// Si algo falla, el mapa y la lista siguen a la vista; solo falta la viñeta.
		console.error('No se ha podido iniciar el mapa de Mariola.', error);
	}
}
