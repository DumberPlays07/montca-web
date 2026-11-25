/**
 * Imagen por defecto para compartir la web en redes y mensajería (B-12): el logo completo de
 * Montca Actiu sobre fondo blanco, en 1200 × 630. La genera scripts/logo/generar_piezas.py.
 * Una página con una imagen propia (un evento) la pasa en `image` y sustituye a esta.
 */
import logo from '../assets/logo/imagen-compartir.png';
import type { ImageMetadata } from 'astro';
import type { TextoAlternativo } from './imagenes';
import { textoEnLosDosIdiomas } from './textos-navegacion';

export const IMAGEN_COMPARTIR_POR_DEFECTO: { src: ImageMetadata; alt: TextoAlternativo } = {
	src: logo,
	alt: textoEnLosDosIdiomas('altLogoCompartir'),
};
