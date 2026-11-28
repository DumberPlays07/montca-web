# Tareas · Web Montca Actiu

Actualizado: 2026-11-28 (A-32: transferir el sitio de Netlify a la cuenta de Montca; A-03 y A-26 descartadas y C-04, C-05 y C-06 ajustadas a las historias de inscripción; antes, 2026-11-25: catálogo y Repte de Montca: A-08 y A-09 empezadas; el mapa pasa a ser el menú de la web: nuevas B-21, B-22, B-23 y A-31; B-19 se replantea). Las decisiones que justifican este reparto están en [decisiones.md](decisiones.md).

Cada tarea está clasificada por **cómo se hace**:

- **A · Gestión** — sin código: hablar, comprar, configurar cuentas.
- **B · Claude Code directo** — tarea pequeña: issue → rama → PR, sin spec.
- **C · Spec Kit** — feature con lógica, datos o varios estados: specify → clarify → plan → tasks → implement.
- **D · Fase 2** — aparcado.

Quién: **S** = Saúl, **P** = Pablo, **M** = Montca. Talla: S (<2 h) · M (medio día) · L (un día o más).

Estado: ✅ Acabada (con su PR) · 🟡 Empezada · ⬜ Pendiente · ➖ No aplica. Al acabar una tarea se cambia aquí mismo, en su fila.

> **Fecha crítica: torneo de Navidad** (27/12/2026 y 3/1/2027). Las inscripciones al torneo empiezan el **25/11/2026** y cierran el **20/12/2026**. El **Google Forms provisional de Montca ya no se usa** (28/11/2026): las inscripciones solo se hacen desde la web (C-05). El camino *legal → eventos → inscripción de equipos* manda sobre la portada bonita. Ver "Orden recomendado" al final.



---

## A · Gestión (sin código)

### A1. Decisiones y contenido que dependen de Montca

