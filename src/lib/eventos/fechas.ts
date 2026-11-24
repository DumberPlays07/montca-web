/**
 * Formato de las fechas de un evento para mostrarlas (C-04). Los instantes se muestran
 * con el calendario de Madrid, igual que se calcula el estado.
 */
import { fechaEnMadrid } from './estado.ts';

type Idioma = 'ca' | 'es';

/** "20/12" a partir de un instante ISO. */
export function diaMes(instante: string): string {
	const [, mes, dia] = fechaEnMadrid(new Date(instante)).split('-');
	return `${dia}/${mes}`;
}

/** "25/11/2026" a partir de un instante ISO. */
export function diaMesAnio(instante: string): string {
	const [anio, mes, dia] = fechaEnMadrid(new Date(instante)).split('-');
	return `${dia}/${mes}/${anio}`;
}

/** "27·12" a partir de una fecha `AAAA-MM-DD` (los numerales grandes de las jornadas). */
export function numeralJornada(fecha: string): string {
	const [, mes, dia] = fecha.split('-');
	return `${dia}·${mes}`;
}

/** "Diumenge" / "Domingo" a partir de una fecha `AAAA-MM-DD`. */
export function diaDeLaSemana(fecha: string, lang: Idioma): string {
	const [anio, mes, dia] = fecha.split('-').map(Number);
	// En UTC para que el día no cambie según la zona horaria de quien construye la web.
	const nombre = new Intl.DateTimeFormat(lang, { weekday: 'long', timeZone: 'UTC' }).format(
		new Date(Date.UTC(anio, mes - 1, dia)),
	);
	return nombre.charAt(0).toLocaleUpperCase(lang) + nombre.slice(1);
}
