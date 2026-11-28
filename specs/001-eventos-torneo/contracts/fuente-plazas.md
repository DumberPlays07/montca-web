# Contrato · `FuentePlazas` (frontera entre la UI y los datos)

La UI de Pablo solo conoce esta interfaz y la capa de datos de Saúl la implementa. Si las dos partes respetan este contrato, pueden trabajar a la vez.

> Sustituye (28/11/2026) al contrato `FuenteEquipos`, que servía una lista pública de equipos y jugadores. Ahora solo se publican recuentos por categoría (HU-19 de [las historias de usuario](../../../docs/historias-usuario-inscripciones.md)).

## Interfaz

```ts
// src/lib/eventos/fuente-plazas.ts
type PlazasCategoria = { categoria: string; equiposActuales: number };

type ResultadoPlazas =
  | { tipo: 'sin-fuente' }
  | { tipo: 'ok'; plazas: PlazasCategoria[] }
  | { tipo: 'error' };

interface FuentePlazas {
  /** Equipos que ocupan plaza por categoría. Nunca lanza: los fallos vuelven como { tipo: 'error' }. */
  obtenerPlazas(evento: string): Promise<ResultadoPlazas>;
}
```

El máximo de equipos de cada categoría **no** viene de la fuente: sale de los datos del evento (`categorias[].maxEquipos` del YAML). La UI une los dos.

## Garantías que da toda implementación

1. Devuelve solo `{ categoria, equiposActuales }`: ningún nombre de equipo ni de jugador ni ningún otro dato.
2. `equiposActuales` cuenta todos los equipos que ocupan plaza, también los de estado `creado` (RN-19).
3. `categoria` es uno de los `categorias[].id` del YAML del evento. Si llega uno desconocido, la UI lo ignora y deja un aviso en la consola de desarrollo.
4. Devuelve una entrada por cada categoría del evento. Si falta alguna, la UI lo trata como un error y muestra el aviso en vez de un número, nunca un cero inventado.
5. Si tarda más de 8 s o falla la red, devuelve `{ tipo: 'error' }`.

## Implementaciones y cómo se elige

Variable de entorno `PUBLIC_FUENTE_PLAZAS` (antes, `PUBLIC_FUENTE_EQUIPOS`):

| Valor | Implementación | Dónde | Dueño |
|---|---|---|---|
| `ninguna` (por defecto) | `fuenteNinguna` → `{ tipo: 'sin-fuente' }` | Producción antes de la consulta pública | Pablo |
| `prueba` | `fuenteIncrustada`: lee el JSON que la página dejó al construirse a partir de `datos-prueba.ts` | Local y vistas previas | Pablo |
| `supabase` | `fuenteSupabase`: `GET {PUBLIC_SUPABASE_URL}/rest/v1/plazas_por_categoria?evento=eq.<id>&select=categoria,equipos_actuales` (la vista de [vista-publica.md](vista-publica.md); si Saúl prefiere una RPC, cambia solo `fuente-supabase.ts`) con las cabeceras `apikey` y `Authorization: Bearer <PUBLIC_SUPABASE_ANON_KEY>` | Producción con la spec de inscripciones | Saúl |

Reglas:
- El build **falla** si `PUBLIC_FUENTE_PLAZAS=prueba` y la variable `CONTEXT` de Netlify vale `production`.
- El build **falla** si `PUBLIC_FUENTE_PLAZAS=supabase` y falta la URL o la clave pública.
- Las variables se configuran en la interfaz de Netlify, nunca en el repositorio (decisión del 18/11). La clave `anon` es pública por diseño de Supabase, pero sigue la misma regla.
- **`PUBLIC_FUENTE_EQUIPOS` ya no se lee.** Si existe en Netlify, hay que borrarla.

## Qué cambia cuando exista la consulta de plazas

| Pieza | Antes | Después | Quién |
|---|---|---|---|
| Consulta pública | — | `plazas_por_categoria` creada según [vista-publica.md](vista-publica.md) | Saúl |
| `fuenteSupabase` | Devuelve `{ tipo: 'sin-fuente' }` | `fetch` real | Saúl |
| Variables de Netlify | `PUBLIC_FUENTE_PLAZAS=ninguna` (o sin definir) | `supabase` + URL + clave pública | Saúl |
| UI | Ya hecha con datos de prueba | **Nada** | — |
