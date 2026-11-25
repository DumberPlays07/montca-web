import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	type EquipoPublico,
	type EntornoFuente,
	elegirFuente,
	fuenteIncrustada,
	fuenteNinguna,
	nombreDeFuente,
	validarEntornoFuente,
} from './fuente-equipos.ts';

const EVENTO = 'torneig-nadal-2026';

const EQUIPO: EquipoPublico = {
	categoria: 'infantil-cadet',
	nombre: 'Prova · Els Falcons',
	jugadoresOcultos: false,
	jugadores: [{ nombrePublico: 'Laia', dorsal: 7, esCapitan: true }],
};

/** Una página falsa con, como mucho, un `<script type="application/json">` de equipos. */
function paginaCon(texto: string | null, evento = EVENTO) {
	return {
		querySelector(selector: string) {
			const esperado = `script[data-equipos-publicos="${evento}"]`;
			return selector === esperado && texto !== null ? { textContent: texto } : null;
		},
	};
}

describe('nombreDeFuente', () => {
	it('sin variable vale ninguna', () => {
		assert.equal(nombreDeFuente({}), 'ninguna');
	});

	it('una variable vacía o con espacios también vale ninguna', () => {
		assert.equal(nombreDeFuente({ PUBLIC_FUENTE_EQUIPOS: '' }), 'ninguna');
		assert.equal(nombreDeFuente({ PUBLIC_FUENTE_EQUIPOS: '  ' }), 'ninguna');
	});

	it('reconoce ninguna, prueba y supabase', () => {
		for (const nombre of ['ninguna', 'prueba', 'supabase'] as const) {
			assert.equal(nombreDeFuente({ PUBLIC_FUENTE_EQUIPOS: nombre }), nombre);
		}
	});

	it('un valor desconocido avisa en vez de caer en silencio en otra fuente', () => {
		assert.throws(() => nombreDeFuente({ PUBLIC_FUENTE_EQUIPOS: 'pruebas' }), /PUBLIC_FUENTE_EQUIPOS.*pruebas/);
	});
});

describe('validarEntornoFuente', () => {
	const supabaseCompleto: EntornoFuente = {
		PUBLIC_FUENTE_EQUIPOS: 'supabase',
		PUBLIC_SUPABASE_URL: 'https://ejemplo.supabase.co',
		PUBLIC_SUPABASE_ANON_KEY: 'clave-publica',
	};

	it('prueba en producción de Netlify hace fallar el build (FR-035)', () => {
		assert.throws(
			() => validarEntornoFuente({ PUBLIC_FUENTE_EQUIPOS: 'prueba', CONTEXT: 'production' }),
			/prueba.*producci/is,
		);
	});

	it('prueba en local y en las vistas previas es válida', () => {
		for (const contexto of [undefined, 'dev', 'deploy-preview', 'branch-deploy']) {
			assert.equal(validarEntornoFuente({ PUBLIC_FUENTE_EQUIPOS: 'prueba', CONTEXT: contexto }), 'prueba');
		}
	});

	it('ninguna es válida en producción y es lo que pasa sin configurar nada', () => {
		assert.equal(validarEntornoFuente({ CONTEXT: 'production' }), 'ninguna');
		assert.equal(validarEntornoFuente({ PUBLIC_FUENTE_EQUIPOS: 'ninguna', CONTEXT: 'production' }), 'ninguna');
	});

	it('supabase sin URL hace fallar el build', () => {
		assert.throws(() => validarEntornoFuente({ ...supabaseCompleto, PUBLIC_SUPABASE_URL: '' }), /PUBLIC_SUPABASE_URL/);
		assert.throws(() => validarEntornoFuente({ ...supabaseCompleto, PUBLIC_SUPABASE_URL: undefined }), /PUBLIC_SUPABASE_URL/);
	});

	it('supabase sin clave pública hace fallar el build', () => {
		assert.throws(() => validarEntornoFuente({ ...supabaseCompleto, PUBLIC_SUPABASE_ANON_KEY: '' }), /PUBLIC_SUPABASE_ANON_KEY/);
	});

	it('supabase con URL y clave es válida, también en producción', () => {
		assert.equal(validarEntornoFuente({ ...supabaseCompleto, CONTEXT: 'production' }), 'supabase');
	});
});

describe('fuenteNinguna', () => {
	it('no tiene fuente', async () => {
		assert.deepEqual(await fuenteNinguna.obtenerEquipos(EVENTO), { tipo: 'sin-fuente' });
	});
});

describe('fuenteIncrustada', () => {
	it('lee los equipos que la página dejó al construirse', async () => {
		const fuente = fuenteIncrustada(paginaCon(JSON.stringify([EQUIPO])));
		assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'ok', equipos: [EQUIPO] });
	});

	it('una lista vacía es un resultado válido: aún no hay equipos confirmados', async () => {
		const fuente = fuenteIncrustada(paginaCon('[]'));
		assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'ok', equipos: [] });
	});

	it('sin los datos en la página no hay fuente', async () => {
		const fuente = fuenteIncrustada(paginaCon(null));
		assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'sin-fuente' });
	});

	it('los datos de otro evento no valen', async () => {
		const fuente = fuenteIncrustada(paginaCon(JSON.stringify([EQUIPO]), 'otro-evento'));
		assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'sin-fuente' });
	});

	it('un JSON roto es un error, no una excepción', async () => {
		const fuente = fuenteIncrustada(paginaCon('[{"nombre":'));
		assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'error' });
	});

	it('algo que no es una lista de equipos es un error', async () => {
		for (const texto of ['{"nombre":"x"}', '"hola"', '[1,2]', '[{"nombre":"x"}]']) {
			const fuente = fuenteIncrustada(paginaCon(texto));
			assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'error' }, texto);
		}
	});
});

describe('elegirFuente', () => {
	it('ninguna: no hay fuente aunque la página lleve datos', async () => {
		const fuente = elegirFuente({ PUBLIC_FUENTE_EQUIPOS: 'ninguna' }, paginaCon(JSON.stringify([EQUIPO])));
		assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'sin-fuente' });
	});

	it('por defecto es ninguna', async () => {
		const fuente = elegirFuente({}, paginaCon(JSON.stringify([EQUIPO])));
		assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'sin-fuente' });
	});

	it('prueba: lee la página', async () => {
		const fuente = elegirFuente({ PUBLIC_FUENTE_EQUIPOS: 'prueba' }, paginaCon(JSON.stringify([EQUIPO])));
		assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'ok', equipos: [EQUIPO] });
	});

	it('supabase: de momento devuelve sin fuente, hasta que Saúl haga la capa de datos (T036)', async () => {
		const fuente = elegirFuente(
			{ PUBLIC_FUENTE_EQUIPOS: 'supabase', PUBLIC_SUPABASE_URL: 'https://ejemplo.supabase.co', PUBLIC_SUPABASE_ANON_KEY: 'clave' },
			paginaCon(null),
		);
		assert.deepEqual(await fuente.obtenerEquipos(EVENTO), { tipo: 'sin-fuente' });
	});
});
