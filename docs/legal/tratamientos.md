# Registro de tratamientos de datos · Web Montca Actiu

Actualizado: 2026-11-19 (A-19; plazos validados por Montca; garantías de Supabase, Netlify y Google comprobadas en A-17). Las decisiones de las que sale están en [decisiones.md](../decisiones.md), sección 3.

Para qué sirve este documento:

- Es el **registro de actividades de tratamiento** de Montca (art. 30 RGPD) para todo lo que recoge la web.
- Es la **fuente** de la política de privacidad, de las cláusulas de cada formulario y de los textos de consentimiento (A-17, A-18).
- Es la **referencia de las specs** C-03 a C-07: una spec no pide un dato que no esté aquí. Si hace falta uno nuevo, primero se añade aquí.

> **Este repositorio es público.** Aquí no va ningún dato personal: ni de los inscritos ni de la gente de Montca. Lo que no puede ser público está en el documento de Drive compartido (A-27).

> Lo ha hecho el equipo de la web, no un abogado. Montca ha validado los plazos (2026-11-19). Los textos legales que salgan de aquí los revisa alguien con criterio legal (decisión del 2026-11-15).

---

## 1. Responsable del tratamiento

| Dato                         | Valor                                                                 |
| ---------------------------- | --------------------------------------------------------------------- |
| Responsable                  | Associació Juvenil i Esportiva Montca Actiu                           |
| NIF                          | G88904354                                                             |
| Domicilio                    | En el documento de Drive (es un domicilio particular)                 |
| Correo para ejercer derechos | montcaadventure@gmail.com                                             |
| Persona de contacto          | La que indique Montca (ver [decisiones.md](../decisiones.md), sección 5) |

Montca es la responsable de todos los tratamientos de este documento. Los servicios que usa la web son **encargados del tratamiento** (sección 4). Saúl y Pablo acceden a los datos como miembros del proyecto de Supabase de Montca y bajo su autoridad, con compromiso de confidencialidad (sección 5).

---

## 2. Resumen

| #  | Tratamiento                                  | Base legal                              | Se borra                                   | Spec        |
| -- | -------------------------------------------- | --------------------------------------- | ------------------------------------------ | ----------- |
| T1 | Formulario de solicitudes y CRM              | Petición del interesado (6.1.b)         | 12 meses después de cerrar la solicitud    | C-03        |
| T2 | Inscripción de jugadores adultos             | Ejecución de la inscripción (6.1.b)     | 03/04/2027 (3 meses después del torneo)    | C-05, C-07  |
| T3 | Inscripción de menores y datos del tutor     | Ejecución de la inscripción (6.1.b)     | 03/04/2027 (3 meses después del torneo)    | C-05, C-07  |
| T4 | Prueba de la autorización del tutor          | Interés legítimo (6.1.f)                | 03/01/2028 (1 año después del torneo)      | C-05, C-06  |
| T5 | Derechos de imagen                           | Consentimiento (6.1.a)                  | Cuando se retire el consentimiento         | C-05, C-06  |
| T6 | Información de otras actividades             | Consentimiento (6.1.a y art. 21 LSSI)   | Cuando la persona se dé de baja            | C-05        |
| T7 | Lista pública de equipos inscritos           | Ejecución de la inscripción (6.1.b), informada en el formulario | 10/01/2027 (una semana después del torneo) | C-04 |
| T8 | Usuarios de la gestión de Montca             | Interés legítimo (6.1.f)                | Cuando la persona deja de tener acceso     | C-06        |

Los correos automáticos de C-07 (confirmaciones, avisos, recordatorios) no son un tratamiento aparte: forman parte de T2 y T3.

Las fechas de T2 a T7 son las del torneo de Navidad (última jornada: 03/01/2027). Para el siguiente evento se calculan igual desde su última jornada.

---

## 3. Fichas

### T1 · Formulario de solicitudes y CRM

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Responder a quien pide información o presupuesto de una actividad (particulares, grupos, escuelas/AMPA, empresas) y hacer el seguimiento de la solicitud. |
| Interesados      | Personas que escriben por el formulario, en su nombre o en el de un centro, grupo o empresa. |
| Datos            | Tipo de solicitante, nombre, correo, teléfono (obligatorio u opcional: lo decide la spec C-03), centro o empresa, número de personas, edades, fecha aproximada, mensaje, idioma, fecha de envío y aceptación de la privacidad. Estado, responsable y notas internas de Montca. |
| Base legal       | Art. 6.1.b RGPD: medidas precontractuales a petición del interesado. |
| Quién lo ve      | Las personas de Montca que gestionan solicitudes (A-04). No se publica nada. |
| Encargados       | Google (Apps Script, Sheets y correo de la cuenta de Montca) y Netlify (alojamiento de la web). |
| Conservación     | 12 meses desde que la solicitud pasa a "tancada". |
| Cómo se borra    | Montca borra la fila del Sheet y los correos de aviso de esa solicitud. |

