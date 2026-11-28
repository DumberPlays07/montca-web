# Registro de tratamientos de datos · Web Montca Actiu

Actualizado: 2026-11-28 (adaptado a las [historias de usuario de las inscripciones](../historias-usuario-inscripciones.md) v3.1, que mandan sobre la versión anterior del 2026-11-19; plazos validados por Montca; garantías de Supabase, Netlify y Google comprobadas en A-17). Las decisiones de las que sale están en [decisiones.md](../decisiones.md), sección 3.

Para qué sirve este documento:

- Es el **registro de actividades de tratamiento** de Montca (art. 30 RGPD) para todo lo que recoge la web.
- Es la **fuente** de la política de privacidad, de las cláusulas de cada formulario y de los textos de consentimiento (A-17, A-18).
- Es la **referencia de las specs** C-03 a C-07: una spec no pide un dato que no esté aquí. Si hace falta uno nuevo, primero se añade aquí.

> **Este repositorio es público.** Aquí no va ningún dato personal: ni de los inscritos ni de la gente de Montca. Lo que no puede ser público está en el documento de Drive compartido (A-27). Tampoco va el IBAN de la asociación.

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
| T2 | Inscripción de jugadores juvenil/sénior      | Ejecución de la inscripción (6.1.b)     | 03/04/2027 (3 meses después del torneo)    | C-05, C-07  |
| T3 | Inscripción de menores (infantil/cadete) y datos del tutor | Ejecución de la inscripción (6.1.b) | 03/04/2027 (3 meses después del torneo); si no se verifica, a las 48 horas | C-05, C-07 |
| T4 | Prueba de la autorización del tutor          | Interés legítimo (6.1.f)                | 03/01/2028 (1 año después del torneo)      | C-05, C-06  |
| T5 | Derechos de imagen                           | Consentimiento (6.1.a)                  | Cuando se retire el consentimiento         | C-05, C-06  |
| T6 | Información de otras actividades             | Consentimiento (6.1.a y art. 21 LSSI)   | Cuando la persona se dé de baja            | C-05        |
| T7 | ~~Lista pública de equipos inscritos~~       | **Suprimido**                           | —                                          | —           |
| T8 | Usuarios de la gestión de Montca             | Interés legítimo (6.1.f)                | Cuando la persona deja de tener acceso; registro de acciones: 03/01/2028 | C-06 |
| T9 | Datos de salud del menor                     | Consentimiento explícito (6.1.a y 9.2.a) | 03/04/2027 (con T3)                       | C-05, C-06  |

Los correos automáticos de C-07 (confirmaciones, avisos, recordatorios) no son un tratamiento aparte: forman parte de T2 y T3.

Las fechas de T2 a T9 son las del torneo de Navidad (última jornada: 03/01/2027). Para el siguiente evento se calculan igual desde su última jornada.

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

### T2 · Inscripción de jugadores juvenil/sénior

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Inscribir al jugador en su equipo, comprobar la categoría, darle de alta en el seguro del evento, organizar el torneo, controlar el pago y enviarle los avisos del torneo. |
| Interesados      | Jugadores juvenil/sénior (nacidos en 2010 o antes) y las personas que indican como contacto de emergencia. |
| Datos            | Nombre y apellidos, fecha de nacimiento, correo electrónico y teléfono de contacto (de todos los jugadores). Contacto de emergencia, opcional: nombre y teléfono (datos de un tercero que facilita el jugador). Equipo, categoría (sale del año de nacimiento), si es capitán, estado de la inscripción y fecha de alta. Estado del pago: lo marca un webmaster, y se guarda quién lo marcó, cuándo y el historial de cambios. Las casillas de imagen e información son T5 y T6. |
| Base legal       | Art. 6.1.b RGPD: ejecución de la inscripción que pide el propio jugador. |
| Quién lo ve      | Los webmasters de Montca (C-06). El capitán ve en el panel de su equipo solo el nombre y el estado de cada jugador, sin datos de contacto. No se publica ninguna lista. |
| Destinatarios    | La aseguradora del evento: los datos de la inscripción necesarios para dar de alta el seguro de los participantes. |
| Encargados       | Supabase (base de datos, UE), Netlify (web y Functions), proveedor de correo (pendiente). |
| Conservación     | Hasta el 03/04/2027: tres meses después del torneo, por si hay incidencias, reclamaciones o partes del seguro. El historial de cambios del pago se conserva el mismo tiempo. |
| Cómo se borra    | Un webmaster usa el botón de borrado del panel (HU-18), que elimina los equipos y jugadores del evento, incluidos los equipos sin jugadores. Montca borra también cualquier exportación que haya hecho. |

