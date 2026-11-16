# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Montca Actiu es una associació juvenil i esportiva de Cocentaina. La web tiene dos públicos con el mismo peso:

- **Gente que se apunta a título individual a fechas abiertas:** familias con hijos que buscan plan para el fin de semana (los menores los inscribe el tutor) y jóvenes y adolescentes (la franja de edad exacta está por confirmar), que suelen llegar desde un reel de Instagram o TikTok.
- **Grupos que piden una actividad a medida:** profesorado y AMPA que organizan salidas escolares y empresas. Necesitan datos claros (edades, duración, tamaño de grupo, precio orientativo) y una forma rápida de pedir presupuesto.

La mayoría llega desde el móvil, a través de redes sociales. La versión móvil es la principal.

## Product Purpose

La web enseña todas las actividades de Montca sobre la Serra de Mariola y lleva cada visita a una de dos acciones: **apuntarse** a una fecha con plazas libres o **pedir la actividad para un grupo** (WhatsApp o formulario de presupuesto). Los dos objetivos pesan lo mismo.

Funciona si un visitante encuentra lo que le interesa y llega a la reserva o al presupuesto en tres toques como máximo, sin leerse toda la web.

## Positioning

Montca es una asociación local sin ánimo de lucro, no una empresa de turismo activo. La llevan jóvenes de Cocentaina que conocen la Serra de Mariola, tiene formatos propios (Montca Sports, Repte 5 Cims, Montca Camp) y precios pensados para familias y gente joven.

## Operating Context

- Las visitas llegan sobre todo desde reels de Instagram y TikTok, en el móvil.
- Las fechas y las plazas las actualiza la gente de Montca desde un panel o archivo sencillo. Todavía no se ha decidido quién lo hará.
- Un bot de Telegram publica los reels en la web: crea archivos JSON en `src/content/reels/` y Netlify vuelve a generar la web (ver `MD's/Instruccions web i bot`; si ese archivo se mueve a `docs/`, hay que actualizar esta referencia).
- WhatsApp es el canal de contacto principal y está siempre visible.
- La web la desarrollan dos personas, cada una con su Claude, trabajando con issues, ramas y PR revisados.

## Capabilities and Constraints

- **Stack:** Astro, desplegado en Netlify con vistas previas por PR (`docs/decisiones.md`).
- **Idiomas:** valenciano por defecto y castellano como segunda opción, con selector VAL / CAST. Las categorías de actividades de los datos están en valenciano: `activitats`, `rutes`, `sports`, `repte`, `camp`, `aventura`.
- **Concepto de portada elegido:** Mapa de Mariola, junto con un buscador ("Qui sou?" + "Què vos ve de gust?"), una agenda deslizable con plazas y la cuenta atrás de Montca Sports. El detalle está en `docs/concepto-elegido-mapa-de-mariola.md`.
- **Inscripción:** el botón **Apunta't** es el mismo desde el mapa, la ficha y la agenda, y con menores rellena el formulario el tutor.
- **Montca Camp:** muestra "Properament" y un botón *Avisa'm* hasta que tenga fechas.
- **Pendiente de decidir:** si el mapa es una ilustración a medida o OpenStreetMap con estilo propio, si las inscripciones van por la web o por una plataforma externa (Spond, Playoff), si se cobra por la web y quién gestiona fechas, plazas y datos de inscritos.

## Brand Commitments

- Nombre: **Montca Actiu**. Marcas propias: **Montca Sports**, **Repte 5 Cims** (con *Passaport* de sellos) y **Montca Camp**.
- Tono: **cercano pero serio**. Tutea y es amable, pero transmite seguridad, que es lo que necesitan los padres y los centros educativos.
- Los monitores de Montca no están certificados a día de hoy (2026-11-16): la web no habla de títulos ni de certificados. Si eso cambia, se actualiza este archivo.
- Los textos de la interfaz van en valenciano (Apunta't, Avisa'm, Lo vull per al meu grup, Ho portem al teu poble).

## Evidence on Hand

- Wireframe de la portada: `docs/wireframe-portada-mapa-de-mariola.webp`.
- Todavía no hay logo en buena calidad, fotos reales, fichas completas de las actividades, fechas, precios ni la lista de los 5 cims. Montca tiene que pasarlo (lista en el documento del concepto). Mientras tanto se usan textos de prueba marcados como tales: no se inventan precios, fechas, plazas, testimonios ni datos de seguridad.
- La primera edición de Montca Sports fue en julio de 2026. Las fotos están pendientes de recibir.

## Product Principles

1. **Dos caminos, el mismo peso:** cada actividad ofrece apuntarse y pedirla para un grupo; ninguno queda escondido.
2. **Tres toques hasta la reserva:** si un recorrido típico necesita más, algo falla.
3. **El móvil primero:** se diseña para el pulgar y para quien viene de un reel; el escritorio se adapta después.
4. **La confianza antes que el adorno:** seguridad, monitores y precios claros ganan a cualquier efecto.
5. **El territorio es el hilo:** la Serra de Mariola y Cocentaina ordenan el contenido y le dan identidad.

## Accessibility & Inclusion

- Botones de al menos 44 px de alto para el pulgar (`docs/concepto-elegido-mapa-de-mariola.md`).
- El mapa siempre tiene una alternativa en lista (Mapa / Llista), que en el móvil es la vista por defecto.
- Hay que atender a públicos muy distintos, desde chavales hasta padres y profesorado. No se ha fijado ningún estándar formal; WCAG 2.2 AA queda como referencia por confirmar.
