# Feature Specification: Eventos y torneo de Navidad (C-04)

**Feature Branch**: `docs/spec-c-04-eventos-torneo`

**Created**: 2026-11-24

**Status**: Draft

**Input**: Tarea C-04 de `docs/tareas.md` (issue #48): sección Eventos, página del torneo de Navidad con "Equips inscrits", botón "Inscriure's", plazas libres y estado de las inscripciones, franja en la portada, preguntas frecuentes, "Com arribar" y datos `Event`. Equipos de dos orígenes (Google Forms de Montca y la inscripción por la web, C-05). C-05 y C-06 quedan fuera de alcance.

**Fuentes de verdad**: sección "C-04 · Eventos y torneo" de `docs/tareas.md`, `docs/info-montca.md`, `docs/decisiones.md`, `.specify/memory/constitution.md`, `PRODUCT.md` y `DESIGN.md`.

## Contexto: cambio de Montca del 23/11 y del 24/11

- **23/11 (llamada de Montca)**: Montca empieza las inscripciones del torneo el **25/11/2026** por su cuenta, fuera de la web, porque la web no llega a tiempo. Cuando la inscripción por la web (C-05) esté lista, se podrá usar también. Buena parte de los equipos (quizá casi todos) entrarán sin pasar por la web, y la web los tiene que mostrar igual.
- **24/11**: Montca inscribe con un **Google Forms** que pide los mismos datos que el formulario de C-05 (adultos y menores, con tutor). Las respuestas quedan en una hoja de cálculo de Google de Montca. La autorización del tutor se entrega **en papel o por Softco**.
- Las inscripciones **cierran el 20/12/2026**. Es la prioridad del proyecto: lo primero que se publique tiene que ser la información del torneo y cómo apuntarse por el canal de Montca, sin esperar a la base de datos (A-14).

## Clarifications

### Session 2026-11-24

- Q: ¿Cómo se cargan los equipos inscritos fuera de la web mientras no exista C-06? → A: Con un script de importación: Saúl descarga la hoja de respuestas como CSV **fuera del repositorio** y el script la vuelca a la base de datos; se puede repetir sin duplicar. Hasta que exista A-14, la web sale sin lista y sin plazas.
- Q: Al importar el Google Forms, ¿cómo se agrupan los jugadores en equipos? → A: Una respuesta por jugador, que escribe el nombre de su equipo; se agrupa por nombre de equipo y categoría. Capitán: quien lo marque en el Forms; si nadie lo marca, la primera respuesta del equipo. (Montca aún lo está confirmando; si cambia, se ajusta la importación.)
- Q: ¿Qué se hace con los nombres de equipo escritos de formas distintas? → A: Se unen solos los que solo se diferencian en mayúsculas, tildes o espacios. Los que se parecen sin ser iguales los lista el script, y deciden Montca o Saúl. Nunca se unen por parecido.
- Q: ¿Se muestra el dorsal? → A: Se muestra si existe. **Inscripción por la web (C-05): obligatorio, del 1 al 99 y sin repetir dentro del equipo** (`docs/legal/tratamientos.md`, T2 y T3, y decisión del 19/11). **Equipos importados del Forms: opcional**; si el Forms no lo pide o viene vacío, el jugador sale sin dorsal.
- Q: ¿La página sale ya en las dos lenguas o solo en valenciano hasta B-07? → A: En las dos ya. El selector VAL / CAST que ya tiene la Cabecera cambia todo el texto de valenciano a castellano y al revés. No hay botones de idioma dentro de la página.
- Q: ¿Qué se ve en "Equips inscrits" cuando aún no hay ningún equipo confirmado? → A: La lista no sale, pero sí las plazas libres por categoría con un texto que anima a apuntarse ("Sigues el primer!") y el botón.
- Q: ¿Cómo se ve una categoría llena con lista de espera? → A: La categoría pone "Completa" con el texto "Pots apuntar-te a la llista d'espera", y el botón sigue. Los equipos en espera no salen ni se cuentan en la web. Mientras la inscripción por la web no esté lista, el botón de una categoría completa lleva igualmente al Google Forms, y la lista de espera la gestiona Montca. **Pendiente de confirmar con Montca (A-26).**
- Q: ¿Qué se muestra de los jugadores adultos? → A: Nombre y primer apellido ("Marc García"), como dicen `docs/legal/tratamientos.md` (T7), `docs/legal/privacidad.md` (2.7) y la decisión del 19/11 de `docs/decisiones.md`. (En la primera sesión del clarify se había propuesto "Marc G."; se descarta para coincidir con los textos legales ya aprobados.)
- Q (`shape`): ¿Dónde entra "Esdeveniments" en el menú? → A: En el menú móvil y en el pie y, en escritorio, en el lugar de "Montca Sports". La barra inferior no cambia. La clave nueva va en `src/components/textos-navegacion.ts` (provisional hasta B-07), sin tocar `src/i18n`.
- Q (`shape`): ¿Qué estructura tiene la primera pantalla de la página del torneo? → A: "Cartell de les dues jornades" (diseño en [diseno.md](diseno.md)).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Informarse del torneo y apuntarse por el canal de Montca (Priority: P1)

Una persona joven, o el padre o la madre de un menor, llega desde un reel de Instagram en el móvil. Quiere saber qué es el torneo de Navidad de Montca Sports, cuándo y dónde es, qué cuesta, en qué categoría entra su equipo y cómo se apunta. En la página del torneo lo ve todo de un vistazo (fechas, lugar, deportes, precio, categorías con sus años de nacimiento y sus límites, normas, preguntas frecuentes), abre "Com arribar" si lo necesita y pulsa **Inscriure's**, que la lleva al formulario de inscripción de Montca. Junto al botón se explica en dos líneas cómo funciona ahora la inscripción (formulario de Montca; la autorización del tutor de los menores se entrega en papel o por Softco).

**Why this priority**: las inscripciones empiezan el 25/11 y cierran el 20/12. Sin esta página, la web no ayuda nada al torneo. Es lo único que se puede publicar ya, porque no depende de la base de datos (A-14) ni del i18n (B-07).

**Independent Test**: publicar solo la página del torneo con los datos del evento, sin ninguna fuente de equipos. Desde un móvil de 375 px, abrir la página, comprobar cada dato contra `docs/info-montca.md`, pulsar "Com arribar" (abre Google Maps en el Poliesportiu Municipal de Cocentaina) y pulsar "Inscriure's" (abre el formulario de Montca).

**Acceptance Scenarios**:

1. **Given** hoy está entre el 25/11/2026 y el 20/12/2026 y no se ha cerrado a mano, **When** abro la página del torneo, **Then** veo el estado "Inscripcions obertes", las fechas de las jornadas (27/12/2026 y 3/1/2027), el lugar, los tres deportes con la nota de que cada equipo juega los tres, el precio ("màxim 10 € per jugador", marcado como pendiente de confirmar), las dos categorías con sus años de nacimiento, el máximo de equipos y el mínimo y máximo de jugadores, y el botón "Inscriure's".
2. **Given** el modo de inscripción del evento es "canal de Montca" y la dirección del formulario está configurada, **When** pulso "Inscriure's", **Then** se abre el formulario de Montca y la página explica, junto al botón, que la autorización del tutor de los menores se entrega en papel o por Softco.
3. **Given** el modo de inscripción es "canal de Montca" pero la dirección del formulario aún no está configurada, **When** abro la página, **Then** en lugar de "Inscriure's" veo cómo contactar con Montca para apuntarse (WhatsApp si hay número; si no, correo), nunca un botón roto.
4. **Given** la inscripción por la web (C-05) ya está lista, **When** Montca cambia el modo de inscripción del evento a "web", **Then** "Inscriure's" lleva a la página de inscripción de la web sin tocar el código de esta página.
5. **Given** hoy es anterior a la fecha de apertura, **When** abro la página, **Then** veo "Inscripcions pròximament" con la fecha de apertura y no hay botón de inscribirse.
6. **Given** hoy es posterior al 20/12/2026, o Montca ha cerrado las inscripciones a mano, **When** abro la página, **Then** veo "Inscripcions tancades", no hay botón de inscribirse y el resto de la información sigue visible.
7. **Given** estoy en la página, **When** pulso "Com arribar", **Then** se abre Google Maps con el Poliesportiu Municipal de Cocentaina; la página no incrusta ningún mapa.
8. **Given** estoy en la página, **When** despliego las preguntas frecuentes, **Then** veo las seis preguntas de Montca de `docs/info-montca.md` con su respuesta; la del contacto muestra los canales públicos de Montca y no ningún dato personal que no esté autorizado para el repositorio.
9. **Given** un buscador analiza la página, **When** lee sus datos estructurados, **Then** encuentra un `Event` válido con nombre, fechas, jornadas, lugar, organizador y estado del evento, sin precio ni oferta mientras el precio final no esté confirmado.

---

### User Story 2 - Ver los equipos inscritos y las plazas libres (Priority: P2)

Quien ya se ha apuntado quiere comprobar que su equipo sale y quién más juega; quien duda quiere saber si quedan plazas en su categoría. En la página del torneo, bajo "Equips inscrits", ve los equipos **confirmados** separados en **Infantil/Cadet** y **Juvenil/Sènior**, cada uno con su nombre, sus jugadores y quién es el capitán, y las plazas libres que quedan en cada categoría. Los equipos se ven igual tanto si se apuntaron con el formulario de Montca como si lo hicieron por la web.

**Why this priority**: da confianza ("mi equipo está dentro") y empuja a apuntarse ("quedan 2 plazas"). Depende de que haya una fuente de equipos real (A-14 + importación), así que va después de P1; la interfaz se hace ya con datos de prueba.

**Independent Test**: con los datos de prueba (por categoría, un equipo confirmado y uno pendiente; uno del formulario de Montca y uno de la web), comprobar que solo salen los confirmados, en su categoría, con el capitán marcado, los menores solo con el primer nombre, y que las plazas libres son el máximo menos los confirmados.

**Acceptance Scenarios**:

1. **Given** no hay ningún equipo confirmado en ninguna categoría, **When** abro la página, **Then** no aparece la lista de equipos; en su lugar veo las plazas libres de cada categoría (el máximo), un texto que anima a ser el primer equipo y el botón "Inscriure's".
2. **Given** Infantil/Cadet tiene sus 8 equipos confirmados y Juvenil/Sènior aún tiene plazas, **When** abro la página, **Then** Infantil/Cadet pone "Completa" con el texto de que se puede entrar en la lista de espera, Juvenil/Sènior muestra sus plazas libres y el botón "Inscriure's" sigue visible. Los equipos en lista de espera no salen.
3. **Given** hay un equipo confirmado y otro pendiente en Infantil/Cadet, **When** abro la página, **Then** en Infantil/Cadet sale solo el confirmado y las plazas libres son 7 de 8.
4. **Given** un equipo confirmado del formulario de Montca y otro confirmado de la web en Juvenil/Sènior, **When** abro la página, **Then** los dos salen con el mismo aspecto, sin ninguna marca de origen, y los dos cuentan para las plazas (quedan 4 de 6).
5. **Given** un equipo confirmado con un jugador menor de edad y uno adulto, **When** veo el equipo, **Then** del menor sale solo el primer nombre ("Laia") y del adulto el nombre y el primer apellido ("Marc García"), nunca el segundo apellido.
6. **Given** un equipo confirmado, **When** veo el equipo, **Then** el capitán está marcado de forma que se entiende sin depender solo del color.
7. **Given** se confirma un equipo nuevo en los datos, **When** pasa como mucho 1 hora, **Then** aparece en la página sin que nadie toque el código.
8. **Given** la fuente de equipos no responde, **When** abro la página, **Then** veo toda la información del torneo y el botón de inscribirse, y en lugar de la lista un aviso breve de que no se ha podido cargar; la página no se rompe.

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

- **Categoría llena con otra abierta**: Infantil/Cadet tiene 8 equipos confirmados y Juvenil/Sènior aún tiene plazas. El estado general sigue "obertes"; Infantil/Cadet pone "Completa" con el texto de la lista de espera y el botón sigue (escenario 2 de la historia 2).
- **Todas las categorías llenas antes del 20/12**: el estado pasa a "completes" y la franja de la portada desaparece. Mientras el modo de inscripción sea "canal de Montca", el botón sigue llevando al Google Forms para entrar en la lista de espera, que gestiona Montca (pendiente de confirmar con Montca, A-26).
- **Equipo que se confirma y luego vuelve a pendiente o se borra**: deja de salir y libera su plaza.
- **Menor sin autorización registrada**: no sale en la lista pública aunque su equipo esté confirmado (constitución IV: un menor no queda inscrito hasta que su tutor autoriza).
- **Fecha de nacimiento desconocida**: el jugador se trata como menor (solo primer nombre).
- **Nombre compuesto** ("Maria José", "Joan Carles"): de un menor se muestra solo la primera palabra del nombre.
- **Dos menores con el mismo primer nombre en un equipo**: se muestran tal cual.
- **Equipo con un nombre muy largo, con tildes, ñ, comillas o emojis**: se muestra entero y sin romper la maquetación en 375 px.
- **Nombre de equipo con insultos o datos personales**: no se publica hasta que Montca lo confirma (solo salen equipos confirmados).
- **Cambio de estado a medianoche**: la apertura y el cierre se calculan en la hora de Madrid; el estado cambia en la fecha sin que nadie tenga que volver a publicar la web.
- **Importación repetida**: al volver a ejecutar el script con la hoja actualizada, los equipos y jugadores ya importados no se duplican y los nuevos se añaden como pendientes.
- **Jugador del Forms en una categoría que no le toca por año de nacimiento, o el mismo jugador dos veces**: el script lo señala en su informe y no lo resuelve solo; decide Montca.
- **Retirada de la lista** (FR-040): el 09/01/2027 a las 23:59 la lista se ve; el 10/01/2027 a las 00:00 ya no se ve en la página ni la devuelve la fuente pública, sin que nadie publique la web. La página del evento sigue accesible con su información.
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
- **FR-014**: Para cada categoría, la página MUST mostrar las plazas de equipos libres: máximo de equipos de la categoría menos equipos confirmados. Una categoría sin plazas MUST marcarse como "Completa", con el texto de que se puede entrar en la lista de espera. Los equipos en lista de espera MUST NOT mostrarse ni contarse en la parte pública.
- **FR-015**: Mientras no exista una fuente real de equipos, la página MUST poder publicarse sin el apartado de plazas y sin "Equips inscrits", con el estado calculado solo por fechas y por el cierre manual.

**Botón Inscriure's**

- **FR-016**: Con el estado "obertes" o "completes", la página MUST mostrar el botón **Inscriure's** en la primera pantalla y otra vez debajo de "Equips inscrits" (o de las plazas, si la lista no se muestra; diseño en `diseno.md`). Con "completes", el botón lleva a la lista de espera por el mismo canal: mientras el modo sea "canal de Montca", al Google Forms, y la lista de espera la gestiona Montca (pendiente de confirmar con Montca, A-26). Con "pròximament" o "tancades", el botón MUST NOT mostrarse.
- **FR-017**: Cada evento MUST tener un **modo de inscripción** configurable en sus datos: **canal de Montca** (el botón abre la dirección configurada, ahora el Google Forms de Montca) o **web** (el botón lleva a la página de inscripción de C-05). Cambiar de modo MUST NOT requerir cambiar código.
- **FR-018**: En modo "canal de Montca", junto al botón MUST explicarse brevemente cómo funciona la inscripción: formulario de Montca y entrega de la autorización del tutor de los menores en papel o por Softco.
- **FR-019**: Si el modo es "canal de Montca" y la dirección no está configurada, en lugar del botón MUST mostrarse cómo contactar con Montca para apuntarse (WhatsApp si hay número; si no, correo).

**Equips inscrits**

- **FR-020**: El apartado "Equips inscrits" MUST mostrar solo equipos **confirmados**, separados por categoría (en el torneo: **Infantil/Cadet** y **Juvenil/Sènior**). Los pendientes y los de lista de espera MUST NOT salir como inscritos.
- **FR-021**: La lista de equipos MUST salir cuando haya al menos un equipo confirmado en el evento. Mientras no haya ninguno, en su lugar MUST mostrarse las plazas libres por categoría con un texto que anima a ser el primer equipo (si hay fuente de equipos; si no, FR-015).
- **FR-022**: De cada equipo MUST mostrarse solo: nombre del equipo, jugadores, el dorsal de cada jugador **si lo tiene** (obligatorio en la inscripción por la web, opcional en lo importado del Forms; quien no lo tiene sale sin él, sin hueco ni guion) y quién es el capitán.
- **FR-023**: De los jugadores menores de edad MUST mostrarse solo el **primer nombre** (la primera palabra del nombre), nunca los apellidos. De los adultos MUST mostrarse el nombre y el **primer apellido** ("Marc García"), nunca el segundo (`docs/legal/tratamientos.md`, T7). Si el primer apellido empieza por partículas ("de", "del", "de la"…), se muestran con él ("Ana de la Fuente"). Un jugador es menor si lo era en la fecha de inscripción o si no se conoce su fecha de nacimiento. El nombre público MUST calcularse antes de salir de la base de datos (FR-026).
- **FR-024**: Un menor sin autorización del tutor registrada MUST NOT salir en la lista pública.
- **FR-025**: Los equipos MUST mostrarse igual sea cual sea su origen (formulario de Montca o web); el origen MUST NOT verse en la parte pública. Los dos orígenes MUST contar igual para las plazas.
- **FR-026**: La parte pública MUST NOT recibir ni contener ningún dato que no se muestre: ni apellidos de menores, ni DNI, fecha de nacimiento, teléfono, correo, origen, autorización ni estado de los equipos no confirmados. Esto se comprueba también en el código fuente de la página y en las respuestas que reciba el navegador, no solo en lo que se ve.
- **FR-027**: Un equipo confirmado en los datos MUST aparecer en la página en 1 hora como máximo, sin cambiar código.
- **FR-028**: Si la fuente de equipos no responde, la página MUST seguir mostrando la información del evento y el botón, con un aviso breve en lugar de la lista.
- **FR-040**: "Equips inscrits" MUST retirarse de la web **una semana después de la última jornada** del evento (`docs/legal/tratamientos.md`, T7, y `privacidad.md`, 2.7): desde las 00:00 (hora de Madrid) del día que cae 7 días después de la última jornada. En este torneo, desde el **10/01/2027**. La fecha MUST calcularse a partir de las jornadas del evento, no escribirse a mano, para que sirva para el siguiente evento. Desde esa fecha, ni la página muestra ni pide la lista ni las plazas, **y la fuente pública de datos deja de devolver los equipos del evento**, porque ocultarlos solo en la página no basta: la clave pública permite pedirlos directamente. Los datos siguen en la base de datos hasta su borrado (T2 y T3, 03/04/2027), que no es parte de C-04.

**Franja en la portada**

- **FR-029**: Mientras un evento tenga el estado "obertes" (aunque alguna de sus categorías esté completa), la portada MUST mostrar en lo alto una franja del evento, visible sin scroll en 375 × 667 px, que lleva a su página. La franja va en la portada en valenciano; la portada en castellano no existe todavía y la crea B-07, que tendrá que incluir la franja.
- **FR-030**: Con cualquier otro estado, la franja MUST NOT mostrarse. Si hubiera más de un evento abierto, la franja muestra el que cierra antes.

**Datos de los equipos (para la capa de datos, C-05 y C-06)**

- **FR-031**: Cada equipo y cada jugador MUST guardar su **origen**: `forms` (formulario de Montca, importado) o `web` (C-05).
- **FR-032**: Cada jugador menor MUST guardar **cómo se entregó la autorización del tutor**: papel, Softco o casilla web. Es requisito para C-06 (validar autorizaciones).
- **FR-033**: Los equipos del formulario de Montca MUST cargarse en la base de datos con un **script de importación** que lee la hoja de respuestas de Montca exportada como CSV, cuando exista A-14. El script:
  - lee el CSV desde una ruta **fuera del repositorio**;
  - trata cada respuesta como **un jugador** y lo agrupa en un equipo por **nombre de equipo normalizado + categoría**;
  - marca como capitán a quien lo indique en el Forms; si nadie lo indica, a la primera respuesta del equipo;
  - normaliza los nombres de equipo (mayúsculas, tildes y espacios) y une solo los que coinciden tras normalizar; los nombres **parecidos sin ser iguales** los lista para que Montca o Saúl decidan, y nunca los une solo;
  - se puede **volver a ejecutar** con la hoja actualizada sin duplicar equipos ni jugadores;
  - guarda los equipos importados como **pendientes** y con origen `forms`; confirmarlos es decisión de Montca.
  La regla de agrupación es provisional hasta que Montca confirme cómo está hecho su Forms (A-26).
- **FR-034**: Los datos reales de inscripción (incluidas las respuestas del formulario de Montca y cualquier archivo exportado de su hoja) MUST NOT guardarse nunca en el repositorio, que es público y contendría DNI de menores.
- **FR-035**: Para hacer y probar la interfaz MUST usarse datos de prueba inventados, marcados como tales, que nunca se publiquen en producción: por categoría, un equipo confirmado y uno pendiente; entre ellos, al menos uno de cada origen.
- **FR-039**: Publicar los nombres de los jugadores (primer nombre de los menores; nombre y primer apellido de los adultos), el dorsal y el capitán MUST figurar en la política de privacidad (A-17, PR #56) y en el registro de tratamientos (A-19, PR #54) antes de que se publique "Equips inscrits" con datos reales.

**Reutilización e idiomas**

- **FR-036**: Todo lo propio de un evento (nombre, fechas, lugar, deportes, precio, categorías y sus límites, plazos, modo y dirección de inscripción, normas, preguntas frecuentes) MUST salir de sus datos, no del código, de modo que el siguiente evento se publique sin reprogramar.
- **FR-037**: Todo texto visible MUST salir de diccionarios de idioma o del contenido por idioma, no escrito directamente en componentes o páginas (constitución II). La sección Eventos, la página del evento y la franja MUST publicarse desde el principio en **valenciano y castellano**, y el botón VAL / CAST MUST cambiar **todo** el texto de la página (incluidos los datos del evento y las preguntas frecuentes) de un idioma al otro. Los nombres de equipos y jugadores no se traducen.
- **FR-038**: La página MUST cumplir la constitución V: zonas pulsables de al menos 44 px de alto, comprobación en 375 px y WCAG 2.2 AA como referencia.

### Fuera de alcance

- **C-05 · Inscripción de equipos por la web**: formulario, enlace del equipo, límites de jugadores, menores y correos. C-04 solo deja preparado el modo "web" del botón.
- **C-06 · Gestión para Montca**. Lo que C-04 le deja anotado como mínimo imprescindible:
  - **Dar de alta equipos y jugadores a mano** (los que no entren por el formulario ni por la web).
  - Confirmar equipos y pasar equipos de la lista de espera.
  - Ver el origen (`forms` / `web`) de cada equipo y jugador.
  - Ver y validar cómo se entregó la autorización de cada menor (papel, Softco o casilla web).
  - Cerrar las inscripciones a mano y crear el siguiente evento.
- **C-07 · Avisos por correo**, **B-13 · Cuenta atrás**, pago online (D-04) y fotos o reels del evento.
- El contenido del Google Forms de Montca y sus textos legales: son de Montca.

### Key Entities *(include if feature involves data)*

- **Evento**: lo que se celebra (el torneo de Navidad es el primero). Nombre, descripción, marca (Montca Sports), jornadas, lugar y su enlace de Google Maps, deportes, precio y si está confirmado, fechas de apertura y cierre de inscripciones, cierre manual, modo de inscripción (canal de Montca o web) y dirección del formulario, normas, preguntas frecuentes. Tiene una o varias categorías.
- **Categoría**: grupo de edad dentro de un evento. Nombre (Infantil/Cadet, Juvenil/Sènior), años de nacimiento, máximo de equipos, mínimo y máximo de jugadores por equipo. Sus plazas libres se calculan con los equipos confirmados.
- **Equipo**: pertenece a una categoría de un evento. Nombre (tal como se muestra) y nombre normalizado (para agrupar al importar), estado (pendiente, confirmado, lista de espera), origen (`forms` / `web`), capitán. Solo los confirmados son públicos y ocupan plaza.
- **Jugador**: pertenece a un equipo. Nombre y apellidos, fecha de nacimiento, dorsal (1–99, sin repetir en el equipo; obligatorio si el origen es `web`, opcional si es `forms`), si es el capitán, origen (`forms` / `web`) y, si es menor, cómo se entregó la autorización del tutor (papel, Softco o casilla web) y si está registrada. El resto de datos de C-05 (DNI, contacto, tutor, casillas de imagen e información) son de C-05 y C-06 y nunca llegan a la parte pública.
- **Vista pública de un equipo**: lo único que sale de la base de datos hacia la web: nombre del equipo, categoría, nombre público de cada jugador (primer nombre si es menor; nombre y primer apellido si es adulto), dorsal si lo tiene y capitán.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La página del torneo con la información y el botón de inscripción por el canal de Montca se puede publicar sin base de datos y sin i18n, antes que el resto de la feature.
- **SC-002**: Desde la portada, con las inscripciones abiertas, se llega al formulario de inscripción en 2 toques (franja → Inscriure's) en un móvil de 375 px; desde un enlace directo a la página del torneo, en 1.
- **SC-003**: En una revisión del código fuente y de las respuestas que recibe el navegador con los datos de prueba, hay 0 apellidos de menores, 0 segundos apellidos de adultos y 0 datos no públicos (DNI, fecha de nacimiento, contacto, origen, autorización, equipos no confirmados).
- **SC-004**: El 100 % de los datos del torneo mostrados coincide con `docs/info-montca.md`; no hay ninguna cifra, fecha ni norma inventada.
- **SC-005**: La prueba de resultados enriquecidos de Google valida el `Event` de la página sin errores.
- **SC-006**: Un segundo evento de prueba con categorías distintas se publica cambiando solo datos, con 0 líneas de código cambiadas.
- **SC-007**: El estado de las inscripciones es el correcto el día de apertura y el día después del cierre sin que nadie haya vuelto a publicar la web.
- **SC-008**: Un equipo confirmado en los datos aparece en la página en 1 hora como máximo.
- **SC-009**: En 375 × 667 px, la franja de la portada se ve entera sin scroll mientras las inscripciones están abiertas.
- **SC-010**: La página del torneo no tiene errores en la consola, se puede recorrer entera con el teclado y todas sus zonas pulsables miden al menos 44 px de alto.

## Assumptions

- **Fechas** (decisión de Montca del 23/11; la cambia en `docs/info-montca.md` el PR de Saúl `docs/estado-tareas-24-11`): inscripciones del 25/11/2026 al 20/12/2026, o antes si se llenan las plazas.
- **Plazas**: solo los equipos confirmados ocupan plaza (`docs/tareas.md`, C-05). Los dos orígenes cuentan igual.
- **Dirección del Google Forms**: Montca aún no la ha pasado; es un dato configurable del evento. No es un secreto (es pública), así que puede ir en los datos del evento del repositorio.
- **Textos legales del Google Forms**: son responsabilidad de Montca. La web solo enlaza; el formulario propio de la web (C-05) sí necesita los textos legales antes de publicarse (constitución IV, A-17). **Antes de publicar el botón**, Saúl confirma con Montca que su Forms informa de la privacidad (responsable, finalidad, derechos) y que la autorización del tutor llega en papel o por Softco; si no, el botón no se publica y en su lugar sale el contacto (FR-019). Las respuestas del Forms se guardan en Google, sin garantía de servidores en la UE: es un riesgo del proceso de Montca, no de la web, y se anota en el PR.
- **Teléfono en la pregunta frecuente de contacto**: el teléfono de Iker está en el documento de Drive, no en el repositorio. Mientras no haya un teléfono público acordado (A-24), la respuesta usa el correo público, las redes y WhatsApp si hay número.
- **Normas del torneo**: Montca aún no las ha pasado. Se piden en A-26.
- **Textos nuevos** (explicación junto al botón, estados, avisos): se redactan en valenciano y los revisa Montca antes de publicar.
- **Datos de prueba**: inventados, sin parecido con personas reales, marcados como prueba y fuera de producción.
- **Frescura de 1 hora** (FR-027): suficiente para un torneo con inscripción de días; si Montca necesita que sea inmediato, se revisa en el plan.
- **Pendiente de confirmar con Montca (A-26)**: que con una categoría o el torneo completos el botón siga llevando al Google Forms y que Montca gestione la lista de espera; cómo está hecho su Forms (una respuesta por jugador, si pregunta el capitán y el dorsal).
- **Privacidad**: publicar nombres de jugadores tiene que estar en la política de privacidad (A-17, PR #56) y en el registro de tratamientos (A-19, PR #54). Lo lleva Saúl.
- **`docs/tareas.md` y `docs/info-montca.md`** ya están actualizados en el PR #68; esta spec no los toca.

## Dependencies

- **A-01** (datos del torneo): hecha.
- **A-14** (proyecto Supabase en la UE, Saúl): necesaria para "Equips inscrits", plazas y la importación. **No bloquea P1.**
- **A-26** (Montca: precio final, quién confirma equipos, agrupación en el Forms, normas): en curso.
- **A-24** (número de WhatsApp): pendiente; mientras tanto, correo.
- **B-07** (i18n VAL/CAST, Saúl): pendiente. Mientras tanto, los textos van en VAL y CAST en un diccionario provisional, como en B-09, y B-07 los mueve a `src/i18n`.
- **B-02** (Netlify): pendiente; necesario para publicar.
- **B-09** (Cabecera, Pie, BarraInferior, EnlaceVolver): hecha; se reutiliza.
- **Página de Montca Sports**: no existe ninguna tarea para ella. "Esdeveniments" ocupa su sitio en el menú de escritorio; si se crea esa página, hay que decidir si vuelve al menú.
