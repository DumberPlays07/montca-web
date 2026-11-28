import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	type EventoParaEstado,
	calcularEstado,
	equiposPorCategoria,
	esEventoPasado,
	plazasCategoria,
} from './estado.ts';

/** Torneo de Navidad con los datos de `torneig-nadal-2026.yaml`. */
function torneo(cambios: Partial<EventoParaEstado['inscripcion']> = {}): EventoParaEstado {
	return {
		jornadas: [{ fecha: '2026-12-27' }, { fecha: '2027-01-03' }],
		inscripcion: {
			apertura: '2026-11-25T00:00:00+01:00',
			cierre: '2026-12-20T23:59:59+01:00',
			cerradaAMano: false,
			...cambios,
		},
		categorias: [
			{ id: 'infantil-cadet', maxEquipos: 8 },
			{ id: 'juvenil-senior', maxEquipos: 6 },
		],
	};
}

const DENTRO_DEL_PLAZO = new Date('2026-12-01T12:00:00+01:00');

describe('calcularEstado', () => {
	it('un minuto antes de la apertura da proximament', () => {
		const ahora = new Date('2026-11-24T23:59:00+01:00');
		assert.equal(calcularEstado(torneo(), ahora), 'proximament');
	});

	it('justo en la apertura da obertes', () => {
		const ahora = new Date('2026-11-25T00:00:00+01:00');
		assert.equal(calcularEstado(torneo(), ahora), 'obertes');
	});

	it('a las 23:59:59 del 20/12 sigue obertes', () => {
		const ahora = new Date('2026-12-20T23:59:59+01:00');
		assert.equal(calcularEstado(torneo(), ahora), 'obertes');
	});

	it('un segundo después del cierre da tancades', () => {
		const ahora = new Date('2026-12-21T00:00:00+01:00');
		assert.equal(calcularEstado(torneo(), ahora), 'tancades');
	});

	it('cerradaAMano da tancades aunque esté dentro del plazo', () => {
		assert.equal(calcularEstado(torneo({ cerradaAMano: true }), DENTRO_DEL_PLAZO), 'tancades');
	});

	it('cerradaAMano gana también antes de la apertura', () => {
		const ahora = new Date('2026-11-01T12:00:00+01:00');
		assert.equal(calcularEstado(torneo({ cerradaAMano: true }), ahora), 'tancades');
	});

	it('con las dos categorías llenas da completes', () => {
		const equipos = { 'infantil-cadet': 8, 'juvenil-senior': 6 };
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, equipos), 'completes');
	});

	it('con una sola categoría llena sigue obertes', () => {
		const equipos = { 'infantil-cadet': 8, 'juvenil-senior': 2 };
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, equipos), 'obertes');
	});

	it('una categoría sin recuento cuenta como con plazas', () => {
		const equipos = { 'infantil-cadet': 8 };
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, equipos), 'obertes');
	});

	it('sin recuento nunca da completes', () => {
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO), 'obertes');
	});

	it('llenas pero después del cierre da tancades', () => {
		const ahora = new Date('2026-12-22T10:00:00+01:00');
		const equipos = { 'infantil-cadet': 8, 'juvenil-senior': 6 };
		assert.equal(calcularEstado(torneo(), ahora, equipos), 'tancades');
	});
});

describe('plazasCategoria', () => {
	const categoria = { id: 'infantil-cadet', maxEquipos: 8 };

	it('resta los equipos que ocupan plaza del máximo', () => {
		assert.deepEqual(plazasCategoria(categoria, 1), { libres: 7, completa: false });
	});

	it('sin equipos quedan todas', () => {
		assert.deepEqual(plazasCategoria(categoria, 0), { libres: 8, completa: false });
	});

	it('justo en el máximo está completa', () => {
		assert.deepEqual(plazasCategoria(categoria, 8), { libres: 0, completa: true });
	});

	it('nunca da plazas negativas', () => {
		assert.deepEqual(plazasCategoria(categoria, 10), { libres: 0, completa: true });
	});
});

describe('esEventoPasado', () => {
	it('el último día de la última jornada todavía no ha pasado', () => {
		const ahora = new Date('2027-01-03T23:59:00+01:00');
		assert.equal(esEventoPasado(torneo(), ahora), false);
	});

	it('el día siguiente a la última jornada ya ha pasado', () => {
		const ahora = new Date('2027-01-04T00:00:00+01:00');
		assert.equal(esEventoPasado(torneo(), ahora), true);
	});

	it('antes del evento no ha pasado', () => {
		assert.equal(esEventoPasado(torneo(), DENTRO_DEL_PLAZO), false);
	});
});

describe('equiposPorCategoria', () => {
	const categorias = ['infantil-cadet', 'juvenil-senior'];

	it('pasa los recuentos de la fuente a un registro por categoría', () => {
		const plazas = [
			{ categoria: 'infantil-cadet', equiposActuales: 5 },
			{ categoria: 'juvenil-senior', equiposActuales: 2 },
		];
		assert.deepEqual(equiposPorCategoria(plazas, categorias), { 'infantil-cadet': 5, 'juvenil-senior': 2 });
	});

	it('una categoría con cero equipos cuenta cero', () => {
		const plazas = [
			{ categoria: 'infantil-cadet', equiposActuales: 0 },
			{ categoria: 'juvenil-senior', equiposActuales: 0 },
		];
		assert.deepEqual(equiposPorCategoria(plazas, categorias), { 'infantil-cadet': 0, 'juvenil-senior': 0 });
	});

	it('una categoría que no llega no aparece: no se da por vacía', () => {
		const plazas = [{ categoria: 'infantil-cadet', equiposActuales: 3 }];
		assert.deepEqual(equiposPorCategoria(plazas, categorias), { 'infantil-cadet': 3 });
	});

	it('ignora las categorías que el evento no tiene', () => {
		const plazas = [
			{ categoria: 'veterans', equiposActuales: 4 },
			{ categoria: 'infantil-cadet', equiposActuales: 1 },
		];
		assert.deepEqual(equiposPorCategoria(plazas, categorias), { 'infantil-cadet': 1 });
	});

	it('con todas las categorías llenas, el estado pasa a completes', () => {
		const plazas = [
			{ categoria: 'infantil-cadet', equiposActuales: 8 },
			{ categoria: 'juvenil-senior', equiposActuales: 6 },
		];
		const recuento = equiposPorCategoria(plazas, categorias);
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, recuento), 'completes');
	});

	it('con una sola categoría llena, el estado sigue siendo obertes', () => {
		const plazas = [
			{ categoria: 'infantil-cadet', equiposActuales: 8 },
			{ categoria: 'juvenil-senior', equiposActuales: 2 },
		];
		const recuento = equiposPorCategoria(plazas, categorias);
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, recuento), 'obertes');
	});
});
