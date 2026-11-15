# Decisiones · Web Montca Actiu

Actualizado: 2026-11-15. Las tareas que salen de aquí están en [tareas.md](tareas.md).

Estado: **Acordada** (Saúl y Pablo, o Montca) · **Por confirmar** (propuesta de uno, falta el visto bueno del otro) · **Pendiente** (aún sin decidir).

Lo que hay en el repositorio no es intocable: se hace lo más útil para la asociación, y lo que deje de tener sentido se elimina tras hablarlo entre los dos.

---

## 1. Producto

| Fecha | Decisión | Por qué | Estado |
|---|---|---|---|
| 2026-11-14 | Portada con el concepto **Mapa de Mariola** + buscador + agenda deslizable + cuenta atrás | Lo eligió Montca. Detalle en [concepto-elegido-mapa-de-mariola.md](concepto-elegido-mapa-de-mariola.md) | Acordada |
| 2026-11-13 | Idiomas: valenciano (principal) y castellano | Público local | Acordada |
| 2026-11-14 | El móvil es la versión principal | La mayoría llega desde Instagram y TikTok | Acordada |
| 2026-11-15 | **Formulario de contacto** e **inscripciones a eventos** son dos cosas separadas, con tecnología distinta | El formulario es para pedir actividades o información; las inscripciones son para eventos grandes con lógica propia | Por confirmar |
| 2026-11-15 | El formulario sirve para todo tipo de solicitante: particulares, grupos, escuelas/AMPA y empresas | Una sola puerta de entrada y un solo sitio donde Montca ve las solicitudes | Por confirmar |
| 2026-11-15 | Existe una sección **Eventos**; el primer evento es el **torneo de Navidad** | Es el próximo evento grande y marca el calendario del proyecto | Por confirmar |
| 2026-11-15 | Página del torneo: apartado "Equipos inscritos" (visible cuando haya alguno), separado en **Infantil + Cadet** (una sola categoría) y **Sénior**; debajo, botón de inscribirse que lleva a **otra página** con el formulario de inscripción | Definido por Saúl a partir de la reunión con Montca | Por confirmar |
| 2026-11-15 | Límites del torneo: Infantil+Cadet máx. 8 equipos, 5–10 jugadores · Sénior máx. 6 equipos, 5–12 jugadores | Notas de la reunión con Montca | Acordada (confirmar cifras con Montca) |
| 2026-11-15 | La lógica detallada de la inscripción (capitán, enlace, menores, verificación) se cierra en la spec, no antes | Faltan consultas, sobre todo legales | Por confirmar |

## 2. Arquitectura y tecnología

| Fecha | Decisión | Por qué | Estado |
|---|---|---|---|
| 2026-11-13 | **Astro + Netlify** | Web rápida, contenido en archivos sencillos, vistas previas por PR, hosting y HTTPS gratis | Acordada |
| 2026-11-15 | Dominio **.es en OVH**, a nombre de la asociación, apuntado a Netlify | ~6 €/año; la asociación es la dueña | Por confirmar |
| 2026-11-15 | Contenido que cambia poco (actividades, textos) en **content collections** de Astro | Sencillo, versionado y sin base de datos | Por confirmar |
| 2026-11-15 | Formulario de contacto: **Google Apps Script + Google Sheet** en la cuenta de Google de Montca. El Sheet funciona como CRM | Gratis, Montca ya sabe usar Sheets, ven y gestionan las solicitudes sin aprender nada nuevo | Por confirmar |
| 2026-11-15 | Cada solicitud: fila en el Sheet + aviso por correo al equipo + respuesta automática al solicitante | Idea original de Saúl para Montca | Por confirmar |
| 2026-11-15 | Antispam del formulario: campo trampa oculto + validación en el script | Gratis y sin captchas molestos | Por confirmar |
| 2026-11-15 | Eventos e inscripciones: **Supabase** (Postgres, región UE) | Equipos, jugadores, plazas y estados de verificación son datos relacionales con permisos; un Sheet se queda corto y es frágil con datos de menores | Por confirmar |
| 2026-11-15 | Lógica de servidor (validar, enviar correos, recordatorios) en **Netlify Functions** | Ya estamos en Netlify; sin servidor que mantener | Por confirmar |
| 2026-11-15 | Avisos y recordatorios **por correo**; WhatsApp solo con enlaces `wa.me` con el mensaje escrito | La API de WhatsApp Business es de pago y exige verificar el negocio | Acordada (Saúl) · Por confirmar (Pablo) |
| 2026-11-15 | **Bot de Telegram de reels → fase 2** | Necesita máquina siempre encendida, clave de IA y token de GitHub; no es prioritario | Acordada (Saúl) · Por confirmar (Pablo) |
| 2026-11-15 | Lectura automática de Instagram → fase 2 | Requiere app de Meta con revisión | Por confirmar |
| 2026-11-15 | Coste objetivo: 0 € salvo el dominio | Es una asociación | Por confirmar |
| 2026-11-15 | Cuentas (dominio, Google, Supabase, Netlify) a nombre de Montca, con nosotros como colaboradores | Que la web no dependa de nuestras cuentas personales | Por confirmar |

