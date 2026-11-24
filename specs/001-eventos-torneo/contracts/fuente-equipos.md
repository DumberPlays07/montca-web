# Contrato · `FuenteEquipos` (frontera entre la UI y los datos)

La UI de Pablo solo conoce esta interfaz y la capa de datos de Saúl la implementa. Si las dos partes respetan este contrato, pueden trabajar a la vez.

## Interfaz

```ts
// src/lib/eventos/fuente-equipos.ts
interface FuenteEquipos {
  /** Equipos confirmados del evento, ya en forma pública. Nunca lanza: los fallos vuelven como { tipo: 'error' }. */
  obtenerEquipos(evento: string): Promise<ResultadoEquipos>;
}
```

`ResultadoEquipos` y `EquipoPublico` están en [../data-model.md](../data-model.md), sección 4.

## Garantías que da toda implementación

1. Solo devuelve equipos **confirmados** del evento pedido.
2. Cada `nombrePublico` ya viene calculado: primer nombre si es menor; nombre y primer apellido si es adulto. La UI **no** recorta nombres.
3. No devuelve menores sin autorización registrada.
4. No devuelve ningún otro campo: ni apellidos, ni fechas, ni origen, ni estado, ni contacto.
5. `categoria` es uno de los `categorias[].id` del YAML del evento. Si llega uno desconocido, la UI lo ignora y deja un aviso en la consola de desarrollo.
6. El orden de los equipos es alfabético por `nombre`; el de los jugadores, capitán primero y después alfabético.
7. Si tarda más de 8 s o falla la red, devuelve `{ tipo: 'error' }`.

## Implementaciones y cómo se elige

Variable de entorno `PUBLIC_FUENTE_EQUIPOS`:

| Valor | Implementación | Dónde | Dueño |
|---|---|---|---|
| `ninguna` (por defecto) | `fuenteNinguna` → `{ tipo: 'sin-fuente' }` | Producción antes de A-14 | Pablo |
| `prueba` | `fuenteIncrustada`: lee el JSON público que la página dejó al construirse a partir de `datos-prueba.ts` | Local y vistas previas | Pablo |
| `supabase` | `fuenteSupabase`: `GET {PUBLIC_SUPABASE_URL}/rest/v1/equipos_publicos?evento=eq.<id>` con las cabeceras `apikey` y `Authorization: Bearer <PUBLIC_SUPABASE_ANON_KEY>` | Producción con A-14 | Saúl |

Reglas:
- El build **falla** si `PUBLIC_FUENTE_EQUIPOS=prueba` y la variable `CONTEXT` de Netlify vale `production`.
- El build **falla** si `PUBLIC_FUENTE_EQUIPOS=supabase` y falta la URL o la clave pública.
- Las variables se configuran en la interfaz de Netlify, nunca en el repositorio (decisión del 18/11). La clave `anon` es pública por diseño de Supabase, pero sigue la misma regla.

## Qué cambia cuando esté A-14

| Pieza | Antes | Después | Quién |
|---|---|---|---|
| Tablas, RLS y vista | — | Creadas según [vista-publica.md](vista-publica.md) | Saúl |
| `fuenteSupabase` | Implementación que devuelve `{ tipo: 'sin-fuente' }` | `fetch` real | Saúl |
| Importación del Forms | — | Primera ejecución ([importacion-forms.md](importacion-forms.md)) | Saúl |
| Variables de Netlify | `PUBLIC_FUENTE_EQUIPOS=ninguna` | `supabase` + URL + clave pública | Saúl |
| UI | Ya hecha con datos de prueba | **Nada** | — |
| Textos legales | — | La publicación de nombres en la privacidad (A-17) y en el registro (A-19), **antes** de pasar a `supabase` en producción (FR-039) | Saúl |
