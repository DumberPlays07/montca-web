// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
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
