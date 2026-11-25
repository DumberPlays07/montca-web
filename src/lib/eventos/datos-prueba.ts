/**
 * DATOS DE PRUEBA de equipos y jugadores (C-04, FR-035). Todo está inventado: las personas
 * no existen y los nombres de equipo empiezan por "Prova ·" para que se vean como prueba.
 *
 * Tienen la forma de las tablas de data-model.md §3 y, igual que los reales, se convierten en
 * `EquipoPublico[]` con `aEquiposPublicos`. Nunca se publican en producción: solo los usa la
 * fuente `prueba` (local y vistas previas), que el build rechaza con `CONTEXT=production`
 * (`fuente-equipos.ts`). Este archivo no lo importa ningún script del navegador.
 */
import {
	type AutorizacionFila,
	type EquipoFila,
	type EquipoPublico,
	type JugadorFila,
	aEquiposPublicos,
} from './vista-publica.ts';

/** `id` del evento al que pertenecen: el del YAML del torneo. */
export const EVENTO_PRUEBA = 'torneig-nadal-2026';

/**
 * Interruptor `eventos.jugadores_forms_publicables` de la fila de evento de prueba. Apagado,
 * como en producción: los jugadores de "Els Falcons" (origen `forms`) no salen (FR-041).
 */
export const JUGADORES_FORMS_PUBLICABLES_PRUEBA = false;

const INSCRIPCION = '2026-11-26';

export const equiposPrueba: EquipoFila[] = [
	{ id: 'prova-falcons', categoria: 'infantil-cadet', nombre: 'Prova · Els Falcons', estado: 'confirmado', origen: 'forms' },
	{ id: 'prova-cabretes', categoria: 'infantil-cadet', nombre: 'Prova · Les Cabretes', estado: 'pendiente', origen: 'web' },
	{
		id: 'prova-mariola',
		categoria: 'juvenil-senior',
		nombre: 'Prova · Mariola Bàsquet Club Amb Un Nom Molt Llarg',
		estado: 'confirmado',
		origen: 'web',
	},
	{ id: 'prova-padel', categoria: 'juvenil-senior', nombre: 'Prova · Cocentaina Pàdel', estado: 'pendiente', origen: 'forms' },
];

function jugador(datos: Omit<JugadorFila, 'fechaInscripcion'>): JugadorFila {
	return { ...datos, fechaInscripcion: INSCRIPCION };
}

export const jugadoresPrueba: JugadorFila[] = [
	// Els Falcons (forms): menores con nombre compuesto, con y sin dorsal y uno sin autorizar.
	jugador({ id: 'f1', equipoId: 'prova-falcons', nombre: 'Laia', apellidos: 'Ferrer Soler', fechaNacimiento: '2012-03-01', dorsal: 7, esCapitan: true, origen: 'forms' }),
	jugador({ id: 'f2', equipoId: 'prova-falcons', nombre: 'Maria José', apellidos: 'Pérez Mas', fechaNacimiento: '2013-05-10', dorsal: null, esCapitan: false, origen: 'forms' }),
	jugador({ id: 'f3', equipoId: 'prova-falcons', nombre: 'Nil', apellidos: 'Sanz Roca', fechaNacimiento: '2012-02-02', dorsal: 12, esCapitan: false, origen: 'forms' }),
	// Les Cabretes (pendiente): no debe salir ni contar.
	jugador({ id: 'c1', equipoId: 'prova-cabretes', nombre: 'Berta', apellidos: 'Climent Gisbert', fechaNacimiento: '2011-09-09', dorsal: 3, esCapitan: true, origen: 'web' }),
	// Mariola Bàsquet Club (web): adultos, un menor de 2010 y uno sin fecha de nacimiento.
	jugador({ id: 'm1', equipoId: 'prova-mariola', nombre: 'Marc', apellidos: 'García Ruiz', fechaNacimiento: '2000-01-15', dorsal: 10, esCapitan: true, origen: 'web' }),
	jugador({ id: 'm2', equipoId: 'prova-mariola', nombre: 'Ana María', apellidos: 'de la Fuente Soler', fechaNacimiento: '1990-03-03', dorsal: 4, esCapitan: false, origen: 'web' }),
	jugador({ id: 'm3', equipoId: 'prova-mariola', nombre: 'Àlex', apellidos: 'Íñiguez Pons', fechaNacimiento: '1999-07-07', dorsal: 23, esCapitan: false, origen: 'web' }),
	jugador({ id: 'm4', equipoId: 'prova-mariola', nombre: 'Núria', apellidos: 'Vidal Mora', fechaNacimiento: '2010-04-20', dorsal: 8, esCapitan: false, origen: 'web' }),
	jugador({ id: 'm5', equipoId: 'prova-mariola', nombre: 'Joan', apellidos: 'Gomis Cano', fechaNacimiento: null, dorsal: 15, esCapitan: false, origen: 'web' }),
	// Cocentaina Pàdel (pendiente): no debe salir.
	jugador({ id: 'p1', equipoId: 'prova-padel', nombre: 'Jordi', apellidos: 'Ferrer i Soler', fechaNacimiento: '1992-06-06', dorsal: null, esCapitan: true, origen: 'forms' }),
];

/** Una por forma de autorización; la de "Nil" sin recibir (por eso no sale). */
export const autorizacionesPrueba: AutorizacionFila[] = [
	{ jugadorId: 'f1', recibida: true, forma: 'firma_digital' },
	{ jugadorId: 'f2', recibida: true, forma: 'papel' },
	{ jugadorId: 'f3', recibida: false, forma: 'papel' },
	{ jugadorId: 'c1', recibida: true, forma: 'casilla_web' },
	{ jugadorId: 'm4', recibida: true, forma: 'casilla_web' },
	{ jugadorId: 'm5', recibida: true, forma: 'casilla_web' },
];

/** Los datos de prueba ya en forma pública: lo que llega a la página. */
export function equiposPublicosDePrueba(
	jugadoresFormsPublicables: boolean = JUGADORES_FORMS_PUBLICABLES_PRUEBA,
): EquipoPublico[] {
	return aEquiposPublicos(equiposPrueba, jugadoresPrueba, autorizacionesPrueba, jugadoresFormsPublicables);
}
