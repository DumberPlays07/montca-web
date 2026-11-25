import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { type EventoConJornadas, calcularCuentaAtras } from './cuenta-atras.ts';

/** Torneo de Navidad con las jornadas de `torneig-nadal-2026.yaml`. */
const torneo: EventoConJornadas = { jornadas: [{ fecha: '2026-12-27' }, { fecha: '2027-01-03' }] };

describe('calcularCuentaAtras', () => {
	it('sin evento devuelve "proximament"', () => {
		assert.deepEqual(calcularCuentaAtras(null, new Date('2026-12-01T12:00:00+01:00')), { tipo: 'proximament' });
	});

	it('un evento sin jornadas devuelve "proximament"', () => {
		assert.deepEqual(calcularCuentaAtras({ jornadas: [] }, new Date('2026-12-01T12:00:00+01:00')), {
			tipo: 'proximament',
		});
	});

	it('con días de margen cuenta los días de calendario hasta la primera jornada', () => {
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-11-25T12:00:00+01:00')), { tipo: 'dias', dias: 32 });
	});

	it('a dos días todavía cuenta días, a cualquier hora', () => {
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-25T00:00:00+01:00')), { tipo: 'dias', dias: 2 });
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-25T23:59:59+01:00')), { tipo: 'dias', dias: 2 });
	});

	it('el cambio de hora de octubre no altera los días de calendario', () => {
		const evento = { jornadas: [{ fecha: '2026-10-27' }] };
		assert.deepEqual(calcularCuentaAtras(evento, new Date('2026-10-20T12:00:00+02:00')), { tipo: 'dias', dias: 7 });
	});

	it('la víspera cuenta las horas que quedan hasta las 00:00 de la primera jornada', () => {
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T00:00:00+01:00')), { tipo: 'horas', horas: 24 });
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T14:30:00+01:00')), { tipo: 'horas', horas: 10 });
	});

	it('en la última hora de la víspera sigue diciendo 1 hora, nunca 0', () => {
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T23:00:00+01:00')), { tipo: 'horas', horas: 1 });
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T23:59:30+01:00')), { tipo: 'horas', horas: 1 });
	});

	it('usa la hora de Madrid aunque el visitante esté en otra zona horaria', () => {
		// 23:30 UTC del 25 son las 00:30 del 26 en Madrid: ya es la víspera.
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-25T23:30:00Z')), { tipo: 'horas', horas: 24 });
		// 22:30 UTC del 26 son las 23:30 en Madrid.
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T22:30:00Z')), { tipo: 'horas', horas: 1 });
	});

	it('el día de la primera jornada devuelve "hoy", de las 00:00 a las 23:59', () => {
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-27T00:00:00+01:00')), { tipo: 'hoy' });
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-27T23:59:59+01:00')), { tipo: 'hoy' });
	});

	it('entre la primera y la última jornada devuelve "en-curso"', () => {
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-28T00:00:00+01:00')), { tipo: 'en-curso' });
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2027-01-03T23:59:59+01:00')), { tipo: 'en-curso' });
	});

	it('cuando ya ha terminado el día de la última jornada devuelve "proximament"', () => {
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2027-01-04T00:00:00+01:00')), { tipo: 'proximament' });
	});

	it('un evento de un solo día pasa de "hoy" a "proximament" al día siguiente', () => {
		const unDia = { jornadas: [{ fecha: '2026-12-27' }] };
		assert.deepEqual(calcularCuentaAtras(unDia, new Date('2026-12-27T20:00:00+01:00')), { tipo: 'hoy' });
		assert.deepEqual(calcularCuentaAtras(unDia, new Date('2026-12-28T00:00:00+01:00')), { tipo: 'proximament' });
	});
});
