# Data model · Eventos y torneo de Navidad (C-04)

Hay tres sitios con datos, cada uno con su dueño (actualizado el 28/11/2026: ya no hay lista pública de equipos):

| Dónde | Qué | Quién | Cuándo |
|---|---|---|---|
| Colección de contenido `eventos` (YAML en el repo) | Todo lo público del evento | Saúl (contenido); el esquema lo revisa Pablo | Ya, sin A-14 |
| Supabase (tablas de inscripciones) | Inscripciones reales, con datos personales. Las define la spec de inscripciones, no esta | Saúl | Cuando esté A-14 |
| Consulta pública `plazas_por_categoria` (Supabase) y tipo `PlazasCategoria` (TS) | Lo único que llega al navegador: equipos por categoría | Saúl (SQL), Pablo (tipo TS y UI) | La consulta con A-14; el tipo ya |

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
| `inscripcion.url` | URL \| vacío | no | Página de inscripción de la web (C-05). Vacía: se muestra el contacto (FR-019) |
| `categorias` | lista de Categoría | sí, ≥ 1 | Ver abajo |
| `normas` | lista de Texto | no | Si falta, el apartado no sale (constitución III) |
| `preguntas` | lista de `{ pregunta: Texto, respuesta: Texto }` | no | Las seis de `docs/info-montca.md` |
| `imagenCompartir` | ruta | no | Por defecto, la de la web |

### Categoría

| Campo | Tipo | Regla |
|---|---|---|
| `id` | texto | `infantil-cadet`, `juvenil-senior`. Une el contenido con `plazas_por_categoria.categoria` |
| `nombre` | Texto | "Infantil/Cadet" |
| `nacidos` | Texto | "2011, 2012, 2013 i 2014" / "2010 o abans" |
| `maxEquipos` | entero > 0 | 8 / 6 |
| `minJugadores`, `maxJugadores` | enteros > 0, mín ≤ máx | 5–10 / 5–12 |

## 2. Estado de las inscripciones (calculado, nunca guardado)

Función pura `calcularEstado(evento, ahora, equiposPorCategoria?)` en `src/lib/eventos/estado.ts`:

```
cerradaAMano                                  → tancades
ahora < apertura                              → proximament
ahora > cierre                                → tancades
hay recuento y todas las categorías llenas    → completes
en otro caso                                  → obertes
```

- Sin recuento (fuente `ninguna`): solo cuentan las fechas y el cierre a mano. Nunca da `completes`.
- Por categoría: `plazasLibres = maxEquipos − equiposActuales` (nunca negativo); `completa = plazasLibres === 0`. Cuentan todos los equipos que ocupan plaza (RN-19).
- Evento pasado (para la lista de Eventos): `ahora` posterior al final del día de la última jornada.

## 3. Supabase (Saúl, con la spec de inscripciones)

Las tablas de equipos, jugadores, autorizaciones y demás datos de inscripción **no son de esta spec**: las define la spec de inscripciones (C-05) con las [historias de usuario](../../docs/historias-usuario-inscripciones.md). Aquí solo se pide la consulta pública `plazas_por_categoria` (vista o RPC), cuyo contrato está en [contracts/vista-publica.md](contracts/vista-publica.md): una fila por categoría con `{ evento, categoria, equipos_actuales }` y nada más. `anon` solo tiene `select` sobre ella; las tablas tienen RLS y ninguna política para `anon`.

## 4. Tipos del navegador (Pablo, ya)

```ts
type PlazasCategoria = { categoria: string; equiposActuales: number };
type ResultadoPlazas =
  | { tipo: 'sin-fuente' }
  | { tipo: 'ok'; plazas: PlazasCategoria[] }
  | { tipo: 'error' };
```

El máximo de cada categoría sale del YAML (`maxEquipos`), no de la consulta.

## 5. Datos de prueba (Pablo, ya)

`src/lib/eventos/datos-prueba.ts`: recuentos inventados por categoría. Nunca se publican en producción: solo los usa la fuente `prueba` (local y vistas previas).

| Categoría | `equiposActuales` | Máximo (del YAML) | Para probar |
|---|---|---|---|
| Infantil/Cadet | 5 | 8 | "5 de 8 equips" |
| Juvenil/Sènior | 2 | 6 | "2 de 6 equips" |

La categoría llena ("Completa") se prueba con los tests de `estado.test.ts`, o en local bajando `maxEquipos` a 1 en el YAML.