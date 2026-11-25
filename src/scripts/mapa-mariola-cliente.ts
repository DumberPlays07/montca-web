/**
 * Script del mapa de Mariola (B-21): abre y cierra la viñeta de un destino y la ficha de un pico, coloca el mapa al empezar y
 * enseña el aviso y los degradados de deslizar en el móvil. Sin animaciones.
 *
 * Sin este script cada botón del mapa es un enlace (`<a href>`) directo a su apartado. Al cargar, el
 * script los convierte en botones que abren la viñeta (role, aria-expanded y aria-controls) y deja de
 * seguir el enlace.
 *
 * Los botones del mapa llevan en `data-*` lo que la viñeta enseña (lugar, título, frase y enlace) y los
 * picos, lo de su ficha (nombre y altura). Cada panel es uno solo: al pulsar otro punto se rellena con el suyo.
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
	// Los estilos que solo tienen sentido con JavaScript (cursor y efectos de los picos) cuelgan de esta clase.
	raiz.classList.add('con-js');
	const caja = elemento<HTMLElement>(raiz, '[data-caja]');
	const marco = elemento<HTMLElement>(raiz, '[data-marco]');
	const vineta = elemento<HTMLElement>(raiz, '[data-vineta]');
	const ficha = elemento<HTMLElement>(raiz, '[data-ficha]');
	const pista = elemento<HTMLElement>(raiz, '[data-pista]');
	const enlace = elemento<HTMLAnchorElement>(vineta, '[data-vineta-enlace]');
	const botones = Array.from(raiz.querySelectorAll<HTMLAnchorElement>('a.boton'));
	const picos = Array.from(raiz.querySelectorAll<HTMLElement>('.pico'));
	// Primero los 8 destinos y después los picos: es también el orden del tabulador.
	const controles: HTMLElement[] = [...botones, ...picos];
	// Tarjeta junto al punto (escritorio, tableta y móvil apaisado) o panel fijo (móvil en vertical).
	// Tiene que coincidir con la media query de `.vineta` en MapaMariola.astro.
	const escritorio = window.matchMedia('(min-width: 48rem), (max-height: 30rem) and (orientation: landscape)');

	let abierto: HTMLElement | null = null;

	/** Los destinos abren la viñeta (con enlace al apartado); los demás picos, su ficha. */
	const panelDe = (control: HTMLElement): HTMLElement => (control.classList.contains('pico') ? ficha : vineta);

	// ---- Paneles ----

	function marcarAbierto(control: HTMLElement | null): void {
		for (const otro of controles) {
			otro.setAttribute('aria-expanded', String(otro === control));
		}
	}

	/** Pone el panel junto al punto (escritorio). En el móvil es un panel fijo y no se coloca. */
	function colocar(control: HTMLElement, panel: HTMLElement): void {
		if (!escritorio.matches) {
			return;
		}
		const cajaRect = caja.getBoundingClientRect();
		const controlRect = control.getBoundingClientRect();
		const sitio = colocarFicha({
			pico: {
				x: controlRect.left + controlRect.width / 2 - cajaRect.left,
				y: controlRect.top + controlRect.height / 2 - cajaRect.top,
			},
			caja: { ancho: cajaRect.width, alto: cajaRect.height },
			ficha: { ancho: panel.offsetWidth, alto: panel.offsetHeight },
			margen: HUECO_VINETA_PX,
		});
		panel.style.setProperty('--vineta-izquierda', `${sitio.izquierda}px`);
		panel.style.setProperty('--vineta-arriba', `${sitio.arriba}px`);
		panel.style.setProperty('--cola-y', `${sitio.colaY}px`);
		panel.dataset.lado = sitio.lado;
	}

	/**
	 * En el móvil el panel es fijo y puede tapar el punto elegido: si es así, sube la página lo justo
	 * para dejarlo a la vista encima del panel, sin pasarse de la cabecera (sin animación).
	 */
	function dejarPuntoALaVista(control: HTMLElement, panel: HTMLElement): void {
		if (escritorio.matches) {
			return;
		}
		const controlRect = control.getBoundingClientRect();
		const hueco = panel.getBoundingClientRect().top - controlRect.bottom - BOTON_SOBRE_PANEL_PX;
		const margenCabecera = controlRect.top - ALTO_CABECERA_PX - BOTON_SOBRE_PANEL_PX;
		if (hueco < 0) {
			window.scrollBy({ top: Math.min(-hueco, Math.max(0, margenCabecera)), behavior: 'instant' });
		}
	}

	/** El nombre del sitio es el título del panel; si es un pico, lleva la altura detrás ("Montcabrer · 1.390 m"). */
	function ponerNombre(nombre: HTMLElement, conAltura: HTMLElement, desde: HTMLElement): void {
		nombre.textContent = desde.dataset.lugar ?? desde.dataset.nombre ?? '';
		const altura = desde.dataset.altura ?? '';
		conAltura.hidden = altura === '';
		elemento<HTMLElement>(conAltura, '[data-vineta-altura], [data-ficha-altura]').textContent = altura;
	}

	function rellenar(desde: HTMLElement, panel: HTMLElement): void {
		if (panel === ficha) {
			ponerNombre(
				elemento<HTMLElement>(ficha, '[data-ficha-nombre]'),
				elemento<HTMLElement>(ficha, '.con-altura'),
				desde,
			);
			return;
		}
		const titulo = desde.dataset.titulo ?? '';
		ponerNombre(
			elemento<HTMLElement>(vineta, '[data-vineta-lugar]'),
			elemento<HTMLElement>(vineta, '[data-vineta-con-altura]'),
			desde,
		);
		elemento<HTMLElement>(vineta, '[data-vineta-titulo]').textContent = titulo;
		elemento<HTMLElement>(vineta, '[data-vineta-frase]').textContent = desde.dataset.frase ?? '';
		enlace.href = desde.getAttribute('href') ?? enlace.href;
		// B-19 lee este atributo para saber a qué apartado va el enlace e interceptar el clic.
		enlace.dataset.destino = desde.dataset.destino ?? '';
		// Para el lector de pantalla el enlace dice "Entra a Repte 5 Cims", no solo "Entra".
		elemento<HTMLElement>(enlace, '[data-vineta-solo-lector]').textContent =
			` ${enlace.dataset.conector ?? ''} ${titulo}`;
	}

	function abrir(desde: HTMLElement): void {
		const panel = panelDe(desde);
		// Solo hay un panel abierto: si estaba abierto el otro, se cierra.
		for (const otro of [vineta, ficha]) {
			otro.hidden = otro !== panel;
		}
		rellenar(desde, panel);
		marcarAbierto(desde);
		abierto = desde;
		colocar(desde, panel);
		dejarPuntoALaVista(desde, panel);
		panel.focus({ preventScroll: true });
	}

	/** Cierra el panel y devuelve el foco al punto que lo abrió. */
	function cerrar(): void {
		if (abierto === null) {
			return;
		}
		const origen = abierto;
		vineta.hidden = true;
		ficha.hidden = true;
		marcarAbierto(null);
		abierto = null;
		origen.focus({ preventScroll: true });
	}

	function alternar(control: HTMLElement): void {
		if (abierto === control) {
			cerrar();
			return;
		}
		abrir(control);
	}

	// Los enlaces de los destinos pasan a ser botones. El `href` se queda (copiar el enlace, abrirlo en
	// otra pestaña), pero un clic normal ya no lo sigue.
	for (const boton of botones) {
		boton.setAttribute('role', 'button');
		boton.addEventListener('click', (evento) => {
			// Con Ctrl, Cmd, Mayús o Alt, el navegador abre el apartado como un enlace normal.
			if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) {
				return;
			}
			evento.preventDefault();
			alternar(boton);
		});
	}

	// Los picos salen en el HTML como puntos sin función (sin JavaScript no hay ficha que abrir): el
	// script los convierte en botones con nombre accesible, que se enfocan con el tabulador.
	for (const pico of picos) {
		pico.setAttribute('role', 'button');
		pico.setAttribute('tabindex', '0');
		pico.setAttribute('aria-label', `${pico.dataset.nombre ?? ''}, ${pico.dataset.altura ?? ''}`);
		pico.addEventListener('click', () => alternar(pico));
		pico.addEventListener('keydown', (evento) => {
			if (evento.key === 'Enter') {
				evento.preventDefault();
				alternar(pico);
			}
		});
	}

	for (const control of controles) {
		control.setAttribute('aria-haspopup', 'dialog');
		control.setAttribute('aria-expanded', 'false');
		control.setAttribute('aria-controls', panelDe(control).id);
		// Un enlace solo se activa con Intro; un botón también con la barra espaciadora.
		control.addEventListener('keydown', (evento) => {
			if (evento.key === ' ') {
				evento.preventDefault();
				alternar(control);
			}
		});
	}

	for (const panel of [vineta, ficha]) {
		elemento<HTMLElement>(panel, '[data-cerrar]').addEventListener('click', cerrar);
	}

	document.addEventListener('keydown', (evento) => {
		if (evento.key === 'Escape' && abierto !== null) {
			cerrar();
		}
	});

	// Un clic fuera la cierra y el foco vuelve al punto que la abrió. Se hace al terminar el clic y no
	// al empezarlo: así el foco que el navegador mueve al pulsar no se lo lleva otro elemento.
	// Los puntos se encargan de sí mismos. Deslizar el mapa no cierra el panel.
	document.addEventListener('click', (evento) => {
		if (abierto === null || !(evento.target instanceof Node)) {
			return;
		}
		const destino = evento.target;
		const dentro = vineta.contains(destino) || ficha.contains(destino);
		const enUnControl = controles.some((control) => control.contains(destino));
		if (!dentro && !enUnControl) {
			cerrar();
		}
	});

	// Al cambiar el tamaño, el panel ya no estaría bien colocado.
	escritorio.addEventListener('change', cerrar);
	window.addEventListener('resize', () => {
		if (abierto !== null) {
			colocar(abierto, panelDe(abierto));
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
