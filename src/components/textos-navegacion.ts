/**
 * PROVISIONAL (B-09): textos y rutas de la cabecera, el pie, la barra inferior y el
 * botón de WhatsApp.
 *
 * Vive aquí porque `src/i18n` es zona de Saúl y la B-07 todavía no está hecha.
 * Al hacer la B-07 hay que mover este diccionario a `src/i18n` (o fundirlo con el
 * suyo) y cambiar los `import` de Cabecera, Pie, BarraInferior, EnlaceVolver, BotonWhatsApp
 * y contacto.ts.
 * La forma `{ ca: {...}, es: {...} }` + `t(lang, clave)` está pensada para eso.
 *
 * Las rutas también son provisionales: las páginas las crean otras tareas y la
 * forma de las URL en castellano la decide la B-07. Mientras tanto, en castellano
 * se usa la misma ruta con el prefijo `/es`.
 */

export type Idioma = 'ca' | 'es';

const textos = {
	ca: {
		saltarAlContenido: 'Salta al contingut',
		navegacionPrincipal: 'Navegació principal',
		navegacionRapida: 'Accessos ràpids',
		navegacionPie: 'Seccions',
		navegacionLegal: 'Avisos legals',
		abrirMenu: 'Obri el menú',
		cerrarMenu: 'Tanca el menú',
		menu: 'Menú',
		inicio: 'Inici',
		actividades: 'Activitats',
		agenda: 'Agenda',
		rutas: 'Montca Rutes',
		repte: 'Repte 5 Cims',
		sports: 'Montca Sports',
		eventos: 'Esdeveniments',
		escuelas: 'Escoles i AMPA',
		quienesSomos: 'Qui som',
		contacto: 'Contacte',
		reserva: 'Reserva',
		whatsapp: 'WhatsApp',
		mensajeWhatsapp: 'Hola! Vull informació sobre les activitats de Montca.',
		escribirWhatsapp: "Escriu-nos per WhatsApp (s'obri en una pestanya nova)",
		idiomaActual: 'VAL',
		otroIdioma: 'CAST',
		// Nombre del otro idioma escrito en ese idioma (va con su `lang`).
		nombreOtroIdioma: 'Castellano',
		lema: 'Associació juvenil i esportiva de Cocentaina. Activitats a la Serra de Mariola.',
		correo: 'Correu',
		avisoLegal: 'Avís legal',
		privacidad: 'Privacitat',
		cookies: 'Cookies',
		volver: 'Tornar',
		altImagenCompartir: 'Mapa il·lustrat de la Serra de Mariola, amb Cocentaina al peu de la serra.',
		altLogoCompartir: 'Logotip de Montca Actiu: un hexàgon amb la muntanya i la torre del castell.',
	},
	es: {
		saltarAlContenido: 'Saltar al contenido',
		navegacionPrincipal: 'Navegación principal',
		navegacionRapida: 'Accesos rápidos',
		navegacionPie: 'Secciones',
		navegacionLegal: 'Avisos legales',
		abrirMenu: 'Abrir el menú',
		cerrarMenu: 'Cerrar el menú',
		menu: 'Menú',
		inicio: 'Inicio',
		actividades: 'Actividades',
		agenda: 'Agenda',
		rutas: 'Montca Rutes',
		repte: 'Repte 5 Cims',
		sports: 'Montca Sports',
		eventos: 'Eventos',
		escuelas: 'Escuelas y AMPA',
		quienesSomos: 'Quiénes somos',
		contacto: 'Contacto',
		reserva: 'Reserva',
		whatsapp: 'WhatsApp',
		mensajeWhatsapp: '¡Hola! Quiero información sobre las actividades de Montca.',
		escribirWhatsapp: 'Escríbenos por WhatsApp (se abre en una pestaña nueva)',
		idiomaActual: 'CAST',
		otroIdioma: 'VAL',
		nombreOtroIdioma: 'Valencià',
		lema: 'Asociación juvenil y deportiva de Cocentaina. Actividades en la Serra de Mariola.',
		correo: 'Correo',
		avisoLegal: 'Aviso legal',
		privacidad: 'Privacidad',
		cookies: 'Cookies',
		volver: 'Volver',
		altImagenCompartir: 'Mapa ilustrado de la Serra de Mariola, con Cocentaina al pie de la sierra.',
		altLogoCompartir: 'Logotipo de Montca Actiu: un hexágono con la montaña y la torre del castillo.',
	},
} as const;

export type ClaveTexto = keyof (typeof textos)['ca'];

/** Devuelve el texto de `clave` en el idioma pedido. */
export function t(lang: Idioma, clave: ClaveTexto): string {
	return textos[lang][clave];
}

/** Devuelve el texto de `clave` en los dos idiomas (por ejemplo, para un texto alternativo). */
export function textoEnLosDosIdiomas(clave: ClaveTexto): Record<Idioma, string> {
	return { ca: textos.ca[clave], es: textos.es[clave] };
}

/** Rutas en valenciano, que es el idioma por defecto (sin prefijo). */
const rutasValenciano = {
	inicio: '/',
	actividades: '/activitats/',
	agenda: '/agenda/',
	rutas: '/rutes/',
	repte: '/repte-5-cims/',
	sports: '/montca-sports/',
	eventos: '/esdeveniments/',
	escuelas: '/escoles-i-ampa/',
	quienesSomos: '/qui-som/',
	contacto: '/contacte/',
	avisoLegal: '/avis-legal/',
	privacidad: '/privacitat/',
	cookies: '/cookies/',
} as const;

export type ClaveRuta = keyof typeof rutasValenciano;

const PREFIJO_CASTELLANO = '/es';

/** Devuelve la ruta de una sección en el idioma pedido. */
export function ruta(lang: Idioma, clave: ClaveRuta): string {
	const rutaValenciano = rutasValenciano[clave];
	return lang === 'ca' ? rutaValenciano : `${PREFIJO_CASTELLANO}${rutaValenciano}`;
}

/** La página de error: ya es bilingüe, así que no tiene "la misma página" en el otro idioma. */
const RUTA_404 = /^\/404(\.html|\/)?$/;

/**
 * Devuelve la misma página en el otro idioma (para el selector VAL / CAST). La 404 no tiene
 * traducción: su selector lleva a la portada del otro idioma, en vez de a otro 404.
 */
export function rutaEnOtroIdioma(lang: Idioma, rutaActual: string): string {
	if (RUTA_404.test(rutaActual)) {
		return lang === 'ca' ? `${PREFIJO_CASTELLANO}/` : '/';
	}
	if (lang === 'es') {
		const sinPrefijo = rutaActual.slice(PREFIJO_CASTELLANO.length);
		return sinPrefijo === '' ? '/' : sinPrefijo;
	}
	return `${PREFIJO_CASTELLANO}${rutaActual}`;
}

/** Indica si `rutaActual` está dentro de la sección `clave` (para marcar el menú). */
export function esSeccionActual(lang: Idioma, clave: ClaveRuta, rutaActual: string): boolean {
	const rutaSeccion = ruta(lang, clave);
	if (clave === 'inicio') {
		return rutaActual === rutaSeccion;
	}
	return rutaActual.startsWith(rutaSeccion);
}
