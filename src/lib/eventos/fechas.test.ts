import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { diaDeLaSemana, diaMes, diaMesAnio, numeralJornada } from './fechas.ts';

describe('fechas de un evento', () => {
	it('diaMes usa el calendario de Madrid', () => {
		assert.equal(diaMes('2026-12-20T23:59:59+01:00'), '20/12');
		// 23:30 UTC del 24/11 ya es el 25/11 en Madrid.
		assert.equal(diaMes('2026-11-24T23:30:00Z'), '25/11');
	});

	it('diaMesAnio con el año', () => {
		assert.equal(diaMesAnio('2026-11-25T00:00:00+01:00'), '25/11/2026');
	});

	it('numeralJornada con dos cifras', () => {
		assert.deepEqual(numeralJornada('2027-01-03'), { dia: '03', mes: '01' });
		assert.deepEqual(numeralJornada('2026-12-27'), { dia: '27', mes: '12' });
	});

	it('día de la semana en cada idioma, con mayúscula', () => {
		assert.equal(diaDeLaSemana('2026-12-27', 'ca'), 'Diumenge');
		assert.equal(diaDeLaSemana('2027-01-03', 'es'), 'Domingo');
	});
});
