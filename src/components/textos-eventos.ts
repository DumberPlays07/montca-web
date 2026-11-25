/**
 * PROVISIONAL (C-04, hasta B-07): textos de la interfaz de la sección Eventos, la página
 * de cada evento y la franja de la portada.
 *
 * Vive aquí, como `textos-navegacion.ts`, porque `src/i18n` es zona de Saúl y la B-07
 * todavía no está hecha. Al hacer la B-07 se mueve a `src/i18n` y se cambian los `import`
 * de `src/components/eventos/`.
 *
 * Los datos propios de cada evento (nombre, fechas, preguntas…) no van aquí: salen de su
 * YAML en `src/content/eventos/`. Los textos nuevos los revisa Montca antes de publicar.
 *
 * Los huecos entre llaves (`{fecha}`) se rellenan con `rellenar()`.
 */
import type { Idioma } from './textos-navegacion';

const textos = {
	ca: {
		esdeveniments: 'Esdeveniments',
		descripcionEsdeveniments: 'Esdeveniments de Montca: tornejos i trobades a Cocentaina i la Serra de Mariola.',
		esdeveniment: 'Esdeveniment',
		estadoProximament: 'Inscripcions a partir del {fecha}',
		estadoObertes: 'Inscripcions obertes fins al {fecha}',
		estadoCompletes: "Places completes – llista d'espera",
		estadoTancades: 'Inscripcions tancades',
		inscriure: "Inscriure's",
		escribenosParaApuntarte: "Escriu-nos per a apuntar-te",
		mensajeWhatsappEvento: 'Hola! Vull apuntar el meu equip al {evento}.',
		asuntoCorreoEvento: 'Inscripció al {evento}',
		respuestaEnMenosDe24h: 'Et responem en menys de 24 hores.',
		comArribar: 'Com arribar',
		lloc: 'Lloc',
		nuevaPestana: "s'obri en una pestanya nova",
		precioPendiente: 'preu final pendent',
		queCalSaber: 'Què cal saber',
		categories: 'Categories',
		categoria: 'Categoria',
		nascuts: 'Nascuts',
		equiposMaximo: 'Equips (màx.)',
		jugadoresPorEquipo: 'Jugadors per equip',
		rangoJugadores: 'De {min} a {max}',
		preu: 'Preu',
		terminiInscripcio: "Termini d'inscripció",
		plazoInscripcion: 'Del {apertura} al {cierre}, o abans si les places es completen.',
		normes: 'Normes',
		preguntesFrequents: 'Preguntes freqüents',
		placesIEquips: 'Places i equips',
		placesLliures: '{libres} de {max} places lliures',
		completa: 'Completa',
		llistaEspera: "Pots apuntar-te a la llista d'espera",
		sinEquipos: 'Encara no hi ha cap equip confirmat. Sigues el primer!',
		capita: 'capità',
		equipsInscrits: 'Equips inscrits',
		unJugador: '1 jugador',
		nJugadores: '{n} jugadors',
		dorsal: 'dorsal',
		errorCargaEquipos: "Ara mateix no podem mostrar els equips inscrits. Torna-ho a provar més tard.",
		sinEventos: "Ara mateix no hi ha cap esdeveniment programat. Prompte n'hi haurà més.",
		preguntanos: 'Si vols saber què preparem, escriu-nos.',
	},
	es: {
		esdeveniments: 'Eventos',
		descripcionEsdeveniments: 'Eventos de Montca: torneos y encuentros en Cocentaina y la Serra de Mariola.',
		esdeveniment: 'Evento',
		estadoProximament: 'Inscripciones a partir del {fecha}',
		estadoObertes: 'Inscripciones abiertas hasta el {fecha}',
		estadoCompletes: 'Plazas completas – lista de espera',
		estadoTancades: 'Inscripciones cerradas',
		inscriure: 'Inscribirse',
		escribenosParaApuntarte: 'Escríbenos para apuntarte',
		mensajeWhatsappEvento: '¡Hola! Quiero apuntar a mi equipo al {evento}.',
		asuntoCorreoEvento: 'Inscripción al {evento}',
		respuestaEnMenosDe24h: 'Te respondemos en menos de 24 horas.',
		comArribar: 'Cómo llegar',
		lloc: 'Lugar',
		nuevaPestana: 'se abre en una pestaña nueva',
		precioPendiente: 'precio final pendiente',
		queCalSaber: 'Qué hay que saber',
		categories: 'Categorías',
		categoria: 'Categoría',
		nascuts: 'Nacidos',
		equiposMaximo: 'Equipos (máx.)',
		jugadoresPorEquipo: 'Jugadores por equipo',
		rangoJugadores: 'De {min} a {max}',
		preu: 'Precio',
		terminiInscripcio: 'Plazo de inscripción',
		plazoInscripcion: 'Del {apertura} al {cierre}, o antes si se completan las plazas.',
		normes: 'Normas',
		preguntesFrequents: 'Preguntas frecuentes',
		placesIEquips: 'Plazas y equipos',
		placesLliures: '{libres} de {max} plazas libres',
		completa: 'Completa',
		llistaEspera: 'Puedes apuntarte a la lista de espera',
		sinEquipos: 'Todavía no hay ningún equipo confirmado. ¡Sé el primero!',
		capita: 'capitán',
		equipsInscrits: 'Equipos inscritos',
		unJugador: '1 jugador',
		nJugadores: '{n} jugadores',
		dorsal: 'dorsal',
		errorCargaEquipos: 'Ahora mismo no podemos mostrar los equipos inscritos. Vuelve a probar más tarde.',
		sinEventos: 'Ahora mismo no hay ningún evento programado. Pronto habrá más.',
		preguntanos: 'Si quieres saber qué preparamos, escríbenos.',
	},
} as const;

export type ClaveTextoEvento = keyof (typeof textos)['ca'];

/** Devuelve el texto de `clave` en el idioma pedido. */
export function t(lang: Idioma, clave: ClaveTextoEvento): string {
	return textos[lang][clave];
}

/** Sustituye cada `{hueco}` de `texto` por su valor. Un hueco sin valor se deja tal cual. */
export function rellenar(texto: string, valores: Record<string, string | number>): string {
	return texto.replace(/\{(\w+)\}/g, (hueco, nombre: string) =>
		nombre in valores ? String(valores[nombre]) : hueco,
	);
}
