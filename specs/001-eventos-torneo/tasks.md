---
description: "Tareas de C-04 · Eventos y torneo de Navidad"
---

# Tasks: Eventos y torneo de Navidad (C-04)

**Input**: `specs/001-eventos-torneo/` (spec.md, plan.md, diseno.md, research.md, data-model.md, contracts/, quickstart.md)

**Tests**: se incluyen pruebas automáticas **solo de la lógica pura** (`src/lib/eventos/`), porque CLAUDE.md pide probar servicios, validadores y cálculos. La UI se comprueba a mano con [quickstart.md](quickstart.md).

**Dueño**: cada tarea dice **(Pablo)**, **(Saúl)** o **(Pablo, avisa a Saúl)** cuando toca algo compartido (`src/pages`, `package.json`). Nadie toca `src/i18n`, `netlify.toml` ni los formularios.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: se puede hacer en paralelo (otro archivo, sin depender de tareas sin acabar)
- **[Story]**: historia de usuario de spec.md (US1–US4)

---

## Phase 1: Setup

**Purpose**: dejar listo lo que usan todas las historias.

- [X] T001 (Pablo, avisa a Saúl) Añadir el script `"test": "node --test \"src/lib/**/*.test.ts\""` en `package.json` (comillas dobles escapadas para que el patrón lo expanda Node y funcione igual en Linux y en el `cmd` de Windows de Saúl) y comprobar que `npm test` termina con 0 pruebas y código 0 (research R7; comprobado en Node 22.23.5)
- [X] T002 [P] (Saúl) Crear la colección `eventos` en `src/content.config.ts` con el cargador `glob` de YAML y el esquema de [data-model.md](data-model.md) §1: todo texto visible es `{ ca, es }` (los dos obligatorios); `jornadas` "≥ 1", con `fecha` en `AAAA-MM-DD`; `inscripcion.apertura` y `inscripcion.cierre` "fecha y hora ISO con diferencia horaria" (rechazar fechas sin diferencia horaria) y el cierre "posterior a la apertura"; `inscripcion.modo` `canal-montca` | `web`; `inscripcion.url` URL o vacía; `inscripcion.nota` obligatoria si `modo = canal-montca`; `precio.importe` "solo con `confirmado: true`"; categorías con `maxEquipos` "entero > 0" y `minJugadores ≤ maxJugadores`
- [X] T003 (Saúl) Crear `src/content/eventos/torneig-nadal-2026.yaml` con los datos de `docs/info-montca.md` según [contracts/evento-contenido.md](contracts/evento-contenido.md), con las seis preguntas en `ca` y `es` (el texto en valenciano tal cual de `docs/info-montca.md`, incluido el teléfono 722 79 60 66 en la de contacto), con `url` y `direccion` vacías hasta que las dé Montca, y comprobar que `npm run build` pasa (depende de T002)

---

## Phase 2: Foundational

**Purpose**: lógica y textos que usan todas las páginas. **Ninguna historia empieza sin esto.**

