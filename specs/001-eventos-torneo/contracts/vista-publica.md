# Contrato · Consulta pública `plazas_por_categoria` (Supabase)

La única puerta pública a los datos de inscripciones: devuelve solo cuántos equipos ocupan plaza en cada categoría (HU-19). La crea Saúl en la spec de inscripciones, cuando exista A-14 y las tablas de equipos. **El nombre previsto es `plazas_por_categoria`** (vista, que es lo que lee `fuente-supabase.ts`; si Saúl prefiere una RPC, cambia solo ese archivo).

> Sustituye (28/11/2026) a la vista `equipos_publicos`, que servía la lista pública de equipos y jugadores.

## Forma

Una fila por categoría del evento:

| Columna | Tipo | Regla |
|---|---|---|
| `evento` | text | `id` del YAML del evento (`torneig-nadal-2026`) |
| `categoria` | text | `categorias[].id` del YAML |
| `equipos_actuales` | entero ≥ 0 | Número de equipos que ocupan plaza (estado `creado`, `inscrito` o `completo`, RN-19) |

Se consulta con `?evento=eq.<id>`.

## Reglas

1. **No devuelve nada más**: ni nombres de equipo, ni jugadores, ni fechas, ni contacto, ni estados. Los máximos de equipos no van aquí: salen del YAML.
2. `anon` solo tiene permiso de lectura sobre esta vista o función. Las tablas de inscripciones tienen RLS activada y ninguna política para `anon`.
3. Una categoría sin equipos devuelve `equipos_actuales = 0`, no falta.
4. El recuento se hace en la base de datos: la web no recibe filas de equipos para contarlas.

## Casos que tiene que pasar (Saúl, con la spec de inscripciones)

| # | Datos | Resultado |
|---|---|---|
| 1 | Ningún equipo | Todas las categorías con `equipos_actuales = 0` |
| 2 | Un equipo `creado` en una categoría | Esa categoría vale 1 (cuenta desde que se crea) |
| 3 | Equipos `creado`, `inscrito` y `completo` en la misma categoría | Los tres cuentan |
| 4 | Un equipo borrado | Deja de contar |
| 5 | Equipos de otro evento | No cuentan |
| 6 | Petición con la clave `anon` a las tablas de equipos o jugadores | 0 filas o error de permisos |
| 7 | Respuesta de la consulta | Solo las columnas de la tabla de arriba |
