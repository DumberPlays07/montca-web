import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { type EventoConJornadas, calcularCuentaAtras, casillasCuenta } from './cuenta-atras.ts';

/** Torneo de Navidad con las jornadas de `torneig-nadal-2026.yaml` (sin hora de inicio). */
const torneo: EventoConJornadas = { jornadas: [{ fecha: '2026-12-27' }, { fecha: '2027-01-03' }] };

function cuenta(dias: number, horas: number, minutos: number, segundos: number) {
	return { tipo: 'cuenta', dias, horas, minutos, segundos };
}

describe('calcularCuentaAtras', () => {
	it('sin evento devuelve "proximament"', () => {
		assert.deepEqual(calcularCuentaAtras(null, new Date('2026-12-01T12:00:00+01:00')), { tipo: 'proximament' });
	});

	it('un evento sin jornadas devuelve "proximament"', () => {
		assert.deepEqual(calcularCuentaAtras({ jornadas: [] }, new Date('2026-12-01T12:00:00+01:00')), {
			tipo: 'proximament',
		});
	});

	it('desglosa lo que falta hasta las 00:00 de Madrid de la primera jornada', () => {
		// Del 25/11 a las 12:00 al 27/12 a las 00:00: 31 días y 12 horas.
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-11-25T12:00:00+01:00')), cuenta(31, 12, 0, 0));
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-25T09:54:18+01:00')), cuenta(1, 14, 5, 42));
	});

	it('el segundo, el minuto, la hora y el día pasan en su momento', () => {
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T23:59:58+01:00')), cuenta(0, 0, 0, 2));
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T23:59:59+01:00')), cuenta(0, 0, 0, 1));
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T23:59:00+01:00')), cuenta(0, 0, 1, 0));
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T23:00:00+01:00')), cuenta(0, 1, 0, 0));
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T00:00:00+01:00')), cuenta(1, 0, 0, 0));
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-25T23:59:59+01:00')), cuenta(1, 0, 0, 1));
	});

	it('los milisegundos que sobran no restan un segundo de más', () => {
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-26T23:59:58.400+01:00')), cuenta(0, 0, 0, 2));
	});

	it('usa la hora de Madrid aunque el visitante esté en otra zona horaria', () => {
		// 23:30 UTC del 25 son las 00:30 del 26 en Madrid.
		assert.deepEqual(calcularCuentaAtras(torneo, new Date('2026-12-25T23:30:00Z')), cuenta(0, 23, 30, 0));
	});

	it('cuenta el tiempo real cuando cambia la hora en octubre (un día de 25 horas)', () => {
		// El 25/10/2026 se atrasa el reloj: de las 12:00 del 24 a las 00:00 del 27 hay 2 días y 13 horas.
		const evento = { jornadas: [{ fecha: '2026-10-27' }] };
		assert.deepEqual(calcularCuentaAtras(evento, new Date('2026-10-24T12:00:00+02:00')), cuenta(2, 13, 0, 0));
	});

	it('cuenta el tiempo real cuando cambia la hora en marzo (un día de 23 horas)', () => {
		// El 28/03/2027 se adelanta el reloj: de las 12:00 del 27 a las 00:00 del 30 hay 2 días y 11 horas.
		const evento = { jornadas: [{ fecha: '2027-03-30' }] };
		assert.deepEqual(calcularCuentaAtras(evento, new Date('2027-03-27T12:00:00+01:00')), cuenta(2, 11, 0, 0));
	});

	it('con hora en la primera jornada cuenta hasta esa hora, en horario de invierno', () => {
		const conHora = { jornadas: [{ fecha: '2026-12-27', hora: '10:30' }, { fecha: '2027-01-03' }] };
		assert.deepEqual(calcularCuentaAtras(conHora, new Date('2026-12-27T09:00:00+01:00')), cuenta(0, 1, 30, 0));
		// A las 00:00 del día de la jornada todavía falta: no es "hoy" hasta la hora de inicio.
		assert.deepEqual(calcularCuentaAtras(conHora, new Date('2026-12-27T00:00:00+01:00')), cuenta(0, 10, 30, 0));
	});

	it('con hora en la primera jornada cuenta hasta esa hora, en horario de verano', () => {
		const conHora = { jornadas: [{ fecha: '2026-07-10', hora: '20:00' }] };
		// 12:00 UTC son las 14:00 en Madrid (UTC+2).
		assert.deepEqual(calcularCuentaAtras(conHora, new Date('2026-07-10T12:00:00Z')), cuenta(0, 6, 0, 0));
	});

	it('al llegar la hora de inicio devuelve "hoy"', () => {
		const conHora = { jornadas: [{ fecha: '2026-12-27', hora: '10:30' }, { fecha: '2027-01-03' }] };
		assert.deepEqual(calcularCuentaAtras(conHora, new Date('2026-12-27T10:29:59+01:00')), cuenta(0, 0, 0, 1));
		assert.deepEqual(calcularCuentaAtras(conHora, new Date('2026-12-27T10:30:00+01:00')), { tipo: 'hoy' });
	});

	it('sin hora, el día de la primera jornada devuelve "hoy", de las 00:00 a las 23:59', () => {
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

describe('casillasCuenta', () => {
	it('escribe cada casilla con dos cifras como mínimo, para que el ancho no cambie', () => {
		assert.deepEqual(casillasCuenta({ tipo: 'cuenta', dias: 3, horas: 4, minutos: 5, segundos: 6 }), {
			dias: '03',
			horas: '04',
			minutos: '05',
			segundos: '06',
		});
	});

	it('deja pasar los días de tres cifras y el cero', () => {
		assert.deepEqual(casillasCuenta({ tipo: 'cuenta', dias: 120, horas: 0, minutos: 59, segundos: 0 }), {
			dias: '120',
			horas: '00',
			minutos: '59',
			segundos: '00',
		});
	});
});