### T3 · Inscripción de menores (infantil/cadete) y datos del tutor

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | La de T2, para jugadores infantil/cadete (nacidos entre 2011 y 2014), con la participación autorizada por su tutor legal. El menor no interactúa con los formularios: lo inscribe su tutor. |
| Interesados      | Jugadores menores de edad, sus tutores legales y las personas que el tutor indica como segundo contacto de emergencia. |
| Datos del menor  | Nombre y apellidos, fecha de nacimiento, equipo, categoría, estado de la inscripción y fecha de alta. Estado del pago, con los mismos datos que en T2. No se piden DNI, teléfono ni correo del menor, tampoco si es el capitán. |
| Datos del tutor  | Nombre y apellidos, DNI (solo para identificar a quien autoriza), fecha de nacimiento (para comprobar que es mayor de edad), correo electrónico, teléfono de contacto y relación con el menor (padre, madre o tutor legal). Segundo contacto de emergencia, opcional: nombre, teléfono y relación con el menor. El teléfono del tutor es el contacto de emergencia por defecto. |
| Datos del equipo | Si el capitán es infantil/cadete, al crear el equipo se guardan el correo del tutor y un teléfono de contacto como contacto del equipo. La fecha de nacimiento del capitán solo sirve para comprobar la categoría y **no se guarda**. |
| Base legal       | Art. 6.1.b RGPD: ejecución de la inscripción, que hace el tutor en nombre del menor. |
| Verificación     | El menor no queda inscrito hasta que el tutor verifica su correo con un código que recibe por correo. Las inscripciones que no se verifican se borran **a las 48 horas**, con un correo recordatorio al tutor a las 24 horas. |
| Quién lo ve      | Los webmasters de Montca (C-06). El capitán o su tutor ven en el panel del equipo solo el nombre y el estado de cada jugador, sin datos de contacto ni de salud. No se publica ninguna lista. |
| Destinatarios    | La aseguradora del evento, con los datos de inscripción del menor necesarios para dar de alta el seguro. Nunca recibe datos de salud (T9). |
| Encargados       | Los de T2. |
| Conservación     | Hasta el 03/04/2027, como T2. |
| Cómo se borra    | Como T2. |

### T4 · Prueba de la autorización del tutor

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Poder demostrar que el tutor autorizó la participación del menor si alguien lo pregunta o reclama después del torneo. |
| Interesados      | Tutores legales de los menores inscritos. |
| Datos            | Nombre del tutor, correo electrónico verificado, fecha y hora de la autorización (con zona horaria), datos del menor, texto exacto de cada autorización aceptada, versión de la política de privacidad, qué casillas obligatorias y opcionales se marcaron y cuáles no, y registro de la verificación del código (cuándo se envió, cuándo se verificó y número de intentos). El registro no se puede modificar. |
| Relación con T5  | T4 guarda la prueba de todo lo que aceptó el tutor, incluidas las casillas opcionales, hasta el 03/01/2028. T5 es el registro vigente del permiso de imagen, que dura mientras no se retire. |
| Base legal       | Art. 6.1.f RGPD: interés legítimo de Montca en poder acreditar la autorización. |
| Quién lo ve      | Los webmasters de Montca (C-06). |
| Encargados       | Supabase. |
| Conservación     | Hasta el 03/01/2028: un año después del torneo. Por eso se guarda separada de T3, que se borra antes. |
| Cómo se borra    | Un webmaster usa el botón de borrado del panel (HU-18), que elimina los registros de autorización del evento, incluidos los de verificación del código. |

### T5 · Derechos de imagen

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Publicar fotos y vídeos del evento en la web y en los perfiles oficiales de la asociación solo de quien lo ha permitido, y que los encargados de redes sepan quién no puede salir. |
| Interesados      | Jugadores juvenil/sénior y menores (en los menores, la casilla la marca el tutor). |
| Datos            | Si ha marcado la casilla, fecha y versión del texto aceptado. Lista de quien **no** puede salir en fotos y vídeos: nombre y equipo. Las fotos y vídeos en los que aparezca. |
| Relación con T4  | T5 es el registro vigente del permiso de imagen y dura mientras no se retire. La prueba de lo que aceptó el tutor, incluida esta casilla, se guarda aparte en T4 hasta el 03/01/2028. |
| Base legal       | Art. 6.1.a RGPD: consentimiento libre, en una casilla separada, sin marcar y opcional (y LO 1/1982 de protección del derecho a la propia imagen). |
| Quién lo ve      | Los webmasters de Montca. La lista de quien no puede salir, también los encargados de redes de Montca. |
| Destinatarios    | La web y los perfiles oficiales de la asociación en redes sociales, donde Montca publique. |
| Conservación     | El consentimiento, mientras no se retire. Retirarlo es igual de fácil que darlo, por el correo de la sección 1. La lista de quien no puede salir se borra con T2 y T3 (03/04/2027). |
| Cómo se borra    | Si alguien retira el consentimiento, no se publican más imágenes suyas y Montca retira las ya publicadas que dependan de ella. |

