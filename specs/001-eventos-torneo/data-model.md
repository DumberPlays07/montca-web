# Data model · Eventos y torneo de Navidad (C-04)

Hay tres sitios con datos, cada uno con su dueño:

| Dónde | Qué | Quién | Cuándo |
|---|---|---|---|
| Colección de contenido `eventos` (YAML en el repo) | Todo lo público del evento | Saúl (contenido); el esquema lo revisa Pablo | Ya, sin A-14 |
| Supabase (tablas `equipos` y `jugadores`) | Inscripciones reales, con datos personales | Saúl | Cuando esté A-14 |
| Vista `equipos_publicos` (Supabase) y tipo `EquipoPublico` (TS) | Lo único que llega al navegador | Saúl (SQL), Pablo (tipo TS y UI) | La vista con A-14; el tipo ya |

## 1. Evento (contenido, `src/content/eventos/<id>.yaml`)

El `id` es el nombre del archivo (`torneig-nadal-2026`) y forma la ruta. Todo texto visible es un objeto `{ ca, es }` (tipo `Texto`); si falta un idioma, el build falla.

| Campo | Tipo | Obligatorio | Regla |
|---|---|---|---|
| `nombre` | Texto | sí | "Torneig de Nadal" / "Torneo de Navidad" |
| `marca` | texto | sí | Marca propia tal cual: `Montca Sports` |
| `resumen` | Texto | sí | Una frase para la tarjeta, la `description` y el JSON-LD |
| `jornadas` | lista de `{ fecha, nombre: Texto }` | sí, ≥ 1 | `fecha` en `AAAA-MM-DD`; ordenadas. La primera es el inicio y la última, el fin |
| `lugar` | `{ nombre, direccion, localidad }` | sí | Se usan para "Com arribar" y el JSON-LD |
| `deportes` | Texto | sí | Incluye "cada equipo juega las tres modalidades" |
| `precio` | `{ texto: Texto, confirmado: boolean, importe?: number }` | sí | Con `confirmado: false`, la página muestra el texto con la nota de pendiente y el JSON-LD no lleva `offers`. `importe` solo con `confirmado: true` |
| `inscripcion.apertura` | fecha y hora ISO con diferencia horaria | sí | `2026-11-25T00:00:00+01:00` |
| `inscripcion.cierre` | fecha y hora ISO con diferencia horaria | sí | `2026-12-20T23:59:59+01:00`; posterior a la apertura |
| `inscripcion.cerradaAMano` | boolean | sí (por defecto `false`) | FR-013 |
| `inscripcion.modo` | `canal-montca` \| `web` | sí | FR-017 |
| `inscripcion.url` | URL \| vacío | no | Dirección del Google Forms o de la página de C-05. Vacía: se muestra el contacto (FR-019) |
| `inscripcion.nota` | Texto | sí si `modo = canal-montca` | Formulario de Montca + autorización en papel o por Softco (FR-018) |
| `categorias` | lista de Categoría | sí, ≥ 1 | Ver abajo |
| `normas` | lista de Texto | no | Si falta, el apartado no sale (constitución III) |
| `preguntas` | lista de `{ pregunta: Texto, respuesta: Texto }` | no | Las seis de `docs/info-montca.md` |
| `imagenCompartir` | ruta | no | Por defecto, la de la web |

### Categoría

| Campo | Tipo | Regla |
|---|---|---|
| `id` | texto | `infantil-cadet`, `juvenil-senior`. Une el contenido con `equipos.categoria` |
| `nombre` | Texto | "Infantil/Cadet" |
| `nacidos` | Texto | "2011, 2012, 2013 i 2014" / "2010 o abans" |
| `maxEquipos` | entero > 0 | 8 / 6 |
| `minJugadores`, `maxJugadores` | enteros > 0, mín ≤ máx | 5–10 / 5–12 |

## 2. Estado de las inscripciones (calculado, nunca guardado)

Función pura `calcularEstado(evento, ahora, confirmadosPorCategoria?)` en `src/lib/eventos/estado.ts`:

```
cerradaAMano                                  → tancades
ahora < apertura                              → proximament
ahora > cierre                                → tancades
hay recuento y todas las categorías llenas    → completes
en otro caso                                  → obertes
```

