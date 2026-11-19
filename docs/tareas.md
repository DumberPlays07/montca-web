# Tareas · Web Montca Actiu

Actualizado: 2026-11-18 (datos del torneo de Montca, diseño de la inscripción y columna de estado en todas las tareas). Las decisiones que justifican este reparto están en [decisiones.md](decisiones.md).

Cada tarea está clasificada por **cómo se hace**:

- **A · Gestión** — sin código: hablar, comprar, configurar cuentas.
- **B · Claude Code directo** — tarea pequeña: issue → rama → PR, sin spec.
- **C · Spec Kit** — feature con lógica, datos o varios estados: specify → clarify → plan → tasks → implement.
- **D · Fase 2** — aparcado.

Quién: **S** = Saúl, **P** = Pablo, **M** = Montca. Talla: S (<2 h) · M (medio día) · L (un día o más).

Estado: ✅ Acabada (con su PR) · 🟡 Empezada · ⬜ Pendiente. Al acabar una tarea se cambia aquí mismo, en su fila.

> **Fecha crítica: torneo de Navidad** (27/12/2026 y 3/1/2027). Las inscripciones al torneo abren el **23/11/2026** y cierran el **20/12/2026**, aunque la web no esté lista; cuanto antes esté la inscripción por la web, mejor. El camino *legal → eventos → inscripción de equipos* manda sobre la portada bonita. Ver "Orden recomendado" al final.



---

## A · Gestión (sin código)

### A1. Decisiones y contenido que dependen de Montca

| ID   | Tarea                                                                                                                                                           | Quién     | Bloquea a        | Estado |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------- | ------ |
| A-01 | Fecha del torneo de Navidad, fecha de apertura y cierre de inscripciones, deporte, lugar, precio (si lo hay)                                                    | M         | C-04, C-05       | ✅ Acabada (precio final y pago → A-26) |
| A-02 | Confirmar reglas del torneo: categorías (infantil+cadet / sénior), máximos de equipos y jugadores, edades exactas de cada categoría                             | M         | C-05             | ✅ Acabada |
| A-03 | Comprobar si la autorización del tutor **por correo** es válida legalmente (firma digital y papel en Softco ya están aceptadas)                                 | M + S     | C-05             | ⬜ Pendiente |
| A-04 | Quién de Montca gestiona solicitudes e inscritos (personas y correos), y qué plazo de respuesta se comprometen a cumplir                                        | M         | C-03, C-06       | 🟡 Empezada: plazo < 24 h; falta quién gestiona |
| A-05 | Ilustración a medida del mapa de Mariola (cada botón, un pico): boceto, visto bueno de Montca y versión final en SVG                                            | P + M     | C-02             | 🟡 Empezada: issue #10, PR #12 en borrador (scripts y versiones v1/v2); Montca está eligiendo versión |
| A-06 | ¿Las actividades normales de la agenda tienen "Apunta't" con plazas, o se piden por formulario/WhatsApp?                                                        | M + S + P | C-02, C-06       | ⬜ Pendiente |
| A-07 | Logo en buena calidad, fotos de cada actividad y de Montca Sports; foto del equipo de monitores (con su permiso)                                                | M         | B-06, C-01, B-11 | ✅ Acabada: fotos, foto del equipo y logo en el Drive de Montca. **No usar la carpeta "Fotos scape room salesianos"** (sin derechos de imagen de los niños) |
| A-08 | Por actividad: dónde, edades, duración, tamaño de grupo, precio orientativo, qué incluye, ubicación en Mariola, punto de encuentro para el enlace "Com arribar" | M         | C-01             | ⬜ Pendiente |
| A-09 | Próximas fechas de actividades, los 5 cimas del Repte                                                                                                           | M         | C-02             | ⬜ Pendiente |
| A-10 | Datos de la asociación para los textos legales: nombre legal, CIF, domicilio, correo de contacto, responsable de datos                                          | M         | B-08             | ✅ Acabada: el teléfono de contacto y el domicilio son los de Iker, según Montca (datos en el Drive) |
| A-23 | Preguntas frecuentes: las dudas que más les llegan sobre el torneo y de escuelas/AMPA, con su respuesta                                                         | M + S     | C-04, B-11       | ✅ Acabada: las del torneo, en [info-montca.md](info-montca.md). Las de escuelas/AMPA se añaden cuando se haga B-11 |
| A-24 | Número de WhatsApp de Montca para los enlaces `wa.me` (404, botón de WhatsApp)                                                                                  | M         | B-01, B-10       | ⬜ Pendiente |
| A-26 | Preguntar a Montca lo que falta: precio final y forma de pago, quién revisa y confirma equipos, cómo se apuntan los equipos hasta que esté la web, si la casilla del tutor sustituye a la firma | S         | C-05, C-06, B-08 | ⬜ Pendiente |

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

