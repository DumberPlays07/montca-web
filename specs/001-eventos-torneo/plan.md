# Implementation Plan: Eventos y torneo de Navidad (C-04)

**Branch**: `docs/spec-c-04-eventos-torneo` | **Date**: 2026-11-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-eventos-torneo/spec.md`, diseño en [diseno.md](diseno.md)

## Summary

Sección Eventos y página del torneo de Navidad, con estado de inscripciones, botón "Inscriure's", plazas, "Equips inscrits", franja en la portada, preguntas frecuentes, "Com arribar" y JSON-LD.

Enfoque:
- Web **estática** de Astro. Los datos del evento están en una **colección de contenido YAML** bilingüe.
- Un **script pequeño en el navegador** recalcula el estado por fechas y pide los equipos a una **vista pública de Supabase**.
- Los equipos están detrás de la interfaz `FuenteEquipos`, con tres implementaciones: `ninguna`, `prueba` y `supabase`.

El trabajo va ordenado para que **lo primero que se publique sea la página informativa con el enlace al Google Forms de Montca, sin Supabase ni i18n**. Toda la UI de equipos se hace ya con datos de prueba, y cuando esté A-14 solo cambian la capa de datos de Saúl y una variable de entorno.

## Technical Context

**Language/Version**: TypeScript (tsconfig estricto de Astro), Node ≥ 22.23 (`package.json`).

**Primary Dependencies**: Astro 7.4.11 (ya instalado). **Ninguna librería nueva** en la web. El script de importación puede necesitar un lector de CSV (R5): si se añade, se justifica en su PR.

**Storage**:
- Contenido YAML en el repo (eventos).
- Supabase Postgres en la UE (equipos y jugadores, A-14). Se lee desde el navegador solo a través de la vista `equipos_publicos`.

**Testing**: `node --test` sobre `.ts` (comprobado en Node 22.23.5, sin dependencias), con el script `npm test`. Las comprobaciones manuales están en [quickstart.md](quickstart.md).

**Target Platform**: web estática en Netlify (B-02). Navegadores móviles actuales; se diseña primero para 375 px.

**Project Type**: web (Astro, sin servidor propio).

**Performance Goals**:
- La primera pantalla del torneo se pinta sin esperar a ninguna petición de datos; los equipos llegan después.
- Una sola petición de datos por página.
- JavaScript de la página por debajo de ~5 KB comprimido.

**Constraints**:
- 0 € de coste.
- Ningún dato personal en el repo.
- Ningún dato no público en el navegador.
- Textos en VAL y CAST.
- Zonas táctiles de 44 px.
- No se tocan `src/i18n`, `netlify.toml` ni los formularios.

**Scale/Scope**: 1 evento (2 categorías, 14 equipos como máximo, unos 150 jugadores). 4 páginas nuevas (lista y evento × 2 idiomas) y la franja en la portada.

## Constitution Check

*GATE: se revisa antes de la Fase 0 y otra vez después de la Fase 1.*

| Principio | Cumple | Cómo |
|---|---|---|
| I. Móvil primero | ✅ | Diseño a 375 px ([diseno.md](diseno.md)); dos toques desde la portada hasta el Forms y uno desde la página (SC-002) |
| II. VAL y CAST | ✅ | Textos de interfaz en el diccionario provisional `textos-eventos.ts` y del evento en su YAML `{ca, es}`. El esquema hace fallar el build si falta un idioma. Mismo patrón provisional que B-09, sin tocar `src/i18n` |
| III. No se inventan datos | ✅ | Precio "pendent" y sin `offers`; normas, dirección y URL del Forms vacías hasta que las dé Montca; datos de prueba con el prefijo "Prova ·" y nunca en producción (el build falla) |
| IV. Privacidad y menores (v2.0.0) | ✅ (con A-30) | Solo se publica lo de `docs/legal/tratamientos.md` T7 (FR-039) y se retira a los 7 días (FR-040); menores sin autorización fuera; Supabase en la UE; CSV fuera del repo. El Google Forms guarda datos en Google (EE. UU., cubierto por el Marco de Privacidad UE-EE. UU.): la constitución v2.0.0 lo admite si consta en la privacidad, que es lo que hace **A-30 (#70)**; hasta entonces el botón no se publica |
| V. Accesibilidad | ✅ | `<details>` nativos; capitán con texto; foco visible; 44 px; sin movimiento |
| VI. Sencillez | ✅ | Astro y Netlify estáticos; Supabase ya acordado (decisión del 15/11); sin librerías nuevas en la web; `fetch` en lugar de `supabase-js` |
| VII. Flujo | ✅ | Issues por zona después del PR de la spec; PR revisado por el otro |

Después de la Fase 1: sin cambios. No hace falta la tabla de *Complexity Tracking*.

## Project Structure

### Documentation (this feature)

```text
specs/001-eventos-torneo/
├── spec.md · diseno.md · boceto-cartell.html
├── plan.md · research.md · data-model.md · quickstart.md
├── contracts/
│   ├── evento-contenido.md     # YAML del evento
│   ├── fuente-equipos.md       # interfaz UI ↔ datos y qué cambia con A-14
│   ├── vista-publica.md        # vista de Supabase + casos compartidos SQL/TS
│   └── importacion-forms.md    # script de importación del Forms
├── checklists/requirements.md
└── tasks.md                    # /speckit-tasks
```

### Source Code (repository root)

Dueño entre corchetes: **[P]** Pablo, **[S]** Saúl, **[P→S]** lo hace Pablo avisando a Saúl (compartido).

```text
src/
├── content.config.ts                         [S] esquema de la colección `eventos` (contrato: evento-contenido.md)
├── content/eventos/torneig-nadal-2026.yaml   [S] datos del torneo, VAL y CAST
├── lib/eventos/
│   ├── estado.ts (+ estado.test.ts)          [P] calcularEstado, plazas, evento pasado
│   ├── vista-publica.ts (+ .test.ts)         [P] regla del nombre público (la misma que la vista SQL)
│   ├── datos-prueba.ts                       [P] filas inventadas (data-model §5)
│   ├── fuente-equipos.ts                     [P] interfaz, elección por variable de entorno, fuenteNinguna, fuenteIncrustada
│   ├── fuente-supabase.ts                    [S] fetch a equipos_publicos (con A-14)
│   ├── enlaces.ts                            [P] URL de "Com arribar", destino de Inscriure's
│   └── json-ld.ts                            [P] SportsEvent
├── scripts/eventos-cliente.ts                [P] recalcula estado, pide equipos, pinta plazas y lista
├── components/
│   ├── textos-eventos.ts                     [P] diccionario provisional ca/es (hasta B-07)
│   ├── textos-navegacion.ts                  [P] + clave y ruta `eventos`
│   ├── Cabecera.astro · Pie.astro            [P] "Esdeveniments" (en escritorio, en lugar de "Montca Sports")
│   ├── Icono.astro                           [P] + iconos `lugar` y `externo`
│   ├── eventos/CartellEvento.astro           [P] primera pantalla (títol, jornades, esports, lloc)
│   ├── eventos/EstatInscripcio.astro         [P]
│   ├── eventos/BotoInscripcio.astro          [P] Inscriure's / contacto si no hay URL
│   ├── eventos/PlacesIEquips.astro           [P] bloques por categoría + lista (los rellena el script)
│   ├── eventos/QueCalSaber.astro             [P]
│   ├── eventos/PreguntesFrequents.astro      [P]
│   ├── eventos/ComArribar.astro              [P]
│   ├── eventos/TargetaEsdeveniment.astro     [P]
│   ├── eventos/FranjaEsdeveniment.astro      [P]
│   ├── eventos/PaginaEvento.astro            [P] compone la página (recibe lang)
│   └── eventos/PaginaEventos.astro           [P] compone la lista (recibe lang)
├── layouts/BaseLayout.astro                  [P] + slot "head" para el JSON-LD
└── pages/                                    [P→S] envoltorios finos
    ├── esdeveniments/index.astro · [evento].astro
    ├── es/esdeveniments/index.astro · [evento].astro
    └── index.astro                           (+ FranjaEsdeveniment)
