import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { equiposPrueba, equiposPublicosDePrueba, jugadoresPrueba } from './datos-prueba.ts';
import { plazasCategoria } from './estado.ts';

/** Máximos de equipos de `torneig-nadal-2026.yaml`. */
const INFANTIL_CADET = { id: 'infantil-cadet', maxEquipos: 8 };
const JUVENIL_SENIOR = { id: 'juvenil-senior', maxEquipos: 6 };

function enCategoria(categoria: string, jugadoresFormsPublicables: boolean) {
	return equiposPublicosDePrueba(jugadoresFormsPublicables).filter((equipo) => equipo.categoria === categoria);
}

describe('datos de prueba', () => {
	it('todos los equipos se ven como prueba: su nombre empieza por "Prova ·"', () => {
		assert.ok(equiposPrueba.every((equipo) => equipo.nombre.startsWith('Prova · ')));
	});

	it('hay un equipo confirmado y uno pendiente por categoría, y uno de cada origen', () => {
		for (const categoria of [INFANTIL_CADET.id, JUVENIL_SENIOR.id]) {
			const deLaCategoria = equiposPrueba.filter((equipo) => equipo.categoria === categoria);
			assert.deepEqual(deLaCategoria.map((equipo) => equipo.estado).sort(), ['confirmado', 'pendiente']);
		}
		assert.deepEqual([...new Set(equiposPrueba.map((equipo) => equipo.origen))].sort(), ['forms', 'web']);
	});

	it('solo salen los dos confirmados', () => {
		assert.deepEqual(
			equiposPublicosDePrueba().map((equipo) => equipo.nombre),
			['Prova · Els Falcons', 'Prova · Mariola Bàsquet Club Amb Un Nom Molt Llarg'],
		);
	});

	it('las plazas son 7 de 8 y 5 de 6', () => {
		const infantil = enCategoria(INFANTIL_CADET.id, false).length;
		const juvenil = enCategoria(JUVENIL_SENIOR.id, false).length;
		assert.equal(plazasCategoria(INFANTIL_CADET, infantil).libres, 7);
		assert.equal(plazasCategoria(JUVENIL_SENIOR, juvenil).libres, 5);
	});

	it('con el interruptor apagado, "Els Falcons" sale sin jugadores y ocupa plaza', () => {
		const [falcons] = enCategoria(INFANTIL_CADET.id, false);
		assert.equal(falcons.jugadoresOcultos, true);
		assert.deepEqual(falcons.jugadores, []);
	});

	it('con el interruptor encendido, los menores salen con el primer nombre y el que no tiene autorización, no', () => {
		const [falcons] = enCategoria(INFANTIL_CADET.id, true);
		assert.deepEqual(
			falcons.jugadores.map((jugador) => jugador.nombrePublico),
			['Laia', 'Maria'],
		);
		assert.equal(falcons.jugadores[0].esCapitan, true);
		assert.equal(falcons.jugadores[0].dorsal, 7);
		assert.equal(falcons.jugadores[1].dorsal, null);
	});

	it('el equipo de la web enseña adultos con primer apellido y menores solo con el nombre', () => {
		const [mariola] = enCategoria(JUVENIL_SENIOR.id, false);
		assert.deepEqual(
			mariola.jugadores.map((jugador) => jugador.nombrePublico),
			['Marc García', 'Àlex Íñiguez', 'Ana de la Fuente', 'Joan', 'Núria'],
		);
	});

	it('lo público no contiene apellidos de menores ni nada de los equipos pendientes (SC-003)', () => {
		const publico = JSON.stringify([equiposPublicosDePrueba(false), equiposPublicosDePrueba(true)]);
		const menores = jugadoresPrueba.filter((jugador) => jugador.fechaNacimiento === null || jugador.fechaNacimiento >= '2008-11-26');
		for (const menor of menores) {
			for (const apellido of menor.apellidos.split(' ')) {
				assert.ok(!publico.includes(apellido), `aparece el apellido ${apellido} de ${menor.nombre}`);
			}
		}
		assert.doesNotMatch(publico, /Cabretes|Pàdel|Climent|Jordi/);
	});
});