- Sin recuento (fuente `ninguna`): solo cuentan las fechas y el cierre a mano. Nunca da `completes`.
- Por categoría: `placesLliures = maxEquipos − confirmados` (nunca negativo); `completa = placesLliures === 0`.
- Evento pasado (para la lista de Eventos): `ahora` posterior al final del día de la última jornada.

## 3. Supabase (Saúl, con A-14)

Los nombres son orientativos y los fija Saúl. Lo que no se puede cambiar es lo que pide la spec: origen, forma de entrega de la autorización y estado.

### `equipos`

| Columna | Tipo | Regla |
|---|---|---|
| `id` | uuid | clave |
| `evento` | text | = `id` del YAML (`torneig-nadal-2026`) |
| `categoria` | text | = `categorias[].id` del YAML |
| `nombre` | text | Tal como se muestra |
| `nombre_normalizado` | text | Minúsculas, sin tildes y con los espacios unificados. Único por `(evento, categoria, nombre_normalizado)` |
| `estado` | enum `pendiente` \| `confirmado` \| `espera` | Por defecto `pendiente`. Solo Montca lo cambia (C-06) |
| `origen` | enum `forms` \| `web` | FR-031 |
| `creado_en` | timestamptz | |

### `jugadores`

| Columna | Tipo | Regla |
|---|---|---|
| `id` | uuid | clave |
| `equipo_id` | uuid → `equipos.id` | |
| `nombre`, `apellidos` | text | |
| `fecha_nacimiento` | date, puede ser nula | Nula ⇒ se trata como menor |
| `fecha_inscripcion` | timestamptz | La "Marca temporal" del Forms o el momento del alta web. Decide si era menor (FR-023) |
| `dorsal` | entero, puede ser nulo | Opcional (clarify) |
| `es_capitan` | boolean | Como mucho uno por equipo |
| `origen` | enum `forms` \| `web` | FR-031 |
| `autorizacion_entrega` | enum `papel` \| `softco` \| `casilla_web`, puede ser nula | Solo menores (FR-032) |
| `autorizacion_registrada` | boolean | Un menor sin ella no sale en la vista (FR-024) |
| `clave_importacion` | text única, puede ser nula | Para los jugadores del Forms: una clave estable de la respuesta, para que la importación se pueda repetir (FR-033) |

Los datos propios de C-05 (DNI, contacto, tutor, casillas de imagen e información) los añade C-05. Esta spec no los define.

RLS activada en las dos tablas, sin políticas para `anon`.

### Vista `equipos_publicos` (contrato en [contracts/vista-publica.md](contracts/vista-publica.md))

Una fila por equipo **confirmado**: `evento`, `categoria`, `nombre`, `jugadores` (lista JSON de `{ nombre_publico, dorsal, es_capitan }`). `anon` solo tiene `select` sobre esta vista.

## 4. Tipos del navegador (Pablo, ya)

```ts
type JugadorPublico = { nombrePublico: string; dorsal: number | null; esCapitan: boolean };
type EquipoPublico = { categoria: string; nombre: string; jugadores: JugadorPublico[] };
type ResultadoEquipos =
  | { tipo: 'sin-fuente' }
  | { tipo: 'ok'; equipos: EquipoPublico[] }
  | { tipo: 'error' };
```

## 5. Datos de prueba (Pablo, ya)

`src/lib/eventos/datos-prueba.ts`: filas inventadas con la misma forma que las tablas. Nunca llegan al navegador en crudo; al construir se convierten en `EquipoPublico[]` con la misma regla que la vista.

| Categoría | Equipo | Estado | Origen | Para probar |
|---|---|---|---|---|
| Infantil/Cadet | "Prova · Els Falcons" | confirmado | forms | menores con nombre compuesto ("Maria José" → "Maria"), dorsal en unos sí y en otros no, capitán, un menor **sin** autorización (no sale) |
| Infantil/Cadet | "Prova · Les Cabretes" | pendiente | web | no sale y no cuenta para las plazas |
| Juvenil/Sènior | "Prova · Mariola Bàsquet Club Amb Un Nom Molt Llarg" | confirmado | web | adultos ("Marc García"; uno con apellido "de la Fuente"), un menor nacido en 2010 (solo el nombre), sin fecha de nacimiento (se trata como menor), nombre largo |
| Juvenil/Sènior | "Prova · Cocentaina Pàdel" | pendiente | forms | no sale |

Todos los nombres de equipo empiezan por "Prova ·", así que se ven como prueba en la página (constitución III).
