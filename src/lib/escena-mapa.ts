/**
 * Escena de entrada del mapa (B-22): el sendero en zigzag de los excursionistas, sus keyframes y los
 * tiempos de cada pieza de la escena. Las reglas están en DESIGN.md (Movimiento → Escena de entrada de la
 * portada); el dibujo y el CSS, en `src/components/EscenaMapa.astro`.
 *
 * El sendero y los excursionistas viven en `src/data/escena-mapa.json`. Los puntos del sendero van en % de
 * la imagen entera, como los picos (en la imagen no hay sendero dibujado: es un camino invisible que sube del
 * valle a la ladera clara del castillo). Cada excursionista recorre un trozo del sendero, dado como fracción
 * de su largo (0 = salida, 1 = final), así que vale igual a cualquier ancho del mapa.
 *
 * Las pruebas (`destinos-mapa.test.ts`) simulan el paseo con estas mismas funciones.
 */
import { type Recorte, type Rectangulo, yEnRecorte } from './mapa.ts';

/** Lo que mide la figura de un excursionista (px): cabeza, torso, mochila, piernas y bastón. */
export const ANCHO_EXCURSIONISTA = 10;
export const ALTO_EXCURSIONISTA = 20;

/** Lo que sube la figura en cada paso (px). */
export const BALANCEO_PASO = 1.5;

/** `--curva-escena` de global.css: ease-in-out suave (seno). Las pruebas comprueban que es la misma. */
export const CURVA_ESCENA: [number, number, number, number] = [0.37, 0, 0.63, 1];

/** Tiempos (ms) de lo que no son los excursionistas. Boira y brisa dentro de los primeros 1.600 ms. */
export const TIEMPOS = {
	boiraBaja: { empieza: 0, dura: 900 },
	boiraAlta: { empieza: 0, dura: 750 },
	rafaga1: { empieza: 300, dura: 600 },
	rafaga2: { empieza: 700, dura: 600 },
	pajaros: { empieza: 200, dura: 4000 },
};

/** Aleteo de cada pájaro: un número fijo de aleteos y luego planean; cada uno con su desfase (ms). */
export const ALETEO = { dura: 450, veces: 8, desfases: [0, 120, 60, 200, 160] };

/** Límites de la escena (ms): WCAG 2.2.2 pide un botón de pausa si algo se mueve solo más de 5 s. */
export const FIN_MAXIMO_ESCENA = 4900;
export const FIN_MAXIMO_BOIRA_Y_BRISA = 1600;

export type ColorTorso = 'roig-motxilla' | 'blau-cantimplora' | 'morat-bruc';
export type ColorPell = 'pell-clara' | 'pell-bruna' | 'pell-fosca';

export interface Punto {
	x: number;
	y: number;
}

/** Un excursionista tal como está en `escena-mapa.json`. */
export interface ExcursionistaEnCrudo {
	id: string;
	torso: ColorTorso;
	pell: ColorPell;
	/** Fracción del sendero donde está al empezar y donde se queda (0 = salida, 1 = final). */
	desde: number;
	hasta: number;
	/** Cuándo echa a andar y cuánto camina (ms). */
	empieza: number;
	dura: number;
	/** Pasos de balanceo: uno detrás de otro, acaban justo al llegar. */
	pasos: number;
}

export interface EscenaEnCruda {
	/** Puntos del sendero en % de la imagen entera (x del ancho, y del alto). */
	sendero: Punto[];
	excursionistas: ExcursionistaEnCrudo[];
}

/** Un punto del paseo: `offset` es la fracción del tiempo de la animación (0 a 1). */
export interface Fotograma extends Punto {
	offset: number;
}

/** Un excursionista listo para el componente: puntos del keyframe en % del recorte y su sitio final. */
export interface Excursionista extends ExcursionistaEnCrudo {
	fotogramas: Fotograma[];
	final: Punto;
}

/** El sendero pasado al recorte (% del ancho y del alto del mapa ya recortado). */
export function senderoEnRecorte(sendero: Punto[], recorte?: Recorte): Punto[] {
	return sendero.map((p) => ({ x: p.x, y: Number(yEnRecorte(p.y, recorte).toFixed(3)) }));
}

/** Largo de un tramo en % del ancho del mapa: el alto se pasa a la misma unidad con la proporción. */
function largoTramo(a: Punto, b: Punto, proporcion: number): number {
	return Math.hypot(b.x - a.x, (b.y - a.y) / proporcion);
}

/** Lo que mide el sendero hasta cada punto, en % del ancho del mapa (el primero, 0). */
function acumulados(sendero: Punto[], proporcion: number): number[] {
	const lista = [0];
	for (let i = 1; i < sendero.length; i++) {
		lista.push(lista[i - 1] + largoTramo(sendero[i - 1], sendero[i], proporcion));
	}
	return lista;
}

/** El punto del sendero a una fracción de su largo. */
export function puntoEnSendero(sendero: Punto[], fraccion: number, proporcion: number): Punto {
	const hasta = acumulados(sendero, proporcion);
	const objetivo = fraccion * hasta[hasta.length - 1];
	for (let i = 1; i < sendero.length; i++) {
		if (objetivo <= hasta[i] || i === sendero.length - 1) {
			const tramo = hasta[i] - hasta[i - 1];
			const u = tramo === 0 ? 0 : Math.min(1, Math.max(0, (objetivo - hasta[i - 1]) / tramo));
			const [a, b] = [sendero[i - 1], sendero[i]];
			return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
		}
	}
	return sendero[0];
}

/**
 * Los puntos del keyframe de un excursionista: donde empieza, cada giro del sendero que pasa y donde se
 * queda. El `offset` de cada uno es proporcional a lo andado, así que la velocidad media es la misma en
 * todos los tramos (la curva hace que frene en cada giro).
 */