## 3. Legal y datos

| Fecha | Decisión | Por qué | Estado |
|---|---|---|---|
| 2026-11-15 | Las páginas legales (aviso legal, privacidad, cookies) se publican **antes** de activar cualquier formulario | Se recogen datos personales desde el primer envío | Por confirmar |
| 2026-11-15 | Un menor no queda inscrito hasta que su tutor autoriza participación y derechos de imagen | Notas de la reunión con Montca | Acordada |
| 2026-11-15 | Los adultos aceptan derechos de imagen al inscribirse | Notas de la reunión con Montca | Acordada |
| 2026-11-15 | Los textos legales se hacen con plantilla y los revisa alguien con criterio legal | Hay datos de menores; no queremos problemas | Por confirmar |

## 4. Forma de trabajar

| Fecha | Decisión | Por qué | Estado |
|---|---|---|---|
| 2026-11-13 | Issues, una rama por issue y PR revisado por el otro; nunca push a main | Para que nuestros dos Claudes no se pisen | Acordada |
| 2026-11-13 | Scrum con sprints de 1 semana: planning el lunes, review y retro al final | | Acordada |
| 2026-11-13 | Diseño con la skill **Impeccable**, instalada en el proyecto; los dos seguimos el mismo DESIGN.md | | Acordada |
| 2026-11-13 | Zonas: Pablo → componentes, layouts, estilos, DESIGN.md · Saúl → contenido, i18n, formularios, netlify.toml · compartido → pages, CLAUDE.md, docs | | Acordada |
| 2026-11-15 | **GitHub Spec Kit** para las features con lógica o datos; las tareas pequeñas van directas con Claude Code. Reparto en [tareas.md](tareas.md) | Spec donde aporta, sin burocracia donde no | Por confirmar |
| 2026-11-15 | Spec Kit: misma versión fijada para los dos, integración `claude`, numeración secuencial reservando el número en el tablero | Evitar diferencias entre máquinas y choques de numeración | Por confirmar |
| 2026-11-15 | Spec Kit se inicializa en una rama aparte, revisando el diff para no perder el CLAUDE.md actual | El init puede sobrescribirlo | Por confirmar |
| 2026-11-15 | Flujo por feature: `specify` → `clarify` → (`/impeccable shape` si hay interfaz) → `plan` → `tasks` → `analyze` → PR de la spec revisado por el otro → issues por zonas → `implement` por issue → `/impeccable audit` → PR | Junta Spec Kit, Impeccable y el flujo de issues | Por confirmar |
| 2026-11-15 | Reparto de documentos: principios en `.specify/memory/constitution.md` · proceso en `CLAUDE.md` · decisiones aquí · tareas en `tareas.md` | Cada cosa en un solo sitio | Por confirmar |
| 2026-11-15 | Limpieza del repo por consenso: lo que no se use se elimina | No acumular basura | Por confirmar |

## 5. Pendiente de decidir

| Qué | Quién decide | Bloquea |
|---|---|---|
| Fechas del torneo de Navidad y de apertura/cierre de inscripciones | Montca | Todo el camino del torneo |
| Cómo verifica el tutor: correo, firma digital, papel en Softco, o varias | Montca + Saúl | Inscripción de equipos |
| Qué datos de equipos y jugadores se ven en público (sobre todo de menores) | Montca + Saúl | Página del torneo |
| ¿Se cobra la inscripción? ¿Cómo? | Montca | Inscripción de equipos |
| Quién de Montca gestiona solicitudes e inscritos | Montca | CRM y gestión |
| Actividades normales de la agenda: ¿"Apunta't" con plazas reales, o se piden por formulario/WhatsApp? | Montca + los dos | Portada y agenda |
| De dónde salen las fechas de la agenda: archivos en el repo, un Sheet o Supabase | Los dos (depende de la anterior) | Portada y agenda |
| Mapa: ilustración a medida u OpenStreetMap con estilo | Montca + Pablo | Portada |
| Reels en la web mientras no hay bot: a mano, o no se muestran | Los dos | Fichas de actividad |
| Proveedor de correo para inscripciones y avisos | Saúl | Avisos |
| "Avisa'm" (Montca Camp, eventos sin fecha): ¿tipo dentro del formulario de contacto o lista aparte? | Saúl | Formulario |
| Scripts de Spec Kit: `sh` o `ps` | Los dos (según el sistema de Pablo) | Inicializar Spec Kit |
| Qué archivos actuales del repo se eliminan | Los dos | Limpieza |

## 6. Sustituidas o descartadas

| Fecha | Qué | Sustituida por |
|---|---|---|
| 2026-11-15 | "Las actividades y la agenda se leen de src/content" (CLAUDE.md) | Sigue valiendo para actividades; la fuente de la agenda está pendiente (sección 5) |
| 2026-11-15 | Bot de Telegram como parte de la primera versión | Fase 2 |
| 2026-11-15 | Recordatorios por WhatsApp | Correo |
| 2026-11-15 | Inscripciones mediante plataforma externa (Spond, Playoff) | Inscripción propia con Supabase (por confirmar) |
