# Research · Eventos y torneo de Navidad (C-04)

Decisiones técnicas tomadas para el plan. Cada una dice qué se elige, por qué y qué se descartó. Lo comprobado en esta máquina el 2026-11-24 va marcado como **comprobado**; el resto, como **por comprobar**.

## R1. Cómo cambian el estado y la lista sin volver a publicar (FR-012, FR-027)

- **Decision**: la web sigue siendo estática (Astro sin adaptador). Cada página trae, al construirse, el estado calculado en ese momento, y un **script pequeño en el navegador**:
  - vuelve a calcular el estado con la hora del visitante, a partir de las fechas que lleva la propia página;
  - si hay fuente real de equipos, pide la lista de equipos confirmados a la vista pública de Supabase.
- **Rationale**: cumple "cambia en su fecha sin volver a publicar" y "aparece en menos de 1 hora" sin servidor propio y sin coste. Sin JavaScript, la página sigue mostrando toda la información y el estado del día en que se construyó.
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

## R3. La capa de datos de equipos detrás de una interfaz

- **Decision**: una interfaz `FuenteEquipos` con un único método que devuelve los **equipos públicos** de un evento o un resultado "sin fuente" o "error". Tiene tres implementaciones:
  - **`ninguna`**: producción antes de A-14. No pide nada y no se muestran ni la lista ni las plazas (FR-015).
  - **`prueba`**: datos inventados. Se convierten en equipos públicos **al construir la página** y solo llega al navegador el resultado público (SC-003).
  - **`supabase`** (A-14): `fetch` a la vista `equipos_publicos` con la clave pública (`anon`) de Supabase.

  La fuente se elige con la variable de entorno `PUBLIC_FUENTE_EQUIPOS`, que vale `ninguna` por defecto. El build **falla** si se pide `prueba` en el contexto de producción de Netlify.
- **Rationale**: toda la interfaz se puede hacer ya con datos de prueba, y cuando exista A-14 solo cambia la variable de entorno. Los datos de prueba nunca salen en producción.
- **Alternatives considered**:
  - *Librería `@supabase/supabase-js`*: es una dependencia nueva para una sola petición de lectura. Con `fetch` a la API REST de Supabase basta y no hay que justificar ninguna librería.
  - *Pasar los datos de prueba "en crudo" al navegador y filtrarlos allí*: enviaría apellidos y equipos pendientes, aunque inventados, y no se podría comprobar SC-003.

## R4. Privacidad en la base de datos (FR-023, FR-024, FR-026)

- **Decision**: las tablas `equipos` y `jugadores` tienen RLS (seguridad por filas) activada y **ninguna política para `anon`**. La única puerta pública es la **vista `equipos_publicos`**, que:
  - devuelve solo los equipos confirmados;
  - calcula en SQL el nombre público (primer nombre de los menores; nombre y primer apellido de los adultos);
  - deja fuera a los menores sin autorización registrada;
  - devuelve solo nombre del equipo, categoría, nombre público, dorsal y capitán.
- **Rationale**: el navegador no puede recibir un dato que no esté en la vista, por mucho que alguien manipule la petición. La regla del nombre público vive en un solo sitio en producción (SQL), y las mismas reglas se prueban en TypeScript con los datos de prueba (contrato en [contracts/vista-publica.md](contracts/vista-publica.md)).
- **Alternatives considered**:
  - *Políticas RLS de lectura sobre las tablas*: expondrían todas las columnas de las filas permitidas, apellidos y fecha de nacimiento incluidos.
  - *Una función de Netlify que filtre*: añade una pieza más que mantener.
- **Por comprobar (Saúl, A-14)**: que la vista se cree con el propietario adecuado para leer tablas con RLS, y que `anon` solo tenga permiso de lectura sobre la vista. Mirar la documentación de Supabase sobre vistas y `security_invoker` antes de crearla.

## R5. Importación del Google Forms (FR-033, FR-034)

- **Decision**: un script de Node en `scripts/importar-forms/`, ejecutado **en el ordenador de Saúl**, con dos datos de entrada:
  - la ruta del CSV exportado de la hoja de Montca, que se pasa como argumento y tiene que estar **fuera del repositorio** (el script se niega a leer un archivo dentro del repo);
  - la clave de servicio de Supabase, en una variable de entorno de `.env`, que ya está en `.gitignore`.

  Qué hace:
  - agrupa los jugadores por nombre de equipo normalizado y categoría;
  - inserta o actualiza con una clave estable por respuesta, así que se puede repetir sin duplicar;
  - guarda los equipos como `pendiente` y con origen `forms`;
  - escribe un informe en pantalla con nombres parecidos, jugadores fuera de su categoría y duplicados.

  El CSV se borra después de importar.
- **Rationale**: cumple la decisión del clarify (script, CSV fuera del repo, repetible) y la regla de que los datos reales nunca entran en el repositorio.
- **Alternatives considered**:
  - *Apps Script en la hoja de Montca que escriba en Supabase*: dejaría la clave de servicio en la cuenta de Google de Montca y es más difícil de probar.
  - *Copiar los datos a mano en el editor de Supabase*: descartado en el clarify.
- **Por decidir (Saúl)**:
  - Si el CSV se lee con un analizador hecho a mano o con una librería. Las respuestas del Forms pueden llevar comas y comillas; si se usa una librería, se justifica en el PR (constitución VI).
  - Las columnas exactas del Forms (A-26): si pregunta el capitán y el dorsal, y cómo viene la autorización.

## R6. Zona horaria y fechas (FR-012, FR-040)

- **Decision**: las fechas del evento se guardan en ISO 8601 **con la diferencia horaria de Madrid escrita**. Por ejemplo, la apertura es `2026-11-25T00:00:00+01:00` y el cierre `2026-12-20T23:59:59+01:00`. El estado se calcula comparando instantes, sin librerías de fechas.
- **Rationale**: en invierno Madrid va a +01:00 y todas las fechas del torneo caen en invierno. Comparar instantes funciona igual en el servidor y en cualquier navegador.
- **Alternatives considered**: guardar fechas sin hora y convertir a Madrid con `Intl`, que es más código y más fácil de equivocar. El siguiente evento, si cae en verano, escribe `+02:00`. El esquema exige la diferencia horaria en las fechas.

- **Retirada de la lista (FR-040)**: se calcula a partir de la fecha de la última jornada (`AAAA-MM-DD`) + 7 días, comparando con la fecha de hoy en Madrid obtenida con `Intl.DateTimeFormat` y `timeZone: 'Europe/Madrid'`. Funciona igual en verano y en invierno, sin librerías. En Supabase, lo mismo con `now() at time zone 'Europe/Madrid'`.

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
