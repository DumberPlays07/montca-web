/**
 * Lógica pura del mapa de Mariola como menú (B-21): posición de los destinos y de los demás picos sobre
 * la imagen recortada, geometría de sus zonas y placas, y dónde se coloca la viñeta o la ficha.
 *
 * Los picos viven en `src/data/picos-mapa.json` con su posición en % de la imagen ENTERA
 * (`x`, `y`) y los destinos en `src/data/destinos-mapa.json`. La web enseña solo una parte de la
 * imagen (se recorta el cielo de arriba y la franja casi blanca de abajo) y estas funciones traducen
 * esas posiciones al recorte.
 */

/**
 * Parte de arriba de la imagen que NO se enseña, entre 0 y 1: el cielo, que a 30 % de la altura ya
 * se funde con el fondo Boira de la página. Para enseñar más o menos cielo, se cambia aquí: los picos
 * y la proporción del mapa se recalculan solos.
 */
export const RECORTE_SUPERIOR = 0.3;

/** Parte de abajo de la imagen que NO se enseña, entre 0 y 1: la franja casi blanca bajo el diorama. */
export const RECORTE_INFERIOR = 0.05;

/**
 * Ancho mínimo del mapa en rem (56rem = 896 px). Por debajo, el mapa no se encoge: se desliza dentro
 * de su marco. Con este ancho los siete botones están a más de 44 px unos de otros.
 */
export const ANCHO_MINIMO_MAPA_REM = 56;

/**
 * Dónde se centra el marco al cargar en el móvil, como fracción del ancho del mapa. Con 0,76 se ven
 * enteros Montcabrer, Castell y Cocentaina desde 320 px de pantalla (con 0,75 la placa del Castell
 * se cortaba 4 px a 320 px). Santa Maria, Replana y Morro del Porc aparecen al deslizar.
 */
export const CENTRO_INICIAL_MARCO = 0.76;

/** Lado de la zona pulsable del punto de un botón: 44 px, el principio V de la constitución. */
export const LADO_ZONA_BOTON = 44;

/**
 * Alto de la placa de un botón: una sola línea con el destino, en letra Label. Es pulsable, pero el
 * botón entero (la zona de 44 px del punto más la placa) sigue cumpliendo los 44 px del principio V.
 */
export const ALTO_PLACA = 24;

/** La zona pulsable de un pico mide como mucho 44 px (principio V de la constitución)... */
export const LADO_MAXIMO_ZONA_PULSABLE = LADO_ZONA_BOTON;

/** ...y nunca menos de 24 px: el mínimo de WCAG 2.2 (2.5.8). Excepción vigente, ver docs/decisiones.md. */
export const LADO_MINIMO_ZONA_PULSABLE = 24;

/** Cuánto se mete la placa en la zona del punto, para que quede pegada a él. */
export const SOLAPE_PLACA = 6;

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

export type LadoPlaca = 'arriba' | 'abajo' | 'derecha' | 'izquierda';
export type IdiomaDestino = 'ca' | 'es';

/** Textos de un destino en un idioma (placa, viñeta y lista). */
export interface TextosDestino {
	/** Nombre del sitio: va en el nombre accesible del botón y en la lista, no en la placa. "Montcabrer". */
	nombre: string;
	/** Lo único que dice la placa: el destino, en una línea. "Repte 5 Cims". */
	placaDestino: string;
	/** Lugar de la viñeta, algo más largo que el de la placa: "Castell de Cocentaina". */
	lugar: string;
	/** Apartado al que lleva: el `h3` de la viñeta y el enlace de la lista. */
	titulo: string;
	frase: string;
}

/** Un destino tal como está en `destinos-mapa.json`: lleva `pico` o bien `x` e `y`. */
export interface DestinoEnCrudo {
	id: string;
	/** Nombre del pico en `picos-mapa.json`, de donde salen su x e y. */
	pico?: string;
	/** % del ancho de la imagen entera (solo Castell y Cocentaina). */
	x?: number;
	/** % del alto de la imagen entera (solo Castell y Cocentaina). */
	y?: number;
	lado: LadoPlaca;
	/**
	 * Cuánto se desplaza la placa a lo largo de su lado, en px (negativo: a la izquierda o arriba).
	 * Solo para separarla de la placa de un botón vecino; sin él, va centrada con el punto.
	 */
	desplazamiento?: number;
	/** Clave de `ruta()` en `textos-navegacion.ts`. */
	ruta: string;
	textos: Record<IdiomaDestino, TextosDestino>;
}

/** Un destino listo para pintar: posición dentro del recorte y orden de abajo arriba. */
export interface DestinoPreparado {
	id: string;
	/** 0 el primero (el de más abajo). Es el orden del HTML, del tabulador y de la lista. */
	orden: number;
	/** % del ancho del mapa. */
	izquierda: number;
	/** % del alto del mapa ya recortado. */
	arriba: number;
	/** Altura en metros si el destino es un pico (va en el título de su viñeta); Castell y Cocentaina no la llevan. */
	altura?: number;
	/** Posición en % de la imagen ENTERA, para medir distancias a los picos. */
	xImagen: number;
	yImagen: number;
	lado: LadoPlaca;
	desplazamiento: number;
	ruta: string;
	textos: Record<IdiomaDestino, TextosDestino>;
}

