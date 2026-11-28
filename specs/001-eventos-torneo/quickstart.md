# Quickstart · Cómo comprobar C-04

Guía para comprobar que la feature funciona. No contiene la implementación.

## Requisitos

- Node ≥ 22.23 y `npm install` hecho.
- Para la fase con datos: la consulta `plazas_por_categoria` hecha y, para probar en local, solo las variables **públicas** de Supabase (URL y clave `anon`) en `.env` (nunca en el repo). La clave de servicio no sale nunca de Netlify.
- **Spec Kit en otro ordenador**: `.specify/feature.json` no se sube (es estado local), y la rama no sigue el formato `NNN-nombre`. Para que los comandos de Spec Kit encuentren esta spec, haz una de estas dos cosas:
  - crear `.specify/feature.json` con `{"feature_directory": "specs/001-eventos-torneo"}`;
  - o lanzar los comandos con la variable `SPECIFY_FEATURE_DIRECTORY=specs/001-eventos-torneo` (en Git Bash de Windows: `export SPECIFY_FEATURE_DIRECTORY=specs/001-eventos-torneo`). La variable manda sobre el archivo, y los comandos que escriben la guardan también en `.specify/feature.json`.

## 1. Lógica (sin navegador)

```sh
npm test          # node --test sobre src/lib/eventos/*.test.ts
```

Tiene que pasar:
- `calcularEstado`:
  - un minuto antes de la apertura → `proximament`; justo en la apertura → `obertes`;
  - a las 23:59:59 del 20/12 → `obertes`; un segundo después → `tancades`;
  - `cerradaAMano` → `tancades`;
  - las dos categorías llenas → `completes`; una sola llena → `obertes`;
  - sin recuento nunca da `completes`.
- Plazas: con el máximo del YAML, `plazasCategoria` da libres y completa (también con más equipos que el máximo, sin negativos).
- Datos de prueba: dan 5 de 8 equipos en Infantil/Cadet y 2 de 6 en Juvenil/Sènior.

## 2. Entrega 1: página informativa, sin Supabase (US1)

```sh
npm run build && npm run preview   # PUBLIC_FUENTE_PLAZAS sin definir = ninguna
```

En `http://localhost:4321/esdeveniments/torneig-nadal-2026/`, a 375 px y en escritorio:
1. La primera pantalla coincide con [diseno.md](diseno.md) §2: fechas, deportes, precio "pendent", lugar, estado e Inscriure's, sin scroll en 390 × 844.
2. Cada dato coincide con `docs/info-montca.md` (SC-004).
3. Con `url` vacía, en lugar de "Inscriure's" sale el contacto ("Escriu-nos per a apuntar-te"); con una `url`, el botón la abre.
4. "Com arribar" abre Google Maps en una pestaña nueva.
5. No hay contadores de plazas (fuente `ninguna`).
6. Las preguntas frecuentes se abren con teclado; todo se recorre con Tab y el foco se ve.
7. CAST en la cabecera → `/es/esdeveniments/torneig-nadal-2026/` con todo el texto en castellano.
8. "← Tornar" lleva a `/esdeveniments/`, que lista el torneo.
9. "Esdeveniments" aparece en el menú móvil, en el pie y, en escritorio, en el lugar de "Montca Sports".
10. La consola no muestra ningún error.
11. Estados: cambiar en el YAML (solo en local) `apertura` a una fecha futura → "pròximament" sin botón; `cerradaAMano: true` → "tancades" sin botón. Volver a dejarlo como estaba.
12. JSON-LD: copiar el HTML de la página construida en la prueba de resultados enriquecidos de Google (SC-005).

## 3. Contador de plazas con datos de prueba (US2)

```sh
PUBLIC_FUENTE_PLAZAS=prueba npm run dev
```

1. Infantil/Cadet: "5 de 8 equips"; Juvenil/Sènior: "2 de 6 equips". Arriba, el estado de las inscripciones y la fecha de cierre.
2. Ver una categoría llena (cambiar `maxEquipos` a 1 en local) → "Completa", sin lista de espera. Las dos llenas → estado "completes" ("Places completes") y sin botón.
3. **Privacidad (SC-003)**: en el HTML servido (Ver código fuente) y en la pestaña Red, no hay ningún nombre de equipo ni de jugador: solo números por categoría.
4. Ver el error: `PUBLIC_FUENTE_PLAZAS=supabase` con una URL falsa → "No s'han pogut carregar les places" y el resto de la página intacto.
5. Estado del contador por texto: con el CSS desactivado, "N de M equips" o "Completa" se lee igual.
6. Build de producción con datos de prueba: `CONTEXT=production PUBLIC_FUENTE_PLAZAS=prueba npm run build` **tiene que fallar**.
7. Con `PUBLIC_FUENTE_EQUIPOS` definida (la variable antigua) no pasa nada: ya no se lee.

## 4. Franja de la portada (US3)

1. `npm run dev`, `/` a 375 × 667 → la franja se ve entera bajo la cabecera, sin scroll, y lleva a la página del torneo.
2. Con `cerradaAMano: true` (en local) → la franja no sale.

## 5. Siguiente evento sin reprogramar (US4, SC-006)

1. Copiar en local un segundo YAML de prueba con otras categorías y otras fechas (no se sube).
2. `npm run build` → aparece en `/esdeveniments/` con su página, su estado y sus plazas, con `git diff -- src/lib src/components src/pages` vacío.
3. Borrar el YAML de prueba.

## 6. Con la consulta pública (Saúl)

1. Comprobaciones de [contracts/vista-publica.md](contracts/vista-publica.md) (permisos y casos).
2. Crear un equipo en Supabase → el contador de su categoría sube al recargar la página, sin volver a publicar la web.
3. Netlify: `PUBLIC_FUENTE_PLAZAS=supabase` con la URL y la clave pública; borrar `PUBLIC_FUENTE_EQUIPOS` si existe.
