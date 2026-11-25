/**
 * Regla de lo que se publica de un equipo (C-04, FR-020 a FR-026 y FR-041).
 *
 * Convierte filas "en crudo" (con la forma de las tablas de data-model.md §3) en equipos
 * públicos. La misma regla está escrita en SQL en la vista `equipos_publicos` de Supabase
 * (Saúl, A-14); las dos tienen que dar lo mismo con los casos de
 * `specs/001-eventos-torneo/contracts/vista-publica.md`.
 *
 * Aquí se aplica a los datos de prueba, **al construir la web**: al navegador solo llega el
 * resultado, nunca las filas en crudo (SC-003).
 */
import { fechaEnMadrid } from './estado.ts';

export type OrigenEquipo = 'forms' | 'web';
export type EstadoEquipo = 'pendiente' | 'confirmado' | 'espera';

/** Fila de `equipos`, con solo las columnas que usa la regla. */
export interface EquipoFila {
	id: string;
	categoria: string;
	nombre: string;
	estado: EstadoEquipo;
	origen: OrigenEquipo;
}

/** Fila de `jugadores`, con solo las columnas que usa la regla. */
export interface JugadorFila {
	id: string;
	equipoId: string;
	nombre: string;
	apellidos: string;
	/** `AAAA-MM-DD`. Nula ⇒ se trata como menor. */
	fechaNacimiento: string | null;
	/** `AAAA-MM-DD` o instante ISO con diferencia horaria: decide si era menor (FR-023). */
	fechaInscripcion: string;
	dorsal: number | null;
	esCapitan: boolean;
	origen: OrigenEquipo;
}

/** Fila de `autorizaciones`, con solo las columnas que usa la regla. */
export interface AutorizacionFila {
	jugadorId: string;
	recibida: boolean;
	forma: 'casilla_web' | 'firma_digital' | 'papel';
}

export interface JugadorPublico {
	nombrePublico: string;
	dorsal: number | null;
	esCapitan: boolean;
}

export interface EquipoPublico {
	categoria: string;
	nombre: string;
	/** true cuando sus jugadores aún no se pueden publicar (FR-041): la UI muestra solo el nombre. */
	jugadoresOcultos: boolean;
	jugadores: JugadorPublico[];
}

/** Años que hay que cumplir para ser adulto (FR-023). */
const EDAD_MAYORIA = 18;

/** Idioma con el que se ordenan los nombres: el de la web por defecto. */
const IDIOMA_ORDEN = 'ca';

/** Palabras que acompañan al primer apellido ("de la Fuente", "del Río", "d'Alcoi"). */
const PARTICULAS_APELLIDO = new Set(['de', 'del', 'dels', 'la', 'las', 'los', "d'"]);

/**
 * Equipos públicos a partir de las filas en crudo de un evento.
 *
 * @param jugadoresFormsPublicables interruptor `eventos.jugadores_forms_publicables` (FR-041):
 *   apagado, los jugadores con origen `forms` no se publican.
 * @returns solo los equipos confirmados, por orden alfabético, sin ningún dato que no se muestre.
 */
export function aEquiposPublicos(
	equipos: EquipoFila[],
	jugadores: JugadorFila[],
	autorizaciones: AutorizacionFila[],
	jugadoresFormsPublicables: boolean,
): EquipoPublico[] {
	const autorizados = new Set(
		autorizaciones.filter((autorizacion) => autorizacion.recibida).map((autorizacion) => autorizacion.jugadorId),
	);

	return equipos
		.filter((equipo) => equipo.estado === 'confirmado')
		.map((equipo) => {
			if (equipo.origen === 'forms' && !jugadoresFormsPublicables) {
				return { categoria: equipo.categoria, nombre: equipo.nombre, jugadoresOcultos: true, jugadores: [] };
			}
			const publicos = jugadores
				.filter((jugador) => jugador.equipoId === equipo.id)
				.filter((jugador) => jugadoresFormsPublicables || jugador.origen !== 'forms')
				.flatMap((jugador) => jugadorPublico(jugador, autorizados));
			return {
				categoria: equipo.categoria,
				nombre: equipo.nombre,
				jugadoresOcultos: false,
				jugadores: publicos.sort(compararJugadores),
			};
		})
		.sort((a, b) => a.nombre.localeCompare(b.nombre, IDIOMA_ORDEN));
}

/** El jugador tal como se publica, o nada si no se puede publicar (menor sin autorización, sin nombre). */
function jugadorPublico(jugador: JugadorFila, autorizados: Set<string>): JugadorPublico[] {
	const menor = esMenor(jugador.fechaNacimiento, jugador.fechaInscripcion);
	if (menor && !autorizados.has(jugador.id)) {
		return [];
	}
	const nombrePublico = menor ? primerNombre(jugador.nombre) : nombreYPrimerApellido(jugador);
	if (nombrePublico === '') {
		return [];
	}
	return [{ nombrePublico, dorsal: jugador.dorsal, esCapitan: jugador.esCapitan }];
}

/** Menor: sin fecha de nacimiento, o con menos de 18 años cumplidos el día de la inscripción. */
function esMenor(fechaNacimiento: string | null, fechaInscripcion: string): boolean {
	if (fechaNacimiento === null) {
		return true;
	}
	return diaDeInscripcion(fechaInscripcion) < fechaDeLaMayoria(fechaNacimiento);
}

/** Día `AAAA-MM-DD` de la inscripción; un instante con hora se pasa al calendario de Madrid. */
function diaDeInscripcion(fechaInscripcion: string): string {
	return /^\d{4}-\d{2}-\d{2}$/.test(fechaInscripcion) ? fechaInscripcion : fechaEnMadrid(new Date(fechaInscripcion));
}

/** Día en que se cumplen 18 años. Quien nace un 29 de febrero los cumple el 1 de marzo si el año no es bisiesto. */
function fechaDeLaMayoria(fechaNacimiento: string): string {
	const anioMayoria = Number(fechaNacimiento.slice(0, 4)) + EDAD_MAYORIA;
	const mesYDia = fechaNacimiento.slice(5);
	const esBisiesto = (anioMayoria % 4 === 0 && anioMayoria % 100 !== 0) || anioMayoria % 400 === 0;
	return mesYDia === '02-29' && !esBisiesto ? `${anioMayoria}-03-01` : `${anioMayoria}-${mesYDia}`;
}

function palabras(texto: string): string[] {
	return texto.split(/\s+/).filter((palabra) => palabra !== '');
}

function primerNombre(nombre: string): string {
	return palabras(nombre)[0] ?? '';
}

function nombreYPrimerApellido(jugador: JugadorFila): string {
	const nombre = primerNombre(jugador.nombre);
	const apellido = primerApellido(jugador.apellidos);
	if (nombre === '') {
		return '';
	}
	return apellido === '' ? nombre : `${nombre} ${apellido}`;
}

/** Primera palabra de los apellidos con las partículas que la preceden ("de la Fuente"). */
function primerApellido(apellidos: string): string {
	const partes = palabras(apellidos);
	let fin = 0;
	while (fin < partes.length - 1 && PARTICULAS_APELLIDO.has(partes[fin].toLowerCase())) {
		fin += 1;
	}
	return partes.slice(0, fin + 1).join(' ');
}

/** Capitán primero y después por orden alfabético. */
function compararJugadores(a: JugadorPublico, b: JugadorPublico): number {
	if (a.esCapitan !== b.esCapitan) {
		return a.esCapitan ? -1 : 1;
	}
	return a.nombrePublico.localeCompare(b.nombrePublico, IDIOMA_ORDEN);
}
