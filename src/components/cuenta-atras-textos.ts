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
	/** Solo para el lector de pantalla ("Falten"); vacío cuando el valor ya es una frase. */
	prefijo: string;
	/** El número grande ("32") o una palabra ("Hui", "En marxa", "Properament"). */
	valor: string;
	/** "dies" u "hores"; vacío cuando el valor es una palabra. */
	unidad: string;
	/** Una línea con la fecha de inicio; vacía sin evento. */
	detalle: string;
}

/**
 * @param fechaInicio la primera jornada como "27/12"; no se usa con `proximament`.
 */
export function textosCuentaAtras(lang: Idioma, cuenta: CuentaAtras, fechaInicio: string): TextosCuentaAtras {
	const fecha = { fecha: fechaInicio };
	switch (cuenta.tipo) {
		case 'dias':
			return {
				prefijo: t(lang, 'cuentaFalten'),
				valor: String(cuenta.dias),
				unidad: t(lang, 'cuentaDies'),
				detalle: rellenar(t(lang, 'cuentaComencaEl'), fecha),
			};
		case 'horas':
			return {
				prefijo: t(lang, 'cuentaFalten'),
				valor: String(cuenta.horas),
				unidad: t(lang, cuenta.horas === 1 ? 'cuentaUnaHora' : 'cuentaHores'),
				detalle: rellenar(t(lang, 'cuentaComencaEl'), fecha),
			};
		case 'hoy':
			return { prefijo: '', valor: t(lang, 'cuentaHui'), unidad: '', detalle: t(lang, 'cuentaComencaHui') };
		case 'en-curso':
			return {
				prefijo: '',
				valor: t(lang, 'cuentaEnMarxa'),
				unidad: '',
				detalle: rellenar(t(lang, 'cuentaVaComencarEl'), fecha),
			};
		case 'proximament':
			return { prefijo: '', valor: t(lang, 'cuentaProperament'), unidad: '', detalle: '' };
	}
}
