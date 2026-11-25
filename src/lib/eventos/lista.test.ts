import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { EventoParaEstado } from './estado.ts';
import { eventosProximos } from './lista.ts';

interface EventoDePrueba extends EventoParaEstado {
	id: string;
}

function evento(id: string, fechasJornadas: string[]): EventoDePrueba {
	return {
		id,
		jornadas: fechasJornadas.map((fecha) => ({ fecha })),
		inscripcion: { apertura: '2026-11-25T00:00:00+01:00', cierre: '2026-12-20T23:59:59+01:00', cerradaAMano: false },
		categorias: [],
	};
}

const HOY = new Date('2026-12-01T12:00:00+01:00');
const ids = (eventos: EventoDePrueba[]) => eventos.map((e) => e.id);

describe('eventosProximos', () => {
	it('sin eventos devuelve una lista vacía', () => {
		assert.deepEqual(eventosProximos([], HOY), []);
	});

	it('deja los eventos que aún no han empezado', () => {
		assert.deepEqual(ids(eventosProximos([evento('torneo', ['2026-12-27', '2027-01-03'])], HOY)), ['torneo']);
	});

	it('quita el evento cuya última jornada ya ha pasado (FR-004)', () => {
		const pasado = evento('pasado', ['2026-10-10', '2026-10-17']);
		assert.deepEqual(ids(eventosProximos([pasado], HOY)), []);
	});

	it('el día de la última jornada todavía es próximo; al día siguiente, no', () => {
		const torneo = evento('torneo', ['2026-12-27', '2027-01-03']);
		assert.deepEqual(ids(eventosProximos([torneo], new Date('2027-01-03T23:59:00+01:00'))), ['torneo']);
		assert.deepEqual(ids(eventosProximos([torneo], new Date('2027-01-04T00:00:00+01:00'))), []);
	});

	it('un evento ya empezado (entre jornadas) sigue saliendo', () => {
		const torneo = evento('torneo', ['2026-12-27', '2027-01-03']);
		assert.deepEqual(ids(eventosProximos([torneo], new Date('2026-12-30T10:00:00+01:00'))), ['torneo']);
	});

	it('los ordena por la primera jornada, sea cual sea el orden de entrada', () => {
		const verano = evento('verano', ['2027-07-05']);
		const torneo = evento('torneo', ['2026-12-27', '2027-01-03']);
		const primavera = evento('primavera', ['2027-04-10']);
		assert.deepEqual(ids(eventosProximos([verano, torneo, primavera], HOY)), ['torneo', 'primavera', 'verano']);
		assert.deepEqual(ids(eventosProximos([primavera, verano, torneo], HOY)), ['torneo', 'primavera', 'verano']);
	});

	it('no cambia la lista que recibe', () => {
		const entrada = [evento('b', ['2027-02-01']), evento('a', ['2026-12-27'])];
		eventosProximos(entrada, HOY);
		assert.deepEqual(ids(entrada), ['b', 'a']);
	});

	it('mezcla pasados y próximos y se queda solo con los próximos', () => {
		const eventos = [evento('pasado', ['2026-09-01']), evento('torneo', ['2026-12-27']), evento('viejo', ['2025-12-27'])];
		assert.deepEqual(ids(eventosProximos(eventos, HOY)), ['torneo']);
	});
});
