import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	type EventoParaEstado,
	calcularEstado,
	confirmadosPorCategoria,
	esEventoPasado,
	listaRetirada,
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
		const confirmados = { 'infantil-cadet': 8, 'juvenil-senior': 6 };
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, confirmados), 'completes');
	});

	it('con una sola categoría llena sigue obertes', () => {
		const confirmados = { 'infantil-cadet': 8, 'juvenil-senior': 2 };
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, confirmados), 'obertes');
	});

	it('una categoría sin recuento cuenta como con plazas', () => {
		const confirmados = { 'infantil-cadet': 8 };
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, confirmados), 'obertes');
	});

	it('sin recuento nunca da completes', () => {
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO), 'obertes');
	});

	it('llenas pero después del cierre da tancades', () => {
		const ahora = new Date('2026-12-22T10:00:00+01:00');
		const confirmados = { 'infantil-cadet': 8, 'juvenil-senior': 6 };
		assert.equal(calcularEstado(torneo(), ahora, confirmados), 'tancades');
	});
});

describe('plazasCategoria', () => {
	const categoria = { id: 'infantil-cadet', maxEquipos: 8 };

	it('resta los confirmados del máximo', () => {
		assert.deepEqual(plazasCategoria(categoria, 1), { libres: 7, completa: false });
	});

	it('sin confirmados quedan todas', () => {
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

describe('listaRetirada', () => {
	it('el 09/01/2027 a las 23:59 de Madrid la lista sigue', () => {
		const ahora = new Date('2027-01-09T23:59:00+01:00');
		assert.equal(listaRetirada(torneo(), ahora), false);
	});

	it('el 10/01/2027 a las 00:00 de Madrid la lista se retira', () => {
		const ahora = new Date('2027-01-10T00:00:00+01:00');
		assert.equal(listaRetirada(torneo(), ahora), true);
	});

	it('usa la fecha de Madrid aunque en UTC aún sea el día anterior', () => {
		// 23:30 UTC del 09/01 son las 00:30 del 10/01 en Madrid.
		const ahora = new Date('2027-01-09T23:30:00Z');
		assert.equal(listaRetirada(torneo(), ahora), true);
	});

	it('en un evento de verano (+02:00) se retira desde el 12/07 a las 00:00', () => {
		const verano: EventoParaEstado = { ...torneo(), jornadas: [{ fecha: '2027-07-05' }] };
		assert.equal(listaRetirada(verano, new Date('2027-07-11T23:59:00+02:00')), false);
		assert.equal(listaRetirada(verano, new Date('2027-07-12T00:00:00+02:00')), true);
	});

	it('los 7 días cruzan bien el cambio de mes', () => {
		const finDeMes: EventoParaEstado = { ...torneo(), jornadas: [{ fecha: '2027-01-28' }] };
		assert.equal(listaRetirada(finDeMes, new Date('2027-02-03T23:59:00+01:00')), false);
		assert.equal(listaRetirada(finDeMes, new Date('2027-02-04T00:00:00+01:00')), true);
	});
});

describe('confirmadosPorCategoria', () => {
	const categorias = ['infantil-cadet', 'juvenil-senior'];

	it('cuenta los equipos de cada categoría', () => {
		const equipos = [{ categoria: 'infantil-cadet' }, { categoria: 'juvenil-senior' }, { categoria: 'infantil-cadet' }];
		assert.deepEqual(confirmadosPorCategoria(equipos, categorias), { 'infantil-cadet': 2, 'juvenil-senior': 1 });
	});

	it('una categoría sin equipos cuenta cero, no falta', () => {
		assert.deepEqual(confirmadosPorCategoria([], categorias), { 'infantil-cadet': 0, 'juvenil-senior': 0 });
	});

	it('ignora las categorías que el evento no tiene', () => {
		const equipos = [{ categoria: 'veterans' }, { categoria: 'infantil-cadet' }];
		assert.deepEqual(confirmadosPorCategoria(equipos, categorias), { 'infantil-cadet': 1, 'juvenil-senior': 0 });
	});

	it('con todas las categorías llenas, el estado pasa a completes', () => {
		const equipos = [
			...Array.from({ length: 8 }, () => ({ categoria: 'infantil-cadet' })),
			...Array.from({ length: 6 }, () => ({ categoria: 'juvenil-senior' })),
		];
		const recuento = confirmadosPorCategoria(equipos, categorias);
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, recuento), 'completes');
	});

	it('con una sola categoría llena, el estado sigue siendo obertes', () => {
		const equipos = Array.from({ length: 8 }, () => ({ categoria: 'infantil-cadet' }));
		const recuento = confirmadosPorCategoria(equipos, categorias);
		assert.equal(calcularEstado(torneo(), DENTRO_DEL_PLAZO, recuento), 'obertes');
	});
});