scripts/importar-forms/importar.ts            [S] importación (contrato: importacion-forms.md)
supabase/ (o donde decida Saúl)               [S] SQL de tablas, RLS y vista (sin datos)
package.json                                  [P→S] script "test"
```

**Structure Decision**: estructura web de Astro que ya existe (`src/components`, `src/layouts`, `src/pages`, `src/content`). La lógica pura va en `src/lib/eventos/` para poder probarla con `node --test` sin Astro. Las páginas son envoltorios para que VAL y CAST compartan componente sin tocar la i18n de Saúl.

## Orden de trabajo

Cada entrega deja `main` compilando y se puede revisar por separado.

### Entrega 1 · Página informativa con el Forms (US1). **Lo primero que se publica.**

No depende de A-14 ni de B-07. Sí depende de B-02 (Netlify) para publicarse.

1. **[S]** `content.config.ts` y `torneig-nadal-2026.yaml` con los datos de `info-montca.md`. Pablo puede empezar en paralelo con el contrato [evento-contenido.md](contracts/evento-contenido.md).
2. **[P]** `estado.ts` con sus pruebas y `npm test` (avisando a Saúl por `package.json`).
3. **[P]** `textos-eventos.ts`, clave `eventos` en `textos-navegacion.ts`, "Esdeveniments" en Cabecera y Pie, iconos nuevos.
4. **[P]** Componentes de la primera pantalla y de debajo (Cartell, Estat, Botó, Què cal saber, Preguntes, Com arribar), `json-ld.ts` y el slot `head` de BaseLayout.
5. **[P→S]** Páginas `/esdeveniments/` (lista mínima) y `/esdeveniments/torneig-nadal-2026/`, en VAL y CAST.
6. **[P]** `eventos-cliente.ts`, solo la parte del estado por fechas.
7. **[P]** Comprobaciones del quickstart §1–§2.

**Montca tiene que pasar antes de publicar**: el enlace del Google Forms (si no, sale el contacto) y el visto bueno de los textos en castellano.

### Entrega 2 · Plazas y "Equips inscrits" con datos de prueba (US2)

Producción sigue con `ninguna`, así que publicarla no cambia nada visible.

1. **[P]** `vista-publica.ts` con los once casos del contrato, y `datos-prueba.ts`.
2. **[P]** `fuente-equipos.ts` (`ninguna`, `prueba`) y el fallo del build si hay datos de prueba en producción.
3. **[P]** `PlacesIEquips.astro` con todos sus estados (sin equipos, completa, error) y la parte de equipos de `eventos-cliente.ts`.
4. **[P]** Quickstart §3, con la prueba de privacidad (SC-003).

### Entrega 3 · Franja de la portada (US3)

1. **[P]** `FranjaEsdeveniment.astro` y el script de estado.
2. **[P→S]** Añadirla a `src/pages/index.astro`. La portada en castellano la crea B-07.

### Entrega 4 · Reutilización y acabado (US4)

1. **[P]** `TargetaEsdeveniment` completa, eventos pasados fuera de la lista y prueba con un segundo YAML local (SC-006).
2. **[P]** `/impeccable audit` y `/impeccable document` (actualiza `DESIGN.md`).

### En paralelo · Capa de datos (Saúl), cuando esté A-14

1. **[S]** Tablas, RLS y vista `equipos_publicos` según [vista-publica.md](contracts/vista-publica.md), con sus comprobaciones.
2. **[S]** `fuente-supabase.ts` según [fuente-equipos.md](contracts/fuente-equipos.md).
3. **[S]** `scripts/importar-forms/` según [importacion-forms.md](contracts/importacion-forms.md); primera importación con `--simular`.
4. **[S]** A-30 (#70) hecha y comprobado que la lista coincide con `docs/legal/tratamientos.md` T7 y `privacidad.md` 2.7 (FR-039).
5. **[S]** Variables de Netlify: `PUBLIC_FUENTE_EQUIPOS=supabase`, URL y clave pública. **Este es el único cambio que activa los equipos en producción.**

### Qué cambia cuando esté A-14 (resumen)

| | Antes de A-14 | Con A-14 |
|---|---|---|
| Página del torneo | Información, estado por fechas, Inscriure's | Además, plazas y "Equips inscrits" reales |
| Fuente en producción | `ninguna` | `supabase` |
| Código de UI | Hecho y probado con `prueba` | Sin cambios |
| Equipos del Forms | En la hoja de Montca | Importados con el script, como `pendiente`; Montca los confirma |
| Confirmar equipos | — | A mano en Supabase hasta C-06 |
| Estado `completes` | No puede darse (sin recuento) | Se calcula con los confirmados |

## Riesgos

1. **Google Forms y la hoja de Montca**: hasta que esté A-30 (#70), el Forms no está en el registro ni en la privacidad, y el botón no se puede publicar. Si A-30 se retrasa, la entrega 1 sale con el contacto en lugar del botón (FR-019).
2. **Confirmar equipos sin C-06**: hasta que exista, alguien tiene que cambiar `estado` a mano en Supabase. Si nadie lo hace, la lista sale vacía aunque haya inscritos.
3. **B-02 (Netlify)** sin hacer: sin él no se publica ni la entrega 1.
4. **Agrupación del Forms** provisional (A-26): si Montca usa una respuesta por equipo, se rehace la lectura del script, no la UI.
