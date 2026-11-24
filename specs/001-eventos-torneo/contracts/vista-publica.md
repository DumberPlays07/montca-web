# Contrato · Vista pública `equipos_publicos` (Saúl, A-14)

Es lo único de Supabase que puede leer el navegador. La misma regla está en TypeScript (`src/lib/eventos/vista-publica.ts`) para convertir los datos de prueba, y las dos tienen que dar el mismo resultado con los casos de abajo.

## Forma de cada fila

```json
{
  "evento": "torneig-nadal-2026",
  "categoria": "infantil-cadet",
  "nombre": "Els Falcons",
  "jugadores": [
    { "nombre_publico": "Laia", "dorsal": 7, "es_capitan": true },
    { "nombre_publico": "Maria", "dorsal": null, "es_capitan": false }
  ]
}
```

`fuenteSupabase` lo convierte a `EquipoPublico` (`nombrePublico`, `esCapitan`).

## Reglas

1. Solo equipos con `estado = 'confirmado'`.
2. **Menor**: `fecha_nacimiento` nula, o menos de 18 años cumplidos en `fecha_inscripcion`.
3. Nombre público:
   - **menor** → primera palabra de `nombre`, después de quitar los espacios de los extremos;
   - **adulto** → primera palabra de `nombre` + espacio + primera letra de `apellidos` en mayúscula + ".". Sin apellidos, solo el nombre.
4. Un menor con `autorizacion_registrada = false` no sale.
5. Un equipo confirmado que se queda sin jugadores visibles sale igualmente, con la lista vacía: ocupa plaza.
6. Permisos: `anon` tiene `select` sobre la vista y nada sobre `equipos` ni `jugadores`.

## Casos que tienen que dar lo mismo en SQL y en TS

| `nombre` | `apellidos` | Nacimiento | Inscripción | Autorizado | → `nombre_publico` |
|---|---|---|---|---|---|
| `Laia` | `Ferrer Soler` | 2012-03-01 | 2026-11-26 | sí | `Laia` |
| ` Maria José ` | `Pérez` | 2013-05-10 | 2026-11-26 | sí | `Maria` |
| `Marc` | `García Ruiz` | 2000-01-15 | 2026-11-26 | — | `Marc G.` |
| `Àlex` | `Íñiguez` | 1999-07-07 | 2026-11-26 | — | `Àlex Í.` |
| `Pau` | `Mira` | 2008-11-27 | 2026-11-26 | sí | `Pau` (le falta un día para los 18) |
| `Pau` | `Mira` | 2008-11-26 | 2026-11-26 | — | `Pau M.` (cumple 18 ese día) |
| `Joan` | `Vidal` | nula | 2026-11-26 | sí | `Joan` (sin fecha ⇒ menor) |
| `Nil` | `Sanz` | 2012-02-02 | 2026-11-26 | **no** | no sale |
| `Sara` | vacío | 1995-04-04 | 2026-11-26 | — | `Sara` |

## Comprobación (Saúl, con A-14)

- Con la clave `anon`: `select * from equipos` y `select * from jugadores` fallan o no devuelven filas.
- Con la clave `anon`: `select * from equipos_publicos` devuelve solo confirmados y solo las columnas de arriba.
- Se cargan los casos de la tabla y se compara la salida con la columna `nombre_publico`.