### A3. Legal

| ID   | Tarea                                                                                                                   | Quién | Notas                                      | Estado |
| ---- | ----------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------ | ------ |
| A-17 | Redactar aviso legal, política de privacidad y política de cookies (plantilla + revisión de alguien con criterio legal) | S + M | **Antes de publicar cualquier formulario** | ⬜ Pendiente |
| A-18 | Texto de consentimiento de derechos de imagen (adultos) y de autorización parental + imagen (menores)                   | S + M | Bloquea C-05                               | ⬜ Pendiente |
| A-19 | Definir qué datos se piden, para qué, cuánto tiempo se guardan y quién los ve                                           | S + M | Entra en la privacidad y en las specs      | ⬜ Pendiente |

### A4. Equipo (Saúl + Pablo)

| ID   | Tarea                                                                                                                                                          | Notas                              | Estado |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ------ |
| A-20 | Cerrar lo que sigue "por confirmar" en decisiones.md: content collections (tras ver Astro), avisos con `wa.me`, repo público                                   | Repaso general hecho el 2026-11-15 | ⬜ Pendiente |
| A-21 | Limpieza del repo por consenso: mover `MD's/Instruccions web i bot` a `docs/fase-2/bot-reels.md` o borrarlo; revisar `docs/ideas/`, `sprint-01.md` y qué sobra | No dejar basura                    | 🟡 Empezada: borrado `Docs`; faltan `MD's/`, `docs/ideas/` y `sprint-01.md` |
| A-22 | Rehacer el backlog del sprint 1 y crear los issues a partir de este archivo                                                                                    |                                    | ✅ Acabada: issues #13–#51 creados con etiquetas de tipo, responsable y "camino del torneo"; qué entra en cada sprint se decide en la planning |
| A-28 | Hacer público el repositorio, tras comprobar que no hay datos personales ni claves en los archivos ni en el historial                                          | Necesario para B-02                | ⬜ Pendiente |

---

## B · Claude Code directo (issue → rama → PR)