### T6 · Información de otras actividades

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Enviar por correo información de otras actividades y eventos de Montca. |
| Interesados      | Jugadores juvenil/sénior y tutores de menores que marcan la casilla. |
| Datos            | Nombre, correo (el del tutor si el jugador es menor), idioma, fecha y versión del texto aceptado. |
| Base legal       | Art. 6.1.a RGPD y art. 21 LSSI: consentimiento en una casilla separada, sin marcar y opcional. |
| Quién lo ve      | Los webmasters de Montca. |
| Encargados       | Supabase y el proveedor de correo (pendiente). |
| Conservación     | Hasta que la persona se dé de baja. Cada correo lleva una forma sencilla de darse de baja. Esta lista se guarda aparte de T2 y T3 para que no se borre con ellas. |
| Cómo se borra    | Al darse de baja se borra de la lista. |

### T7 · Lista pública de equipos inscritos

**Suprimido (28/11/2026).** La web ya no publica ninguna lista de equipos ni de jugadores (decisión D-4 de las [historias de usuario](../historias-usuario-inscripciones.md)). Lo único que ve alguien de fuera de Montca es el panel privado del capitán o su tutor (T2 y T3), con el nombre y el estado de cada jugador. Se mantiene el número T7 para no romper referencias.

### T8 · Usuarios de la gestión de Montca

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Dar acceso a la gestión (C-06) solo a las personas autorizadas y saber quién ha hecho cada cambio. |
| Interesados      | Personas de Montca con acceso a la gestión (A-04). |
| Datos            | Nombre, correo, credenciales de acceso y registro de accesos y cambios. Registro de las acciones de administración (abrir y cerrar inscripciones, renombrar equipos, borrados): qué hizo, qué webmaster y cuándo, sin guardar los datos borrados. |
| Acceso           | Los webmasters entran con Supabase Auth, con correo y contraseña. Las cuentas las crea a mano el equipo: no hay registro público. |
| Base legal       | Art. 6.1.f RGPD: interés legítimo en proteger los datos de los inscritos. |
| Quién lo ve      | Quien administre el proyecto de Supabase de Montca. |
| Encargados       | Supabase. |
| Conservación     | La cuenta, mientras la persona tenga acceso. El registro de acciones de administración, hasta el 03/01/2028, cuando acaba el último plazo del torneo. |
| Cómo se borra    | Se borra su usuario en Supabase. El registro de acciones se borra con el botón del panel (HU-18), junto con los registros de autorización. |

### T9 · Datos de salud del menor

| Campo            | Contenido |
| ---------------- | --------- |
| Finalidad        | Valorar y atender las necesidades de seguridad y asistencia del menor durante el torneo. |
| Interesados      | Jugadores menores de edad (infantil/cadete). Los facilita su tutor. |
| Datos            | Todos opcionales: alergias, lesiones actuales, enfermedad o circunstancia relevante para la práctica deportiva, medicación de emergencia y otras observaciones. Si no se rellena ninguno, no se guarda ningún dato de salud. No se piden datos de salud a los jugadores juvenil/sénior. |
| Base legal       | Art. 6.1.a y art. 9.2.a RGPD: consentimiento explícito del tutor, en una casilla propia (A4) que solo es obligatoria si se rellena algún dato de salud. Son datos de categoría especial. |
| Quién lo ve      | Solo los webmasters de Montca, con un acceso más restringido que el resto de datos (tabla separada). No los ven el capitán ni su tutor en el panel del equipo. |
| Destinatarios    | Los servicios de emergencia y los profesionales sanitarios, solo si hace falta (casilla A5). La aseguradora no los recibe. |
| Encargados       | Supabase. |
| Conservación     | Hasta el 03/04/2027, como T3. |
| Cómo se borra    | Se borran junto con T3. |

---

## 4. Encargados y destinatarios