### T2 · Inscripción de jugadores adultos

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Inscribir al jugador en su equipo, comprobar la categoría, darle de alta en el seguro del evento, organizar el torneo y enviarle los avisos del torneo. |
| Interesados      | Jugadores mayores de edad. |
| Datos            | Nombre y apellidos, DNI, fecha de nacimiento, correo, teléfono **solo si es el administrador del equipo** (obligatorio en ese caso), equipo, dorsal (del 1 al 99, sin repetir dentro del equipo), categoría (sale del año de nacimiento), si es administrador, estado de la inscripción, fecha de alta. Las casillas de imagen e información son T5 y T6. |
| Base legal       | Art. 6.1.b RGPD: ejecución de la inscripción que pide el propio jugador. |
| Por qué el DNI   | Todos los jugadores tienen que estar cubiertos por el seguro, y la aseguradora lo pide. |
| Quién lo ve      | Gestión de Montca (C-06). El administrador del equipo no ve los datos de sus jugadores: solo lo que ve todo el mundo (T7). |
| Destinatarios    | La aseguradora del evento: los datos que pida para dar de alta el seguro (pendiente, A-26). |
| Encargados       | Supabase (base de datos, UE), Netlify (web y Functions), proveedor de correo (pendiente). |
| Conservación     | Hasta el 03/04/2027: tres meses después del torneo, por si hay incidencias, reclamaciones o partes del seguro. |
| Cómo se borra    | Montca borra los equipos y jugadores del evento en Supabase y cualquier exportación que haya hecho. |

### T3 · Inscripción de menores y datos del tutor

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | La de T2, para jugadores menores de edad, con la participación autorizada por su tutor legal. |
| Interesados      | Jugadores menores de edad y sus tutores legales. |
| Datos del menor  | Nombre y apellidos, DNI, fecha de nacimiento, teléfono y correo **solo si es el administrador del equipo** (obligatorios en ese caso: el enlace del equipo le llega a él), equipo, dorsal (del 1 al 99, sin repetir dentro del equipo), categoría, si es administrador, estado de la inscripción, fecha de alta. |
| Datos del tutor  | Nombre y apellidos, DNI, fecha de nacimiento, teléfono y correo. La fecha de nacimiento sirve para comprobar que el tutor es mayor de edad. El correo del tutor recibe las comunicaciones del menor, salvo el enlace del equipo si el menor es el administrador. |
| Base legal       | Art. 6.1.b RGPD: ejecución de la inscripción, que hace el tutor en nombre del menor. |
| Por qué el DNI   | El del menor, por el seguro (como en T2). El del tutor identifica a quien autoriza (T4). Menores de 14 sin DNI: pendiente (A-26). |
| Quién lo ve      | Gestión de Montca (C-06). El administrador del equipo no ve los datos de sus jugadores: solo lo que ve todo el mundo (T7). En la web pública, solo el primer nombre y el dorsal del menor. |
| Destinatarios    | La aseguradora del evento, con los datos del menor que pida (pendiente, A-26). |
| Encargados       | Los de T2. |
| Conservación     | Hasta el 03/04/2027, como T2. |
| Cómo se borra    | Como T2. |

### T4 · Prueba de la autorización del tutor

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Poder demostrar que el tutor autorizó la participación del menor si alguien lo pregunta o reclama después del torneo. |
| Interesados      | Tutores legales de los menores inscritos. |
| Datos            | Qué menor, qué tutor (nombre y DNI), fecha y hora, cómo autorizó (casilla en la web, firma digital o papel en Softco), versión del texto aceptado y, si se decide, la confirmación por correo. |
| Base legal       | Art. 6.1.f RGPD: interés legítimo de Montca en poder acreditar la autorización. |
| Quién lo ve      | Gestión de Montca (C-06). |
| Encargados       | Supabase. Las autorizaciones en papel se dejan en Softco (servicio de paquetería), que las guarda hasta que alguien de Montca pasa a recogerlas; no pasan por la web. |
| Conservación     | Hasta el 03/01/2028: un año después del torneo. Por eso se guarda separada de T3, que se borra antes. |
| Cómo se borra    | Montca borra los registros de autorización del evento en Supabase y destruye los papeles. |