export function fotogramasDe(crudo: ExcursionistaEnCrudo, sendero: Punto[], proporcion: number): Fotograma[] {
	const hasta = acumulados(sendero, proporcion);
	const total = hasta[hasta.length - 1];
	const [inicio, fin] = [crudo.desde * total, crudo.hasta * total];
	const puntos: { distancia: number; punto: Punto }[] = [{ distancia: inicio, punto: puntoEnSendero(sendero, crudo.desde, proporcion) }];
	sendero.forEach((punto, i) => {
		if (hasta[i] > inicio && hasta[i] < fin) {
			puntos.push({ distancia: hasta[i], punto });
		}
	});
	puntos.push({ distancia: fin, punto: puntoEnSendero(sendero, crudo.hasta, proporcion) });
	return puntos.map(({ distancia, punto }) => ({
		offset: Number(((distancia - inicio) / (fin - inicio)).toFixed(4)),
		x: Number(punto.x.toFixed(3)),
		y: Number(punto.y.toFixed(3)),
	}));
}

/** Prepara los excursionistas para el componente y las pruebas. */
export function prepararExcursionistas(escena: EscenaEnCruda, proporcion: number, recorte?: Recorte): Excursionista[] {
	const sendero = senderoEnRecorte(escena.sendero, recorte);
	return escena.excursionistas.map((crudo) => {
		const fotogramas = fotogramasDe(crudo, sendero, proporcion);
		const ultimo = fotogramas[fotogramas.length - 1];
		return { ...crudo, fotogramas, final: { x: ultimo.x, y: ultimo.y } };
	});
}

/**
 * El `@keyframes` del paseo de un excursionista. Cada punto se escribe como desplazamiento desde su sitio
 * final, en unidades de la escena (`cqw` y `cqh`: 1 % de su ancho y de su alto), así que el último es
 * `translate(0, 0)`. Si el navegador no las entiende, la animación no vale y se queda en su sitio final.
 */
export function keyframesDe(excursionista: Excursionista): string {
	const { final } = excursionista;
	const pasos = excursionista.fotogramas
		.map((f) => {
			const dx = Number((f.x - final.x).toFixed(3));
			const dy = Number((f.y - final.y).toFixed(3));
			return `${Number((f.offset * 100).toFixed(2))}%{transform:translate(${dx}cqw,${dy}cqh)}`;
		})
		.join('');
	return `@keyframes ${nombreAnimacion(excursionista)}{${pasos}}`;
}

/** Nombre del `@keyframes` del paseo de un excursionista. */
export function nombreAnimacion(excursionista: Pick<Excursionista, 'id'>): string {
	return `escena-excursionista-${excursionista.id}`;
}

/** Una curva `cubic-bezier` como función de 0–1 en 0–1, igual que la calcula el navegador. */
export function curvaBezier([x1, y1, x2, y2]: [number, number, number, number]): (u: number) => number {
	const coord = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s ** 2 * (1 - s) + s ** 3;
	return (u: number) => {
		if (u <= 0 || u >= 1) {
			return Math.min(1, Math.max(0, u));
		}
		// x(s) crece con s: se busca por bisección el s que da este x.
		let [bajo, alto] = [0, 1];
		for (let i = 0; i < 40; i++) {
			const medio = (bajo + alto) / 2;
			if (coord(x1, x2, medio) < u) {
				bajo = medio;
			} else {
				alto = medio;
			}
		}
		return coord(y1, y2, (bajo + alto) / 2);
	};
}

const curvaEscena = curvaBezier(CURVA_ESCENA);

/**
 * Dónde está un excursionista (% del recorte) a `ms` de cargar la página: quieto en su salida hasta que
 * empieza, por tramos con la curva de la escena (se aplica a cada tramo, como hace el CSS) y quieto al final.
 */
export function posicionEn(excursionista: Excursionista, ms: number): Punto {
	const { fotogramas } = excursionista;
	const progreso = Math.min(1, Math.max(0, (ms - excursionista.empieza) / excursionista.dura));
	for (let i = 1; i < fotogramas.length; i++) {
		const [a, b] = [fotogramas[i - 1], fotogramas[i]];
		if (progreso <= b.offset) {
			const u = curvaEscena((progreso - a.offset) / (b.offset - a.offset));
			return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u };
		}
	}
	return excursionista.final;
}

/** Lo que ocupa la figura (px) en un punto del recorte, contando lo que sube al dar un paso. */
export function rectanguloExcursionista(punto: Punto, anchoMapa: number, altoMapa: number): Rectangulo {
	const x = (punto.x / 100) * anchoMapa;
	const y = (punto.y / 100) * altoMapa;
	return {
		izquierda: x - ANCHO_EXCURSIONISTA / 2,
		arriba: y - ALTO_EXCURSIONISTA / 2 - BALANCEO_PASO,
		ancho: ANCHO_EXCURSIONISTA,
		alto: ALTO_EXCURSIONISTA + BALANCEO_PASO,
	};
}

/** Cuándo acaba cada pieza de la escena (ms), con el último paso y el último aleteo. */
export function finales(excursionistas: ExcursionistaEnCrudo[]): Record<string, number> {
	const resultado: Record<string, number> = {};
	for (const [nombre, { empieza, dura }] of Object.entries(TIEMPOS)) {
		resultado[nombre] = empieza + dura;
	}
	resultado.aleteo = TIEMPOS.pajaros.empieza + Math.max(...ALETEO.desfases) + ALETEO.dura * ALETEO.veces;
	for (const e of excursionistas) {
		resultado[`paseo-${e.id}`] = e.empieza + e.dura;
		resultado[`pasos-${e.id}`] = e.empieza + (e.dura / e.pasos) * e.pasos;
	}
	return resultado;
}
