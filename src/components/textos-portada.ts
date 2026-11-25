/**
 * PROVISIONAL (B-19, B-21): textos del mapa de Mariola y de la portada. Los de cada destino del mapa
 * (placas, viñetas y frases) están en `src/data/destinos-mapa.json`.
 *
 * Vive aquí, como `textos-navegacion.ts`, `textos-eventos.ts` y `textos-proximament.ts`, porque
 * `src/i18n` es zona de Saúl y la B-07 todavía no está hecha. Al hacer la B-07 se mueve a `src/i18n`.
 * **Montca tiene que revisar estos textos antes de publicar**, en valenciano y en castellano.
 */
import type { Idioma } from './textos-navegacion';

const textos = {
	ca: {
		regionMapa: 'Mapa de Mariola: tria un lloc per a anar a cada apartat',
		llisca: 'Llisca per a veure tota la serra',
		destinosTitulo: 'Tria per on començar',
		cerrarVineta: 'Tanca',
		entra: 'Entra',
		entraConector: 'a',
		cuentaMarcaFija: 'Montca Sports',
		cuentaFalten: 'Falten',
		cuentaDies: 'dies',
		cuentaFaltaUnDia: 'Falta 1 dia',
		cuentaFaltaMenysDUnDia: "Falta menys d'un dia",
		cuentaUnidadDias: 'd',
		cuentaUnidadHoras: 'h',
		cuentaUnidadMinutos: 'min',
		cuentaUnidadSegundos: 's',
		cuentaHui: 'Hui',
		cuentaEnMarxa: 'En marxa',
		cuentaProperament: 'Properament',
		cuentaComencaEl: 'Comença el {fecha}',
		cuentaComencaElA: 'Comença el {fecha} a les {hora}',
		cuentaComencaHui: "Comença l'esdeveniment",
		cuentaVaComencarEl: 'Va començar el {fecha}',
	},
	es: {
		regionMapa: 'Mapa de Mariola: elige un lugar para ir a cada apartado',
		llisca: 'Desliza para ver toda la sierra',
		destinosTitulo: 'Elige por dónde empezar',
		cerrarVineta: 'Cerrar',
		entra: 'Entra',
		entraConector: 'en',
		cuentaMarcaFija: 'Montca Sports',
		cuentaFalten: 'Faltan',
		cuentaDies: 'días',
		cuentaFaltaUnDia: 'Falta 1 día',
		cuentaFaltaMenysDUnDia: 'Falta menos de un día',
		cuentaUnidadDias: 'd',
		cuentaUnidadHoras: 'h',
		cuentaUnidadMinutos: 'min',
		cuentaUnidadSegundos: 's',
		cuentaHui: 'Hoy',
		cuentaEnMarxa: 'En marcha',
		cuentaProperament: 'Próximamente',
		cuentaComencaEl: 'Empieza el {fecha}',
		cuentaComencaElA: 'Empieza el {fecha} a las {hora}',
		cuentaComencaHui: 'Empieza el evento',
		cuentaVaComencarEl: 'Empezó el {fecha}',
	},
} as const;

export type ClaveTextoPortada = keyof (typeof textos)['ca'];

/** Devuelve el texto de `clave` en el idioma pedido. */
export function t(lang: Idioma, clave: ClaveTextoPortada): string {
	return textos[lang][clave];
}
