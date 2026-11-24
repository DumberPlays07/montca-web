# Quickstart · Cómo comprobar C-04

Guía para comprobar que la feature funciona. No contiene la implementación.

## Requisitos

- Node ≥ 22.23 y `npm install` hecho.
- Para la fase con datos: A-14 hecha y, para probar en local, solo las variables **públicas** de Supabase (URL y clave `anon`) en `.env` (nunca en el repo). La clave de servicio no sale nunca de Netlify.
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
- `listaRetirada`: con la hora de Madrid, el 09/01/2027 a las 23:59 → `false`; el 10/01/2027 a las 00:00 → `true`; un evento de verano (+02:00) con la última jornada el 05/07 → `true` desde el 12/07 a las 00:00.
- Vista pública: los once casos de [contracts/vista-publica.md](contracts/vista-publica.md).
- Datos de prueba: con las filas de [data-model.md](data-model.md) §5 solo salen los dos equipos confirmados, y las plazas libres son 7/8 y 5/6.

## 2. Entrega 1: página informativa, sin Supabase (US1)

```sh
npm run build && npm run preview   # PUBLIC_FUENTE_EQUIPOS sin definir = ninguna
```

En `http://localhost:4321/esdeveniments/torneig-nadal-2026/`, a 375 px y en escritorio:
1. La primera pantalla coincide con [diseno.md](diseno.md) §2: fechas, deportes, precio "pendent", lugar, estado e Inscriure's, sin scroll en 390 × 844.
2. Cada dato coincide con `docs/info-montca.md` (SC-004).
3. "Inscriure's" abre el Google Forms; con `url` vacía, en su lugar sale el contacto.
4. "Com arribar" abre Google Maps en una pestaña nueva.
5. No hay plazas ni "Equips inscrits" (fuente `ninguna`).
6. Las preguntas frecuentes se abren con teclado; todo se recorre con Tab y el foco se ve.
7. CAST en la cabecera → `/es/esdeveniments/torneig-nadal-2026/` con todo el texto en castellano.
8. "← Tornar" lleva a `/esdeveniments/`, que lista el torneo.
9. "Esdeveniments" aparece en el menú móvil, en el pie y, en escritorio, en el lugar de "Montca Sports".
10. La consola no muestra ningún error.
11. Estados: cambiar en el YAML (solo en local) `apertura` a una fecha futura → "pròximament" sin botón; `cerradaAMano: true` → "tancades" sin botón. Volver a dejarlo como estaba.
12. JSON-LD: copiar el HTML de la página construida en la prueba de resultados enriquecidos de Google (SC-005).

## 3. UI con datos de prueba (US2)

```sh
PUBLIC_FUENTE_EQUIPOS=prueba npm run dev
```

1. Infantil/Cadet: "7 de 8 places lliures"; solo "Prova · Els Falcons". "Maria José" sale como "Maria", el menor sin autorización no sale y el capitán lleva "capità".
2. Juvenil/Sènior: "5 de 6"; adultos como "Marc García" y "Ana de la Fuente", el menor de 2010 solo con el nombre, el nombre largo no rompe los 375 px.
3. Los equipos pendientes no salen.
4. **Privacidad (SC-003)**: en el HTML servido (Ver código fuente) y en la pestaña Red, buscar los apellidos de las filas de prueba y "Les Cabretes" → 0 resultados.
5. Ver una categoría llena (cambiar `maxEquipos` a 1 en local) → "Completa" y el texto de la lista de espera, con el botón visible. Las dos llenas → estado "completes".
6. Ver el error: `PUBLIC_FUENTE_EQUIPOS=supabase` con una URL falsa → aviso de una línea y el resto de la página intacto.
7. Lista retirada: con la última jornada del YAML puesta (en local) en una fecha de hace 7 días, no salen ni la lista ni las plazas, y la pestaña Red no muestra ninguna petición de equipos.
8. Build de producción con datos de prueba: `CONTEXT=production PUBLIC_FUENTE_EQUIPOS=prueba npm run build` **tiene que fallar**.

## 4. Franja de la portada (US3)

1. `npm run dev`, `/` a 375 × 667 → la franja se ve entera bajo la cabecera, sin scroll, y lleva a la página del torneo (dos toques hasta el Forms).
2. Con `cerradaAMano: true` (en local) → la franja no sale.

## 5. Siguiente evento sin reprogramar (US4, SC-006)

1. Copiar en local un segundo YAML de prueba con otras categorías y otras fechas (no se sube).
2. `npm run build` → aparece en `/esdeveniments/` con su página, su estado y sus plazas, con `git diff -- src/lib src/components src/pages` vacío.
3. Borrar el YAML de prueba.

## 6. Con A-14 (Saúl)

1. Comprobaciones de [contracts/vista-publica.md](contracts/vista-publica.md) (permisos y once casos).
2. Importación (la opción que se decida en A-30): primero en modo simular → informe sin errores; después, en serio; después, otra vez → 0 filas nuevas. Comprobar que ningún dato de la hoja ha pasado por un ordenador personal y que la clave de servicio no está fuera de Netlify.
3. Confirmar un equipo en Supabase → aparece en la página en menos de 1 hora (en la práctica, al recargar).
4. Antes de pasar `PUBLIC_FUENTE_EQUIPOS=supabase` a producción: A-30 (issue #70) hecha y la lista igual a `docs/legal/tratamientos.md` T7 (FR-039).
5. `eventos.ultima_jornada` en Supabase = última jornada del YAML (FR-040).
