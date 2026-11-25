/** Datos de un evento tal como los da la colección `eventos` (src/content.config.ts). */
import type { CollectionEntry } from 'astro:content';

export type DatosEvento = CollectionEntry<'eventos'>['data'];
