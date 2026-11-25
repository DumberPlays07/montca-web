/**
 * Textos de la cuenta atrás de la portada (B-13) a partir de su estado.
 *
 * Los usan el componente, al construir, y el script del navegador, al recalcular: así el texto
 * es el mismo en los dos sitios. Los textos del diccionario son provisionales (`textos-portada.ts`).
 */
import type { CuentaAtras } from '../lib/eventos/cuenta-atras';
import { rellenar } from './textos-eventos';
import type { Idioma } from './textos-navegacion';
import { t } from './textos-portada';

export interface TextosCuentaAtras {
	/**
	 * Frase fija para el lector de pantalla mientras se ven las casillas ("Falten 32 dies"); solo
	 * cambia al cambiar de día. Vacía cuando lo que se ve es una palabra.
	 */
	frase: string;
	/** La palabra grande ("Hui", "En marxa", "Properament"); vacía mientras se ven las casillas. */
	valor: string;
	/** Una línea con la fecha de inicio; vacía sin evento. */
	detalle: string;
}

/**
 * @param fechaInicio la primera jornada como "27/12"; no se usa con `proximament`.
 * @param horaInicio la hora de inicio ("10:30"), si la jornada la trae.
 */
export function textosCuentaAtras(
	lang: Idioma,
	cuenta: CuentaAtras,
	fechaInicio: string,
	horaInicio?: string,
): TextosCuentaAtras {
	const fecha = { fecha: fechaInicio };
	switch (cuenta.tipo) {
		case 'cuenta':
			return {
				frase: fraseFaltan(lang, cuenta.dias),
				valor: '',
				detalle:
					horaInicio === undefined
						? rellenar(t(lang, 'cuentaComencaEl'), fecha)
						: rellenar(t(lang, 'cuentaComencaElA'), { ...fecha, hora: horaInicio }),
			};
		case 'hoy':
			return { frase: '', valor: t(lang, 'cuentaHui'), detalle: t(lang, 'cuentaComencaHui') };
		case 'en-curso':
			return { frase: '', valor: t(lang, 'cuentaEnMarxa'), detalle: rellenar(t(lang, 'cuentaVaComencarEl'), fecha) };
		case 'proximament':
			return { frase: '', valor: t(lang, 'cuentaProperament'), detalle: '' };
	}
}

/** "Falten 32 dies", "Falta 1 dia" o "Falta menys d'un dia": los días enteros que quedan. */
function fraseFaltan(lang: Idioma, dias: number): string {
	if (dias === 0) {
		return t(lang, 'cuentaFaltaMenysDUnDia');
	}
	if (dias === 1) {
		return t(lang, 'cuentaFaltaUnDia');
	}
	return `${t(lang, 'cuentaFalten')} ${dias} ${t(lang, 'cuentaDies')}`;
}
