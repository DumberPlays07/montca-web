/**
 * Reglas comunes de las imágenes de la web (B-12): las usan Foto.astro y BaseLayout.astro.
 */
import type { Idioma } from './textos-navegacion';

/** Texto alternativo de una imagen en los dos idiomas de la web (constitución II y V). */
export type TextoAlternativo = Record<Idioma, string>;

/**
 * Ancho máximo del contenido (72rem, `--ancho-maximo` en global.css) en píxeles.
 * Una foto nunca se muestra más ancha, así que no se generan versiones mayores que el doble.
 */
export const ANCHO_MAXIMO_CONTENIDO = 1152;

/**
 * Corta el build si falta el texto alternativo en alguno de los dos idiomas o está vacío.
 * Se comprueban los dos aunque la página esté en un solo idioma, para que nunca se publique
 * una imagen sin su texto en el otro (requisito de C-01).
 *
 * @param alt texto alternativo recibido
 * @param donde qué imagen y en qué página, para que el mensaje de error diga dónde mirar
 * @throws Error si falta `ca` o `es`, o si alguno está vacío o solo tiene espacios
 */
export function exigirTextoAlternativo(alt: TextoAlternativo | undefined, donde: string): void {
	const idiomas: Idioma[] = ['ca', 'es'];
	const idiomasQueFaltan = idiomas.filter((idioma) => {
		const texto = alt?.[idioma];
		return typeof texto !== 'string' || texto.trim() === '';
	});
	if (idiomasQueFaltan.length > 0) {
		throw new Error(
			`Falta el texto alternativo (${idiomasQueFaltan.join(' y ')}) de ${donde}. ` +
				'Toda imagen necesita `alt={{ ca: "…", es: "…" }}` con texto en los dos idiomas.',
		);
	}
}
