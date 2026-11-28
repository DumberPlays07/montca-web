import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { plazasPrueba } from './datos-prueba.ts';
import { equiposPorCategoria, plazasCategoria } from './estado.ts';

/** Máximos de equipos de `torneig-nadal-2026.yaml`. */
const INFANTIL_CADET = { id: 'infantil-cadet', maxEquipos: 8 };
const JUVENIL_SENIOR = { id: 'juvenil-senior', maxEquipos: 6 };

describe('datos de prueba de plazas', () => {
	it('hay un recuento por cada categoría del torneo', () => {
		assert.deepEqual(plazasPrueba.map((plazas) => plazas.categoria).sort(), [INFANTIL_CADET.id, JUVENIL_SENIOR.id]);
	});

	it('dan 5 de 8 equipos en Infantil/Cadet y 2 de 6 en Juvenil/Sènior, con plazas libres en las dos', () => {
		const recuento = equiposPorCategoria(plazasPrueba, [INFANTIL_CADET.id, JUVENIL_SENIOR.id]);
		assert.deepEqual(plazasCategoria(INFANTIL_CADET, recuento[INFANTIL_CADET.id]), { libres: 3, completa: false });
		assert.deepEqual(plazasCategoria(JUVENIL_SENIOR, recuento[JUVENIL_SENIOR.id]), { libres: 4, completa: false });
	});

	it('lo público solo tiene categoría y número: ningún dato personal ni nombre de equipo (SC-003)', () => {
		for (const plazas of plazasPrueba) {
			assert.deepEqual(Object.keys(plazas).sort(), ['categoria', 'equiposActuales']);
		}
	});
});