- [X] T004 [P] (Pablo) Escribir las pruebas de `calcularEstado` en `src/lib/eventos/estado.test.ts` con los casos de [quickstart.md](quickstart.md) §1: un minuto antes de la apertura, justo en la apertura, 23:59:59 del 20/12 y un segundo después, `cerradaAMano`, las dos categorías llenas, una sola llena, sin recuento; y `placesLliures` nunca negativo, evento pasado y `listaRetirada` (casos de [quickstart.md](quickstart.md) §1, incluido el de verano). Comprobar que fallan
- [X] T005 (Pablo) Implementar en `src/lib/eventos/estado.ts` `calcularEstado(evento, ahora, confirmadosPorCategoria?)` (devuelve `proximament` | `obertes` | `completes` | `tancades`), `plazasCategoria(categoria, confirmados)`, `esEventoPasado(evento, ahora)` y `listaRetirada(evento, ahora)` ("igual o posterior a última jornada + 7 días", con la fecha de hoy en Madrid; FR-040), según el orden de [data-model.md](data-model.md) §2, hasta que pase T004
- [X] T006 [P] (Pablo) Crear `src/components/textos-eventos.ts` con la forma `{ ca: {...}, es: {...} }` y la función `t(lang, clave)` de `textos-navegacion.ts`, con todos los textos de interfaz de [diseno.md](diseno.md): estados, "Inscriure's", "Com arribar", "Què cal saber", "Preguntes freqüents", "Places i equips", "N de M places lliures", "Completa", "Pots apuntar-te a la llista d'espera", "Encara no hi ha cap equip confirmat. Sigues el primer!", "capità", aviso de error de carga, "preu final pendent", "Escriu-nos per a apuntar-te", sin eventos próximos, "s'obri en una pestanya nova"
- [X] T007 [P] (Pablo) Añadir la clave `eventos` ("Esdeveniments" / "Eventos") y la ruta `/esdeveniments/` en `src/components/textos-navegacion.ts`, sin mover nada a `src/i18n`
- [X] T008 (Pablo) En `src/components/Cabecera.astro`, poner `eventos` en el lugar de `sports` en el menú de escritorio y añadir `eventos` al menú móvil; en `src/components/Pie.astro`, añadirlo a las secciones. La barra inferior no cambia (depende de T007)
- [X] T009 [P] (Pablo) Añadir los iconos `lugar` y `externo` (trazo de 2 px, 24 × 24, `currentColor`, `aria-hidden`) en `src/components/Icono.astro`
- [X] T010 [P] (Pablo) Añadir a `src/layouts/BaseLayout.astro` un `<slot name="head" />` dentro de `<head>`, sin cambiar nada más

**Checkpoint**: `npm test` y `npm run build` pasan; el menú muestra "Esdeveniments".

---

## Phase 3: User Story 1 · Informarse y apuntarse por el canal de Montca (Priority: P1) 🎯 MVP

**Goal**: página del torneo con toda la información y "Inscriure's" al Google Forms, publicable sin Supabase.

**Independent Test**: [quickstart.md](quickstart.md) §2, con `PUBLIC_FUENTE_EQUIPOS` sin definir.