### T5 · Derechos de imagen

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Publicar fotos y vídeos del evento en la web y en los perfiles de Instagram y TikTok de Montca solo de quien lo ha permitido, sin nombrar ni etiquetar a nadie, y que los encargados de redes sepan quién no puede salir. |
| Interesados      | Jugadores adultos y menores (en los menores, la casilla la marca el tutor). |
| Datos            | Si ha marcado la casilla, fecha y versión del texto aceptado. Lista de quien **no** puede salir en fotos y vídeos: nombre y equipo. Las fotos y vídeos en los que aparezca. |
| Base legal       | Art. 6.1.a RGPD: consentimiento libre, en una casilla separada, sin marcar y opcional (y LO 1/1982 de protección del derecho a la propia imagen). |
| Quién lo ve      | Gestión de Montca. La lista de quien no puede salir, también los encargados de redes de Montca. |
| Destinatarios    | Las redes sociales donde Montca publique (Instagram, TikTok). |
| Conservación     | El consentimiento, mientras no se retire. Retirarlo es igual de fácil que darlo, por el correo de la sección 1. La lista de quien no puede salir se borra con T2 y T3 (03/04/2027). |
| Cómo se borra    | Si alguien retira el consentimiento, no se publican más imágenes suyas y Montca retira las ya publicadas que dependan de ella. |

### T6 · Información de otras actividades

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Enviar por correo información de otras actividades y eventos de Montca. |
| Interesados      | Jugadores adultos y tutores de menores que marcan la casilla. |
| Datos            | Nombre, correo (el del tutor si el jugador es menor), idioma, fecha y versión del texto aceptado. |
| Base legal       | Art. 6.1.a RGPD y art. 21 LSSI: consentimiento en una casilla separada, sin marcar y opcional. |
| Quién lo ve      | Gestión de Montca. |
| Encargados       | Supabase y el proveedor de correo (pendiente). |
| Conservación     | Hasta que la persona se dé de baja. Cada correo lleva una forma sencilla de darse de baja. Esta lista se guarda aparte de T2 y T3 para que no se borre con ellas. |
| Cómo se borra    | Al darse de baja se borra de la lista. |

### T7 · Lista pública de equipos inscritos

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Que en la página del torneo se vea qué equipos y quién juega en cada uno. |
| Interesados      | Jugadores de equipos **confirmados**. Los equipos pendientes y en lista de espera no salen. |
| Datos que se publican | Nombre del equipo; de los adultos, nombre y primer apellido; de los menores, **solo el primer nombre**; quién es el capitán; el dorsal de cada jugador junto a su nombre. |
| Base legal       | Art. 6.1.b RGPD: forma parte de la inscripción, y el formulario avisa antes de enviar de que estos datos saldrán publicados. |
| Quién lo ve      | Cualquiera que visite la web. |
| Encargados       | Netlify (sirve la página) y Supabase (de donde salen los datos). |
| Conservación     | Hasta el 10/01/2027: una semana después del torneo. |
| Cómo se borra    | La lista desaparece de la web en esa fecha. Los datos siguen en Supabase hasta que se borre T2 y T3. |

### T8 · Usuarios de la gestión de Montca

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Dar acceso a la gestión (C-06) solo a las personas autorizadas y saber quién ha hecho cada cambio. |
| Interesados      | Personas de Montca con acceso a la gestión (A-04). |
| Datos            | Nombre, correo, credenciales de acceso y registro de accesos y cambios. |
| Base legal       | Art. 6.1.f RGPD: interés legítimo en proteger los datos de los inscritos. |
| Quién lo ve      | Quien administre el proyecto de Supabase de Montca. |
| Encargados       | Supabase. |
| Conservación     | Mientras la persona tenga acceso. Cuando deja la gestión se le da de baja. |
| Cómo se borra    | Se borra su usuario en Supabase. |

---

## 4. Encargados y destinatarios

