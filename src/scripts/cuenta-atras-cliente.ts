/**
 * Script de la cuenta atrás de la portada (B-13, #102). La web es estática: la página trae la cuenta
 * del día en que se construyó y este script la vuelve a calcular con la hora del momento, igual que
 * `eventos-cliente.ts` con el estado de los eventos.
 *
 * Se actualiza cada segundo; con `prefers-reduced-motion` cada minuto y sin la casilla de segundos
 * (la oculta el CSS). No hay región `aria-live`: las casillas van con `aria-hidden` y la frase que
 * oye el lector solo cambia al cambiar de día.
 */
import { textosCuentaAtras } from '../components/cuenta-atras-textos';
import type { Idioma } from '../components/textos-navegacion';
import { t } from '../components/textos-portada';
import { type CuentaAtras, calcularCuentaAtras, casillasCuenta } from '../lib/eventos/cuenta-atras';

const INTERVALO_SEGUNDO_MS = 1_000;
const INTERVALO_MINUTO_MS = 60_000;

/** Un elemento que la pieza siempre trae; si falta, es un fallo de la página, no del usuario. */
function pieza(raiz: HTMLElement, selector: string): HTMLElement {
	const encontrada = raiz.querySelector<HTMLElement>(selector);
	if (encontrada === null) {
		throw new Error(`Falta ${selector} en la cuenta atrás.`);
	}
	return encontrada;
}

/** Escribe `texto` solo si cambia: así el navegador no repinta cada segundo lo que sigue igual. */
function escribir(elemento: HTMLElement, texto: string): void {
	if (elemento.textContent !== texto) {
		elemento.textContent = texto;
	}
}

function pintar(raiz: HTMLElement, lang: Idioma, cuenta: CuentaAtras, diaMes: string, hora?: string): void {
	const textos = textosCuentaAtras(lang, cuenta, diaMes, hora);
	raiz.dataset.tipo = cuenta.tipo;
	escribir(pieza(raiz, '[data-frase]'), textos.frase);
	escribir(pieza(raiz, '[data-valor]'), textos.valor);
	escribir(pieza(raiz, '[data-detalle]'), textos.detalle);
	if (cuenta.tipo === 'cuenta') {
		const casillas = casillasCuenta(cuenta);
		for (const [clave, texto] of Object.entries(casillas)) {
			escribir(pieza(raiz, `[data-casilla="${clave}"]`), texto);
		}
	}
	if (cuenta.tipo === 'proximament') {
		// El evento ya terminó con la página abierta: se queda "Properament", sin nombre ni enlace.
		escribir(pieza(raiz, '[data-marca]'), t(lang, 'cuentaMarcaFija'));
		raiz.querySelectorAll('[data-nombre-evento]').forEach((parte) => parte.remove());
		raiz.removeAttribute('href');
	}
}

function iniciar(raiz: HTMLElement): void {
	const { inicio, fin, hora, lang } = raiz.dataset;
	// Sin fechas no había evento al construir: ya sale "Properament" y no hay nada que recalcular.
	if (!inicio || !fin || (lang !== 'ca' && lang !== 'es')) {
		return;
	}
	const evento = { jornadas: [{ fecha: inicio, hora }, { fecha: fin }] };
	const [, mes, dia] = inicio.split('-');
	const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
	let temporizador: number | undefined;

	const actualizar = () => {
		pintar(raiz, lang, calcularCuentaAtras(evento, new Date()), `${dia}/${mes}`, hora);
		if (raiz.dataset.tipo === 'proximament') {
			window.clearInterval(temporizador);
		}
	};
	const arrancar = () => {
		window.clearInterval(temporizador);
		actualizar();
		if (raiz.dataset.tipo !== 'proximament') {
			temporizador = window.setInterval(
				actualizar,
				movimientoReducido.matches ? INTERVALO_MINUTO_MS : INTERVALO_SEGUNDO_MS,
			);
		}
	};

	arrancar();
	// Si el visitante cambia el ajuste con la página abierta, cambia el ritmo sin recargar.
	movimientoReducido.addEventListener('change', arrancar);
	// Una pestaña en segundo plano frena sus temporizadores: al volver se pone al día enseguida.
	document.addEventListener('visibilitychange', () => {
		if (!document.hidden) {
			actualizar();
		}
	});
}

document.querySelectorAll<HTMLElement>('[data-cuenta-atras]').forEach(iniciar);