- [X] T011 [P] [US1] (Pablo) Implementar en `src/lib/eventos/enlaces.ts` `urlComArribar(lugar)` (`https://www.google.com/maps/search/?api=1&query=` + nombre, dirección si la hay y localidad, codificados) y `destinoInscripcion(evento)`: la `url` si existe, o `null` si el modo es `canal-montca` con la `url` vacía (FR-017, FR-019). Añadir sus pruebas en `src/lib/eventos/enlaces.test.ts`
- [X] T012 [P] [US1] (Pablo) Implementar en `src/lib/eventos/json-ld.ts` el `SportsEvent` de research R8: `name`, `startDate`, `endDate`, `eventStatus`, `eventAttendanceMode`, `location` (`Place` con la localidad), `organizer` (`SportsOrganization` Montca Actiu) y `subEvent` por jornada; **sin `offers` mientras `precio.confirmado` sea `false`**. Añadir sus pruebas en `src/lib/eventos/json-ld.test.ts`
- [X] T013 [P] [US1] (Pablo) Crear `src/components/eventos/EstatInscripcio.astro`: marca de pintura teja con el texto de cada estado según la tabla de [diseno.md](diseno.md) §2, con un atributo `data-estado` que el script pueda cambiar
- [X] T014 [P] [US1] (Pablo) Crear `src/components/eventos/BotoInscripcio.astro`: botón primario teja a todo el ancho, con la altura de `button-primary` de DESIGN.md (44 px), que lleva a `destinoInscripcion`; debajo, la `nota` del evento; con destino `null`, el enlace de contacto (WhatsApp con `urlWhatsapp` o, sin número, el correo de `contacto.ts`). No se muestra con `proximament` ni con `tancades` (FR-016)
- [X] T015 [US1] (Pablo) Crear `src/components/eventos/CartellEvento.astro`: la primera pantalla de [diseno.md](diseno.md) §2 y [boceto-cartell.html](boceto-cartell.html) (marca, `h1`, jornadas con numerales Display 800 y raya Verd bosc, plano Pedra con deportes y precio + "preu final pendent" si no está confirmado, lugar con "Com arribar" (zona pulsable de 44 px de alto como mínimo), `EstatInscripcio`, `BotoInscripcio`). Comprobar en 390 × 844 que todo cabe sin scroll (depende de T011, T013 y T014)
- [X] T016 [P] [US1] (Pablo) Crear `src/components/eventos/QueCalSaber.astro`: tabla de categorías (nombre, nacidos, máximo de equipos, jugadores mín–máx), precio, plazo de inscripción y normas solo si existen (FR-005, FR-006)
- [X] T017 [P] [US1] (Pablo) Crear `src/components/eventos/PreguntesFrequents.astro` con un `<details>`/`<summary>` por pregunta, con filas de al menos 44 px y foco visible (FR-008)
- [X] T018 [P] [US1] (Pablo) Crear `src/components/eventos/ComArribar.astro`: nombre del lugar y enlace externo de 44 px de alto como mínimo con el icono `externo` y el texto oculto "s'obri en una pestanya nova", sin mapa incrustado (FR-007)
- [X] T019 [US1] (Pablo) Crear `src/components/eventos/PaginaEvento.astro` (recibe `evento` y `lang`): `BaseLayout` con título, descripción e imagen, JSON-LD en el slot `head`, `EnlaceVolver` a la lista de eventos, `CartellEvento`, el segundo `BotoInscripcio`, `QueCalSaber`, `PreguntesFrequents` y `ComArribar`, en el orden de [diseno.md](diseno.md) §2 (depende de T010, T012 y T015–T018)
- [X] T020 [US1] (Pablo, avisa a Saúl) Crear los envoltorios `src/pages/esdeveniments/[evento].astro` y `src/pages/es/esdeveniments/[evento].astro` con `getStaticPaths` sobre la colección `eventos`, pasando `lang` `ca` o `es` a `PaginaEvento` (depende de T003 y T019)
- [X] T021 [P] [US1] (Pablo) Crear una versión mínima de `src/components/eventos/PaginaEventos.astro` (título "Esdeveniments" y un enlace por evento) y sus envoltorios `src/pages/esdeveniments/index.astro` y `src/pages/es/esdeveniments/index.astro` (avisa a Saúl), para que "← Tornar" y el menú no lleven a un 404 (se completa en US4)
- [X] T022 [US1] (Pablo) Crear `src/scripts/eventos-cliente.ts`, solo la parte del estado: lee las fechas de la página (`data-*`), llama a `calcularEstado` con la hora actual y actualiza `EstatInscripcio` y la visibilidad de `BotoInscripcio` sin recargar (FR-012). Cargarlo desde `PaginaEvento` (depende de T005 y T019)
- [X] T023 [US1] (Pablo) Comprobar [quickstart.md](quickstart.md) §2, puntos 1–12, a 375 px y en escritorio, con la consola sin errores, y anotar el resultado en el PR
- [ ] T024 [US1] (Saúl) Cuando esté hecha **A-30 (issue #70)** (el Google Forms en `docs/legal/tratamientos.md` y `docs/legal/privacidad.md`, y el Forms informando de la privacidad y de la lista pública), anotar la URL del Forms en `src/content/eventos/torneig-nadal-2026.yaml`. **Hasta entonces, `url` queda vacía** y la página sale con el contacto en lugar del botón (FR-019)

**Checkpoint**: la entrega 1 se puede publicar en cuanto estén B-02 y Montca haya revisado el castellano; sin T024 (A-30) sale con el contacto en lugar del botón al Forms.

---

## Phase 4: User Story 2 · Equipos inscritos y plazas libres (Priority: P2)

**Goal**: plazas por categoría y "Equips inscrits" con los dos orígenes iguales. UI hecha con datos de prueba; datos reales cuando esté A-14.

**Independent Test**: [quickstart.md](quickstart.md) §3 (Pablo) y §6 (Saúl).

### UI con datos de prueba (Pablo, ya)

- [X] T025 [P] [US2] (Pablo) Escribir en `src/lib/eventos/vista-publica.test.ts` los once casos de [contracts/vista-publica.md](contracts/vista-publica.md), más: solo equipos `confirmado`; interruptor `jugadores_forms_publicables` apagado y encendido (FR-041); un equipo confirmado sin jugadores visibles sale con la lista vacía; orden (equipos alfabético, capitán primero). Comprobar que fallan
- [X] T026 [US2] (Pablo) Implementar en `src/lib/eventos/vista-publica.ts` `aEquiposPublicos(equipos, jugadores, autorizaciones)` con las reglas de [contracts/vista-publica.md](contracts/vista-publica.md): menor si "`fecha_nacimiento` nula, o menos de 18 años cumplidos en `fecha_inscripcion`"; nombre público del menor = primera palabra; del adulto = primera palabra + primer apellido (con sus partículas iniciales: "de", "del", "de la"…); fuera los menores sin una autorización `recibida` en `autorizaciones`; con el interruptor `jugadores_forms_publicables` apagado, equipos `forms` con `jugadoresOcultos: true` y sin jugadores, y fuera los jugadores `forms` de equipos `web` (FR-041). Debe pasar T025
- [X] T027 [P] [US2] (Pablo) Crear `src/lib/eventos/datos-prueba.ts` con las cuatro filas de equipos, sus jugadores y las autorizaciones de sus menores (formas `casilla_web`, `firma_digital` y `papel`; una sin recibir) de [data-model.md](data-model.md) §5 (nombres de equipo con el prefijo "Prova ·", personas inventadas), y una prueba en `src/lib/eventos/datos-prueba.test.ts` que compruebe que solo salen los dos confirmados y que las plazas son 7/8 y 5/6
- [X] T028 [US2] (Pablo) Implementar `src/lib/eventos/fuente-equipos.ts` según [contracts/fuente-equipos.md](contracts/fuente-equipos.md): interfaz `FuenteEquipos`, tipos `EquipoPublico` y `ResultadoEquipos`, `fuenteNinguna`, `fuenteIncrustada` (lee un `<script type="application/json">` de la página), elección con `PUBLIC_FUENTE_EQUIPOS` (por defecto `ninguna`), y error de build si vale `prueba` con `CONTEXT=production` o `supabase` sin URL o sin clave. Dejar `src/lib/eventos/fuente-supabase.ts` como implementación provisional que devuelve `{ tipo: 'sin-fuente' }`, para Saúl (depende de T026 y T027)
- [X] T029 [US2] (Pablo) Crear `src/components/eventos/PlacesIEquips.astro`: un bloque Herba clara por categoría con nombre, nacidos, "N de M places lliures" o "Completa" + "Pots apuntar-te a la llista d'espera", y la lista de equipos como `<details>` (nombre y número de jugadores; dentro, "nombre · dorsal" si lo tiene y "capità" en texto). Estados: sin equipos confirmados → plazas + "Sigues el primer!"; `sin-fuente` → no se renderiza nada; error → una línea de aviso. Con fuente `prueba`, incrustar al construir **solo** el JSON público. Colocarlo en `PaginaEvento.astro` entre `CartellEvento` y el segundo `BotoInscripcio` (depende de T028)
- [X] T030 [US2] (Pablo) Completar `src/scripts/eventos-cliente.ts`: pide los equipos con la fuente elegida, rellena `PlacesIEquips` con plantillas `<template>` (textos desde el HTML, no escritos en el script), pasa a `calcularEstado` el recuento de confirmados por categoría (para `completes`) y deja la página intacta si hay error (FR-027, FR-028) (depende de T029)
- [X] T031 [US2] (Pablo) Retirada de la lista (FR-040): con `listaRetirada` verdadero, `PlacesIEquips.astro` no renderiza nada al construir y `eventos-cliente.ts` ni pide equipos ni muestra la lista ni las plazas, también si la página se construyó antes de la fecha. La información del evento sigue (depende de T005 y T030)
- [X] T032 [US2] (Pablo) Equipos con jugadores ocultos (FR-041): en `PlacesIEquips.astro` y `eventos-cliente.ts`, un equipo con `jugadoresOcultos: true` sale solo con su nombre (sin desplegable, sin número de jugadores, sin capitán) y cuenta para las plazas; el texto de la interfaz no dice nada del origen. Comprobarlo con los datos de prueba con el interruptor apagado y encendido (depende de T026 y T029)
- [X] T033 [US2] (Pablo) Comprobar [quickstart.md](quickstart.md) §3, puntos 1–8, incluida la búsqueda de apellidos y equipos pendientes en el código fuente y en la pestaña Red (SC-003), y anotarlo en el PR

### Capa de datos (Saúl, cuando esté A-14)

- [ ] T034 [US2] (Saúl) Crear en Supabase (UE) las tablas `eventos` (con `ultima_jornada` = la última jornada del YAML y `jugadores_forms_publicables` por defecto `false`, FR-041), `equipos`, `jugadores` y `autorizaciones` (aparte de `jugadores`, con `jugador_id` `on delete set null` y borrado un año después de la última jornada, T4) de [data-model.md](data-model.md) §3, incluidos `estado` `pendiente` | `confirmado` | `espera` (por defecto `pendiente`), `origen` `forms` | `web`, `autorizaciones.forma` `casilla_web` | `firma_digital` | `papel`, `dorsal` "del 1 al 99, sin repetir dentro del equipo", obligatorio si `origen = web` y opcional si `origen = forms`, y la unicidad de `(evento, categoria, nombre_normalizado)`, con RLS activada y sin políticas para `anon`. Guardar el SQL (sin datos) en el repo, en la carpeta que decida Saúl
- [ ] T035 [US2] (Saúl) Crear la vista `equipos_publicos`, que deja de devolver un evento desde última jornada + 7 días en hora de Madrid (FR-040) y que, con `jugadores_forms_publicables = false`, devuelve los equipos `forms` sin jugadores y sin ningún jugador `forms` (FR-041), y dar `select` solo sobre ella a `anon`, según [contracts/vista-publica.md](contracts/vista-publica.md). Pasar sus comprobaciones y los once casos (depende de T034)
- [ ] T036 [US2] (Saúl) Implementar `src/lib/eventos/fuente-supabase.ts`: `fetch` a `{PUBLIC_SUPABASE_URL}/rest/v1/equipos_publicos?evento=eq.<id>` con `apikey` y `Authorization`, tiempo máximo de 8 s, conversión a `EquipoPublico` y `{ tipo: 'error' }` ante cualquier fallo. Sin `supabase-js` (depende de T028 y T035)
- [ ] T050 [US2] (Pablo, después de T036) Reservar el espacio del bloque "Places i equips" en `src/components/eventos/PlacesIEquips.astro` para que no empuje el contenido de debajo cuando aparece al cargar (P2 del `/impeccable audit` del #86). Con la fuente de datos reales la respuesta tarda más que con la de prueba (hasta 8 s) y el desplazamiento se nota. Comprobar con la red limitada que "Què cal saber" no se mueve, y que con `sin-fuente` o con la lista retirada el espacio se libera sin dejar un hueco
- [ ] T051 [US2] (Pablo, después de T036) Que el aviso de error de "Places i equips" sea una región `role="status"` (P3 del `/impeccable audit` del #86): tiene que estar ya en el HTML al construir, vacía, y rellenarse cuando falle la fuente, para que los lectores de pantalla lo anuncien. Comprobarlo con una fuente que falle
- [ ] T037 [US2] (Saúl) Decidir en A-30 (issue #70) la forma de importar, opción (a) Apps Script + Netlify Function con secreto (recomendada) u opción (b) desde un ordenador si antes se cambia el registro, y construirla según [contracts/importacion-forms.md](contracts/importacion-forms.md): ningún dato por un ordenador personal y la clave de servicio solo en Netlify (salvo la opción b aprobada); modo simular; un jugador por fila; agrupa por nombre normalizado y categoría; capitán marcado o primera respuesta; duplicados por DNI; repetible; nunca cambia `estado`; dorsal opcional (1–99, sin repetir; si no, vacío y al informe); autorización en `autorizaciones` con `forma` `firma_digital` o `papel` (según la respuesta o Montca) y `recibida = false`; informe sin datos personales completos; columnas leídas por un mapa de nombres (depende de T034)
- [ ] T038 [US2] (Saúl) Comprobar que lo que muestra la vista coincide con `docs/legal/tratamientos.md` (T7) y `docs/legal/privacidad.md` (2.7), ya en `main`, y que A-30 (issue #70) está hecha antes de activar los equipos reales (FR-039)
- [ ] T039 [US2] (Saúl) Primera importación real (primero en modo simular y después en serio), configurar en Netlify `PUBLIC_FUENTE_EQUIPOS=supabase`, `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_ANON_KEY`, y comprobar [quickstart.md](quickstart.md) §6 (depende de T036, T037 y T038)
- [ ] T040 [US2] (Saúl) Cuando A-30 (issue #70) confirme que quienes se apuntaron por el Forms están informados de la lista pública (T7), poner `eventos.jugadores_forms_publicables = true` en Supabase y comprobar que sus jugadores aparecen al recargar, sin publicar la web (FR-041)

**Checkpoint**: con `prueba`, toda la UI funciona; en producción no cambia nada hasta T039.

---

## Phase 5: User Story 3 · Franja en la portada (Priority: P3)

**Goal**: franja del torneo bajo la cabecera mientras las inscripciones estén abiertas.

**Independent Test**: [quickstart.md](quickstart.md) §4.

- [X] T041 [US3] (Pablo) Crear `src/components/eventos/FranjaEsdeveniment.astro`: banda Verd bosc a todo el ancho, texto Boira, flecha y foco en Teula clara, toda la banda es un enlace de al menos 44 px, no fija. Elige el evento abierto que cierra antes (FR-030). Al construir solo se renderiza si el estado es `obertes`; en el navegador, `eventos-cliente.ts` la oculta o la muestra según el estado actual
- [X] T042 [US3] (Pablo, avisa a Saúl) Colocar `FranjaEsdeveniment` al principio del contenido de `src/pages/index.astro` y comprobar a 375 × 667 que se ve entera sin scroll (depende de T041)

---

## Phase 6: User Story 4 · Sección Eventos y siguiente evento sin reprogramar (Priority: P4)

**Goal**: lista de eventos completa y reutilización sin tocar código.

**Independent Test**: [quickstart.md](quickstart.md) §5.

- [X] T043 [P] [US4] (Pablo) Crear `src/components/eventos/TargetaEsdeveniment.astro`: nombre, jornadas, lugar y `EstatInscripcio`; toda la tarjeta es un enlace de al menos 44 px; plano Pedra si el evento está `obertes` y Herba clara si no
- [X] T044 [US4] (Pablo) Completar `src/components/eventos/PaginaEventos.astro`: tarjetas de los eventos no pasados (`esEventoPasado`), ordenadas por primera jornada, y mensaje sin eventos con contacto (FR-003, FR-004) (depende de T043)
- [ ] T045 [US4] (Pablo) Comprobar [quickstart.md](quickstart.md) §5 con un segundo YAML local (no se sube): aparece con su página, su estado y sus plazas, y `git diff -- src/lib src/components src/pages` sale vacío (SC-006)

---

## Phase 7: Polish & Cross-Cutting

- [ ] T046 (Pablo) `/impeccable audit` de la página del torneo, la lista y la franja (375 px y escritorio, teclado, contraste, 44 px) y corregir lo que salga
- [ ] T047 (Pablo) `/impeccable document` para actualizar `DESIGN.md` y su anexo con el tamaño Display y los componentes nuevos
- [ ] T048 [P] (Pablo) Pasar la página construida por la prueba de resultados enriquecidos de Google (SC-005) y anotarlo en el PR
- [ ] T049 (Saúl, al fusionar el PR de la spec) Anotar en `docs/decisiones.md` "Esdeveniments" en el lugar de "Montca Sports" en el menú

---

## Dependencies & Execution Order

- **Setup (T001–T003)**: T003 depende de T002. T001 y T002 en paralelo. T002 y T003 están en el camino crítico de la entrega 1: si Saúl no puede hacerlos a tiempo, los hace Pablo **con su acuerdo** y Saúl los revisa en el PR.
- **Foundational (T004–T010)**: T005 después de T004; T008 después de T007. El resto, en paralelo. **Bloquea todas las historias.**
- **US1 (T011–T024)**: depende de Setup y Foundational. Es la **entrega 1**.
- **US2 UI (T025–T033)**: depende de Foundational y de que exista `PaginaEvento` (T019). Se puede empezar en cuanto esté T019.
- **US2 datos (T034–T040)**: depende de A-14 y de la interfaz T028. Va en paralelo con todo lo de Pablo.
- **US2, después de Supabase (T050–T051)**: dependen de T036 (con la fuente real hay tiempo de carga); son de Pablo y se hacen cuando Saúl la tenga.
- **US3 (T041–T042)**: depende de Foundational y de la parte de estado de `eventos-cliente.ts` (T022).
- **US4 (T043–T045)**: depende de T021.
- **Polish**: al final de cada entrega que se publique (T046), o al terminar todo.

### Orden de las historias

US1 → (US2 UI ∥ US2 datos de Saúl) → US3 → US4. US3 y US4 son independientes entre sí.

## Parallel Example

```text
# Foundational, en paralelo (Pablo):
T004 estado.test.ts · T006 textos-eventos.ts · T007 textos-navegacion.ts · T009 Icono.astro · T010 BaseLayout.astro
# A la vez (Saúl):
T002 content.config.ts → T003 torneig-nadal-2026.yaml

# US1, en paralelo (Pablo):
T011 enlaces.ts · T012 json-ld.ts · T013 EstatInscripcio · T014 BotoInscripcio · T016 QueCalSaber · T017 PreguntesFrequents · T018 ComArribar
```

## Implementation Strategy

1. **MVP = US1** (T001–T024): página informativa + Forms. Se publica con B-02, sin esperar a A-14 ni a B-07. **Es lo que corre prisa antes del 20/12.**
2. **US2 UI** con datos de prueba: se fusiona sin cambiar nada en producción (fuente `ninguna`).
3. **US2 datos** (Saúl) en cuanto esté A-14; la activación es T039 (y T040 para los jugadores del Forms, cuando esté A-30).
4. **US3** y **US4**, y el acabado.

**Issues por zona** (después del PR de la spec):
- **Pablo**: Foundational + US1; US2 UI; US3; US4 + acabado; T050–T051 después de T036.
- **Saúl**: T002–T003 y T024; US2 datos (T034–T040); T049.
