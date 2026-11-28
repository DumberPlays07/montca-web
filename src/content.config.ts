/**
 * Colecciones de contenido de la web.
 *
 * `eventos` (C-04): un archivo YAML por evento en `src/content/eventos/`. El nombre del
 * archivo es su `id` y forma la ruta (`/esdeveniments/<id>/`). Los campos y sus reglas
 * están en `specs/001-eventos-torneo/data-model.md` §1. Si un evento no cumple el esquema
 * (falta un idioma, una fecha sin diferencia horaria…), el build falla.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Texto visible: obligatorio en valenciano y en castellano (constitución II). */
const texto = z.object({
	ca: z.string().trim().min(1, 'falta el texto en valenciano'),
	es: z.string().trim().min(1, 'falta el texto en castellano'),
});

/** Día de una jornada, sin hora: `AAAA-MM-DD`. */
const fechaDia = z.iso.date();

/**
 * Instante con la diferencia horaria escrita (`2026-11-25T00:00:00+01:00`), para que el
 * estado se calcule igual en cualquier navegador (research R6). Sin ella, falla.
 */
const instante = z.iso.datetime({ offset: true, local: false });

const categoria = z
	.object({
		id: z.string().regex(/^[a-z0-9-]+$/, 'el id de la categoría va en minúsculas y con guiones'),
		nombre: texto,
		nacidos: texto,
		maxEquipos: z.int().positive(),
		minJugadores: z.int().positive(),
		maxJugadores: z.int().positive(),
	})
	.refine((cat) => cat.minJugadores <= cat.maxJugadores, {
		message: 'minJugadores no puede ser mayor que maxJugadores',
	});

const eventos = defineCollection({
	loader: glob({ pattern: '*.{yaml,yml}', base: './src/content/eventos' }),
	schema: ({ image }) =>
		z
			.object({
				nombre: texto,
				marca: z.string().trim().min(1),
				resumen: texto,
				jornadas: z
					.array(
						z.object({
							fecha: fechaDia,
							nombre: texto,
							// Hora de inicio en Madrid. Opcional: sin ella la cuenta atrás de la portada cuenta hasta las 00:00.
							hora: z
								.string()
								.regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'la hora va como HH:MM, por ejemplo "10:30"')
								.optional(),
						}),
					)
					.min(1),
				lugar: z.object({
					nombre: z.string().trim().min(1),
					direccion: z.string().trim(),
					localidad: z.string().trim().min(1),
				}),
				deportes: texto,
				precio: z.object({
					texto: texto,
					confirmado: z.boolean(),
					importe: z.number().nonnegative().optional(),
				}),
				inscripcion: z.object({
					apertura: instante,
					cierre: instante,
					cerradaAMano: z.boolean().default(false),
					url: z.union([z.literal(''), z.url()]).default(''),
				}),
				categorias: z.array(categoria).min(1),
				normas: z.array(texto).optional(),
				preguntas: z.array(z.object({ pregunta: texto, respuesta: texto })).optional(),
				imagenCompartir: image().optional(),
			})
			.superRefine((evento, ctx) => {
				const { inscripcion, precio, jornadas } = evento;
				if (Date.parse(inscripcion.cierre) <= Date.parse(inscripcion.apertura)) {
					ctx.addIssue({
						code: 'custom',
						path: ['inscripcion', 'cierre'],
						message: 'el cierre tiene que ser posterior a la apertura',
					});
				}
				if (precio.importe !== undefined && !precio.confirmado) {
					ctx.addIssue({
						code: 'custom',
						path: ['precio', 'importe'],
						message: 'el importe solo se pone con confirmado: true (constitución III)',
					});
				}
				// Las fechas AAAA-MM-DD se ordenan bien como texto.
				const ordenadas = jornadas.every((j, i) => i === 0 || jornadas[i - 1].fecha < j.fecha);
				if (!ordenadas) {
					ctx.addIssue({
						code: 'custom',
						path: ['jornadas'],
						message: 'las jornadas van ordenadas por fecha y sin repetir',
					});
				}
				const ids = evento.categorias.map((cat) => cat.id);
				if (new Set(ids).size !== ids.length) {
					ctx.addIssue({ code: 'custom', path: ['categorias'], message: 'hay ids de categoría repetidos' });
				}
			}),
});

export const collections = { eventos };