/** Un pico sin botón de destino, listo para pintar: punto pequeño con su ficha de nombre y altura. */
export interface PicoPreparado {
	id: string;
	nombre: string;
	altura: number;
	/** % del ancho del mapa. */
	izquierda: number;
	/** % del alto del mapa ya recortado. */
	arriba: number;
	/** Distancia al pico más cercano, como fracción del ancho del mapa. */
	vecino: number;
	/** Distancia al botón de destino más cercano, como fracción del ancho del mapa. */
	vecinoBoton: number;
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
 * Distancia de `punto` al más cercano de `otros`, como fracción del ancho del mapa. Se mide sobre la
 * imagen entera (el recorte no cambia las distancias). Sin otros, devuelve 1.
 */
export function vecinoMasCercano(
	punto: { x: number; y: number },
	otros: { x: number; y: number }[],
	anchoImagen: number,
	altoImagen: number,
): number {
	const proporcionAlto = altoImagen / anchoImagen;
	let minimo = Number.POSITIVE_INFINITY;
	for (const otro of otros) {
		if (otro === punto) {
			continue;
		}
		const dx = (otro.x - punto.x) / 100;
		const dy = ((otro.y - punto.y) / 100) * proporcionAlto;
		minimo = Math.min(minimo, Math.hypot(dx, dy));
	}
	return Number.isFinite(minimo) ? minimo : 1;
}

/**
 * Lado en píxeles de la zona pulsable de un pico con el mapa a `anchoMapa` px: 44 px, o menos si otro
 * pico está más cerca (para que las dos zonas no se tapen) o si un botón de destino, que mide siempre
 * 44 px, está más cerca de la mitad de su zona; pero nunca menos de 24 px. Ese mínimo es la excepción
 * al principio V (docs/decisiones.md): con 24 px la zona del pico puede solapar la del botón, que
 * queda encima y es el que prevalece.
 */
export function zonaPulsable(vecino: number, vecinoBoton: number, anchoMapa: number): number {
	const hastaElBoton = 2 * (vecinoBoton * anchoMapa - LADO_ZONA_BOTON / 2);
	const lado = Math.min(LADO_MAXIMO_ZONA_PULSABLE, vecino * anchoMapa, hastaElBoton);
	return Math.max(LADO_MINIMO_ZONA_PULSABLE, lado);
}

/**
 * Los picos visibles que NO son un destino, con su posición en el recorte y la distancia a su vecino,
 * por orden de altura. Los destinos que son un pico (Montcabrer, Alt de la Codolla...) ya tienen su botón.
 */
export function prepararPicos(
	picos: PicoEnCrudo[],
	destinos: DestinoPreparado[],
	anchoImagen: number,
	altoImagen: number,
	destinosEnCrudo: DestinoEnCrudo[],
	recorte: Recorte = RECORTE_POR_DEFECTO,
): PicoPreparado[] {
	const conBoton = new Set(destinosEnCrudo.map((destino) => destino.pico).filter((nombre) => nombre !== undefined));
	const sueltos = ordenarPorAltura(picos.filter((pico) => pico.visible && !conBoton.has(pico.nombre)));
	const botones = destinos.map((destino) => ({ x: destino.xImagen, y: destino.yImagen }));
	return sueltos.map((pico) => ({
		id: idDePico(pico.nombre),
		nombre: pico.nombre,
		altura: pico.altura,
		izquierda: pico.x,
		arriba: Number(yEnRecorte(pico.y, recorte).toFixed(3)),
		vecino: Number(vecinoMasCercano(pico, sueltos, anchoImagen, altoImagen).toFixed(5)),
		vecinoBoton: Number(vecinoMasCercano(pico, botones, anchoImagen, altoImagen).toFixed(5)),
	}));
}

/** Lo que aparta el piquito de la viñeta de sus esquinas, para que no quede en el borde redondeado. */
const MARGEN_COLA_PX = 16;

/**
 * Dónde pone la viñeta, en píxeles dentro de la caja del mapa (solo escritorio): a la derecha del
 * botón, o a la izquierda si a la derecha se saldría; centrada en vertical con el pico y sin salirse
 * por arriba ni por abajo. Devuelve también de qué lado queda respecto al pico y a qué altura de la
 * tarjeta está el pico (`colaY`), para que el piquito de la viñeta siga apuntando a él aunque la
 * tarjeta se haya subido o bajado.
 */
export function colocarFicha(entrada: {
	pico: { x: number; y: number };
	caja: { ancho: number; alto: number };
	ficha: { ancho: number; alto: number };
	margen: number;
}): { izquierda: number; arriba: number; lado: 'derecha' | 'izquierda'; colaY: number } {
	const { pico, caja, ficha, margen } = entrada;
	const aLaDerecha = pico.x + margen + ficha.ancho <= caja.ancho;
	const izquierdaDeseada = aLaDerecha ? pico.x + margen : pico.x - margen - ficha.ancho;
	const izquierda = Math.max(0, Math.min(izquierdaDeseada, caja.ancho - ficha.ancho));
	const arribaDeseada = pico.y - ficha.alto / 2;
	const arriba = Math.max(0, Math.min(arribaDeseada, caja.alto - ficha.alto));
	const colaY = Math.max(MARGEN_COLA_PX, Math.min(pico.y - arriba, ficha.alto - MARGEN_COLA_PX));
	return { izquierda, arriba, lado: aLaDerecha ? 'derecha' : 'izquierda', colaY };
}

/**
 * Los destinos del mapa-menú con su posición en el recorte. Las coordenadas de los picos salen de
 * `picos-mapa.json` (un solo sitio, el que regenera el script); Castell y Cocentaina llevan las suyas.
 * Mantiene el orden de `destinos`: de abajo arriba.
 *
 * @throws Error si un destino nombra un pico que no existe o no tiene ni pico ni x e y.
 */
export function prepararDestinos(
	destinos: DestinoEnCrudo[],
	picos: PicoEnCrudo[],
	recorte: Recorte = RECORTE_POR_DEFECTO,
): DestinoPreparado[] {
	return destinos.map((destino, orden) => {
		let x = destino.x;
		let y = destino.y;
		let altura: number | undefined;
		if (destino.pico !== undefined) {
			const pico = picos.find((candidato) => candidato.nombre === destino.pico);
			if (pico === undefined) {
				throw new Error(`El destino "${destino.id}" nombra el pico "${destino.pico}", que no está en picos-mapa.json.`);
			}
			x = pico.x;
			y = pico.y;
			altura = pico.altura;
		}
		if (x === undefined || y === undefined) {
			throw new Error(`El destino "${destino.id}" necesita un pico o una x y una y.`);
		}
		return {
			id: destino.id,
			orden,
			izquierda: x,
			arriba: Number(yEnRecorte(y, recorte).toFixed(3)),
			altura,
			xImagen: x,
			yImagen: y,
			lado: destino.lado,
			desplazamiento: destino.desplazamiento ?? 0,
			ruta: destino.ruta,
			textos: destino.textos,
		};
	});
}

/** Un rectángulo en píxeles: esquina de arriba a la izquierda y tamaño. */
export interface Rectangulo {
	izquierda: number;
	arriba: number;
	ancho: number;
	alto: number;
}

/** La zona pulsable del punto de un botón, centrada en `centro` (px dentro del mapa). */
export function zonaDeBoton(centro: { x: number; y: number }): Rectangulo {
	return {
		izquierda: centro.x - LADO_ZONA_BOTON / 2,
		arriba: centro.y - LADO_ZONA_BOTON / 2,
		ancho: LADO_ZONA_BOTON,
		alto: LADO_ZONA_BOTON,
	};
}

/**
 * Dónde cae la placa de un botón: pegada al punto por su lado, metida `SOLAPE_PLACA` px en su zona y
 * centrada con él (o desplazada `desplazamiento` px a lo largo de su lado). `anchoPlaca` es lo que mide el texto. Sirve para comprobar que las placas no se pisan.
 */
export function rectanguloPlaca(
	lado: LadoPlaca,
	centro: { x: number; y: number },
	anchoPlaca: number,
	desplazamiento = 0,
): Rectangulo {
	const zona = zonaDeBoton(centro);
	const hueco = LADO_ZONA_BOTON / 2 - SOLAPE_PLACA;
	switch (lado) {
		case 'arriba':
			return { izquierda: centro.x - anchoPlaca / 2 + desplazamiento, arriba: centro.y - hueco - ALTO_PLACA, ancho: anchoPlaca, alto: ALTO_PLACA };
		case 'abajo':
			return { izquierda: centro.x - anchoPlaca / 2 + desplazamiento, arriba: centro.y + hueco, ancho: anchoPlaca, alto: ALTO_PLACA };
		case 'derecha':
			return { izquierda: zona.izquierda + zona.ancho - SOLAPE_PLACA, arriba: centro.y - ALTO_PLACA / 2 + desplazamiento, ancho: anchoPlaca, alto: ALTO_PLACA };
		case 'izquierda':
			return { izquierda: zona.izquierda + SOLAPE_PLACA - anchoPlaca, arriba: centro.y - ALTO_PLACA / 2 + desplazamiento, ancho: anchoPlaca, alto: ALTO_PLACA };
	}
}

/** Indica si dos rectángulos se tocan o se pisan por dentro (compartir solo un borde no cuenta). */
export function sePisan(a: Rectangulo, b: Rectangulo): boolean {
	return (
		a.izquierda < b.izquierda + b.ancho &&
		b.izquierda < a.izquierda + a.ancho &&
		a.arriba < b.arriba + b.alto &&
		b.arriba < a.arriba + a.alto
	);
}
