# Constitución de la web de Montca Actiu

## Principios fundamentales

### I. Móvil primero
La web se diseña primero para el móvil y para quien llega desde un reel de Instagram o TikTok;
el escritorio se adapta después. Todo recorrido típico hasta llegar al formulario de inscripción
o de solicitud MUST completarse en tres toques como máximo. Toda pantalla nueva MUST comprobarse en un
ancho de unos 375 px antes de darse por terminada.

### II. Valenciano por defecto y castellano
El idioma por defecto es el valenciano y el castellano es la segunda opción, con selector
VAL / CAST. Todo texto visible MUST salir de los diccionarios de idioma o del contenido por
idioma (fichas, textos legales) y MUST NOT escribirse directamente en componentes o páginas. Cada texto nuevo MUST existir en los dos idiomas.

### III. No se inventan datos
Los precios, las fechas, las plazas, los testimonios y los datos de seguridad MUST provenir de
Montca. Mientras Montca no los entregue, se usan textos de prueba marcados de forma visible como
tales. La web no afirma títulos ni certificados de monitores mientras Montca no los tenga
(ver `PRODUCT.md`).

### IV. Privacidad y menores
Un formulario MUST NOT publicarse sin sus textos legales. Un menor MUST NOT quedar inscrito
hasta que su tutor autorice su participación. Los derechos de imagen, de menores y de adultos,
son opcionales y MUST NOT condicionar la inscripción: quien no los da no sale en fotos ni vídeos.
Los datos personales recogidos MUST limitarse a lo imprescindible para la inscripción o el
presupuesto y MUST figurar en `docs/legal/tratamientos.md`. Se prefieren servidores de la Unión
Europea; un servicio que guarde o procese datos personales fuera de ella MUST cubrir esa
transferencia con una garantía válida (por ejemplo, el Marco de Privacidad de Datos UE-EE. UU.
o cláusulas contractuales tipo) y MUST aparecer en la política de privacidad.

### V. Accesibilidad
- Los botones y las zonas pulsables miden al menos 44 px de alto.
- Toda imagen lleva texto alternativo en valenciano y en castellano; no se publica ninguna sin él
  (`docs/decisiones.md`).
- El mapa tiene siempre una alternativa en lista (Mapa / Llista), que en móvil es la vista
  por defecto.
- WCAG 2.2 AA es la referencia, pendiente de confirmar como estándar formal (`PRODUCT.md`).

### VI. Sencillez
La base es Astro y Netlify. El contenido editorial que cambia poco (actividades, textos,
páginas) vive en archivos que la gente de Montca pueda mantener; el formato concreto está por
confirmar en `docs/decisiones.md`. Los datos que cambian con el uso (inscripciones, plazas,
solicitudes) usan solo los servicios acordados en la sección "Arquitectura y tecnología" de
`docs/decisiones.md` o en la spec de la feature.
Toda librería nueva MUST justificarse por escrito en el issue o en el PR y MUST aceptarla la otra
persona del equipo antes de añadirse.
El coste es 0 € salvo el dominio: si algo cuesta dinero, se plantea y se decide con Montca antes
de pagar. Las cuentas del proyecto (dominio, Google, Supabase, Netlify) MUST estar a nombre de
Montca, con nosotros como colaboradores.

### VII. Flujo de trabajo
Todo cambio parte de un issue, se hace en una rama propia (`tipo/descripcion-corta`) y entra en
`main` mediante un PR revisado por la otra persona del equipo. `main` MUST compilar y funcionar
en todo momento.

## Contenido y datos

- Las categorías de actividades usan los identificadores en valenciano ya definidos: `activitats`,
  `rutes`, `sports`, `repte`, `camp`, `aventura`.
- Las marcas propias se escriben tal cual: Montca Actiu, Montca Sports, Repte 5 Cims y Montca Camp.
- El tono es cercano pero serio: tutea y es amable, y transmite seguridad.
- Las decisiones técnicas o de producto que cambien lo anterior se anotan en `docs/decisiones.md`.

## Gobierno

Esta constitución prevalece sobre cualquier otra práctica del proyecto. Toda excepción se
justifica por escrito en el PR, la aprueba la otra persona del equipo y se anota en
`docs/decisiones.md`. Se modifica mediante un PR que explique el motivo y que revise la otra
persona del equipo; el cambio se anota en `docs/decisiones.md`. El versionado sigue semver:
MAJOR si se elimina o redefine un principio, MINOR si se añade un principio o sección o se
amplía su alcance, PATCH para aclaraciones de redacción. Toda revisión de PR MUST comprobar que
se cumplen estos principios.

**Versión**: 2.0.0 | **Ratificada**: 2026-11-17 | **Última modificación**: 2026-11-19