| Servicio | Para qué | Dónde están los datos | Contrato de encargo (DPA) | Estado |
| -------- | -------- | --------------------- | ------------------------- | ------ |
| Supabase | Base de datos de inscripciones y login de la gestión | Región UE (se elige al crear el proyecto, A-14) | Su DPA, con cláusulas contractuales tipo, forma parte de los términos y se acepta al crear la cuenta | ✅ Comprobado (2026-11-19) |
| Netlify | Alojamiento de la web y Netlify Functions | Web: red de servidores mundial. Functions: EE. UU. (Ohio) por defecto; cambiar a la UE exige plan de pago, así que se queda en EE. UU. | Su DPA forma parte de los términos. Está adherida al Marco de Privacidad de Datos UE-EE. UU., que cubre la transferencia | ✅ Comprobado (2026-11-19) |
| Google | Apps Script, Sheet-CRM y correo de la cuenta de Montca | EE. UU.; no se puede elegir la región en una cuenta gratuita | Google LLC está adherida al Marco de Privacidad de Datos UE-EE. UU. Con una cuenta gratuita no hay contrato de encargo que aceptar; con Google Workspace sí (A-25) | 🟡 Transferencia cubierta; contrato al pasar a Workspace |
| Proveedor de correo | Correos de inscripción y avisos (C-07) | Por decidir (A-15) | Elegir uno que lo ofrezca y, si puede ser, con datos en la UE | ⬜ Pendiente |
| OVH | Dominio | No trata datos de quien usa la web | No hace falta | — |
| Softco | Guarda las autorizaciones en papel hasta que las recoge Montca | En la tienda, poco tiempo | Comprobar en la revisión legal si basta con dejarlo por escrito de forma sencilla | ⬜ Pendiente |
| Aseguradora | Alta de los jugadores en el seguro | — | Es destinataria, no encargada: recibe los datos para dar el seguro | ⬜ Pendiente (A-26) |

---

## 5. Medidas de seguridad

- Todas las cuentas (Supabase, Netlify, Google, dominio) son de Montca, con verificación en dos pasos activada.
- Tienen acceso a los datos de los inscritos las personas de gestión de Montca (A-04), y Saúl y Pablo como miembros del proyecto de Supabase, con un compromiso de confidencialidad firmado.
- Todas las tablas de Supabase tienen RLS activado: lo que se ve sin login es solo lo de T7.
- La clave de servicio de Supabase solo está en las variables de entorno de Netlify. Nunca en el repositorio ni en el navegador.
- Los enlaces de equipo no se pueden adivinar y sus páginas llevan `noindex`.
- Las Functions no escriben datos personales en los logs.
- Las exportaciones de inscritos se guardan en el Drive de Montca, no en dispositivos personales, y se borran con los mismos plazos que los datos de los que salen.
- El Sheet-CRM se comparte solo con las personas de A-04.
- Las autorizaciones en papel se entregan en Softco en sobre cerrado, y Montca las recoge lo antes posible.

---

## 6. Derechos de las personas

- Cualquiera puede pedir acceder a sus datos, corregirlos, borrarlos, oponerse al tratamiento, limitarlo o llevárselos (portabilidad) escribiendo al correo de la sección 1. Si son datos de un menor, lo pide su tutor.
- Montca responde en el plazo máximo de **un mes**.
- También se puede reclamar ante la Agencia Española de Protección de Datos (AEPD). La política de privacidad lo dice.

---

## 7. Calendario de borrado del torneo de Navidad

| Fecha      | Qué se hace                                                                                    | Quién  |
| ---------- | ---------------------------------------------------------------------------------------------- | ------ |
| 10/01/2027 | Quitar de la web la lista de equipos inscritos (T7)                                            | Montca |
| 03/04/2027 | Borrar equipos, jugadores, tutores y la lista de quien no puede salir en imágenes (T2, T3, T5) y las exportaciones | Montca |
| 03/01/2028 | Borrar los registros de autorización y destruir los papeles (T4)                               | Montca |

---

## 8. Pendientes

| Qué | Quién | Afecta a |
| --- | ----- | -------- |
| Aseguradora: cuál es (o qué tipo de seguro), qué datos se le pasan y qué documento acepta para menores de 14 sin DNI | Montca (A-26) | T2, T3, privacidad |
| Pago: si Montca apunta quién ha pagado, se añade a T2 | Montca (A-26) | T2 |
| Google: aceptar su contrato de encargo cuando la cuenta pase a Google Workspace | Montca + Saúl (A-25) | Sección 4 |
| Compromiso de confidencialidad de Saúl y Pablo (una página) | Saúl | Sección 5 |
| Consentimiento de imagen de menores de 14 a 17 años: comprobar en la revisión legal si lo acepta también el menor | A-18 | T5 |
