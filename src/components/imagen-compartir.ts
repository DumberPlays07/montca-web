/**
 * Imagen por defecto para compartir la web en redes y mensajería (B-12).
 *
 * TODO: sustituir por la imagen definitiva para compartir cuando lleguen el logo (A-07)
 * y la imagen de B-14. Mientras tanto se usa el mapa de Mariola.
 */
import mapa from '../assets/mapa/mapa-mariola.png';
import type { ImageMetadata } from 'astro';
import type { TextoAlternativo } from './imagenes';
import { textoEnLosDosIdiomas } from './textos-navegacion';

export const IMAGEN_COMPARTIR_POR_DEFECTO: { src: ImageMetadata; alt: TextoAlternativo } = {
	src: mapa,
	alt: textoEnLosDosIdiomas('altImagenCompartir'),
};