| Servicio | Para qué | Dónde están los datos | Contrato de encargo (DPA) | Estado |
| -------- | -------- | --------------------- | ------------------------- | ------ |
| Supabase | Base de datos de inscripciones y login de la gestión | Región UE (se elige al crear el proyecto, A-14) | Su DPA, con cláusulas contractuales tipo, forma parte de los términos y se acepta al crear la cuenta | ✅ Comprobado (2026-11-19) |
| Netlify | Alojamiento de la web y Netlify Functions | Web: red de servidores mundial. Functions: EE. UU. (Ohio) por defecto; cambiar a la UE exige plan de pago, así que se queda en EE. UU. | Su DPA forma parte de los términos. Está adherida al Marco de Privacidad de Datos UE-EE. UU., que cubre la transferencia | ✅ Comprobado (2026-11-19) |
| Google | Apps Script, Sheet-CRM y correo de la cuenta de Montca | EE. UU.; no se puede elegir la región en una cuenta gratuita | Google LLC está adherida al Marco de Privacidad de Datos UE-EE. UU. Con una cuenta gratuita no hay contrato de encargo que aceptar; con Google Workspace sí (A-25) | 🟡 Transferencia cubierta; contrato al pasar a Workspace |
| Proveedor de correo | Correos de inscripción y avisos (C-07) | Por decidir (A-15) | Elegir uno que lo ofrezca y, si puede ser, con datos en la UE | ⬜ Pendiente |
| OVH | Dominio | No trata datos de quien usa la web | No hace falta | — |
| Aseguradora | Alta de los jugadores en el seguro | — | Es destinataria, no encargada: recibe los datos de la inscripción necesarios para dar de alta el seguro de los participantes, sin DNI de jugadores y sin datos de salud | ✅ Definido (28/11/2026) |
| Servicios de emergencia y profesionales sanitarios | Atender una emergencia del menor durante el torneo | — | Son destinatarios, no encargados: reciben los datos de salud y de contacto solo si hace falta (casilla A5) | ✅ Definido (28/11/2026) |

---

## 5. Medidas de seguridad

- Todas las cuentas (Supabase, Netlify, Google, dominio) son de Montca, con verificación en dos pasos activada.
- Tienen acceso a los datos de los inscritos las personas de gestión de Montca (A-04), y Saúl y Pablo como miembros del proyecto de Supabase, con un compromiso de confidencialidad firmado.
- Todas las tablas de Supabase tienen RLS activado: el público no puede leer datos personales. Solo puede insertar inscripciones a través de funciones controladas.
- Los datos de salud (T9) están en una tabla separada con acceso solo para los webmasters.
- La clave de servicio de Supabase solo está en las variables de entorno de Netlify. Nunca en el repositorio ni en el navegador.
- Los enlaces de equipo (de invitación y de gestión) no se pueden adivinar y sus páginas llevan `noindex`.
- La entrada a un equipo con el código de 6 cifras tiene un límite de intentos. Para aplicarlo se guarda la IP de la conexión **cifrada con hash** (nunca en claro), como máximo 24 horas. Base legal: art. 6.1.f RGPD, interés legítimo en la seguridad de las inscripciones.
- El código de verificación del tutor se guarda cifrado con hash, nunca en texto plano, y caduca a los 30 minutos.
- Las Functions no escriben datos personales en los logs.
- Las exportaciones de inscritos se guardan en el Drive de Montca, no en dispositivos personales, y se borran con los mismos plazos que los datos de los que salen.
- El Sheet-CRM se comparte solo con las personas de A-04.

---

## 6. Derechos de las personas

- Cualquiera puede pedir acceder a sus datos, corregirlos, borrarlos, oponerse al tratamiento, limitarlo o llevárselos (portabilidad) escribiendo al correo de la sección 1. Si son datos de un menor, lo pide su tutor.
- Montca responde en el plazo máximo de **un mes**.
- También se puede reclamar ante la Agencia Española de Protección de Datos (AEPD). La política de privacidad lo dice.

---

## 7. Calendario de borrado del torneo de Navidad

| Fecha      | Qué se hace                                                                                    | Quién  |
| ---------- | ---------------------------------------------------------------------------------------------- | ------ |
| 24 horas   | Control de intentos del código de equipo: la IP cifrada con hash se borra como máximo a las 24 horas | Automático |
| 24 y 48 horas desde el envío | Inscripciones de menores sin verificar: recordatorio al tutor a las 24 horas y borrado de la inscripción a las 48 horas | Automático |
| 03/04/2027 | Borrar equipos (también los que no tienen jugadores), jugadores, tutores, contactos de emergencia, datos de salud (T9), estado de pago y su historial, la lista de quien no puede salir en imágenes (T2, T3, T5, T9) y las exportaciones | Webmaster, con el botón del panel (HU-18) |
| 03/01/2028 | Borrar los registros de autorización (T4) y el registro de acciones de administración (T8)    | Webmaster, con el botón del panel (HU-18) |

El permiso de imagen (T5) y la lista de información de actividades (T6) no tienen fecha: duran mientras la persona no retire el consentimiento o no se dé de baja.

---

## 8. Pendientes

| Qué | Quién | Afecta a |
| --- | ----- | -------- |
| Google: aceptar su contrato de encargo cuando la cuenta pase a Google Workspace | Montca + Saúl (A-25) | Sección 4 |
| Compromiso de confidencialidad de Saúl y Pablo (una página) | Saúl | Sección 5 |
| Consentimiento de imagen de menores de 14 a 17 años: comprobar en la revisión legal si lo acepta también el menor | A-18 | T5 |
