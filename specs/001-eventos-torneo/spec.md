# Feature Specification: Eventos y torneo de Navidad (C-04)

**Feature Branch**: `docs/spec-c-04-eventos-torneo`

**Created**: 2026-11-24

**Status**: Draft

**Input**: Tarea C-04 de `docs/tareas.md` (issue #48): sección Eventos, página del torneo de Navidad con las plazas libres por categoría (HU-19; antes, la lista "Equips inscrits"), botón "Inscriure's", estado de las inscripciones, franja en la portada, preguntas frecuentes, "Com arribar" y datos `Event`. C-05 y C-06 quedan fuera de alcance. *(Actualizado el 28/11/2026: ver la nota de cambio.)*

**Fuentes de verdad**: sección "C-04 · Eventos y torneo" de `docs/tareas.md`, `docs/info-montca.md`, `docs/decisiones.md`, `.specify/memory/constitution.md`, `PRODUCT.md` y `DESIGN.md`.

## Nota de cambio (28/11/2026)

Por decisión del 28/11/2026 ([historias de usuario de las inscripciones](../../docs/historias-usuario-inscripciones.md), D-3, D-4 y HU-19, y `docs/decisiones.md`):

- La **lista pública de equipos y de jugadores** y los **dorsales** se suprimen. En su lugar, la página muestra solo las **plazas de equipo ocupadas sobre el máximo de cada categoría**, sin ningún dato personal (HU-19).
- El **Google Forms provisional ya no se usa**. Las inscripciones solo se hacen desde la web (C-05). Hasta que exista, el botón lleva al contacto de Montca.
- Ocupan plaza **todos los equipos desde que se crean** (estado `creado` o superior, RN-19), no solo los confirmados. Ya no hay lista de espera.
- Los requisitos, escenarios y tareas que implementaban la lista, el Forms o el origen de los equipos se marcan **«Sustituido (28/11/2026)»** y se conservan como historial.

## Contexto: cambio de Montca del 23/11 y del 24/11

- **23/11 (llamada de Montca)**: Montca empieza las inscripciones del torneo el **25/11/2026** por su cuenta, fuera de la web, porque la web no llega a tiempo. Cuando la inscripción por la web (C-05) esté lista, se podrá usar también. Buena parte de los equipos (quizá casi todos) entrarán sin pasar por la web, y la web los tiene que mostrar igual.
- **24/11**: Montca inscribe con un **Google Forms** que pide los mismos datos que el formulario de C-05 (adultos y menores, con tutor). Las respuestas quedan en una hoja de cálculo de Google de Montca. La autorización del tutor se entrega **en papel o por Softco**. *Nota: con "papel o Softco" Montca se refería a las dos formas que recoge `docs/legal/tratamientos.md` (T4): **firma digital** o **papel entregado en Softco**. Así se escribe en el resto de la spec (FR-018).*
- Las inscripciones **cierran el 20/12/2026**. Es la prioridad del proyecto: lo primero que se publique tiene que ser la información del torneo y cómo apuntarse por el canal de Montca, sin esperar a la base de datos (A-14).

## Clarifications

### Session 2026-11-24

- **[Sustituida (28/11/2026)]** Q: ¿Cómo se cargan los equipos inscritos fuera de la web mientras no exista C-06? → A: Con un script de importación: Saúl descarga la hoja de respuestas como CSV **fuera del repositorio** y el script la vuelca a la base de datos; se puede repetir sin duplicar. Hasta que exista A-14, la web sale sin lista y sin plazas. *(Revisado al alinear la spec con `docs/legal/tratamientos.md` §5: descargar la hoja a un ordenador y usar allí la clave de servicio choca con el registro, así que la forma de importar queda pendiente de A-30; ver FR-033.)*
- **[Sustituida (28/11/2026)]** Q: Al importar el Google Forms, ¿cómo se agrupan los jugadores en equipos? → A: Una respuesta por jugador, que escribe el nombre de su equipo; se agrupa por nombre de equipo y categoría. Capitán: quien lo marque en el Forms; si nadie lo marca, la primera respuesta del equipo. (Montca aún lo está confirmando; si cambia, se ajusta la importación.)
- **[Sustituida (28/11/2026)]** Q: ¿Qué se hace con los nombres de equipo escritos de formas distintas? → A: Se unen solos los que solo se diferencian en mayúsculas, tildes o espacios. Los que se parecen sin ser iguales los lista el script, y deciden Montca o Saúl. Nunca se unen por parecido.
- **[Sustituida (28/11/2026)]** Q: ¿Se muestra el dorsal? → A: Se muestra si existe. **Inscripción por la web (C-05): obligatorio, del 1 al 99 y sin repetir dentro del equipo** (`docs/legal/tratamientos.md`, T2 y T3, y decisión del 19/11). **Equipos importados del Forms: opcional**; si el Forms no lo pide o viene vacío, el jugador sale sin dorsal.
- Q: ¿La página sale ya en las dos lenguas o solo en valenciano hasta B-07? → A: En las dos ya. El selector VAL / CAST que ya tiene la Cabecera cambia todo el texto de valenciano a castellano y al revés. No hay botones de idioma dentro de la página.
- **[Sustituida (28/11/2026)]** Q: ¿Qué se ve en "Equips inscrits" cuando aún no hay ningún equipo confirmado? → A: La lista no sale, pero sí las plazas libres por categoría con un texto que anima a apuntarse ("Sigues el primer!") y el botón.
- **[Sustituida (28/11/2026)]** Q: ¿Cómo se ve una categoría llena con lista de espera? → A: La categoría pone "Completa" con el texto "Pots apuntar-te a la llista d'espera", y el botón sigue. Los equipos en espera no salen ni se cuentan en la web. Mientras la inscripción por la web no esté lista, el botón de una categoría completa lleva igualmente al Google Forms, y la lista de espera la gestiona Montca. **Pendiente de confirmar con Montca (A-26).**
- **[Sustituida (28/11/2026)]** Q: ¿Qué se muestra de los jugadores adultos? → A: Nombre y primer apellido ("Marc García"), como dicen `docs/legal/tratamientos.md` (T7), `docs/legal/privacidad.md` (2.7) y la decisión del 19/11 de `docs/decisiones.md`. (En la primera sesión del clarify se había propuesto "Marc G."; se descarta para coincidir con los textos legales ya aprobados.)
- Q (`shape`): ¿Dónde entra "Esdeveniments" en el menú? → A: En el menú móvil y en el pie y, en escritorio, en el lugar de "Montca Sports". La barra inferior no cambia. La clave nueva va en `src/components/textos-navegacion.ts` (provisional hasta B-07), sin tocar `src/i18n`.
- Q (`shape`): ¿Qué estructura tiene la primera pantalla de la página del torneo? → A: "Cartell de les dues jornades" (diseño en [diseno.md](diseno.md)).

### Session 2026-11-28

- Q: ¿Qué se muestra en lugar de la lista pública de equipos? → A: Solo las plazas de equipo ocupadas sobre el máximo de cada categoría («5 de 8 equipos»), o «Completa», sin ningún dato personal (HU-19).
- Q: ¿Qué hace "Inscriure's" mientras no exista la inscripción por la web (C-05)? → A: Con la dirección de inscripción vacía, el botón es «Escríbenos para apuntarte» (WhatsApp o correo). Cuando exista C-05, la dirección apunta a la web.
- Q: ¿Se retira la sección una semana después del torneo? → A: No. Sin datos personales ya no hace falta. Después del cierre, el contador sigue junto al estado «Inscripcions tancades».
- Q: ¿Hay botón de crear equipo por categoría (HU-19, criterio 2)? → A: Todavía no. La categoría llena sale como «Completa» y el botón por categoría llega con la spec de inscripciones.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Informarse del torneo y apuntarse (Priority: P1)

Una persona joven, o el padre o la madre de un menor, llega desde un reel de Instagram en el móvil. Quiere saber qué es el torneo de Navidad de Montca Sports, cuándo y dónde es, qué cuesta, en qué categoría entra su equipo y cómo se apunta. En la página del torneo lo ve todo de un vistazo (fechas, lugar, deportes, precio, categorías con sus años de nacimiento y sus límites, normas, preguntas frecuentes), abre "Com arribar" si lo necesita y pulsa **Inscriure's**, que la lleva a la inscripción de la web. Mientras esa inscripción no exista, en su lugar ve cómo escribir a Montca para apuntarse.

**Why this priority**: las inscripciones cierran el 20/12. Sin esta página, la web no ayuda nada al torneo. Es lo único que se puede publicar ya, porque no depende de la base de datos (A-14) ni del i18n (B-07).

**Independent Test**: publicar solo la página del torneo con los datos del evento, sin ninguna fuente de plazas. Desde un móvil de 375 px, abrir la página, comprobar cada dato contra `docs/info-montca.md`, pulsar "Com arribar" (abre Google Maps en el Poliesportiu Municipal de Cocentaina) y comprobar el botón "Escríbenos para apuntarte" (o "Inscriure's", si ya hay dirección de inscripción).

**Acceptance Scenarios**:

1. **Given** hoy está entre el 25/11/2026 y el 20/12/2026 y no se ha cerrado a mano, **When** abro la página del torneo, **Then** veo el estado "Inscripcions obertes", las fechas de las jornadas (27/12/2026 y 3/1/2027), el lugar, los tres deportes con la nota de que cada equipo juega los tres, el precio ("màxim 10 € per jugador", marcado como pendiente de confirmar), las dos categorías con sus años de nacimiento, el máximo de equipos y el mínimo y máximo de jugadores, y el botón "Inscriure's".
2. **Given** la dirección de inscripción del evento está configurada (la página de inscripción de la web, C-05), **When** pulso "Inscriure's", **Then** llego a esa página.
3. **Given** la dirección de inscripción aún no está configurada, **When** abro la página, **Then** en lugar de "Inscriure's" veo "Escríbenos para apuntarte" y cómo contactar con Montca (WhatsApp si hay número; si no, correo), nunca un botón roto.
4. *(Suprimido el 28/11/2026: ya no existe el modo de inscripción "canal de Montca" ni el Google Forms.)*
5. **Given** hoy es anterior a la fecha de apertura, **When** abro la página, **Then** veo "Inscripcions pròximament" con la fecha de apertura y no hay botón de inscribirse.
6. **Given** hoy es posterior al 20/12/2026, o Montca ha cerrado las inscripciones a mano, **When** abro la página, **Then** veo "Inscripcions tancades", no hay botón de inscribirse y el resto de la información sigue visible.
7. **Given** estoy en la página, **When** pulso "Com arribar", **Then** se abre Google Maps con el Poliesportiu Municipal de Cocentaina; la página no incrusta ningún mapa.
8. **Given** estoy en la página, **When** despliego las preguntas frecuentes, **Then** veo las seis preguntas de Montca de `docs/info-montca.md` con su respuesta; la del contacto muestra los canales públicos de Montca y no ningún dato personal que no esté autorizado para el repositorio.
9. **Given** un buscador analiza la página, **When** lee sus datos estructurados, **Then** encuentra un `Event` válido con nombre, fechas, jornadas, lugar, organizador y estado del evento, sin precio ni oferta mientras el precio final no esté confirmado.

---

### User Story 2 - Ver las plazas libres por categoría (Priority: P2)

Quien duda quiere saber si todavía puede apuntar un equipo. En la página del torneo, para **Infantil/Cadet** y para **Juvenil/Sènior**, ve cuántos equipos hay sobre el máximo, el estado de las inscripciones y la fecha de cierre. No aparece ningún nombre de equipo ni de jugador ni ningún otro dato de la inscripción (HU-19 de las [historias de usuario](../../docs/historias-usuario-inscripciones.md)).

**Why this priority**: sustituye a la lista pública de equipos, que se ha suprimido (D-4). Anima a apuntarse sin mostrar ningún dato personal. Depende de una consulta pública de plazas (spec de inscripciones y A-14), así que va después de P1; la interfaz se hace ya con datos de prueba.

**Independent Test**: con los datos de prueba (recuentos por categoría), comprobar que cada categoría muestra "N de M equips" o "Completa", que el máximo sale de los datos del evento y que el código fuente y las respuestas de red no contienen ningún dato personal.

**Acceptance Scenarios**:

1. **Given** la fuente de plazas responde, **When** abro la página, **Then** cada categoría muestra cuántos equipos ocupan plaza sobre su máximo (por ejemplo, "5 de 8 equips" y "2 de 6 equips"), junto con el estado de las inscripciones y la fecha de cierre.
2. **Given** una categoría ha llegado a su máximo, **When** veo su contador, **Then** pone "Completa". El botón de crear equipo de esa categoría llega con la spec de inscripciones.
3. **Given** se crea un equipo en estado `creado`, **When** recargo la página, **Then** el contador ya lo incluye (RN-19).
4. **Given** se crea o se borra un equipo, **When** recargo la página, **Then** el contador está actualizado sin volver a publicar la web.
5. **Given** la sección es pública, **When** miro la página, su código fuente y las respuestas que recibe el navegador, **Then** no hay ningún nombre de equipo ni de jugador, ni ningún otro dato de la inscripción: solo los números por categoría.
6. **Given** la fuente de plazas no responde, **When** abro la página, **Then** veo toda la información del torneo y, en lugar de los números, el aviso "No s'han pogut carregar les places". Nunca un número incorrecto.
7. **Given** uso un lector de pantalla o no distingo colores, **When** leo los contadores, **Then** el estado ("N de M equips" o "Completa") se entiende por el texto, no solo por el color.

---

### User Story 3 - Franja del torneo en la portada (Priority: P3)

Quien entra en la portada mientras las inscripciones están abiertas ve, arriba y sin hacer scroll, una franja del torneo de Navidad que le lleva a la página del torneo.

**Why this priority**: es la vía más directa desde la portada a la inscripción, pero la página del torneo (P1) ya se puede enlazar desde redes y el menú.

**Independent Test**: con el estado "obertes", abrir la portada en 375 × 667 px y comprobar que la franja se ve sin scroll y lleva a la página del torneo; con cualquier otro estado, comprobar que no sale.

**Acceptance Scenarios**:

1. **Given** las inscripciones de un evento están abiertas, **When** abro la portada en un móvil de 375 × 667 px, **Then** la franja se ve entera sin hacer scroll y no tapa la cabecera ni el contenido principal.
2. **Given** estoy en la portada con la franja visible, **When** la pulso, **Then** llego a la página del torneo; desde ahí, un toque en "Inscriure's" me lleva a la inscripción (dos toques desde la portada).
3. **Given** las inscripciones están pròximament, completes o tancades, **When** abro la portada, **Then** la franja no aparece.

---

### User Story 4 - Sección Eventos y el siguiente evento sin reprogramar (Priority: P4)

Cualquier visitante encuentra en la web una sección **Eventos**, separada del formulario de contacto, con los eventos de Montca; el torneo de Navidad es el primero. Cuando Montca prepare el siguiente evento, se publica añadiendo sus datos (nombre, fechas, lugar, categorías con sus límites, plazos, modo de inscripción, preguntas frecuentes), sin cambiar código.

**Why this priority**: con un solo evento, la página del torneo es lo que importa; la sección y la reutilización evitan rehacer el trabajo en el siguiente evento, pero no corren prisa antes del 20/12.

**Independent Test**: añadir a los datos un segundo evento de prueba con otras categorías y otras fechas, y comprobar que aparece en la sección Eventos y tiene su propia página con su estado, sus plazas y su botón, sin haber cambiado código.

**Acceptance Scenarios**:

1. **Given** el torneo de Navidad es el único evento, **When** abro la sección Eventos, **Then** veo el torneo con su nombre, fechas, lugar y estado de las inscripciones, y un enlace a su página.
2. **Given** se añaden los datos de un evento nuevo con categorías distintas, **When** se publica, **Then** el evento sale en la sección con su página, y sus categorías, límites y estado salen de sus datos.
3. **Given** no hay ningún evento próximo, **When** abro la sección Eventos, **Then** veo un mensaje de que pronto habrá más eventos y cómo contactar con Montca, no una página vacía.
4. **Given** la última jornada de un evento ya ha pasado, **When** abro la sección Eventos, **Then** el evento ya no sale en la lista de próximos, pero su página sigue accesible por su enlace.
5. **Given** estoy en la página del torneo, **When** pulso el enlace "← tornar", **Then** vuelvo a la sección Eventos.

---

### Edge Cases

- **Categoría llena con otra abierta**: Infantil/Cadet tiene sus 8 equipos y Juvenil/Sènior aún tiene plazas. El estado general sigue "obertes"; Infantil/Cadet pone "Completa".
- **Todas las categorías llenas antes del 20/12**: el estado pasa a "completes" ("Places completes", sin lista de espera), la franja de la portada desaparece y el botón de inscribirse deja de mostrarse.
- **Equipo creado o borrado**: el contador cambia al recargar la página y la plaza se libera al borrarlo.
- **Cambio de estado a medianoche**: la apertura y el cierre se calculan en la hora de Madrid; el estado cambia en la fecha sin que nadie tenga que volver a publicar la web.
- **Datos de prueba en producción**: nunca salen en la web publicada; solo en local y en las vistas previas, marcados de forma visible como prueba.
- **Precio final pendiente**: se muestra "màxim 10 € per jugador" con la nota de que el precio final está pendiente; no se inventa una cifra.
- **Normas del torneo aún no entregadas por Montca**: el apartado no sale (o sale con un texto de prueba marcado como tal en las vistas previas); no se inventan normas.
- **Sin número de WhatsApp (A-24)**: los enlaces de contacto usan el correo público.

## Requirements *(mandatory)*

### Functional Requirements

**Sección Eventos**

- **FR-001**: La web MUST tener una sección Eventos, independiente del formulario de contacto, que lista los eventos próximos de Montca con nombre, fechas, lugar, estado de las inscripciones y enlace a su página.
- **FR-002**: La sección Eventos ("Esdeveniments") MUST estar en el menú móvil y en el pie y, en el menú de escritorio, en el lugar de "Montca Sports". La barra inferior del móvil no cambia (decisión del `shape`, 2026-11-24). No existe ninguna tarea para una página de Montca Sports: si se crea, hay que decidir si vuelve al menú.
- **FR-003**: Cuando no haya eventos próximos, la sección MUST mostrar un mensaje y una forma de contactar con Montca.
- **FR-004**: Un evento cuya última jornada ya ha pasado MUST dejar de salir entre los próximos; su página MUST seguir accesible.

**Página del evento (torneo de Navidad)**

- **FR-005**: La página del torneo MUST mostrar: nombre (torneo de Navidad de Montca Sports), fechas de las jornadas (27/12/2026 y 3/1/2027), lugar (Poliesportiu Municipal de Cocentaina), deportes (fútbol sala, básquet y pádel) con la nota de que cada equipo juega los tres, precio (máximo 10 € por jugador, marcado como pendiente mientras Montca no dé la cifra final), categorías con sus años de nacimiento, máximo de equipos y mínimo y máximo de jugadores, plazo de inscripción y normas.
- **FR-006**: Todos los datos del torneo MUST salir de `docs/info-montca.md` o de Montca. Lo que falte se muestra como pendiente o no se muestra; nunca se inventa (constitución III).
- **FR-007**: La página MUST tener un enlace "Com arribar" que abre Google Maps en el lugar del evento, sin mapa incrustado.
- **FR-008**: La página MUST incluir las preguntas frecuentes del evento (las seis del torneo, de `docs/info-montca.md`), desplegables y accesibles con teclado y lector de pantalla.
- **FR-009**: La página MUST incluir datos estructurados `Event` (tipo `SportsEvent`): nombre, fechas de inicio y fin, una subjornada por día, lugar (con la dirección postal cuando Montca la dé; mientras tanto, la localidad), organizador Montca Actiu y estado del evento. El precio y la oferta (`offers`, que es donde iría el enlace de inscripción) MUST NOT incluirse mientras el precio no esté confirmado.
- **FR-010**: La página MUST tener el enlace "← tornar" a la sección Eventos (sin migas de pan, `docs/decisiones.md`).

**Estado de las inscripciones y plazas**

- **FR-011**: Cada evento MUST mostrar uno de estos estados de inscripción: **pròximament** (antes de la fecha de apertura), **obertes** (entre la apertura y el cierre y con plazas en al menos una categoría), **completes** (todas las categorías llenas antes del cierre) o **tancades** (después del cierre o cerradas a mano por Montca).
- **FR-012**: El estado MUST calcularse a partir de las fechas de apertura y cierre del evento (hora de Madrid; el cierre incluye todo el día 20/12/2026) y de las plazas, y MUST cambiar en su fecha sin volver a publicar la web.
- **FR-013**: Montca MUST poder forzar el estado "tancades" de un evento antes de la fecha de cierre (hasta que exista C-06, cambiando un dato del evento, no el código).
- **FR-014**: Para cada categoría, la página MUST mostrar cuántos equipos ocupan plaza sobre el máximo de la categoría («5 de 8 equipos»), contando todos los equipos desde que se crean (estado `creado` o superior, RN-19). Una categoría que ha llegado a su máximo MUST marcarse como «Completa». La sección MUST mostrar también el estado de las inscripciones y la fecha de cierre (HU-19). No hay lista de espera.
- **FR-015**: Mientras no exista una fuente real de plazas, la página MUST poder publicarse sin el apartado de plazas, con el estado calculado solo por fechas y por el cierre manual.

**Botón Inscriure's**

- **FR-016**: Con el estado "obertes", la página MUST mostrar el botón **Inscriure's** en la primera pantalla y otra vez debajo de las plazas (diseño en `diseno.md`). Con "completes", "pròximament" o "tancades", el botón MUST NOT mostrarse. El botón de crear equipo por categoría (HU-19, criterio 2) llega con la spec de inscripciones.
- **FR-017**: Cada evento MUST tener una **dirección de inscripción** configurable en sus datos: la página de inscripción de la web (C-05). Cambiarla MUST NOT requerir cambiar código. *(Sustituido el 28/11/2026: ya no existe el «modo» canal de Montca ni el Google Forms.)*
- **FR-018** *(Suprimido el 28/11/2026)*: ya no hay modo "canal de Montca" ni nota sobre la firma digital o el papel en Softco. La autorización del tutor es solo en la web (D-6).
- **FR-019**: Si la dirección de inscripción no está configurada, en lugar del botón MUST mostrarse "Escríbenos para apuntarte" con el contacto de Montca (WhatsApp si hay número; si no, correo), nunca un botón roto.

**Plazas por categoría** (antes, "Equips inscrits")

- **FR-020 a FR-025** *(Sustituidos el 28/11/2026)*: describían la lista pública de equipos (equipos confirmados, jugadores, dorsales, menores con solo el primer nombre, autorización, origen de los equipos). Ya no existe: D-3 y D-4 de las historias.
- **FR-026**: La parte pública MUST NOT recibir ni contener ningún dato personal ni ningún nombre de equipo: solo, por categoría, el número de equipos que ocupan plaza (HU-19, criterio 5). Esto se comprueba también en el código fuente de la página y en las respuestas que reciba el navegador, no solo en lo que se ve.
- **FR-027**: Un equipo creado o borrado MUST reflejarse en el contador al recargar la página, sin cambiar código ni volver a publicar la web (HU-19, criterio 6).
- **FR-028**: Si la fuente de plazas no responde, la página MUST seguir mostrando la información del evento, con el aviso "No s'han pogut carregar les places" en lugar de los números (nunca un número incorrecto).
- **FR-040** *(Sustituido el 28/11/2026)*: la retirada de la lista una semana después de la última jornada ya no existe. Sin datos personales no hace falta; el contador sigue visible junto al estado de las inscripciones.
- **FR-041** *(Sustituido el 28/11/2026)*: el interruptor `jugadores_forms_publicables` ya no existe. No se publica ningún jugador.

**Franja en la portada**

- **FR-029**: Mientras un evento tenga el estado "obertes" (aunque alguna de sus categorías esté completa), la portada MUST mostrar en lo alto una franja del evento, visible sin scroll en 375 × 667 px, que lleva a su página. La franja va en la portada en valenciano; la portada en castellano no existe todavía y la crea B-07, que tendrá que incluir la franja.
- **FR-030**: Con cualquier otro estado, la franja MUST NOT mostrarse. Si hubiera más de un evento abierto, la franja muestra el que cierra antes.

**Datos de las plazas (para la capa de datos y la spec de inscripciones)**

- **FR-031** *(Sustituido el 28/11/2026)*: el origen `forms` / `web` de equipos y jugadores ya no existe: no hay Google Forms.
- **FR-032** *(Sustituido el 28/11/2026)*: el registro de la autorización del tutor lo define HU-10 en la spec de inscripciones, con la verificación por código solo en la web. No es parte de C-04.
- **FR-033** *(Sustituido el 28/11/2026)*: no hay importación desde el Google Forms. En su lugar, la página lee de una consulta pública que solo devuelve los recuentos por categoría: vista o RPC `plazas_por_categoria`, que se crea en la spec de inscripciones y devuelve `{ categoria, equipos_actuales }`. Mientras no exista, la fuente `prueba` usa datos de ejemplo y la fuente `supabase` no devuelve nada.
- **FR-034**: Los datos reales de inscripción (incluidas las respuestas del formulario de Montca y cualquier archivo exportado de su hoja) MUST NOT guardarse nunca en el repositorio, que es público y contendría DNI de menores.
- **FR-035**: Para hacer y probar la interfaz MUST usarse datos de prueba inventados (recuentos por categoría), marcados como tales, que nunca se publiquen en producción: el build falla con la fuente `prueba` y `CONTEXT=production`.
- **FR-039**: La sección MUST coincidir con `docs/legal/tratamientos.md` (T7, suprimido) y `docs/legal/privacidad.md`: no se publica ningún dato personal, solo los recuentos por categoría (HU-19). Si C-04 necesita publicar algo distinto, primero se cambia `tratamientos.md` (constitución IV).

**Reutilización e idiomas**

- **FR-036**: Todo lo propio de un evento (nombre, fechas, lugar, deportes, precio, categorías y sus límites, plazos, dirección de inscripción, normas, preguntas frecuentes) MUST salir de sus datos, no del código, de modo que el siguiente evento se publique sin reprogramar.
- **FR-037**: Todo texto visible MUST salir de diccionarios de idioma o del contenido por idioma, no escrito directamente en componentes o páginas (constitución II). La sección Eventos, la página del evento y la franja MUST publicarse desde el principio en **valenciano y castellano**, y el botón VAL / CAST MUST cambiar **todo** el texto de la página (incluidos los datos del evento y las preguntas frecuentes) de un idioma al otro. Los nombres de equipos y jugadores no se traducen.
- **FR-038**: La página MUST cumplir la constitución V: zonas pulsables de al menos 44 px de alto, comprobación en 375 px y WCAG 2.2 AA como referencia.

### Fuera de alcance

- **C-05 · Inscripción de equipos por la web**: formulario, enlace del equipo, límites de jugadores, menores y correos. C-04 solo deja preparada la dirección de inscripción del botón.
- **C-06 · Gestión para Montca**. Lo que C-04 le deja anotado como mínimo imprescindible:
  - **Dar de alta equipos y jugadores a mano** (los que no entren por el formulario ni por la web).
  - Ver el estado de cada equipo (creado, inscrito, completo; HU-17) y marcar los pagos (HU-12).
  - Borrar los datos al acabar su plazo de conservación (HU-18).
  - Cerrar las inscripciones a mano y crear el siguiente evento.
- **C-07 · Avisos por correo**, **B-13 · Cuenta atrás**, pago online (D-04) y fotos o reels del evento.
- *(Suprimido el 28/11/2026: el Google Forms ya no se usa.)*

### Key Entities *(include if feature involves data)*

- **Evento**: lo que se celebra (el torneo de Navidad es el primero). Nombre, descripción, marca (Montca Sports), jornadas, lugar y su enlace de Google Maps, deportes, precio y si está confirmado, fechas de apertura y cierre de inscripciones, cierre manual, dirección de inscripción, normas, preguntas frecuentes. Tiene una o varias categorías.
- **Categoría**: grupo de edad dentro de un evento. Nombre (Infantil/Cadet, Juvenil/Sènior), años de nacimiento, máximo de equipos, mínimo y máximo de jugadores por equipo. Los equipos que ocupan plaza los da la consulta pública de plazas.
- **Plazas de una categoría**: lo único que sale de la base de datos hacia la web: categoría y número de equipos que ocupan plaza (`{ categoria, equiposActuales }`). El máximo sale de los datos del evento. Ningún dato personal ni nombre de equipo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La página del torneo con la información y el contacto para apuntarse se puede publicar sin base de datos y sin i18n, antes que el resto de la feature.
- **SC-002**: Desde la portada, con las inscripciones abiertas, se llega al formulario de inscripción en 2 toques (franja → Inscriure's) en un móvil de 375 px; desde un enlace directo a la página del torneo, en 1.
- **SC-003**: En una revisión del código fuente y de las respuestas que recibe el navegador con los datos de prueba, hay 0 datos personales y 0 nombres de equipo o de jugador: solo recuentos por categoría.
- **SC-004**: El 100 % de los datos del torneo mostrados coincide con `docs/info-montca.md`; no hay ninguna cifra, fecha ni norma inventada.
- **SC-005**: La prueba de resultados enriquecidos de Google valida el `Event` de la página sin errores.
- **SC-006**: Un segundo evento de prueba con categorías distintas se publica cambiando solo datos, con 0 líneas de código cambiadas.
- **SC-007**: El estado de las inscripciones es el correcto el día de apertura y el día después del cierre sin que nadie haya vuelto a publicar la web.
- **SC-008**: Un equipo creado o borrado se refleja en el contador al recargar la página, sin volver a publicar la web.
- **SC-009**: En 375 × 667 px, la franja de la portada se ve entera sin scroll mientras las inscripciones están abiertas.
- **SC-010**: La página del torneo no tiene errores en la consola, se puede recorrer entera con el teclado y todas sus zonas pulsables miden al menos 44 px de alto.

## Assumptions

- **Fechas** (decisión de Montca del 23/11; la cambia en `docs/info-montca.md` el PR de Saúl `docs/estado-tareas-24-11`): inscripciones del 25/11/2026 al 20/12/2026, o antes si se llenan las plazas.
- **Plazas**: ocupan plaza todos los equipos desde que se crean, también los de estado `creado` (RN-19).
- **Dirección de inscripción**: vacía hasta que exista la inscripción por la web (C-05). Es pública, así que puede ir en los datos del evento del repositorio.
- **Consulta de plazas**: la base de datos de inscripciones todavía no existe (llegará con la spec de inscripciones y A-14). Mientras tanto, `PUBLIC_FUENTE_PLAZAS` vale `ninguna` por defecto: no sale el contador. Con `prueba` (solo local y vistas previas) salen datos de ejemplo. Con `supabase` se leerá la consulta `plazas_por_categoria`.
- **Teléfono en la pregunta frecuente de contacto**: A-24 está acabada. La respuesta usa el texto de Montca tal cual de `docs/info-montca.md`, con el número principal (722 79 60 66), que Iker acepta que esté en la web y en el repositorio (decisión del 2026-11-24 en `docs/decisiones.md`, fusionada con el PR #67).
- **Normas del torneo**: Montca aún no las ha pasado. Se piden en A-26.
- **Textos nuevos** (explicación junto al botón, estados, avisos): se redactan en valenciano y los revisa Montca antes de publicar.
- **Datos de prueba**: inventados, sin parecido con personas reales, marcados como prueba y fuera de producción.
- **Frescura de 1 hora** (FR-027): suficiente para un torneo con inscripción de días; si Montca necesita que sea inmediato, se revisa en el plan.
- **Privacidad**: la sección no publica datos personales. `docs/legal/tratamientos.md` tiene T7 suprimido.
- **`docs/tareas.md` y `docs/info-montca.md`** ya están actualizados en el PR #68; esta spec no los toca.

## Dependencies

- **A-01** (datos del torneo): hecha.
- **A-14** (proyecto Supabase en la UE, Saúl): necesaria para las plazas por categoría. **No bloquea P1.**
- **A-26** (descartada el 28/11/2026): lo resuelven las historias de inscripción. Las normas del torneo siguen pendientes de Montca.
- **A-24** (número de WhatsApp): pendiente; mientras tanto, correo.
- **A-30** (descartada el 28/11/2026): el Google Forms ya no se usa.
- **B-07** (i18n VAL/CAST, Saúl): pendiente. Mientras tanto, los textos van en VAL y CAST en un diccionario provisional, como en B-09, y B-07 los mueve a `src/i18n`.
- **B-02** (Netlify): pendiente; necesario para publicar.
- **B-09** (Cabecera, Pie, BarraInferior, EnlaceVolver): hecha; se reutiliza.
- **Página de Montca Sports**: no existe ninguna tarea para ella. "Esdeveniments" ocupa su sitio en el menú de escritorio; si se crea esa página, hay que decidir si vuelve al menú.
