# Research · Eventos y torneo de Navidad (C-04)

Decisiones técnicas tomadas para el plan. Cada una dice qué se elige, por qué y qué se descartó. Lo comprobado en esta máquina el 2026-11-24 va marcado como **comprobado**; el resto, como **por comprobar**.

## R1. Cómo cambian el estado y las plazas sin volver a publicar (FR-012, FR-027)

- **Decision**: la web sigue siendo estática (Astro sin adaptador). Cada página trae, al construirse, el estado calculado en ese momento, y un **script pequeño en el navegador**:
  - vuelve a calcular el estado con la hora del visitante, a partir de las fechas que lleva la propia página;
  - si hay fuente real de plazas, pide los recuentos por categoría a la consulta pública de Supabase.
- **Rationale**: cumple "cambia en su fecha sin volver a publicar" y "el contador se actualiza al recargar" sin servidor propio y sin coste. Sin JavaScript, la página sigue mostrando toda la información y el estado del día en que se construyó.
- **Alternatives considered**:
  - *Reconstruir la web cada hora con un aviso programado de Netlify*: unas 720 construcciones al mes superan los 300 minutos gratuitos de Netlify y tocaría `netlify.toml` (zona de Saúl).
  - *Páginas generadas en el servidor (adaptador de Netlify)*: añade un adaptador y funciones por visita para una página que cambia pocas veces al día.

## R2. Dónde viven los datos del evento (FR-036, constitución VI)

- **Decision**: una **colección de contenido de Astro** `eventos`, con un archivo YAML por evento (`src/content/eventos/torneig-nadal-2026.yaml`) y su esquema en `src/content.config.ts`. Los textos van con su versión `ca` y `es`.
- **Rationale**: el evento cambia poco y lo podrá editar Montca (constitución VI). El esquema hace que el build falle si falta un dato o un idioma. El siguiente evento es otro archivo YAML (SC-006). **Comprobado**: el cargador de archivos de Astro 7.4.11 lee `.yaml` (`node_modules/astro/dist/content/loaders/file.js`).
- **Alternatives considered**:
  - *El evento en Supabase*: haría depender la página informativa de A-14, justo lo que hay que evitar.
  - *JSON*: igual de válido, pero menos cómodo de editar a mano para Montca.
  - *Markdown con frontmatter*: no encaja con textos en dos idiomas.

## R3. La capa de datos de plazas detrás de una interfaz

- **Decision**: una interfaz `FuentePlazas` con un único método que devuelve los **recuentos de equipos por categoría** de un evento o un resultado "sin fuente" o "error". Tiene tres implementaciones:
  - **`ninguna`**: producción antes de la consulta pública. No pide nada y no se muestran las plazas (FR-015).
  - **`prueba`**: recuentos inventados. La página los deja incrustados **al construirse** (solo local y vistas previas).
  - **`supabase`** (A-14): `fetch` a la consulta `plazas_por_categoria` con la clave pública (`anon`) de Supabase.

  La fuente se elige con la variable de entorno `PUBLIC_FUENTE_PLAZAS`, que vale `ninguna` por defecto. El build **falla** si se pide `prueba` en el contexto de producción de Netlify.
- **Rationale**: toda la interfaz se puede hacer ya con datos de prueba, y cuando exista la consulta solo cambia la variable de entorno. Los datos de prueba nunca salen en producción.
- **Alternatives considered**: la librería `@supabase/supabase-js` (dependencia nueva para una sola petición de lectura; con `fetch` basta).
- *Sustituye (28/11/2026) a la interfaz `FuenteEquipos` y a la lista pública de equipos y jugadores.*

## R4. Privacidad en la base de datos (FR-026)

- **Decision**: las tablas de inscripciones tienen RLS activada y **ninguna política para `anon`**. La única puerta pública es la consulta **`plazas_por_categoria`**, que devuelve solo `{ evento, categoria, equipos_actuales }` ([contracts/vista-publica.md](contracts/vista-publica.md)).
- **Rationale**: el navegador no puede recibir un dato que no esté en la consulta, por mucho que alguien manipule la petición. Ni nombres de equipo ni de jugador salen de la base de datos.
- **Por comprobar (Saúl)**: que la vista o la función se creen con el propietario adecuado para leer tablas con RLS, y que `anon` solo tenga permiso sobre ella (documentación de Supabase sobre vistas y `security_invoker`).
- *Sustituye (28/11/2026) a la vista `equipos_publicos`.*

