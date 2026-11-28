import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	type EntornoFuente,
	type PlazasCategoria,
	elegirFuente,
	fuenteIncrustada,
	fuenteNinguna,
	nombreDeFuente,
	validarEntornoFuente,
} from './fuente-plazas.ts';

const EVENTO = 'torneig-nadal-2026';

const PLAZAS: PlazasCategoria[] = [
	{ categoria: 'infantil-cadet', equiposActuales: 5 },
	{ categoria: 'juvenil-senior', equiposActuales: 2 },
];

/** Una página falsa con, como mucho, un `<script type="application/json">` de plazas. */
function paginaCon(texto: string | null, evento = EVENTO) {
	return {
		querySelector(selector: string) {
			const esperado = `script[data-plazas-publicas="${evento}"]`;
			return selector === esperado && texto !== null ? { textContent: texto } : null;
		},
	};
}

describe('nombreDeFuente', () => {
	it('sin variable vale ninguna', () => {
		assert.equal(nombreDeFuente({}), 'ninguna');
	});

	it('una variable vacía o con espacios también vale ninguna', () => {
		assert.equal(nombreDeFuente({ PUBLIC_FUENTE_PLAZAS: '' }), 'ninguna');
		assert.equal(nombreDeFuente({ PUBLIC_FUENTE_PLAZAS: '  ' }), 'ninguna');
	});

	it('reconoce ninguna, prueba y supabase', () => {
		for (const nombre of ['ninguna', 'prueba', 'supabase'] as const) {
			assert.equal(nombreDeFuente({ PUBLIC_FUENTE_PLAZAS: nombre }), nombre);
		}
	});

	it('un valor desconocido avisa en vez de caer en silencio en otra fuente', () => {
		assert.throws(() => nombreDeFuente({ PUBLIC_FUENTE_PLAZAS: 'pruebas' }), /PUBLIC_FUENTE_PLAZAS.*pruebas/);
	});
});

describe('validarEntornoFuente', () => {
	const supabaseCompleto: EntornoFuente = {
		PUBLIC_FUENTE_PLAZAS: 'supabase',
		PUBLIC_SUPABASE_URL: 'https://ejemplo.supabase.co',
		PUBLIC_SUPABASE_ANON_KEY: 'clave-publica',
	};

	it('prueba en producción de Netlify hace fallar el build (FR-035)', () => {
		assert.throws(
			() => validarEntornoFuente({ PUBLIC_FUENTE_PLAZAS: 'prueba', CONTEXT: 'production' }),
			/prueba.*producci/is,
		);
	});

	it('prueba en local y en las vistas previas es válida', () => {
		for (const contexto of [undefined, 'dev', 'deploy-preview', 'branch-deploy']) {
			assert.equal(validarEntornoFuente({ PUBLIC_FUENTE_PLAZAS: 'prueba', CONTEXT: contexto }), 'prueba');
		}
	});

	it('ninguna es válida en producción y es lo que pasa sin configurar nada', () => {
		assert.equal(validarEntornoFuente({ CONTEXT: 'production' }), 'ninguna');
		assert.equal(validarEntornoFuente({ PUBLIC_FUENTE_PLAZAS: 'ninguna', CONTEXT: 'production' }), 'ninguna');
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
		assert.deepEqual(await fuenteNinguna.obtenerPlazas(EVENTO), { tipo: 'sin-fuente' });
	});
});

describe('fuenteIncrustada', () => {
	it('lee los recuentos que la página dejó al construirse', async () => {
		const fuente = fuenteIncrustada(paginaCon(JSON.stringify(PLAZAS)));
		assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'ok', plazas: PLAZAS });
	});

	it('un recuento de cero es válido: aún no hay equipos', async () => {
		const ceros = PLAZAS.map((plazas) => ({ ...plazas, equiposActuales: 0 }));
		const fuente = fuenteIncrustada(paginaCon(JSON.stringify(ceros)));
		assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'ok', plazas: ceros });
	});

	it('sin los datos en la página no hay fuente', async () => {
		const fuente = fuenteIncrustada(paginaCon(null));
		assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'sin-fuente' });
	});

	it('los datos de otro evento no valen', async () => {
		const fuente = fuenteIncrustada(paginaCon(JSON.stringify(PLAZAS), 'otro-evento'));
		assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'sin-fuente' });
	});

	it('un JSON roto es un error, no una excepción', async () => {
		const fuente = fuenteIncrustada(paginaCon('[{"categoria":'));
		assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'error' });
	});

	it('algo que no es una lista de recuentos válidos es un error', async () => {
		const casos = [
			'{"categoria":"x"}',
			'"hola"',
			'[1,2]',
			'[{"categoria":"x"}]',
			'[{"categoria":"x","equiposActuales":-1}]',
			'[{"categoria":"x","equiposActuales":1.5}]',
			'[{"categoria":"x","equiposActuales":"3"}]',
		];
		for (const texto of casos) {
			const fuente = fuenteIncrustada(paginaCon(texto));
			assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'error' }, texto);
		}
	});
});

describe('elegirFuente', () => {
	it('ninguna: no hay fuente aunque la página lleve datos', async () => {
		const fuente = elegirFuente({ PUBLIC_FUENTE_PLAZAS: 'ninguna' }, paginaCon(JSON.stringify(PLAZAS)));
		assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'sin-fuente' });
	});

	it('por defecto es ninguna', async () => {
		const fuente = elegirFuente({}, paginaCon(JSON.stringify(PLAZAS)));
		assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'sin-fuente' });
	});

	it('la variable antigua PUBLIC_FUENTE_EQUIPOS ya no se lee', async () => {
		const entornoAntiguo = { PUBLIC_FUENTE_EQUIPOS: 'prueba' } as EntornoFuente;
		const fuente = elegirFuente(entornoAntiguo, paginaCon(JSON.stringify(PLAZAS)));
		assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'sin-fuente' });
	});

	it('prueba: lee la página', async () => {
		const fuente = elegirFuente({ PUBLIC_FUENTE_PLAZAS: 'prueba' }, paginaCon(JSON.stringify(PLAZAS)));
		assert.deepEqual(await fuente.obtenerPlazas(EVENTO), { tipo: 'ok', plazas: PLAZAS });
	});
});
