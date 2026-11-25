// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
// URL pública para og:image y demás enlaces absolutos. En Netlify sale de sus variables:
// URL en producción y DEPLOY_PRIME_URL en las vistas previas. En local, la del servidor de Astro.
const urlPublica =
	process.env.CONTEXT === 'production'
		? process.env.URL
		: (process.env.DEPLOY_PRIME_URL ?? process.env.URL);

export default defineConfig({
	site: urlPublica ?? 'http://localhost:4321',
	// Overpass se descarga al compilar y se sirve desde la propia web: no hay peticiones
	// a servidores de fuentes externos (DESIGN.md). `latin-ext` cubre la "ŀ" del valenciano.
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Overpass',
			cssVariable: '--font-overpass',
			weights: ['400', '600', '800'],
			styles: ['normal'],
			subsets: ['latin', 'latin-ext'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
	],
});
