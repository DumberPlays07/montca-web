import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { EventoParaEstado } from './estado.ts';
import { eventoParaFranja } from './franja.ts';

interface EventoDePrueba extends EventoParaEstado {
	id: string;
}

function evento(id: string, apertura: string, cierre: string, cerradaAMano = false): EventoDePrueba {
	return {
		id,
		jornadas: [{ fecha: '2026-12-27' }],
		inscripcion: { apertura, cierre, cerradaAMano },
		categorias: [{ id: 'unica', maxEquipos: 4 }],
	};
}

const TORNEO = evento('torneo', '2026-11-25T00:00:00+01:00', '2026-12-20T23:59:59+01:00');
const DENTRO_DEL_PLAZO = new Date('2026-12-01T12:00:00+01:00');

describe('eventoParaFranja', () => {
	it('sin eventos no hay franja', () => {
		assert.equal(eventoParaFranja([], DENTRO_DEL_PLAZO), null);
	});

	it('con un evento abierto, la franja es de ese evento', () => {
		assert.equal(eventoParaFranja([TORNEO], DENTRO_DEL_PLAZO)?.id, 'torneo');
	});

	it('antes de la apertura no hay franja', () => {
		assert.equal(eventoParaFranja([TORNEO], new Date('2026-11-24T23:59:00+01:00')), null);
	});

	it('después del cierre no hay franja', () => {
		assert.equal(eventoParaFranja([TORNEO], new Date('2026-12-21T00:00:00+01:00')), null);
	});

	it('con las inscripciones cerradas a mano no hay franja', () => {
		const cerrado = evento('cerrado', TORNEO.inscripcion.apertura, TORNEO.inscripcion.cierre, true);
		assert.equal(eventoParaFranja([cerrado], DENTRO_DEL_PLAZO), null);
	});

	it('con dos eventos abiertos, elige el que cierra antes (FR-030)', () => {
		const otro = evento('otro', '2026-11-20T00:00:00+01:00', '2026-12-10T23:59:59+01:00');
		assert.equal(eventoParaFranja([TORNEO, otro], DENTRO_DEL_PLAZO)?.id, 'otro');
		assert.equal(eventoParaFranja([otro, TORNEO], DENTRO_DEL_PLAZO)?.id, 'otro');
	});

	it('se salta los eventos que no están abiertos aunque cierren antes', () => {
		const futuro = evento('futuro', '2026-12-05T00:00:00+01:00', '2026-12-06T23:59:59+01:00');
		assert.equal(eventoParaFranja([futuro, TORNEO], DENTRO_DEL_PLAZO)?.id, 'torneo');
	});
});