| ID   | Tarea                                                                                                                                                                                                                                                                                                                   | Quién               | Talla | Tecnología         | Depende de             | Estado |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ----- | ------------------ | ---------------------- | ------ |
| B-01 | Estructura del proyecto Astro: carpetas, layout base, `lang` correcto, quitar plantilla por defecto; el layout exige `title`, `description` e imagen para compartir en cada página; página 404 bilingüe con enlaces a Agenda, Activitats y WhatsApp                                                                     | P                   | S     | Astro              | —                      | ✅ Acabada (#2, #9) |
| B-02 | Netlify: conectar repo, vistas previas por PR, `netlify.toml`                                                                                                                                                                                                                                                           | S                   | S     | Netlify            | —                      | ⬜ Pendiente |
| B-03 | Inicializar Spec Kit en rama propia con `--script sh`, sin perder el `CLAUDE.md` actual; comprobar que los scripts corren en el Windows de Saúl (Git Bash)                                                                                                                                                              | S                   | S     | Spec Kit           | —                      | ✅ Acabada (#5, #7) |
| B-04 | Escribir la constitución (`/speckit-constitution`) y actualizar `CLAUDE.md` con el flujo nuevo                                                                                                                                                                                                                          | S + P               | M     | Spec Kit           | B-03                   | ✅ Acabada (#7) |
| B-05 | Mover los hooks de Impeccable de `settings.local.json` a `.claude/settings.json` para que los tengamos los dos                                                                                                                                                                                                          | P                   | S     | Claude Code        | —                      | ✅ Acabada (#4) |
| B-06 | `/impeccable init` → PRODUCT.md y DESIGN.md                                                                                                                                                                                                                                                                             | P                   | M     | Impeccable         | A-07                   | ✅ Acabada (#3) |
| B-07 | i18n VAL/CAST: rutas, diccionarios en `src/i18n`, selector de idioma                                                                                                                                                                                                                                                    | S                   | M     | Astro i18n         | B-01                   | ⬜ Pendiente |
| B-08 | Páginas legales (aviso legal, privacidad, cookies) y enlaces en el pie. **Aviso:** el aviso legal tiene que llevar el domicilio (art. 10 LSSI); está en el documento de Drive y se mete al hacer esta tarea                                                                                                                                                                                                                                                  | S                   | S     | Astro              | A-17                   | ⬜ Pendiente |
| B-09 | Menú fijo, pie y barra inferior en móvil (Agenda · Activitats · WhatsApp); enlace "← tornar" en fichas y eventos (sin migas de pan). Con esta primera pieza visual sale también `DESIGN.md` (no lo crea `/impeccable init`)                                                                                         | P                   | M     | Astro + Impeccable | B-06                   | ⬜ Pendiente |
| B-10 | Botón de WhatsApp siempre visible (`wa.me` con mensaje escrito)                                                                                                                                                                                                                                                         | P                   | S     | Astro              | B-09                   | ⬜ Pendiente |
| B-11 | Páginas informativas: Qui som (con foto de equipo), Contacte, Escoles i AMPA (parte informativa y preguntas frecuentes)                                                                                                                                                                                                 | P (UI) + S (textos) | M     | Astro              | B-07, B-09, A-07, A-23 | ⬜ Pendiente |
| B-12 | Imágenes optimizadas con `<Image>` de Astro; nada de fotos incrustadas en el HTML                                                                                                                                                                                                                                       | P                   | S     | Astro              | A-07                   | ⬜ Pendiente |
| B-13 | Cuenta atrás de Montca Sports / próximo evento ("Properament" si no hay fecha)                                                                                                                                                                                                                                          | P                   | S     | Astro              | C-04                   | ⬜ Pendiente |
| B-14 | SEO técnico: sitemap, `hreflang`, robots (`noindex` en la gestión de Montca y en los enlaces de equipo), schema `SportsOrganization` (o `LocalBusiness` si hay local abierto al público) y `Event` para el torneo, imagen para compartir por defecto y la del torneo. Título y descripción por página ya vienen de B-01 | S                   | M     | Astro              | B-07, A-12             | ⬜ Pendiente |
| B-15 | Aviso de cookies (solo si se usa algo que lo exija: analítica, embeds de Instagram)                                                                                                                                                                                                                                     | S                   | S     | Astro              | A-17                   | ⬜ Pendiente |
| B-16 | Página Repte 5 Cims (informativa)                                                                                                                                                                                                                                                                                       | P                   | M     | Astro              | A-09                   | ⬜ Pendiente |
| B-17 | Revisión final antes de publicar: `/impeccable audit` + `polish`, enlaces rotos, móvil                                                                                                                                                                                                                                  | P + S               | M     | Impeccable         | Todo                   | ⬜ Pendiente |

---

## C · Spec Kit (una spec por feature)

| ID   | Feature                                                                                                                                         | Quién              | Tecnología                                | Depende de                   | Estado |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------- | ---------------------------- | ------ |
| C-01 | **Actividades**: modelo de datos, ficha y página de cada actividad (sin reels hasta D-01)                                                       | S (datos) + P (UI) | Astro content collections (por confirmar) | B-07, A-08                   | ⬜ Pendiente |
| C-02 | **Portada**: buscador (Qui sou? / Què vos ve de gust?) que filtra mapa y agenda                                                                 | P                  | Astro + JS en cliente                     | C-01, A-05, A-06             | ⬜ Pendiente |
| C-03 | **Formulario de solicitudes + CRM**                                                                                                             | S                  | Astro + Apps Script + Google Sheets       | A-13, B-08                   | ⬜ Pendiente |
| C-04 | **Eventos y torneo de Navidad**: sección Eventos, página del torneo, lista de equipos inscritos por categoría, botón Inscribir-se               | S (datos) + P (UI) | Astro + Supabase                          | A-14, A-01                   | ⬜ Pendiente |
| C-05 | **Inscripción de equipos**: página de inscripción, capitán, enlace para jugadores, límites, menores                                             | S                  | Supabase + Netlify Functions + correo     | C-04, A-02, A-03, A-18, B-08 | ⬜ Pendiente |
| C-06 | **Gestión para Montca**: ver inscritos, validar autorizaciones, abrir/cerrar inscripciones, crear eventos; fechas de la agenda si así se decide | S                  | Supabase (login) + Astro                  | C-04, A-04                   | ⬜ Pendiente |
| C-07 | **Avisos por correo**: confirmaciones, "qué llevar", recordatorio el día antes                                                                  | S                  | Netlify Scheduled Functions + correo      | C-05, A-15                   | ⬜ Pendiente |

### Qué tiene que cubrir cada spec (para no olvidarlo al escribirla)

**C-01 · Actividades**

- Toda imagen lleva texto alternativo obligatorio en VAL y CAST: es un campo del modelo y el build falla si falta.
- Cada página de actividad enlaza a actividades relacionadas, a la agenda y al contacto.
- Enlace "Com arribar" al punto de encuentro en Google Maps. Enlace, no mapa incrustado (evita cookies y peso).

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
- Apartado "Equips inscrits": aparece cuando hay al menos un equipo **confirmado** (los pendientes no salen); separado en dos categorías: **Infantil/Cadet** y **Juvenil/Sènior**.
- Debajo, botón **Inscriure's** → lleva a otra página (la de inscripción, C-05).
- Plazas de equipos libres por categoría; estado de inscripciones (pròximament / obertes / completes / tancades).
- Datos públicos de cada equipo: nombre del equipo, nombres y dorsales de los jugadores y quién es el capitán. De los menores, solo el primer nombre, sin apellidos.
- Pensado para reutilizarse con el siguiente evento sin reprogramar.
- Mientras las inscripciones estén abiertas, franja del torneo en lo alto de la portada, visible sin hacer scroll.
- Preguntas frecuentes en la página del torneo: el texto está en [info-montca.md](info-montca.md).
- Enlace "Com arribar" al lugar del torneo y datos `Event` para buscadores.

**C-05 · Inscripción de equipos** (diseño de Saúl del 2026-11-18; los casos raros se cierran en `clarify`)
- Cualquier jugador puede crear un equipo; quien lo crea queda como **administrador del equipo**.
- Lo primero que se pregunta es la **edad**: mayor de edad → formulario de adultos; menor → formulario de menores (uno solo para todos los menores, sin distinguir categoría).
- **Adultos**: nombre y apellidos, DNI, fecha de nacimiento, teléfono, correo, casilla de derechos de imagen (opcional) y casilla para recibir información de otras actividades (opcional).
- **Menores**: nombre y apellidos, DNI y fecha de nacimiento del menor; datos del tutor legal (los mismos que en adultos); casilla de derechos de imagen del menor (opcional); casilla para recibir información de otras actividades en el correo del tutor (opcional); **autorización del tutor para que el menor participe, la única casilla obligatoria**.
- La casilla de imagen es una sola en cada formulario (en el de menores, sin separar por edad). Se guarda si cada jugador la ha marcado, para la lista de C-06.
- Al crear el equipo, el administrador recibe **por correo un enlace único del equipo** para pasarlo a quien quiera. **Solo se entra en un equipo con ese enlace.** Quien entra sigue los mismos pasos: edad → formulario de adulto o de menor.
- Categoría por año de nacimiento: **Infantil/Cadet** 2011–2014 · **Juvenil/Sènior** 2010 o antes. Hay menores en las dos.
- Límites: Infantil/Cadet máx. 8 equipos, 5–10 jugadores · Juvenil/Sènior máx. 6 equipos, 5–12 jugadores.
- Estados: **pendiente** (no llega al mínimo o falta la revisión de Montca) → **confirmado** (llega al mínimo y Montca lo revisa). Solo los confirmados ocupan plaza y salen en la web. Con las plazas llenas, los demás equipos van a **lista de espera**.
- Página de confirmación tras crear el equipo: dice que el enlace llega por correo. Otra más sencilla para cada jugador que se apunta.
- Las páginas con enlace de equipo no se indexan (`noindex`).
- Dorsal: estaba previsto pedirlo y mostrarlo en la página del equipo, pero no está en la lista de campos del 2026-11-18. Confirmar si se mantiene.
- Casos a resolver en `clarify`:
  - Equipo que no llega al mínimo antes del cierre.
  - Enlace reenviado a desconocidos.
  - Jugador que se borra.
  - Administrador menor de edad: ¿el correo con el enlace va al tutor?
  - Jugador nacido en un año que no es de la categoría del equipo.
  - El mismo DNI en dos equipos.
  - Menores de 14 sin DNI.
  - Si la casilla del tutor sustituye a la firma digital o al papel en Softco (A-26).
  - Equipos apuntados antes de que esté la web.

**C-06 · Gestión para Montca**
- Acceso con login solo para las personas de A-04.
- Ver equipos y jugadores, estado de cada autorización, marcar como verificada la entregada en papel.
- Jugadores sin permiso de imagen marcados en la vista de equipos, y **lista de quién no puede salir en fotos y vídeos** (nombre y equipo) para pasarla a los encargados de redes sociales.
- Revisar y **confirmar** equipos; pasar equipos de la **lista de espera** cuando quede una plaza libre.
- Dar de alta a mano los equipos que se apunten antes de que la inscripción por la web esté lista.
- Exportar inscritos.
- Abrir y cerrar inscripciones, crear el siguiente evento.

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

1. **Base** (en paralelo): A-11 (comprar el dominio ya) · A-27, A-28 → B-02 · B-07 · A-20, A-21, A-22 · A-13, A-14 · pedir a Montca A-07, A-08 y lo de A-26.
2. **Spec Kit listo**: B-03, B-04.
3. **Legal**: A-17, A-18, A-19 → B-08.
4. **Camino del torneo** (prioridad por fecha): C-04 → C-05 → C-06 (mínimo) → C-07.
5. **Formulario**: C-03 (puede ir en paralelo con el paso 4; lo lleva Saúl, así que va detrás de C-05 si hay que elegir).
6. **Web pública**: B-09, B-10, C-01, C-02, B-11, B-12, B-13, B-16.
7. **Salida**: A-12, B-14, B-15, A-16, B-17 → A-25 (Google Workspace, con la web ya publicada).