| ID   | Tarea                                                                                                                                                           | Quién     | Bloquea a        | Estado |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------- | ------ |
| A-01 | Fecha del torneo de Navidad, fecha de apertura y cierre de inscripciones, deporte, lugar, precio (si lo hay)                                                    | M         | C-04, C-05       | ✅ Acabada (precio final y pago → A-26) |
| A-02 | Confirmar reglas del torneo: categorías (infantil+cadet / sénior), máximos de equipos y jugadores, edades exactas de cada categoría                             | M         | C-05             | ✅ Acabada |
| A-03 | Comprobar si la autorización del tutor **por correo** es válida legalmente (firma digital y papel en Softco ya están aceptadas)                                 | M + S     | C-05             | ➖ Descartada (28/11/2026): la autorización del tutor es solo en la web, con verificación por código de correo (D-6); ya no hay firma digital, papel ni autorización por correo que validar |
| A-04 | Quién de Montca gestiona solicitudes e inscritos (personas y correos), y qué plazo de respuesta se comprometen a cumplir                                        | M         | C-03, C-06       | 🟡 Empezada: plazo < 24 h; falta quién gestiona |
| A-05 | Ilustración a medida del mapa de Mariola (cada botón, un pico): boceto, visto bueno de Montca y versión final                                                   | P + M     | C-02             | ✅ Acabada: PR #12. Imagen en `src/assets/mapa/`, picos en `src/data/picos-mapa.json` (lista provisional hasta A-09); versión en alta resolución hecha en A-29 (PR #72) |
| A-06 | ¿Las actividades normales de la agenda tienen "Apunta't" con plazas, o se piden por formulario/WhatsApp?                                                        | M + S + P | C-02, C-06       | ⬜ Pendiente |
| A-07 | Logo en buena calidad, fotos de cada actividad y de Montca Sports; foto del equipo de monitores (con su permiso)                                                | M         | B-06, C-01, B-11 | ✅ Acabada: fotos, foto del equipo y logo en el Drive de Montca. **No usar la carpeta "Fotos scape room salesianos"** (sin derechos de imagen de los niños) |
| A-08 | Por actividad: dónde, edades, duración, tamaño de grupo, precio orientativo, qué incluye, ubicación en Mariola, punto de encuentro para el enlace "Com arribar" | M         | C-01             | 🟡 Empezada: el catálogo 2026-27 (resumen en [info-montca.md](info-montca.md)) da formatos, actividades, edades y aforos; faltan precios, fechas, duraciones, puntos de encuentro y fotos |
| A-09 | Próximas fechas de actividades, los 5 cimas del Repte                                                                                                           | M         | C-02             | 🟡 Empezada: el documento del Repte está resumido en [info-montca.md](info-montca.md); faltan los nombres de las 5 cimas y todas las fechas |
| A-31 | Que Montca diga qué fotos se pueden publicar (o cree una carpeta "Fotos per a la web" solo con las aprobadas) y pase el logo en vectorial (SVG, AI o PDF) | M | B-23, B-20 | ⬜ Pendiente |
| A-10 | Datos de la asociación para los textos legales: nombre legal, CIF, domicilio, correo de contacto, responsable de datos                                          | M         | B-08             | ✅ Acabada: el teléfono de contacto y el domicilio son los de Iker, según Montca (datos en el Drive) |
| A-23 | Preguntas frecuentes: las dudas que más les llegan sobre el torneo y de escuelas/AMPA, con su respuesta                                                         | M + S     | C-04, B-11       | ✅ Acabada: las del torneo, en [info-montca.md](info-montca.md). Las de escuelas/AMPA se añaden cuando se haga B-11 |
| A-24 | Número de WhatsApp de Montca para los enlaces `wa.me` (404, botón de WhatsApp)                                                                                  | M         | B-01, B-10       | ✅ Acabada: 722 79 60 66 (principal) y 657 39 47 01, en `src/components/contacto.ts` (PR #67) |
| A-26 | Preguntar a Montca lo que falta: precio final y forma de pago, quién revisa y confirma equipos, cómo se apuntan los equipos hasta que esté la web, si la casilla del tutor sustituye a la firma; seguro: qué aseguradora o tipo de seguro, qué datos de los jugadores se le pasan y qué documento acepta para menores de 14 sin DNI | S         | C-05, C-06, B-08 | ➖ Descartada (28/11/2026): las historias de inscripción lo resuelven: precio y pago (10 € por transferencia, RN-17 y HU-11), quién confirma (los webmasters marcan los pagos, HU-12), sin DNI de jugadores y solo datos de inscripción para la aseguradora (D-1), y autorización solo en la web (D-6). |

### A2. Cuentas e infraestructura

| ID   | Tarea                                                                                              | Quién | Notas                          | Estado |
| ---- | -------------------------------------------------------------------------------------------------- | ----- | ------------------------------ | ------ |
| A-11 | Comprar dominio .es en OVH a nombre de la asociación                                               | M + S | ~6 €/año                       | ⬜ Pendiente |
| A-12 | Apuntar el DNS del dominio a Netlify y comprobar HTTPS                                             | S     | Tras A-11 y B-02               | ⬜ Pendiente |
| A-13 | Cuenta de Google de Montca: confirmar acceso; ahí vivirán el Sheet-CRM y el Apps Script            | M + S | Bloquea C-03                   | ⬜ Pendiente |
| A-14 | Proyecto Supabase (región UE) a nombre de Montca, con Saúl y Pablo como miembros                   | S     | Bloquea C-04                   | ⬜ Pendiente |
| A-15 | Servicio de envío de correo para inscripciones y avisos (decidir proveedor y verificar el dominio) | S     | Tras A-11                      | ⬜ Pendiente |
| A-16 | Ficha de Google Business                                                                           | M + S | Mejor con el dominio ya activo | ⬜ Pendiente |
| A-25 | Pedir Google Workspace para entidades sin ánimo de lucro (correo profesional)                      | M + S | Cuando la web esté publicada   | ⬜ Pendiente |
| A-27 | Documento de Drive compartido (Saúl, Pablo y Montca) con los datos personales que no pueden ir al repo | S     | Ya hay datos que guardar        | ✅ Acabada |
| A-32 | Transferir el sitio de Netlify a la cuenta de Montca (montcaadventure@gmail.com): pasos justo debajo de la tabla | P     | Antes de configurar Supabase, el correo y el dominio en producción (A-12, A-14, A-15) | ⬜ Pendiente |

**A-32 · Transferir Netlify a la cuenta de Montca**

- **Motivo:** el sitio está ahora en la cuenta personal de Pablo. El registro de tratamientos dice que el contrato de encargado de Netlify se acepta desde la cuenta de Montca, y Montca tiene que poder acceder a su propia web aunque cambie quien la mantiene. Saúl ya ha creado la cuenta de Netlify de Montca, que está vacía.
- **Pasos:**
  1. Desde la cuenta de Montca, invitar a Pablo como miembro del equipo. Para transferir un sitio, hay que ser miembro de los dos equipos.
  2. Pablo transfiere el sitio desde su equipo al de Montca (configuración del sitio → opción de transferir a otro equipo).
  3. Comprobar después de la transferencia:
     - que el sitio sigue enlazado al repositorio de GitHub y que un push a `main` despliega (si no, volver a conectar el repositorio);
     - que las variables de entorno y la configuración de build se han mantenido;
     - que la web publicada sigue funcionando igual.
  4. Borrar la variable `PUBLIC_FUENTE_EQUIPOS` si existe (ya no se usa) y comprobar que `PUBLIC_FUENTE_PLAZAS` no está en `prueba`.
  5. Aceptar el contrato de encargado del tratamiento (DPA) de Netlify desde la cuenta de Montca.
  6. Dar acceso a Saúl. Si el plan gratuito no permite tantos miembros, decidir entre Pablo y Saúl quién se queda con acceso y anotarlo en [decisiones.md](decisiones.md).
  7. Cuando esté hecho, actualizar la fila de Netlify en la tabla de encargados de [legal/tratamientos.md](legal/tratamientos.md) (estado del DPA) y añadir una entrada en [decisiones.md](decisiones.md) con la fecha de la transferencia.

### A3. Legal

| ID   | Tarea                                                                                                                   | Quién | Notas                                      | Estado |
| ---- | ----------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------ | ------ |
| A-17 | Redactar aviso legal, política de privacidad y política de cookies (plantilla + revisión de alguien con criterio legal) | S + M | **Antes de publicar cualquier formulario** | 🟡 Empezada: borradores de privacidad, capas de los formularios y cookies en [legal/](legal/), pendientes de la revisión legal de Montca; falta el aviso legal |
| A-18 | Texto de consentimiento de derechos de imagen (adultos) y de autorización parental + imagen (menores)                   | S + M | Bloquea C-05                               | 🟡 Empezada: borrador en [legal/consentimientos.md](legal/consentimientos.md), pendiente de la revisión legal de Montca |
| A-19 | Definir qué datos se piden, para qué, cuánto tiempo se guardan y quién los ve                                           | S + M | Entra en la privacidad y en las specs      | ✅ Acabada: [legal/tratamientos.md](legal/tratamientos.md), plazos validados por Montca |
| A-30 | Meter el Google Forms de Montca en el registro de tratamientos y en la privacidad (canal, encargado, plazo y borrado de la hoja de respuestas) y confirmar que el Forms informa de la privacidad (issue #70) | S + M | Bloquea publicar el botón al Forms (C-04) | ➖ Descartada (28/11/2026): el Google Forms provisional ya no se usa; las inscripciones solo se hacen desde la web |

### A4. Equipo (Saúl + Pablo)

| ID   | Tarea                                                                                                                                                          | Notas                              | Estado |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------ |
| A-20 | Cerrar lo que sigue "por confirmar" en decisiones.md: content collections (tras ver Astro) y avisos con `wa.me`                                                 | Repaso general hecho el 2026-11-15 | ⬜ Pendiente |
| A-21 | Limpieza del repo por consenso: mover `MD's/Instruccions web i bot` a `docs/fase-2/bot-reels.md` o borrarlo; revisar `docs/ideas/`, `sprint-01.md` y qué sobra | No dejar basura                    | 🟡 Empezada: borrado `Docs`; faltan `MD's/`, `docs/ideas/` y `sprint-01.md` |
| A-22 | Rehacer el backlog del sprint 1 y crear los issues a partir de este archivo                                                                                    |                                    | ✅ Acabada: issues #13–#51 creados con etiquetas de tipo, responsable y "camino del torneo"; qué entra en cada sprint se decide en la planning |
| A-28 | Hacer público el repositorio, tras comprobar que no hay datos personales ni claves en los archivos ni en el historial                                          | Necesario para B-02                | ✅ Acabada: PR #61; auditoría del historial en el issue #32 |
| A-29 | Conseguir `mapa-definitivo` en alta resolución (≥ 2400 px de ancho) con el mismo encuadre y sustituir la de 1024 px | **Antes de publicar.** Si el encuadre cambia, hay que recolocar los picos (ver `scripts/mapa/README.md`) | ✅ Acabada: PR #72. 2560 × 1430 px en WebP (97 KB), ampliada con Real-ESRGAN; mismo encuadre, picos sin cambios |

---

## B · Claude Code directo (issue → rama → PR)

| ID   | Tarea                                                                                                                                                                                                                                                                                                                   | Quién               | Talla | Tecnología         | Depende de             | Estado |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----- | ------------------ | ---------------------- | ------ |
| B-01 | Estructura del proyecto Astro: carpetas, layout base, `lang` correcto, quitar plantilla por defecto; el layout exige `title`, `description` e imagen para compartir en cada página; página 404 bilingüe con enlaces a Agenda, Activitats y WhatsApp                                                                     | P                   | S     | Astro              | —                      | ✅ Acabada (#2, #9) |
| B-02 | Netlify: conectar repo, vistas previas por PR, `netlify.toml`. **Programar también una publicación diaria de la web** (por ejemplo, un build hook de Netlify que llame cada noche una GitHub Action con `cron`): la franja de la portada y el estado de las inscripciones de los eventos (C-04) se calculan al construir, y sin ella la franja no aparece sola cuando abre un evento futuro                                                                                                                                                                                                                                                           | S                   | S     | Netlify            | —                      | ⬜ Pendiente |
| B-03 | Inicializar Spec Kit en rama propia con `--script sh`, sin perder el `CLAUDE.md` actual; comprobar que los scripts corren en el Windows de Saúl (Git Bash)                                                                                                                                                              | S                   | S     | Spec Kit           | —                      | ✅ Acabada (#5, #7) |
| B-04 | Escribir la constitución (`/speckit-constitution`) y actualizar `CLAUDE.md` con el flujo nuevo                                                                                                                                                                                                                          | S + P               | M     | Spec Kit           | B-03                   | ✅ Acabada (#7) |
| B-05 | Mover los hooks de Impeccable de `settings.local.json` a `.claude/settings.json` para que los tengamos los dos                                                                                                                                                                                                          | P                   | S     | Claude Code        | —                      | ✅ Acabada (#4) |
| B-06 | `/impeccable init` → PRODUCT.md y DESIGN.md                                                                                                                                                                                                                                                                             | P                   | M     | Impeccable         | A-07                   | ✅ Acabada (#3) |
| B-07 | i18n VAL/CAST: rutas, diccionarios en `src/i18n`, selector de idioma. El idioma va solo en la ruta; no se guarda en el navegador                                                                                                                                                                                                                                                    | S                   | M     | Astro i18n         | B-01                   | ⬜ Pendiente |
| B-08 | Páginas legales (aviso legal, privacidad, cookies) y enlaces en el pie. **Aviso:** el aviso legal tiene que llevar el domicilio (art. 10 LSSI); está en el documento de Drive y se mete al hacer esta tarea; ajustar los enlaces internos de los textos legales (/privacidad, /aviso-legal) a las rutas por idioma de B-07                                                                                                                                                                                                                                                  | S                   | S     | Astro              | A-17                   | ⬜ Pendiente |
| B-09 | Menú fijo, pie y barra inferior en móvil (Agenda · Activitats · WhatsApp); enlace "← tornar" en fichas y eventos (sin migas de pan). Con esta primera pieza visual sale también `DESIGN.md` (no lo crea `/impeccable init`)                                                                                         | P                   | M     | Astro + Impeccable | B-06                   | ✅ Acabada (#66) |
| B-10 | Botón de WhatsApp siempre visible (`wa.me` con mensaje escrito)                                                                                                                                                                                                                                                         | P                   | S     | Astro              | B-09                   | ✅ Acabada (#67). Falta probar en un móvil real que WhatsApp abre el chat con el mensaje |
| B-11 | Páginas informativas: Qui som (con foto de equipo), Contacte, Escoles i AMPA (parte informativa y preguntas frecuentes)                                                                                                                                                                                                 | P (UI) + S (textos) | M     | Astro              | B-07, B-09, A-07, A-23 | ⬜ Pendiente |
| B-12 | Imágenes optimizadas con `<Image>` de Astro; nada de fotos incrustadas en el HTML                                                                                                                                                                                                                                       | P                   | S     | Astro              | A-07                   | ✅ Acabada (#71): componente `Foto.astro`; `site` para `og:image` pendiente de B-02 |
| B-13 | Cuenta atrás de Montca Sports / próximo evento ("Properament" si no hay fecha)                                                                                                                                                                                                                                          | P                   | S     | Astro              | C-04                   | ✅ Acabada (#100). Mejora pendiente: días, horas, minutos y segundos |
| B-14 | SEO técnico: sitemap, `hreflang`, robots (`noindex` en la gestión de Montca y en los enlaces de equipo), schema `SportsOrganization` (o `LocalBusiness` si hay local abierto al público) y `Event` para el torneo, imagen para compartir por defecto y la del torneo. Título y descripción por página ya vienen de B-01 | S                   | M     | Astro              | B-07, A-12             | ⬜ Pendiente |
| B-15 | Aviso de cookies (solo si se usa algo que lo exija: analítica, embeds de Instagram)                                                                                                                                                                                                                                     | S                   | S     | Astro              | A-17                   | ➖ No aplica: la web no usa cookies que necesiten consentimiento (decisiones.md, sección 3). Se reabre si se añade algo de terceros |
| B-16 | Página Repte 5 Cims (informativa)                                                                                                                                                                                                                                                                                       | P                   | M     | Astro              | A-09                   | ⬜ Pendiente |
| B-17 | Revisión final antes de publicar: `/impeccable audit` + `polish`, enlaces rotos, móvil; comprobar en las herramientas del navegador que las páginas públicas no guardan cookies ni datos                                                                                                                                                                                                                                  | P + S               | M     | Impeccable         | Todo                   | ⬜ Pendiente |
| B-18 | Lenguaje de movimiento: instalar en el proyecto las skills `animate` y `review-animations` de Emil Kowalski (el diseño lo sigue llevando Impeccable); hacer la lista de momentos que se mueven y para qué; escribir la sección "Movimiento" de DESIGN.md (duraciones, curvas, solo `transform` y `opacity`, nada en bucle, alternativa con `prefers-reduced-motion`) y pasarla a variables de CSS en `global.css`. Apuntar la decisión en decisiones.md | P | S | Impeccable + skills de Emil | — | ✅ Acabada: PR #107 |
| B-19 | Animaciones de los botones del mapa según la sección Movimiento de DESIGN.md: aparición escalonada, se levantan al pasar el ratón y "vuelan" al apartado al pulsar (transición entre páginas). Solo transform y opacity, sin librerías; revisión con `review-animations` y `/impeccable audit` | P | M | `animate` + Impeccable | B-21 | ✅ Acabada: PR #114. Queda fuera la flecha de la franja y de la cuenta atrás, el borde de la viñeta (#84) y la animación de la viñeta (#113) |
| B-20 | Logo de Montca Actiu en SVG a partir de `scripts/logo/fuentes/` (o del original si Montca lo pasa): símbolo y logo completo con los verdes de DESIGN.md; usarlo en la cabecera, el pie, el favicon y la imagen para compartir | P | S | Impeccable | — | ✅ Acabada: PR #105 |
| B-21 | **Mapa como menú**: botones de Castell y Cocentaina (nuevos) y de Montcabrer, Morro del Porc, Alt de Santa Maria, Alt de la Replana y Alt de la Codolla, cada uno con su apartado (ver decisiones.md, 25/11); etiqueta con el destino siempre visible, que se oculta al abrir la viñeta; viñeta con botón para ir al apartado; botones en amarillo (tono nuevo en DESIGN.md, con contraste comprobado); el resto de picos, sin botón; la lista accesible pasa a ser la de destinos | P | M | Astro + Impeccable | B-20 | ✅ Acabada: PR #112 |
| B-22 | **Escena de entrada del mapa**, una sola vez al cargar: la boira se levanta, ráfagas de brisa, una bandada de pájaros en V y dos o tres excursionistas (torso de colores vivos distintos del amarillo de los botones y del teja; cabeza en tres tonos de piel) que suben un tramo del sendero y se quedan quietos. Sin bucles; con movimiento reducido no hay escena y los excursionistas salen quietos. Apartado propio en la sección Movimiento de DESIGN.md | P | M | `animate` + Impeccable | B-19 | ✅ Acabada: PR #116. Los excursionistas suben en zigzag y los pájaros cruzan despacio: la escena dura hasta 4,9 s (WCAG 2.2.2) |
| B-23 | **Galeria**: página con las fotos que Montca apruebe (permiso de imagen confirmado, sin la carpeta "Fotos scape room salesianos", sin GPS) | P | S | Astro + `Foto` | A-31 | 🟡 Empezada: página Pròximament y botón en el mapa (#112); faltan las fotos (A-31) |

---

## C · Spec Kit (una spec por feature)

| ID   | Feature                                                                                                                                         | Quién              | Tecnología                                | Depende de                   | Estado |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------- | ---------------------------- | ------ |
| C-01 | **Actividades**: modelo de datos, ficha y página de cada actividad (sin reels hasta D-01)                                                       | S (datos) + P (UI) | Astro content collections (por confirmar) | B-07, A-08                   | ⬜ Pendiente |
| C-02 | **Portada**: buscador (Qui sou? / Què vos ve de gust?) que filtra mapa y agenda; usa `MapaMariola` de B-19 y añade la transición al filtrar                                                                 | P                  | Astro + JS en cliente                     | C-01, A-05, A-06, B-19       | ⬜ Pendiente |
| C-03 | **Formulario de solicitudes + CRM**                                                                                                             | S                  | Astro + Apps Script + Google Sheets       | A-13, B-08                   | ⬜ Pendiente |
| C-04 | **Eventos y torneo de Navidad**: sección Eventos, página del torneo, contador de plazas libres por categoría (HU-19, sin lista pública de equipos), botón Inscribir-se               | S (datos) + P (UI) | Astro + Supabase                          | A-14, A-01                   | 🟡 Empezada: spec aprobada (#69, en `specs/001-eventos-torneo/`); falta implementar |
| C-05 | **Inscripción de equipos**: página de inscripción, capitán, enlace y código para jugadores, límites, menores (con verificación del tutor)                                             | S                  | Supabase + Netlify Functions + correo     | C-04, A-02, A-18, B-08 | ⬜ Pendiente |
| C-06 | **Gestión para Montca**: ver inscritos, marcar pagos, abrir/cerrar inscripciones, crear eventos; fechas de la agenda si así se decide | S                  | Supabase (login) + Astro                  | C-04, A-04                   | ⬜ Pendiente |
| C-07 | **Avisos por correo**: confirmaciones, "qué llevar", recordatorio el día antes                                                                  | S                  | Netlify Scheduled Functions + correo      | C-05, A-15                   | ⬜ Pendiente |

### Qué tiene que cubrir cada spec (para no olvidarlo al escribirla)

**C-01 · Actividades**

- Toda imagen lleva texto alternativo obligatorio en VAL y CAST: es un campo del modelo y el build falla si falta.
- Cada página de actividad enlaza a actividades relacionadas, a la agenda y al contacto.
- Enlace "Com arribar" al punto de encuentro en Google Maps. Enlace, no mapa incrustado (evita cookies y peso).

**C-02 · Portada**

- El mapa lleva la atribución obligatoria completa de Copernicus DEM y OpenStreetMap (texto en `scripts/mapa/README.md`).
- La imagen del mapa es apaisada (1024 × 572): revisar cómo se ve y si los botones se pueden pulsar en un móvil de 375 px.

**C-03 · Formulario + CRM**
- Un solo formulario para todo tipo de contacto: particular, grupo, escuela/AMPA, empresa. Campos que cambian según el tipo (p. ej. escuela → centro, nº de alumnos, edades, fecha aproximada).
- Destino: Apps Script en la cuenta de Google de Montca → fila nueva en un Sheet.
- El Sheet es el CRM y tiene que ser cómodo: columnas de estado (nova / contestada / en curs / tancada), quién la lleva, notas, fecha; filtros por tipo y estado; colores por estado; vista resumen.
- Aviso al equipo por correo con los datos y enlace directo a la fila.
- Respuesta automática a quien escribe, en su idioma (VAL/CAST).
- Antispam: campo trampa oculto + validación en el script.
- Casilla de privacidad obligatoria con enlace a la política.
- Qué pasa si se supera la cuota diaria de correos de Apps Script (que la fila se guarde siempre aunque el correo falle).
- "Avisa'm" (Montca Camp, eventos sin fecha): decidir si es este mismo formulario con otro tipo.
- Página de agradecimiento tras enviar: confirma que ha llegado, dice qué pasa ahora y en cuánto tiempo responde Montca, y ofrece WhatsApp si corre prisa.
- El plazo de respuesta (A-04) aparece junto al botón de enviar, en la página de agradecimiento y en la respuesta automática.

**C-04 · Eventos y torneo**
- Sección Eventos independiente del formulario de contacto; el torneo de Navidad es el primer evento.
- Página del torneo: información, fechas (27/12/2026 y 3/1/2027), lugar (Poliesportiu Municipal de Cocentaina), deportes (fútbol sala, básquet y pádel; **cada equipo juega los tres**), precio (máx. 10 € por jugador), categorías, normas. Datos públicos en [info-montca.md](info-montca.md).
- Contador de plazas por categoría: equipos que ocupan plaza sobre el máximo («5 de 8 equipos» o «Completa»), sin ningún dato personal ni lista de equipos o de jugadores (HU-19 y D-4 de las [historias](historias-usuario-inscripciones.md)).
- Debajo, botón **Inscriure's** → lleva a otra página (la de inscripción, C-05).
- Estado de inscripciones (pròximament / obertes / completes / tancades) y fecha de cierre.
- Pensado para reutilizarse con el siguiente evento sin reprogramar.
- Mientras las inscripciones estén abiertas, franja del torneo en lo alto de la portada, visible sin hacer scroll.
- Preguntas frecuentes en la página del torneo: el texto está en [info-montca.md](info-montca.md).
- Enlace "Com arribar" al lugar del torneo y datos `Event` para buscadores.

**C-05 · Inscripción de equipos** (diseño de Saúl del 2026-11-18, actualizado el 2026-11-28 según las [historias de usuario](historias-usuario-inscripciones.md), que mandan; los casos raros se cierran en `clarify`)
- Cualquier jugador puede crear un equipo; quien lo crea queda como **administrador del equipo**.
- Lo primero que se pide es la **fecha de nacimiento del capitán**, que decide la categoría y el formulario: juvenil/sénior (2010 o antes) o infantil/cadete (2011–2014). En infantil/cadete se piden el correo del tutor y un teléfono de contacto, y esa fecha no se guarda (HU-01).
- **Juvenil/sénior** (HU-06): nombre y apellidos, fecha de nacimiento, correo, teléfono de todos los jugadores y contacto de emergencia opcional. Casillas: normas, aptitud y protección de datos (obligatorias), imagen y futuras actividades (opcionales). Sin DNI ni dorsal.
- **Infantil/cadete**, lo rellena el tutor (HU-07, HU-08): del menor, nombre y apellidos y fecha de nacimiento (sin teléfono, correo ni DNI); del tutor, nombre y apellidos, DNI, fecha de nacimiento (para comprobar que es mayor de edad), correo, teléfono y relación con el menor; segundo contacto de emergencia opcional; datos de salud opcionales (casilla A4 solo si se rellenan); casillas A1 a A7 con los textos del Anexo A.
- **Verificación del tutor** (HU-09): el menor solo queda inscrito al verificar el código que llega al correo del tutor. Recordatorio a las 24 h y borrado a las 48 h. La autorización es **solo en la web**: sin firma digital, papel ni Softco.
- La casilla de imagen es una sola en cada formulario. Se guarda si cada persona la ha marcado, para la lista de C-06.
- Al crear el equipo, el capitán (o su tutor, en infantil/cadete) recibe **por correo el enlace de invitación, un código de 6 cifras y un enlace de gestión**. Se entra en un equipo con el enlace o con el código (con límite de intentos) y se llega al formulario de la categoría del equipo.
- Categoría por año de nacimiento: **Infantil/Cadet** 2011–2014 · **Juvenil/Sènior** 2010 o antes. Hay menores en las dos.
- Límites: Infantil/Cadet máx. 8 equipos, 5–10 jugadores · Juvenil/Sènior máx. 6 equipos, 5–12 jugadores.
- Estados del equipo, calculados solos (HU-17): **creado** (menos de 5 jugadores) → **inscrito** (5 o más) → **completo** (10 en infantil/cadete, 12 en juvenil/sénior). Un equipo `creado` ya ocupa plaza de su categoría.
- Página de confirmación tras crear el equipo: dice que el enlace llega por correo. Otra más sencilla para cada jugador que se apunta.
- Las páginas con enlace de equipo no se indexan (`noindex`).
- El capitán (o su tutor) ve en su panel (HU-15) solo el nombre y el estado de cada jugador, sin datos de contacto ni de salud.
- Casos a resolver en `clarify`:
  - Equipo que no llega al mínimo antes del cierre.
  - Enlace reenviado a desconocidos.
  - Jugador que se borra.
  - Jugador nacido en un año que no es de la categoría del equipo.
  - Equipos apuntados antes de que esté la web.

**C-06 · Gestión para Montca** (actualizado el 2026-11-28 según las [historias de usuario](historias-usuario-inscripciones.md))
- Acceso con login solo para las personas de A-04.
- Ver equipos y jugadores, el estado de cada inscripción y marcar los pagos (HU-12). La autorización del tutor se verifica sola con el código: no hay nada que validar a mano.
- Jugadores sin permiso de imagen marcados en la vista de equipos, y **lista de quién no puede salir en fotos y vídeos** (nombre y equipo) para pasarla a los encargados de redes sociales.
- Ver el estado de cada equipo (creado, inscrito, completo; se calcula solo) y filtrar por estado (HU-12, HU-17).
- Dar de alta a mano los equipos que se apunten antes de que la inscripción por la web esté lista.
- Exportar inscritos.
- Abrir y cerrar inscripciones, crear el siguiente evento.
- Borrar los datos de cada tipo cuando acaba su plazo de conservación (HU-18).

**C-07 · Avisos por correo**
- Confirmación al inscribirse, aviso al capitán cuando se apunta alguien, recordatorio el día antes con punto de encuentro, hora y qué traer.
- Siempre por correo. Botones `wa.me` con el mensaje escrito: por confirmar.

---

## D · Fase 2 (aparcado)

| ID   | Tarea                                                                             | Notas                                                             | Estado |
| ---- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------ |
| D-01 | Bot de Telegram que publica reels en la web                                       | Guía ya escrita por Pablo. Hasta entonces la web no muestra reels | ⬜ Pendiente |
| D-02 | Lectura automática de Instagram para publicar próximas actividades                | Requiere app de Meta y cuenta Business                            | ⬜ Pendiente |
| D-03 | Recordatorios por WhatsApp Business API                                           | De pago por mensaje                                               | ⬜ Pendiente |
| D-04 | Pago online de inscripciones                                                      | Solo si Montca lo pide                                            | ⬜ Pendiente |
| D-05 | Pasaporte digital con sellos del Repte 5 Cims                                     |                                                                   | ⬜ Pendiente |
| D-06 | SEO de contenidos (artículos, palabras clave)                                     | Tras publicar                                                     | ⬜ Pendiente |
| D-07 | Reseñas reales: enlazar las de Google Business y pedir reseña tras cada actividad | Tras A-16. Mientras tanto, 2 o 3 testimonios con permiso          | ⬜ Pendiente |
| D-08 | Bloque "Ho hem fet amb…" en Escoles i AMPA con ejemplos reales                    | Necesita contenido y permisos de imagen de menores                | ⬜ Pendiente |

---

## Orden recomendado

1. **Base** (en paralelo): A-11 (comprar el dominio ya) · A-27, A-28 → B-02 · B-07 · A-20, A-21, A-22 · A-13, A-14 · pedir a Montca A-07 y A-08.
2. **Spec Kit listo**: B-03, B-04.
3. **Legal**: A-17, A-18, A-19 → B-08.
4. **Camino del torneo** (prioridad por fecha): C-04 → C-05 → C-06 (mínimo) → C-07.
5. **Formulario**: C-03 (puede ir en paralelo con el paso 4; lo lleva Saúl, así que va detrás de C-05 si hay que elegir).
6. **Web pública**: B-09, B-10, C-01, C-02, B-11, B-12, B-13, B-16.
7. **Salida**: A-12, B-14, B-15, A-16, B-17 → A-25 (Google Workspace, con la web ya publicada).
