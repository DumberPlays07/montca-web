import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fuenteSupabase } from './fuente-supabase.ts';

const EVENTO = 'torneig-nadal-2026';

/** Un `fetch` falso que guarda la petición y responde lo que se le diga. */
function peticionFalsa(respuesta: { ok?: boolean; cuerpo?: unknown; falla?: boolean }) {
	const llamadas: { direccion: string; init: RequestInit | undefined }[] = [];
	const peticion = (async (direccion: string | URL | Request, init?: RequestInit) => {
		llamadas.push({ direccion: String(direccion), init });
		if (respuesta.falla) {
			throw new Error('sin red');
		}
		return { ok: respuesta.ok ?? true, json: async () => respuesta.cuerpo } as Response;
	}) as typeof fetch;
	return { peticion, llamadas };
}

function fuente(respuesta: Parameters<typeof peticionFalsa>[0], url = 'https://ejemplo.supabase.co') {
	const { peticion, llamadas } = peticionFalsa(respuesta);
	return { fuente: fuenteSupabase({ url, clavePublica: 'clave-publica', peticion }), llamadas };
}

describe('fuenteSupabase', () => {
	it('pide los recuentos del evento a la consulta pública con la clave pública', async () => {
		const { fuente: f, llamadas } = fuente({ cuerpo: [] }, 'https://ejemplo.supabase.co/');
		await f.obtenerPlazas(EVENTO);
		assert.equal(llamadas.length, 1);
		assert.equal(
			llamadas[0].direccion,
			'https://ejemplo.supabase.co/rest/v1/plazas_por_categoria?evento=eq.torneig-nadal-2026&select=categoria,equipos_actuales',
		);
		assert.deepEqual(llamadas[0].init?.headers, {
			apikey: 'clave-publica',
			Authorization: 'Bearer clave-publica',
		});
	});

	it('convierte equipos_actuales en equiposActuales', async () => {
		const { fuente: f } = fuente({
			cuerpo: [
				{ categoria: 'infantil-cadet', equipos_actuales: 5 },
				{ categoria: 'juvenil-senior', equipos_actuales: 0 },
			],
		});
		assert.deepEqual(await f.obtenerPlazas(EVENTO), {
			tipo: 'ok',
			plazas: [
				{ categoria: 'infantil-cadet', equiposActuales: 5 },
				{ categoria: 'juvenil-senior', equiposActuales: 0 },
			],
		});
	});

	it('una respuesta con error HTTP es un error, no una excepción', async () => {
		const { fuente: f } = fuente({ ok: false, cuerpo: { message: 'no' } });
		assert.deepEqual(await f.obtenerPlazas(EVENTO), { tipo: 'error' });
	});

	it('un fallo de red es un error, no una excepción', async () => {
		const { fuente: f } = fuente({ falla: true });
		assert.deepEqual(await f.obtenerPlazas(EVENTO), { tipo: 'error' });
	});

	it('una fila con otra forma es un error, nunca un número inventado', async () => {
		const casos: unknown[] = [
			{ categoria: 'x', equipos_actuales: 1 },
			[1],
			[{ categoria: 'x' }],
			[{ categoria: 'x', equipos_actuales: -2 }],
			[{ categoria: 'x', equipos_actuales: '3' }],
		];
		for (const cuerpo of casos) {
			const { fuente: f } = fuente({ cuerpo });
			assert.deepEqual(await f.obtenerPlazas(EVENTO), { tipo: 'error' }, JSON.stringify(cuerpo));
		}
	});
});