## R5. Importación del Google Forms: suprimida (28/11/2026)

El Google Forms provisional ya no se usa: las inscripciones solo se hacen desde la web. No hay importación de hojas de respuestas ni opciones (a) y (b) de A-30.

## R6. Zona horaria y fechas (FR-012, FR-040)

- **Decision**: las fechas del evento se guardan en ISO 8601 **con la diferencia horaria de Madrid escrita**. Por ejemplo, la apertura es `2026-11-25T00:00:00+01:00` y el cierre `2026-12-20T23:59:59+01:00`. El estado se calcula comparando instantes, sin librerías de fechas.
- **Rationale**: en invierno Madrid va a +01:00 y todas las fechas del torneo caen en invierno. Comparar instantes funciona igual en el servidor y en cualquier navegador.
- **Alternatives considered**: guardar fechas sin hora y convertir a Madrid con `Intl`, que es más código y más fácil de equivocar. El siguiente evento, si cae en verano, escribe `+02:00`. El esquema exige la diferencia horaria en las fechas.

## R7. Pruebas automáticas sin librería nueva

- **Decision**: `node --test` sobre archivos `.ts` (la lógica pura de `src/lib/eventos/`), con el script `npm test`. **Comprobado**: Node 22.23.5 ejecuta pruebas `.ts` sin opciones y sin dependencias, y el tsconfig de Astro permite importar con extensión `.ts` (`allowImportingTsExtensions`).
- **Rationale**: CLAUDE.md pide pruebas de la lógica, y la constitución VI pide justificar cada librería nueva. Así no hace falta ninguna.
- **Alternatives considered**: Vitest, que es más cómodo, pero es una dependencia nueva que habría que aprobar.

## R8. Datos `Event` para buscadores (FR-009)

- **Decision**: JSON-LD `SportsEvent` en el `<head>` de la página del evento, con:
  - `name`, `startDate` (primera jornada) y `endDate` (última);
  - `eventStatus: EventScheduled` y `eventAttendanceMode: OfflineEventAttendanceMode`;
  - `location` (`Place` con dirección de Cocentaina) y `organizer` (`SportsOrganization` Montca Actiu);
  - `subEvent` con las dos jornadas;
  - `offers` **solo** cuando el precio esté confirmado (de momento, no).

  Para que la página pueda escribir en el `<head>`, `BaseLayout` recibe un hueco (`slot`) con nombre para ese contenido.
- **Rationale**: `SportsEvent` es un subtipo de `Event`, así que vale para los resultados de eventos. Las dos jornadas no son seguidas, y `subEvent` lo dice sin mentir sobre los días intermedios.
- **Por comprobar**: pasar la página por la prueba de resultados enriquecidos de Google (SC-005). Sin `offers`, Google puede dar un aviso, que no es un error. Se acepta hasta que haya precio.

## R9. Rutas e idiomas (FR-037)

- **Decision**:
  - Rutas en valenciano: `/esdeveniments/` y `/esdeveniments/<id-del-evento>/`. En castellano, las mismas con el prefijo provisional `/es` (como B-09).
  - Las páginas de `src/pages/` son envoltorios finos que pasan `lang` a componentes de página compartidos.
  - Los textos de la interfaz van en un diccionario provisional `src/components/textos-eventos.ts`, con la misma forma que `textos-navegacion.ts`.
  - Los textos del evento van en su YAML con `ca` y `es`.
  - La clave `eventos` y su ruta van en `textos-navegacion.ts`.
- **Rationale**: respeta la constitución II y las zonas (no se toca `src/i18n`). B-07 solo tendrá que mover diccionarios y rutas.
- **Nota**: la franja va en la portada en valenciano (`src/pages/index.astro`). La portada en castellano todavía no existe; cuando B-07 la cree, se añade allí el mismo componente.

## R10. "Com arribar"

- **Decision**: enlace `https://www.google.com/maps/search/?api=1&query=<lugar codificado>`, formado a partir del nombre y la dirección del lugar que trae el YAML. Se abre en una pestaña nueva, con un icono de enlace externo y texto para lectores de pantalla.
- **Rationale**: es la forma documentada de los enlaces universales de Google Maps. No carga nada de Google en la página (decisión del 15/11: sin mapa incrustado).
