/**
 * PROVISIONAL (B-19): textos del mapa de Mariola y de la portada.
 *
 * Vive aquí, como `textos-navegacion.ts`, `textos-eventos.ts` y `textos-proximament.ts`, porque
 * `src/i18n` es zona de Saúl y la B-07 todavía no está hecha. Al hacer la B-07 se mueve a `src/i18n`.
 * **Montca tiene que revisar estos textos antes de publicar**, en valenciano y en castellano.
 *
 * Los huecos entre llaves (`{pico}`) se rellenan con `rellenar()` de `textos-eventos.ts`.
 */
import type { Idioma } from './textos-navegacion';

const textos = {
	ca: {
		regionMapa: 'Mapa de la Serra de Mariola amb els cims',
		llisca: 'Llisca per a veure tota la serra',
		cimsTitulo: 'Els cims de la serra',
		cimsAyuda: "Tria un cim per a veure'n la fitxa.",
		actividadesPico: 'Activitats en aquest cim: pròximament',
		cerrarFicha: 'Tanca la fitxa',
		mensajePico: 'Hola! Vull informació sobre les activitats del cim: {pico}.',
		cuentaMarcaFija: 'Montca Sports',
		cuentaFalten: 'Falten',
		cuentaDies: 'dies',
		cuentaUnaHora: 'hora',
		cuentaHores: 'hores',
		cuentaHui: 'Hui',
		cuentaEnMarxa: 'En marxa',
		cuentaProperament: 'Properament',
		cuentaComencaEl: 'Comença el {fecha}',
		cuentaComencaHui: "Comença l'esdeveniment",
		cuentaVaComencarEl: 'Va començar el {fecha}',
	},
	es: {
		regionMapa: 'Mapa de la Serra de Mariola con las cimas',
		llisca: 'Desliza para ver toda la sierra',
		cimsTitulo: 'Las cimas de la sierra',
		cimsAyuda: 'Elige una cima para ver su ficha.',
		actividadesPico: 'Actividades en esta cima: próximamente',
		cerrarFicha: 'Cerrar la ficha',
		mensajePico: '¡Hola! Quiero información sobre las actividades de la cima: {pico}.',
		cuentaMarcaFija: 'Montca Sports',
		cuentaFalten: 'Faltan',
		cuentaDies: 'días',
		cuentaUnaHora: 'hora',
		cuentaHores: 'horas',
		cuentaHui: 'Hoy',
		cuentaEnMarxa: 'En marcha',
		cuentaProperament: 'Próximamente',
		cuentaComencaEl: 'Empieza el {fecha}',
		cuentaComencaHui: 'Empieza el evento',
		cuentaVaComencarEl: 'Empezó el {fecha}',
	},
} as const;

export type ClaveTextoPortada = keyof (typeof textos)['ca'];

/** Devuelve el texto de `clave` en el idioma pedido. */
export function t(lang: Idioma, clave: ClaveTextoPortada): string {
	return textos[lang][clave];
}
