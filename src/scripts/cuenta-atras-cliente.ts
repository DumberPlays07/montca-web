/**
 * Script de la cuenta atrás de la portada (B-13). La web es estática: la página trae la cuenta del
 * día en que se construyó y este script la vuelve a calcular con la hora del momento, igual que
 * `eventos-cliente.ts` con el estado de los eventos.
 *
 * No hay región `aria-live`: el lector de pantalla no anuncia los cambios, solo lee el texto
 * cuando el visitante llega a la pieza.
 */
import { textosCuentaAtras } from '../components/cuenta-atras-textos';
import type { Idioma } from '../components/textos-navegacion';
import { t } from '../components/textos-portada';
import { type CuentaAtras, calcularCuentaAtras } from '../lib/eventos/cuenta-atras';

/** Cada minuto basta para que la cuenta cambie a su hora si la página se queda abierta. */
const INTERVALO_COMPROBACION_MS = 60_000;

/** El texto de un elemento que la pieza siempre trae; si falta, es un fallo de la página. */
function pieza(raiz: HTMLElement, selector: string): HTMLElement {
	const encontrada = raiz.querySelector<HTMLElement>(selector);
	if (encontrada === null) {
		throw new Error(`Falta ${selector} en la cuenta atrás.`);
	}
	return encontrada;
}

function pintar(raiz: HTMLElement, lang: Idioma, cuenta: CuentaAtras, diaMes: string): void {
	const textos = textosCuentaAtras(lang, cuenta, diaMes);
	raiz.dataset.tipo = cuenta.tipo;
	pieza(raiz, '[data-prefijo]').textContent = textos.prefijo;
	pieza(raiz, '[data-valor]').textContent = textos.valor;
	pieza(raiz, '[data-unidad]').textContent = textos.unidad;
	pieza(raiz, '[data-detalle]').textContent = textos.detalle;
	if (cuenta.tipo === 'proximament') {
		// El evento ya terminó con la página abierta: se queda "Properament", sin nombre ni enlace.
		pieza(raiz, '[data-marca]').textContent = t(lang, 'cuentaMarcaFija');
		raiz.querySelectorAll('[data-nombre-evento]').forEach((parte) => parte.remove());
		raiz.removeAttribute('href');
	}
}

function iniciar(raiz: HTMLElement): void {
	const { inicio, fin, lang } = raiz.dataset;
	// Sin fechas no había evento al construir: ya sale "Properament" y no hay nada que recalcular.
	if (!inicio || !fin || (lang !== 'ca' && lang !== 'es')) {
		return;
	}
	const evento = { jornadas: [{ fecha: inicio }, { fecha: fin }] };
	const [, mes, dia] = inicio.split('-');
	const actualizar = () => pintar(raiz, lang, calcularCuentaAtras(evento, new Date()), `${dia}/${mes}`);
	actualizar();
	const temporizador = window.setInterval(() => {
		actualizar();
		if (raiz.dataset.tipo === 'proximament') {
			window.clearInterval(temporizador);
		}
	}, INTERVALO_COMPROBACION_MS);
}

document.querySelectorAll<HTMLElement>('[data-cuenta-atras]').forEach(iniciar);
