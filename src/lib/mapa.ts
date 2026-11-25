/**
 * Lógica pura del mapa de Mariola (B-19): posición de los picos sobre la imagen recortada,
 * tamaño de su zona pulsable, orden y formato, y dónde se coloca la ficha.
 *
 * Los picos viven en `src/data/picos-mapa.json` con su posición en % de la imagen ENTERA
 * (`x`, `y`). La web enseña solo una parte de la imagen (se recorta el cielo de arriba y la franja
 * casi blanca de abajo) y estas funciones traducen esas posiciones al recorte.
 */

/**
 * Parte de arriba de la imagen que NO se enseña, entre 0 y 1: el cielo, que a 30 % de la altura ya
 * se funde con el fondo Boira de la página. Para enseñar más o menos cielo, se cambia aquí: los picos
 * y la proporción del mapa se recalculan solos.
 */
export const RECORTE_SUPERIOR = 0.3;

/** Parte de abajo de la imagen que NO se enseña, entre 0 y 1: la franja casi blanca bajo el diorama. */
export const RECORTE_INFERIOR = 0.05;

/** La zona pulsable de un pico mide como mucho 44 px (principio V de la constitución). */
export const LADO_MAXIMO_ZONA_PULSABLE = 44;

/** ...y nunca menos de 24 px: el mínimo de WCAG 2.2 (2.5.8). */
export const LADO_MINIMO_ZONA_PULSABLE = 24;

export interface Recorte {
	superior: number;
	inferior: number;
}

const RECORTE_POR_DEFECTO: Recorte = { superior: RECORTE_SUPERIOR, inferior: RECORTE_INFERIOR };

/** Un pico tal como está en `picos-mapa.json`. */
export interface PicoEnCrudo {
	nombre: string;
	altura: number;
	/** % del ancho de la imagen entera. */
	x: number;
	/** % del alto de la imagen entera. */
	y: number;
	visible: boolean;
}

/** Un pico listo para pintar: posición dentro del recorte y tamaño de su zona pulsable. */
export interface PicoPreparado {
	id: string;
	nombre: string;
	altura: number;
	/** % del ancho del mapa. */
	izquierda: number;
	/** % del alto del mapa ya recortado. */
	arriba: number;
	/**
	 * Distancia al pico más cercano como fracción del ancho del mapa. Multiplicada por el ancho
	 * en píxeles da la distancia en píxeles, y de ella sale el lado de su zona pulsable.
	 */
	vecino: number;
}

/** Posición vertical (en % del alto de la imagen entera) pasada a % del alto del recorte. */
export function yEnRecorte(y: number, recorte: Recorte = RECORTE_POR_DEFECTO): number {
	const porcentaje = ((y - recorte.superior * 100) / ((1 - recorte.superior - recorte.inferior) * 100)) * 100;
	// Redondeado para que los bordes del recorte den justo 0 y 100 y no 100,00000000000003.
	return Number(porcentaje.toFixed(6));
}

/** Ancho entre alto de la parte visible de la imagen. */
export function proporcionRecortada(
	anchoImagen: number,
	altoImagen: number,
	recorte: Recorte = RECORTE_POR_DEFECTO,
): number {
	return anchoImagen / (altoImagen * (1 - recorte.superior - recorte.inferior));
}

/** Texto para el identificador de un pico: "el Portell de Just d'Alfafara" → "el-portell-de-just-d-alfafara". */
export function idDePico(nombre: string): string {
	return nombre
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** "1.390 m". El punto como separador de miles va igual en valenciano y en castellano. */
export function formatoAltura(metros: number): string {
	return `${String(metros).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} m`;
}

/** Del más alto al más bajo, sin cambiar la lista que recibe. */
export function ordenarPorAltura<T extends { altura: number }>(picos: T[]): T[] {
	return [...picos].sort((a, b) => b.altura - a.altura);
}

/**
 * Distancia de `pico` al pico más cercano, como fracción del ancho del mapa. Se mide sobre la
 * imagen entera (el recorte no cambia las distancias). Un pico solo no tiene vecino: devuelve 1.
 */
export function vecinoMasCercano(
	pico: { x: number; y: number },
	todos: { x: number; y: number }[],
	anchoImagen: number,
	altoImagen: number,
): number {
	const proporcionAlto = altoImagen / anchoImagen;
	let minimo = Number.POSITIVE_INFINITY;
	for (const otro of todos) {
		if (otro === pico) {
			continue;
		}
		const dx = (otro.x - pico.x) / 100;
		const dy = ((otro.y - pico.y) / 100) * proporcionAlto;
		minimo = Math.min(minimo, Math.hypot(dx, dy));
	}
	return Number.isFinite(minimo) ? minimo : 1;
}

/**
 * Lado en píxeles de la zona pulsable de un pico con el mapa a `anchoMapa` px: 44 px, o menos si el
 * vecino está más cerca (para que las zonas no se tapen), pero nunca menos de 24 px.
 */
export function zonaPulsable(vecino: number, anchoMapa: number): number {
	return Math.min(LADO_MAXIMO_ZONA_PULSABLE, Math.max(LADO_MINIMO_ZONA_PULSABLE, vecino * anchoMapa));
}

/** Los picos visibles, con su posición en el recorte y su vecino, por orden de altura. */
export function preparar(
	picos: PicoEnCrudo[],
	anchoImagen: number,
	altoImagen: number,
	recorte: Recorte = RECORTE_POR_DEFECTO,
): PicoPreparado[] {
	const visibles = picos.filter((pico) => pico.visible);
	return ordenarPorAltura(visibles).map((pico) => ({
		id: idDePico(pico.nombre),
		nombre: pico.nombre,
		altura: pico.altura,
		izquierda: pico.x,
		arriba: Number(yEnRecorte(pico.y, recorte).toFixed(3)),
		vecino: Number(vecinoMasCercano(pico, visibles, anchoImagen, altoImagen).toFixed(5)),
	}));
}

/**
 * Dónde pone la ficha, en píxeles dentro de la caja del mapa (solo escritorio): a la derecha del
 * pico, o a la izquierda si a la derecha se saldría; centrada en vertical con el pico y sin salirse
 * por arriba ni por abajo.
 */
export function colocarFicha(entrada: {
	pico: { x: number; y: number };
	caja: { ancho: number; alto: number };
	ficha: { ancho: number; alto: number };
	margen: number;
}): { izquierda: number; arriba: number } {
	const { pico, caja, ficha, margen } = entrada;
	const aLaDerecha = pico.x + margen + ficha.ancho <= caja.ancho;
	const izquierdaDeseada = aLaDerecha ? pico.x + margen : pico.x - margen - ficha.ancho;
	const izquierda = Math.max(0, Math.min(izquierdaDeseada, caja.ancho - ficha.ancho));
	const arribaDeseada = pico.y - ficha.alto / 2;
	const arriba = Math.max(0, Math.min(arribaDeseada, caja.alto - ficha.alto));
	return { izquierda, arriba };
}
