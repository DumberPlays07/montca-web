# Historias de usuario — Inscripciones al Torneo de Navidad (Montca Actiu)

> **Proyecto:** MONTCA-WEB · **Módulo:** Inscripción de equipos y jugadores
> **Fuente:** documento «Aclaraciones Montcactiu» + resolución de preguntas abiertas (28/11/2026)
> **Versión:** 3.1 · **Estado:** listo para `/specify`. Sin preguntas abiertas
> **Fecha:** 28/11/2026

---

## 0. Cómo leer este documento

- **Formato de cada historia:** *Como* [rol], *quiero* [acción], *para* [beneficio].
- **Prioridad:** P1 = imprescindible para abrir inscripciones · P2 = necesaria antes del torneo · P3 = mejora.
- **Prueba independiente:** cómo se puede demostrar la historia por sí sola (mismo criterio que usa Spec Kit en `spec.md`).
- **Criterios de aceptación:** escenarios *Dado / Cuando / Entonces* (Gherkin). Cada escenario tiene un resultado de sí/no, así que se pueden convertir casi uno a uno en tests.
- **Calidad (INVEST):** cada historia intenta ser Independiente, Negociable, Valiosa, Estimable, Pequeña (*Small*) y Testeable. Las que dependen de otra lo indican en «Depende de».
- **⚠️** marca un punto todavía pendiente. Están en la sección 9.2; las historias asumen la opción indicada hasta que se decida otra cosa.

### Cambios en la versión 3

- Resueltas P-13 a P-18 (sección 9.1).
- Plazos de conservación tomados del registro de tratamientos (`docs/legal/tratamientos.md`), revisado con Montca: nueva sección 8.4, RN-20 y **HU-18** (borrado de datos tras el torneo).
- Nuevos **estados del equipo**: `creado`, `inscrito` y `completo` (RN-19, **HU-17**).
- **HU-11:** el correo de pago no muestra ninguna fecha límite.
- Nueva sección 11: diferencias entre estas historias y los documentos legales ya redactados.

### Cambios en la versión 2

- Resueltas las preguntas P-01 a P-12 (sección 9.1).
- **HU-01** reescrita: formulario distinto según la categoría del capitán; en infantil/cadete se piden datos de contacto del tutor y la fecha de nacimiento del capitán solo para comprobar la categoría.
- **HU-03:** el código del equipo pasa a ser **numérico de 6 dígitos**, único por equipo.
- Nuevas reglas de límites: equipos por categoría y jugadores por equipo (RN-13, RN-14).
- **HU-09:** recordatorio a las 24 h y borrado a las 48 h.
- **HU-11:** importe, método y concepto de pago definidos.
- **HU-14** confirmada; **HU-15** desarrollada; nueva **HU-16** (abrir/cerrar inscripciones).

---

## 1. Roles

| Rol | Quién es | Qué hace en el sistema |
|---|---|---|
| **Capitán** | Jugador que crea el equipo. En infantil/cadete, el equipo lo crea con los datos de contacto de su tutor | Registra el equipo y recibe el enlace, el código y el enlace de gestión |
| **Jugador juvenil/sénior** | Jugador nacido en 2010 o antes | Se inscribe él mismo en un equipo y paga |
| **Tutor legal** | Padre, madre o tutor legal de un jugador infantil/cadete | Rellena el formulario del menor, verifica su correo, autoriza y paga |
| **Jugador infantil/cadete** | Menor nacido entre 2011 y 2014 | No interactúa con los formularios: lo inscribe su tutor |
| **Webmaster** | Miembro de Montca Actiu con acceso de administración | Revisa inscripciones, marca pagos, abre/cierra inscripciones y modera nombres |
| **Sistema** | La web (Netlify + Supabase + envío de correo) | Calcula categoría, controla límites, envía correos y guarda evidencias |

---

## 2. Reglas de negocio

| ID | Regla |
|---|---|
| **RN-01** | La categoría se determina por **año de nacimiento**, no por edad exacta. |
| **RN-02** | **Infantil/cadete:** nacidos en 2011, 2012, 2013 o 2014. |
| **RN-03** | **Juvenil/sénior:** nacidos en **2010 o antes**. |
| **RN-04** | Nacidos en 2015 o después: no pueden inscribirse (no hay categoría). |
| **RN-05** | La categoría del equipo la fija la fecha de nacimiento del **capitán** al crearlo y no cambia. |
| **RN-06** | Todo jugador que entre a un equipo debe pertenecer a la categoría de ese equipo. |
| **RN-07** | Se accede a un equipo de dos formas: **enlace único** o **código numérico de 6 dígitos**. Las dos llevan al formulario de la categoría del equipo. |
| **RN-08** | Un jugador infantil/cadete solo queda inscrito cuando el tutor **verifica su correo con el código** enviado. Sin código correcto, no hay inscripción. |
| **RN-09** | Estados de un jugador: `pendiente de verificación` (solo menores) → `inscrito, pendiente de pago` → `pagado`. Solo puede **jugar** quien está en `pagado`. |
| **RN-10** | El pago se comprueba manualmente: Montca recibe la transferencia y un webmaster marca la casilla en la web. La web no cobra. |
| **RN-11** | Las autorizaciones de un menor se guardan con su **texto exacto** y la **versión de la política de privacidad** vigente en ese momento. |
| **RN-12** | Las casillas opcionales (imagen, futuras actividades) nunca bloquean la inscripción y aparecen **desmarcadas** por defecto. |
| **RN-13** | **Máximo de equipos por categoría:** 8 en infantil/cadete y 6 en juvenil/sénior. |
| **RN-14** | **Jugadores por equipo** (cuentan los jugadores en `inscrito, pendiente de pago` o `pagado`): infantil/cadete mínimo 5 y máximo 10; juvenil/sénior mínimo 5 y máximo 12. Los jugadores en `pendiente de verificación` no cuentan. |
| **RN-15** | Un jugador **solo puede estar en un equipo** por torneo. Se considera el mismo jugador si coinciden nombre y apellidos (sin distinguir mayúsculas, tildes ni espacios) y fecha de nacimiento; en juvenil/sénior, también si coincide el correo. |
| **RN-16** | **Plazo de inscripción:** abierto hasta el **20/12/2026 a las 23:59** (hora de Madrid). Un webmaster puede abrir o cerrar las inscripciones manualmente en cualquier momento. |
| **RN-17** | **Pago:** 10 € por jugador, por transferencia a la cuenta de la asociación, con el concepto «Nombre equipo - Nombre jugador». |
| **RN-18** | **Nombres de equipo:** no se aceptan nombres repetidos (sin distinguir mayúsculas, tildes ni espacios) ni ofensivos. Al rechazar un nombre se explica el motivo. |
| **RN-19** | **Estados del equipo**, calculados según los jugadores en `inscrito, pendiente de pago` o `pagado`: **`creado`** (menos de 5) → **`inscrito`** (5 o más, sin llegar al máximo) → **`completo`** (10 en infantil/cadete, 12 en juvenil/sénior). Si un jugador sale del equipo, el estado baja al que corresponda. Un equipo en `creado` ya ocupa una de las plazas de su categoría. |
| **RN-20** | **Conservación:** los datos se guardan y se borran según los plazos del registro de tratamientos (sección 8.4). |

---

## 3. Épica E1 — Creación de equipo

### HU-01 · Crear un equipo como capitán (P1)

**Como** jugador que quiere participar con sus amigos,
**quiero** crear un equipo con mis datos y el nombre del equipo,
**para** quedar como capitán y poder invitar al resto.

**Por qué esta prioridad:** sin equipos no existe ninguna otra inscripción.

**Prueba independiente:** crear un equipo de cada categoría y comprobar en la base de datos que existe con su categoría correcta, su código y los datos de contacto que corresponden.

**Flujo del formulario**

1. Se pide primero la **fecha de nacimiento del capitán**. Con ella la web decide la categoría y muestra los campos que tocan.
2. **Si es juvenil/sénior** (2010 o antes), se piden: nombre y apellidos, correo electrónico, teléfono de contacto, nombre del equipo, contacto de emergencia (opcional) y las casillas de HU-06. Así el capitán queda inscrito como primer jugador del equipo en el mismo paso.
3. **Si es infantil/cadete** (2011–2014), se piden: **correo electrónico del tutor legal**, **teléfono de contacto preferido** y nombre del equipo. La fecha de nacimiento del capitán **solo sirve para comprobar la categoría y no se guarda**. El capitán todavía no queda inscrito como jugador: su tutor lo inscribe después con HU-07, como al resto del equipo.

**Criterios de aceptación**

1. **Dado** que introduzco una fecha de nacimiento de 2010 o antes, **cuando** continúo, **entonces** veo los campos del capitán juvenil/sénior.
2. **Dado** que introduzco una fecha de nacimiento de 2011–2014, **cuando** continúo, **entonces** veo un aviso de que hace falta el correo del tutor legal y un teléfono de contacto, y los campos para introducirlos.
3. **Dado** que introduzco una fecha de 2015 o posterior, **cuando** continúo, **entonces** veo que no hay categoría para esa edad y no puedo seguir.
4. **Dado** que soy juvenil/sénior y relleno todo correctamente, **cuando** envío, **entonces** se crea el equipo en juvenil/sénior en estado `creado` y quedo como capitán y primer jugador en `inscrito, pendiente de pago`.
5. **Dado** que soy infantil/cadete y relleno todo correctamente, **cuando** envío, **entonces** se crea el equipo en infantil/cadete en estado `creado`, con el correo y el teléfono indicados como contacto del equipo, **sin guardar** mi fecha de nacimiento.
6. **Dado** que la categoría ya tiene su máximo de equipos (8 infantil/cadete, 6 juvenil/sénior), **cuando** intento crear un equipo, **entonces** veo que no quedan plazas en esa categoría y no se crea.
7. **Dado** que las inscripciones están cerradas, **cuando** abro el formulario, **entonces** veo que el plazo ha terminado y no puedo crear el equipo.
8. **Dado** que el nombre del equipo ya existe, **cuando** envío, **entonces** se me pide otro nombre con el mensaje «Ya hay un equipo con este nombre».
9. **Dado** que el nombre del equipo es ofensivo, **cuando** envío, **entonces** se me pide otro nombre con el mensaje «Este nombre no está permitido por ser ofensivo».
10. **Dado** que, siendo juvenil/sénior, ya estoy inscrito en otro equipo del torneo, **cuando** envío, **entonces** no se crea el equipo y se me indica que ya estoy en uno (RN-15).
11. **Dado** que falta algún campo o el correo no tiene un formato válido, **cuando** intento enviar, **entonces** el formulario no se envía y me marca qué corregir.

**Casos límite**
- Doble clic en «enviar»: no se pueden crear dos equipos iguales.
- Dos capitanes crean a la vez el último equipo disponible de una categoría: solo se crea uno; el otro recibe el mensaje de que no quedan plazas (la comprobación se hace en la base de datos, no solo en el navegador).
- Moderación de nombres: la web filtra automáticamente con una lista de palabras prohibidas; además, un webmaster puede renombrar un equipo si algo se cuela.

---

### HU-02 · Entender cómo funciona la inscripción antes de crear el equipo (P1)

**Como** capitán,
**quiero** que el formulario me explique cómo funciona el proceso,
**para** saber qué pasará después y cómo se apunta mi equipo.

**Prueba independiente:** abrir el formulario y comprobar que la explicación está visible antes de enviar.

**Criterios de aceptación**

1. **Dado** que abro el formulario de crear equipo, **cuando** se carga, **entonces** veo, antes de los campos, una explicación breve que cubre:
   - que quien crea el equipo es el capitán y que la categoría se decide por su año de nacimiento;
   - las dos categorías, sus años de nacimiento y los límites (plazas de equipos y de 5 a 10 o de 5 a 12 jugadores);
   - que **si el capitán es infantil/cadete hay que dar el correo del tutor legal y un teléfono de contacto**, y que su tutor tendrá que inscribirlo después como al resto;
   - que se recibirá por correo un enlace y un código de 6 dígitos para que se apunten los compañeros;
   - que cada jugador (o su tutor, si es infantil/cadete) rellena su propio formulario;
   - que la inscripción cuesta 10 € por jugador y que solo es válida cuando Montca confirma el pago;
   - que las inscripciones cierran el 20/12.
2. **Dado** que estoy en el móvil, **cuando** leo la explicación, **entonces** se lee sin hacer zoom ni desplazarse en horizontal.

---

### HU-03 · Recibir el enlace y el código del equipo por correo (P1)

**Como** capitán (o su tutor, en infantil/cadete),
**quiero** recibir por correo el enlace y el código del equipo,
**para** pasárselos a los compañeros.

**Depende de:** HU-01.

**Prueba independiente:** crear un equipo y comprobar que llega un correo con un enlace y un código de 6 dígitos que llevan al formulario de ese equipo.

**Criterios de aceptación**

1. **Dado** que acabo de crear un equipo, **cuando** se guarda, **entonces** se envía un correo (al capitán en juvenil/sénior; al tutor en infantil/cadete) con: nombre del equipo, categoría, enlace de invitación, código del equipo, enlace de gestión (HU-15) e instrucciones para compartirlos.
2. **Dado** que el equipo es infantil/cadete, **cuando** llega el correo, **entonces** incluye un aviso de que el capitán aún no está inscrito y un enlace directo para que el tutor lo inscriba (HU-07).
3. **Dado** que se genera el código, **cuando** lo veo, **entonces** es un **número de exactamente 6 dígitos** (puede empezar por 0 y se guarda como texto).
4. **Dado** que se genera el código, **cuando** se compara con el de los demás equipos, **entonces** es distinto de todos; si al generarlo al azar coincide con uno existente, se genera otro.
5. **Dado** que se generan varios equipos seguidos, **cuando** comparo sus códigos, **entonces** no son consecutivos ni predecibles (se generan al azar).
6. **Dado** que el enlace de invitación es único, **cuando** alguien lo abre, **entonces** no se puede deducir a partir de él el enlace de otro equipo.
7. **Dado** que la pantalla de confirmación de HU-01 se muestra, **cuando** la veo, **entonces** también aparecen el enlace y el código, por si el correo tarda o va a spam.
8. **Dado** que el correo falla al enviarse, **cuando** ocurre, **entonces** el equipo sigue creado y el error queda registrado para que un webmaster pueda reenviarlo.

---

### HU-17 · Ver el estado del equipo según sus jugadores (P1)

**Como** organización (y como capitán),
**quiero** que cada equipo tenga un estado que se actualice solo,
**para** saber de un vistazo qué equipos llegan al mínimo y cuáles ya no admiten más jugadores.

**Depende de:** HU-01.

**Prueba independiente:** ir inscribiendo jugadores en un equipo juvenil/sénior y comprobar que pasa de `creado` a `inscrito` con el 5.º jugador y a `completo` con el 12.º.

**Criterios de aceptación**

1. **Dado** un equipo recién creado, **cuando** tiene menos de 5 jugadores en `inscrito, pendiente de pago` o `pagado`, **entonces** su estado es `creado`.
2. **Dado** un equipo en `creado`, **cuando** se inscribe su 5.º jugador, **entonces** pasa automáticamente a `inscrito`.
3. **Dado** un equipo en `inscrito`, **cuando** llega a 10 jugadores (infantil/cadete) o 12 (juvenil/sénior), **entonces** pasa a `completo` y deja de admitir jugadores (HU-04, HU-05).
4. **Dado** un equipo, **cuando** solo cambia el pago de sus jugadores (pendiente ↔ pagado), **entonces** su estado no cambia.
5. **Dado** que los menores en `pendiente de verificación` no cuentan, **cuando** un tutor envía el formulario pero aún no verifica, **entonces** el estado del equipo no cambia.
6. **Dado** que un webmaster saca a un jugador de un equipo `completo` o `inscrito`, **cuando** se guarda, **entonces** el estado baja al que corresponda (por ejemplo, de `completo` a `inscrito`, o de `inscrito` a `creado`).
7. **Dado** que se cierran las inscripciones, **cuando** un webmaster revisa los equipos, **entonces** ve destacados los que siguen en `creado`; qué hacer con ellos lo decide Montca a mano (puede borrarlos desde el panel).

---

## 4. Épica E2 — Acceso a un equipo

### HU-04 · Unirme a un equipo con el enlace (P1)

**Como** jugador (o tutor de un jugador),
**quiero** abrir el enlace que me ha pasado el capitán,
**para** ir directamente al formulario que me toca.

**Depende de:** HU-03.

**Prueba independiente:** abrir el enlace de un equipo de cada categoría y comprobar que lleva al formulario correcto con el nombre del equipo visible.

**Criterios de aceptación**

1. **Dado** un enlace de un equipo **juvenil/sénior**, **cuando** lo abro, **entonces** llego al formulario juvenil/sénior (HU-06) y veo el nombre del equipo.
2. **Dado** un enlace de un equipo **infantil/cadete**, **cuando** lo abro, **entonces** llego al formulario para tutores (HU-07) y veo el nombre del equipo.
3. **Dado** un enlace inválido o de un equipo que no existe, **cuando** lo abro, **entonces** veo un mensaje claro y la opción de introducir un código.
4. **Dado** que las inscripciones están cerradas, **cuando** abro el enlace, **entonces** veo que el plazo ha terminado y no puedo rellenar el formulario.
5. **Dado** que el equipo está en estado `completo` (HU-17), **cuando** abro el enlace, **entonces** veo que el equipo está completo y no puedo rellenar el formulario.

---

### HU-05 · Unirme a un equipo con el código (P1)

**Como** jugador (o tutor de un jugador),
**quiero** introducir el código de 6 dígitos del equipo,
**para** apuntarme aunque no tenga el enlace.

**Prueba independiente:** introducir el código de un equipo en la página del torneo y llegar al formulario de su categoría.

**Criterios de aceptación**

1. **Dado** que estoy en la página de inscripción del torneo, **cuando** busco la opción «Tengo un código de equipo», **entonces** veo un campo que solo acepta números (teclado numérico en el móvil).
2. **Dado** un código válido, **cuando** lo envío, **entonces** llego al formulario de la categoría del equipo con su nombre visible (mismo destino y mismas comprobaciones que HU-04).
3. **Dado** un código escrito con espacios (por ejemplo «123 456»), **cuando** lo envío, **entonces** se aceptan igualmente los 6 dígitos.
4. **Dado** un código que no tiene 6 dígitos, **cuando** intento enviarlo, **entonces** se me indica que el código tiene 6 números.
5. **Dado** un código que no existe, **cuando** lo envío, **entonces** veo «Código no válido».
6. **Dado** que alguien prueba muchos códigos seguidos, **cuando** supera el límite de intentos (por ejemplo, 10 en 10 minutos), **entonces** se le frena temporalmente. Con códigos de solo 6 cifras este límite es imprescindible para que no se puedan adivinar.

---

### HU-05b · Comprobar la categoría y que el jugador no esté en otro equipo (P1)

**Como** organización,
**quiero** que la web compruebe la fecha de nacimiento y que cada jugador esté en un solo equipo,
**para** que no se mezclen edades ni haya jugadores duplicados.

**Prueba independiente:** intentar inscribir a un nacido en 2009 en un equipo infantil/cadete, y a un jugador ya inscrito en otro equipo, y comprobar que ambos se rechazan.

**Criterios de aceptación**

1. **Dado** un equipo infantil/cadete, **cuando** el tutor introduce un menor nacido fuera de 2011–2014, **entonces** el formulario no se envía y explica qué años admite la categoría.
2. **Dado** un equipo juvenil/sénior, **cuando** un jugador introduce un año 2011 o posterior, **entonces** el formulario no se envía y le indica que su categoría es infantil/cadete (o que no tiene categoría si es de 2015 o posterior).
3. **Dado** que el jugador ya está en otro equipo del torneo (RN-15), **cuando** se envía el formulario, **entonces** se rechaza con el mensaje «Este jugador ya está inscrito en otro equipo del torneo».
4. **Dado** que alguien manipula la petición desde el navegador, **cuando** llega al servidor, **entonces** todas estas comprobaciones se repiten en Supabase y se rechaza igual.

---

## 5. Épica E3 — Inscripción juvenil/sénior

### HU-06 · Inscribirme en un equipo juvenil/sénior (P1)

**Como** jugador juvenil/sénior,
**quiero** rellenar mis datos y aceptar las condiciones,
**para** quedar inscrito en mi equipo.

**Depende de:** HU-04 o HU-05.

**Prueba independiente:** entrar con el enlace de un equipo juvenil/sénior, enviar el formulario y comprobar que el jugador aparece en el equipo como `inscrito, pendiente de pago` y recibe el correo de pago.

**Datos que se piden**

| Campo | Obligatorio |
|---|---|
| Nombre y apellidos | Sí |
| Fecha de nacimiento | Sí |
| Correo electrónico | Sí |
| Teléfono de contacto | Sí |
| Contacto de emergencia (nombre y teléfono) | No |

**Casillas**

| Casilla | Obligatoria |
|---|---|
| Aceptación de las normas y condiciones del torneo | Sí |
| Declaración de aptitud para participar | Sí |
| Información de protección de datos / política de privacidad | Sí |
| Derechos de imagen | No |
| Información sobre futuras actividades | No |

> No se piden datos de salud a los jugadores juvenil/sénior.

**Criterios de aceptación**

1. **Dado** que relleno todos los campos obligatorios y marco las casillas obligatorias, **cuando** envío, **entonces** quedo añadido al equipo en `inscrito, pendiente de pago` y veo una confirmación.
2. **Dado** que no marco alguna casilla obligatoria, **cuando** intento enviar, **entonces** el formulario no se envía y me señala cuál falta.
3. **Dado** que dejo sin marcar las casillas de imagen y futuras actividades, **cuando** envío, **entonces** la inscripción se completa igual y se guarda que no las acepté.
4. **Dado** que me inscribo, **cuando** se guarda, **entonces** recibo un correo con la información del pago (HU-11).
5. **Dado** que el equipo se llena mientras relleno el formulario, **cuando** envío, **entonces** no se me inscribe y se me explica que el equipo ha alcanzado el máximo de 12 jugadores.

---

## 6. Épica E4 — Inscripción infantil/cadete (tutor legal)

### HU-07 · Inscribir a mi hijo/a o tutelado/a en un equipo (P1)

**Como** padre, madre o tutor legal,
**quiero** rellenar mis datos, los del menor y las autorizaciones,
**para** que pueda jugar en el equipo de sus amigos.

**Depende de:** HU-04 o HU-05.

**Por qué esta prioridad:** es la parte con más riesgo legal. En España, el tratamiento de datos de menores de 14 años basado en consentimiento solo es lícito si consta el del titular de la patria potestad o tutela (art. 7 LOPDGDD), y el RGPD pide «esfuerzos razonables» para verificarlo (art. 8.2 RGPD). En esta categoría hay jugadores de 12 y 13 años.

**Prueba independiente:** rellenar el formulario como tutor y comprobar que se envía un código al correo del tutor y que el menor **todavía no** aparece inscrito.

**Datos del tutor legal (obligatorios):** nombre y apellidos, DNI, fecha de nacimiento, correo electrónico, teléfono de contacto y relación con el menor (padre / madre / tutor legal).

**Datos del menor (obligatorios):** nombre y apellidos, fecha de nacimiento.

**Contactos de emergencia:** el teléfono del tutor es el contacto de emergencia por defecto. Se puede añadir un **segundo contacto opcional** (nombre, teléfono y relación con el menor).

**Criterios de aceptación**

1. **Dado** que abro el formulario de un equipo infantil/cadete, **cuando** se carga, **entonces** veo un aviso claro de que debe rellenarlo el padre, la madre o el tutor legal, no el menor.
2. **Dado** que introduzco un DNI/NIE, **cuando** envío, **entonces** se valida su formato y letra de control antes de aceptarlo.
3. **Dado** que mi fecha de nacimiento indica que soy menor de 18 años, **cuando** envío, **entonces** el formulario no se acepta (el tutor debe ser mayor de edad).
4. **Dado** que no añado un segundo contacto de emergencia, **cuando** envío, **entonces** se acepta y el contacto de emergencia es mi teléfono.
5. **Dado** que relleno todos los datos y marco todas las casillas obligatorias (HU-08), **cuando** envío, **entonces** la inscripción queda en `pendiente de verificación` y se me lleva a la pantalla del código (HU-09).
6. **Dado** que falta algún dato o casilla obligatoria, **cuando** intento enviar, **entonces** no se envía y se me indica qué falta.

---

### HU-08 · Dar las autorizaciones del menor (P1)

**Como** tutor legal,
**quiero** leer y marcar cada autorización por separado,
**para** saber exactamente qué estoy aceptando y poder rechazar las opcionales.

**Depende de:** HU-07 (es parte del mismo formulario, pero se separa porque concentra la lógica legal).

**Prueba independiente:** comprobar que cada casilla muestra su texto literal, que las obligatorias bloquean el envío y que las opcionales no.

**Casillas** (textos literales en el Anexo A)

| # | Casilla | Obligatoria |
|---|---|---|
| A1 | Declaración de representación legal | Sí |
| A2 | Autorización de participación | Sí |
| A3 | Protección de datos | Sí |
| A4 | Consentimiento específico de datos de salud | **Solo si** se rellena algún campo de salud |
| A5 | Emergencias médicas | Sí |
| A6 | Derechos de imagen | No |
| A7 | Información sobre futuras actividades | No |

**Campos de salud del menor (todos opcionales):** alergias, lesiones actuales, enfermedad o circunstancia relevante para la práctica deportiva, medicación de emergencia y otras observaciones.

**Criterios de aceptación**

1. **Dado** que veo el formulario, **cuando** reviso las casillas, **entonces** cada una tiene su propio checkbox (no hay un «acepto todo») y **ninguna viene marcada** de serie.
2. **Dado** que no relleno ningún campo de salud, **cuando** envío, **entonces** no se me exige la casilla A4 y no se guarda ningún dato de salud.
3. **Dado** que relleno al menos un campo de salud, **cuando** intento enviar sin marcar A4, **entonces** el formulario no se envía y me explica que hace falta mi consentimiento expreso para tratar esos datos (los datos de salud son categoría especial, art. 9 RGPD).
4. **Dado** que no marco A6 ni A7, **cuando** envío, **entonces** la inscripción sigue adelante y se guarda que no las acepté.
5. **Dado** que la casilla A3 enlaza a la política de privacidad, **cuando** hago clic, **entonces** se abre en una pestaña nueva sin perder lo que he rellenado.

---

### HU-09 · Verificar mi correo con un código para completar la inscripción (P1)

**Como** tutor legal,
**quiero** introducir el código que me llega al correo,
**para** demostrar que soy yo quien autoriza y completar la inscripción del menor.

**Depende de:** HU-07, HU-08.

**Prueba independiente:** enviar el formulario de tutor, leer el código del correo, introducirlo y comprobar que el menor pasa a `inscrito, pendiente de pago`. Repetir con un código erróneo y comprobar que no se inscribe.

**Criterios de aceptación**

1. **Dado** que he enviado el formulario, **cuando** se guarda, **entonces** se envía automáticamente un código de verificación al correo del tutor y veo una pantalla para introducirlo.
2. **Dado** que introduzco el código correcto dentro de su plazo de validez, **cuando** lo envío, **entonces** el menor queda inscrito en el equipo (`inscrito, pendiente de pago`) y se guarda el registro de evidencias (HU-10).
3. **Dado** que introduzco un código incorrecto, **cuando** lo envío, **entonces** veo un error, el menor **no** queda inscrito y puedo volver a intentarlo.
4. **Dado** que fallo el código 5 veces, **cuando** lo intento otra vez, **entonces** ese código queda anulado y tengo que pedir uno nuevo.
5. **Dado** que el código tiene más de 30 minutos, **cuando** lo introduzco, **entonces** se rechaza por caducado y puedo pedir otro.
6. **Dado** que no me ha llegado el correo, **cuando** pulso «Reenviar código» (como mucho una vez por minuto), **entonces** recibo uno nuevo y el anterior deja de valer.
7. **Dado** que cierro la página sin verificar, **cuando** vuelvo desde el enlace del correo, **entonces** puedo pedir un código nuevo e introducirlo sin rellenar todo otra vez.
8. **Dado** que han pasado **24 horas** sin verificar, **cuando** se cumple ese plazo, **entonces** se envía al tutor un **correo recordatorio** con un enlace para completar la verificación y el aviso de que la inscripción se borrará a las 48 horas.
9. **Dado** que han pasado **48 horas** sin verificar, **cuando** se cumple ese plazo, **entonces** la inscripción se borra junto con todos sus datos (no se guardan datos de menores sin autorización).
10. **Dado** que el equipo ha llegado a 10 jugadores mientras la inscripción estaba pendiente, **cuando** introduzco el código correcto, **entonces** el menor no se inscribe, se me explica que el equipo está completo y se borran los datos.
11. **Dado** que las inscripciones han cerrado mientras la inscripción estaba pendiente, **cuando** introduzco el código correcto dentro de las 48 h, **entonces** la inscripción se completa igualmente.

> El código se guarda cifrado con *hash*, nunca en texto plano. El recordatorio y el borrado se hacen con una tarea programada (por ejemplo, `pg_cron` en Supabase o una función programada de Netlify).

---

### HU-10 · Guardar la prueba de la autorización del tutor (P1)

**Como** Montca Actiu,
**quiero** que la web guarde automáticamente un registro completo de cada autorización,
**para** poder demostrar, si alguien lo pide, quién autorizó qué y cuándo (principio de responsabilidad proactiva, art. 5.2 RGPD).

**Depende de:** HU-09.

**Prueba independiente:** completar una inscripción de menor y comprobar en la base de datos que existe un registro con todos los campos de la lista.

**El registro guarda:**
- nombre del tutor;
- correo electrónico verificado;
- fecha y hora de la autorización (con zona horaria);
- datos del menor al que se refiere;
- **texto exacto** de cada autorización aceptada;
- versión de la política de privacidad;
- qué casillas obligatorias y opcionales se marcaron (y cuáles no);
- registro de la verificación del código (cuándo se envió, cuándo se verificó, número de intentos).

**Criterios de aceptación**

1. **Dado** que un tutor verifica el código, **cuando** se completa la inscripción, **entonces** se crea un registro con todos los campos de la lista anterior.
2. **Dado** que Montca cambia después el texto de una autorización o la política de privacidad, **cuando** consulto un registro antiguo, **entonces** sigue mostrando el texto y la versión que se aceptaron en su momento.
3. **Dado** que el registro ya existe, **cuando** alguien intenta modificarlo, **entonces** no se puede: solo se pueden añadir registros, no editarlos ni borrarlos desde la web.
4. **Dado** que alguien sin permisos de webmaster consulta la base de datos con la clave pública, **cuando** pide estos registros, **entonces** no obtiene nada (Row Level Security en Supabase).

---

## 7. Épica E5 — Pagos y administración

### HU-11 · Recibir la información de pago por correo (P1)

**Como** jugador juvenil/sénior o tutor legal,
**quiero** recibir por correo cuánto y cómo tengo que pagar,
**para** completar la inscripción.

**Depende de:** HU-06 (adultos) o HU-09 (menores).

**Prueba independiente:** completar una inscripción de cada tipo y comprobar que llega el correo con los datos de pago correctos.

**Criterios de aceptación**

1. **Dado** que un jugador juvenil/sénior envía su formulario (incluido el capitán en HU-01), **cuando** se guarda, **entonces** recibe el correo de pago.
2. **Dado** que un tutor verifica el código, **cuando** se completa la inscripción del menor, **entonces** el tutor recibe el correo de pago (y **no** antes de verificar).
3. **Dado** el correo de pago, **cuando** lo leo, **entonces** incluye:
   - importe: **10 €**;
   - método: **transferencia bancaria**;
   - IBAN de la asociación;
   - concepto exacto, ya rellenado con los datos reales: **«Nombre equipo - Nombre jugador»** (por ejemplo, «Los Rayos - Marta García»);
   - aviso de que la plaza solo es válida cuando Montca confirma el pago, y de que se recibirá un correo cuando eso ocurra.
4. **Dado** el correo de pago (y cualquier otra página o correo de la web), **cuando** lo leo, **entonces** **no** aparece ninguna fecha límite de pago. El control de pagos antes del torneo lo hace Montca directamente.
5. **Dado** que el IBAN puede cambiar y el repositorio es público, **cuando** se configura la web, **entonces** el IBAN y el importe se leen de la configuración (variables de entorno o tabla de configuración del torneo), no están escritos en el código.

---

### HU-12 · Marcar a un jugador como pagado (P1)

**Como** webmaster de Montca,
**quiero** marcar la casilla de pagado de cada jugador cuando recibo su transferencia,
**para** saber quién puede jugar.

**Prueba independiente:** iniciar sesión como webmaster, marcar un jugador como pagado y comprobar que cambia su estado.

**Criterios de aceptación**

1. **Dado** que no he iniciado sesión como webmaster, **cuando** intento entrar al panel, **entonces** no puedo ver ni modificar inscripciones.
2. **Dado** que soy webmaster, **cuando** entro al panel, **entonces** veo los equipos de cada categoría (con las plazas usadas, por ejemplo «5/8 equipos»), el estado de cada equipo (`creado`, `inscrito`, `completo`) y, en cada uno, sus jugadores con su estado y el número de jugadores frente al mínimo y el máximo. Puedo filtrar los equipos por estado.
3. **Dado** un jugador `inscrito, pendiente de pago`, **cuando** marco la casilla de pagado, **entonces** pasa a `pagado` y se guarda qué webmaster lo marcó y cuándo.
4. **Dado** que me he equivocado de jugador, **cuando** desmarco la casilla, **entonces** vuelve a `inscrito, pendiente de pago` y queda registrado el cambio.
5. **Dado** un jugador en `pendiente de verificación`, **cuando** lo veo en el panel, **entonces** no puedo marcarlo como pagado.
6. **Dado** que busco una transferencia por su concepto, **cuando** escribo el nombre del jugador o del equipo, **entonces** el panel lo filtra.
7. **Dado** que quiero avisar a quien no ha pagado, **cuando** filtro por `inscrito, pendiente de pago`, **entonces** veo la lista con el teléfono y el correo de contacto de cada uno (del jugador en juvenil/sénior; del tutor en infantil/cadete).
8. **Dado** que un nombre de equipo resulta ofensivo, **cuando** lo edito desde el panel, **entonces** se cambia y se guarda quién lo cambió.

---

### HU-13 · Confirmar la inscripción al tutor con justificante (P2)

**Como** tutor legal,
**quiero** recibir la confirmación cuando se registra mi pago, con un justificante de lo que autoricé,
**para** tener constancia de que el menor está inscrito y de lo que firmé.

**Depende de:** HU-10, HU-12.

**Prueba independiente:** marcar como pagado a un menor y comprobar que el tutor recibe el correo con el justificante.

**Criterios de aceptación**

1. **Dado** que un webmaster marca como pagado a un jugador infantil/cadete, **cuando** se guarda, **entonces** se envía al tutor un correo de confirmación de inscripción.
2. **Dado** ese correo, **cuando** lo abro, **entonces** contiene un justificante con: datos del menor, equipo, fecha y hora de la autorización, correo verificado, autorizaciones aceptadas y rechazadas con su texto, y versión de la política de privacidad (los datos del registro de HU-10).
3. **Dado** que el webmaster desmarca y vuelve a marcar el pago, **cuando** ocurre, **entonces** no se envía un segundo correo de confirmación.

---

### HU-14 · Confirmar la inscripción al jugador juvenil/sénior (P2)

**Como** jugador juvenil/sénior,
**quiero** recibir un correo cuando Montca confirme mi pago,
**para** saber que ya puedo jugar.

**Depende de:** HU-12.

**Prueba independiente:** marcar como pagado a un jugador juvenil/sénior y comprobar que recibe el correo.

**Criterios de aceptación**

1. **Dado** que un webmaster me marca como pagado, **cuando** se guarda, **entonces** recibo un correo de confirmación con mi equipo, mi categoría y los datos del torneo.
2. **Dado** el correo, **cuando** lo leo, **entonces** incluye un resumen de lo que acepté (normas, aptitud, protección de datos y las opcionales que marqué).
3. **Dado** que el webmaster desmarca y vuelve a marcar el pago, **cuando** ocurre, **entonces** no se envía un segundo correo.

---

### HU-15 · Ver el estado de mi equipo como capitán (P3)

**Como** capitán (o su tutor, en infantil/cadete),
**quiero** ver quién se ha apuntado a mi equipo y quién ha pagado,
**para** saber si llegamos al mínimo y avisar a quien falte.

**Depende de:** HU-03.

**Por qué esta prioridad:** el equipo puede inscribirse sin ella, pero ahorra a Montca muchas preguntas del tipo «¿se ha apuntado ya X?» y ayuda a que los equipos lleguen al mínimo de 5 antes del cierre.

**Prueba independiente:** abrir el enlace de gestión de un equipo con jugadores en distintos estados y comprobar que se ven correctamente, sin datos de contacto ni de salud.

**Acceso:** sin crear cuenta. En el correo de HU-03 se envía un **enlace de gestión privado**, distinto del enlace de invitación, que solo recibe el capitán (o su tutor).

**Criterios de aceptación**

1. **Dado** que abro el enlace de gestión, **cuando** se carga, **entonces** veo el nombre del equipo, la categoría, el código y el enlace de invitación (con un botón para copiarlos) y la fecha de cierre de inscripciones.
2. **Dado** el panel, **cuando** lo miro, **entonces** veo la lista de jugadores con su nombre y su estado: `pendiente de verificación`, `inscrito, pendiente de pago` o `pagado`.
3. **Dado** que el equipo está en `creado`, **cuando** abro el panel, **entonces** veo el estado y un aviso del tipo «Os faltan 2 jugadores para llegar al mínimo de 5».
4. **Dado** que el equipo está en `inscrito` o `completo`, **cuando** abro el panel, **entonces** veo el estado y cuántas plazas de jugador quedan (o que está completo).
5. **Dado** el panel, **cuando** lo miro, **entonces** **no** veo correos, teléfonos, fechas de nacimiento, DNI ni datos de salud de nadie.
6. **Dado** el panel, **cuando** lo uso, **entonces** no puedo marcar pagos, borrar jugadores ni cambiar el nombre del equipo (eso lo hace un webmaster).
7. **Dado** que alguien abre el enlace de **invitación**, **cuando** se carga, **entonces** no puede llegar desde él al panel de gestión.
8. **Dado** que he perdido el correo, **cuando** introduzco en la web el código del equipo y el correo con el que se creó, **entonces** se me reenvía el enlace de gestión a ese correo (y solo a ese).

---

### HU-16 · Abrir y cerrar las inscripciones (P2)

**Como** webmaster de Montca,
**quiero** que las inscripciones se cierren solas el 20/12 y poder abrirlas o cerrarlas a mano,
**para** controlar el plazo si hay algún imprevisto.

**Prueba independiente:** cerrar las inscripciones desde el panel y comprobar que no se pueden crear equipos ni inscribir jugadores; volver a abrirlas y comprobar que sí.

**Criterios de aceptación**

1. **Dado** que son más de las 23:59 del 20/12/2026 (hora de Madrid), **cuando** alguien intenta crear un equipo o inscribirse, **entonces** ve que el plazo ha terminado.
2. **Dado** que soy webmaster, **cuando** pulso «Cerrar inscripciones», **entonces** se cierran inmediatamente aunque no haya llegado la fecha.
3. **Dado** que las inscripciones están cerradas (por fecha o a mano), **cuando** pulso «Abrir inscripciones», **entonces** vuelven a estar abiertas hasta que las cierre de nuevo o hasta la fecha de cierre que indique.
4. **Dado** que se cambia el estado, **cuando** se guarda, **entonces** queda registrado qué webmaster lo hizo y cuándo.
5. **Dado** que las inscripciones están cerradas, **cuando** un webmaster entra al panel, **entonces** puede seguir marcando pagos con normalidad.
6. **Dado** que la página del torneo se muestra, **cuando** la visito, **entonces** veo si las inscripciones están abiertas o cerradas y la fecha de cierre.

---

### HU-19 · Ver las plazas libres por categoría en la página del torneo (P2)

**Como** visitante de la web (jugador, padre o madre),
**quiero** ver cuántas plazas de equipo quedan en cada categoría,
**para** saber si todavía puedo apuntar un equipo antes de empezar.

**Depende de:** HU-01, HU-16, HU-17.

**Por qué esta prioridad:** sustituye a la lista pública de equipos, que se ha suprimido (D-4). Anima a inscribirse sin mostrar ningún dato personal.

**Prueba independiente:** crear equipos en una categoría y comprobar que el contador de la página del torneo cambia sin volver a desplegar la web.

**Criterios de aceptación**

1. **Dado** que visito la página del torneo, **cuando** se carga, **entonces** veo, para cada categoría, cuántos equipos hay sobre el máximo (por ejemplo, «Infantil/cadete: 5 de 8 equipos» y «Juvenil/sénior: 2 de 6 equipos»).
2. **Dado** que una categoría ha llegado a su máximo, **cuando** veo su contador, **entonces** aparece como «Completo» y el botón de crear equipo de esa categoría no está disponible.
3. **Dado** que cuentan todos los equipos que ocupan plaza (RN-19), **cuando** se crea un equipo en estado `creado`, **entonces** el contador ya lo incluye.
4. **Dado** que las inscripciones están abiertas o cerradas (HU-16), **cuando** veo la sección, **entonces** también veo ese estado y la fecha de cierre.
5. **Dado** que la sección es pública, **cuando** la veo, **entonces** no aparece ningún nombre de equipo ni de jugador, ni ningún otro dato de la inscripción: solo los números por categoría.
6. **Dado** que se crea o se borra un equipo, **cuando** recargo la página, **entonces** el contador está actualizado sin volver a desplegar la web. Los datos salen de una consulta pública que solo devuelve los recuentos por categoría.
7. **Dado** que no se pueden cargar los datos, **cuando** abro la página, **entonces** veo un mensaje neutro («No se han podido cargar las plazas») en vez de un número incorrecto.
8. **Dado** que uso un lector de pantalla o no distingo colores, **cuando** leo los contadores, **entonces** el estado se entiende por el texto, no solo por el color.

---

### HU-18 · Borrar los datos del torneo cuando termina su plazo (P2)

**Como** webmaster de Montca,
**quiero** que la web me avise y me deje borrar los datos de cada tipo cuando acaba su plazo de conservación,
**para** cumplir lo que dice la política de privacidad sin tener que hacerlo a mano en Supabase.

**Depende de:** HU-10, HU-12.

**Prueba independiente:** simular que ha pasado la fecha de borrado de las inscripciones y comprobar que el panel avisa, que el botón borra jugadores, tutores, datos de salud y pagos del torneo, y que los registros de autorización siguen ahí.

**Criterios de aceptación**

1. **Dado** que llega una fecha de borrado de la sección 8.4, **cuando** ocurre, **entonces** los webmasters reciben un correo recordándolo, y el panel muestra un aviso con un botón «Borrar» para ese tipo de datos.
2. **Dado** que estamos a partir del **03/04/2027**, **cuando** un webmaster pulsa «Borrar datos de inscripción», **entonces** se borran equipos, jugadores, tutores, contactos de emergencia, datos de salud, pagos y la lista de quién no puede salir en fotos del torneo, pero **no** los registros de autorización del tutor (HU-10), ni los consentimientos de imagen vigentes (se conservan mientras no se retiren, T5), ni la lista de futuras actividades.
3. **Dado** que estamos a partir del **03/01/2028**, **cuando** un webmaster pulsa «Borrar registros de autorización», **entonces** se borran los registros de HU-10 del torneo, incluidos los de verificación del código, y el registro de administración del torneo (abrir/cerrar inscripciones, renombrar equipos y borrados anteriores), menos la propia anotación de este borrado.
4. **Dado** que todavía no ha llegado la fecha, **cuando** un webmaster mira el panel, **entonces** el botón no está disponible.
5. **Dado** que se pulsa un botón de borrado, **cuando** se va a ejecutar, **entonces** se pide confirmar escribiendo el nombre del torneo, y queda registrado qué webmaster lo hizo y cuándo (sin guardar los datos borrados).
6. **Dado** el correo recordatorio, **cuando** lo leo, **entonces** también recuerda borrar cualquier exportación que se haya hecho fuera de la web (hojas de cálculo, listas para la aseguradora…).

---

## 8. Datos y correos (para el `plan.md`)

### 8.1 Entidades principales

| Entidad | Campos clave |
|---|---|
| **Torneo** | nombre, fechas, fecha de cierre (20/12/2026 23:59), inscripciones abiertas sí/no, importe (10 €), IBAN, máx. equipos por categoría (8 / 6), mín./máx. jugadores por categoría (5–10 / 5–12) |
| **Equipo** | nombre, nombre normalizado (para detectar repetidos), categoría, estado (`creado` / `inscrito` / `completo`), código de 6 dígitos (único), token de invitación, token de gestión, correo y teléfono de contacto, fecha de creación |
| **Jugador** | equipo, nombre y apellidos, fecha de nacimiento, correo y teléfono (solo juvenil/sénior), contacto de emergencia, es capitán, estado |
| **Tutor** | nombre y apellidos, DNI, fecha de nacimiento, correo, teléfono, relación con el menor, segundo contacto de emergencia (opcional) |
| **Datos de salud** | jugador, alergias, lesiones, enfermedad/circunstancia, medicación de emergencia, observaciones (tabla separada con acceso muy restringido) |
| **Consentimiento** | jugador, tipo de casilla, aceptada sí/no, texto exacto, versión de la política de privacidad, fecha y hora |
| **Verificación** | inscripción, hash del código, enviado el, caduca el, intentos, recordatorio enviado el, verificado el |
| **Pago** | jugador, pagado sí/no, marcado por, marcado el, historial de cambios |
| **Registro de administración** | acción (abrir/cerrar inscripciones, renombrar equipo, marcar pago), webmaster, fecha y hora |

### 8.2 Correos transaccionales

| # | Correo | Destinatario | Se envía cuando |
|---|---|---|---|
| C1 | Equipo creado (enlace, código de 6 dígitos y enlace de gestión) | Capitán (juvenil/sénior) o tutor (infantil/cadete) | Se crea el equipo (HU-03) |
| C2 | Código de verificación | Tutor | Se envía el formulario de menor o se pide un código nuevo (HU-09) |
| C3 | Recordatorio de verificación | Tutor | Pasan 24 h sin verificar (HU-09) |
| C4 | Información de pago | Jugador juvenil/sénior | Se envía su formulario (HU-11) |
| C5 | Información de pago | Tutor | Se verifica el código (HU-11) |
| C6 | Confirmación + justificante | Tutor | Un webmaster marca pagado (HU-13) |
| C7 | Confirmación de inscripción | Jugador juvenil/sénior | Un webmaster marca pagado (HU-14) |
| C8 | Reenvío del enlace de gestión | Capitán o tutor | Lo pide desde la web (HU-15) |

### 8.3 Requisitos no funcionales

- **Móvil primero:** la mayoría de inscripciones se harán desde el móvil.
- **Seguridad:** RLS activado en todas las tablas; el público solo puede insertar inscripciones a través de funciones controladas, nunca leerlas. Los datos de salud y el DNI solo los ven los webmasters.
- **Límites en la base de datos:** las plazas de equipos (RN-13), los jugadores por equipo (RN-14) y el jugador único (RN-15) se comprueban en Supabase dentro de una transacción, para que dos personas a la vez no puedan pasarse del límite.
- **Minimización:** no pedir más datos de los listados; la fecha de nacimiento del capitán infantil/cadete no se guarda; los datos de salud solo se guardan si se rellenan.
- **Configuración fuera del código:** IBAN, importe, fechas y límites se guardan en la configuración del torneo o en variables de entorno, no en el repositorio público.
- **Tareas programadas:** recordatorio a las 24 h, borrado a las 48 h y cierre automático el 20/12.
- **Correo:** servicio de envío transaccional con dominio propio verificado (SPF/DKIM) para que los códigos no acaben en spam.
- **Webmasters:** Supabase Auth con correo y contraseña; las cuentas las crea a mano el equipo (no hay registro público). Se recomienda activar la verificación en dos pasos, como dice la política de privacidad.

### 8.4 Conservación de datos

Plazos tomados del registro de tratamientos (`docs/legal/tratamientos.md`) y de la política de privacidad, revisados con Montca. Las fechas parten del último día del torneo que figura en ese registro (03/01/2027); si cambia la fecha del torneo, cambian todas.

| Datos | Tratamiento del registro | Se conservan hasta | Cómo se borran |
|---|---|---|---|
| Inscripciones de menores sin verificar | — (nuevo, HU-09) | 48 h desde el envío | Automáticamente |
| Equipos, jugadores juvenil/sénior y su estado de pago | T2 | **03/04/2027** (tres meses después del torneo) | Botón del panel (HU-18) + borrar exportaciones |
| Jugadores infantil/cadete, datos del tutor, contactos de emergencia y su estado de pago | T3 | **03/04/2027** | Igual que T2 |
| Datos de salud del menor | T3 (hay que añadirlos al registro) | **03/04/2027**, como T3 | Con T3 |
| Registro de la autorización del tutor y verificación del código (HU-10) | T4 | **03/01/2028** (un año después del torneo). Se guarda aparte de T3 para no borrarse con ella | Botón del panel (HU-18) |
| Consentimiento de imagen | T5 | Mientras no se retire. La lista de quién no puede salir en fotos se borra con T2/T3 (03/04/2027) | Al retirarlo, no se publican más imágenes y se retiran las ya publicadas |
| Futuras actividades | T6 | Hasta que la persona se dé de baja (cada correo lleva cómo hacerlo). Se guarda aparte de T2/T3 | Al darse de baja |
| Usuarios webmaster | T8 | Mientras tengan acceso a la gestión | Se borra su usuario en Supabase |
| Registro de administración (abrir/cerrar inscripciones, renombrar, borrados) | T8 | 03/01/2028, cuando acaba el último plazo del torneo | Botón del panel (HU-18), con los registros de autorización |
| Control de intentos del código de equipo (HU-05) | Seguridad | Como máximo 24 h, guardando la IP cifrada con hash | Automáticamente |

---

## 9. Preguntas abiertas

### 9.1 Resueltas (28/11/2026)

| ID | Tema | Decisión | Dónde se aplica |
|---|---|---|---|
| P-01 | Años juvenil/sénior | Nacidos en **2010 o antes**. | RN-03 |
| P-02 | Capitán menor de edad | En infantil/cadete, el formulario de crear equipo pide el correo del tutor legal, un teléfono de contacto y la fecha de nacimiento del capitán, que solo sirve para comprobar la categoría. | HU-01, HU-02, HU-03 |
| P-03 | Límites | Infantil/cadete: máx. 8 equipos, de 5 a 10 jugadores. Juvenil/sénior: máx. 6 equipos, de 5 a 12 jugadores. Cuentan los jugadores en `inscrito, pendiente de pago` o `pagado`. | RN-13, RN-14 |
| P-04 | Un jugador en varios equipos | No: un jugador solo puede estar en un equipo por torneo. | RN-15, HU-05b |
| P-05 | Nombres de equipo | No se aceptan repetidos ni ofensivos; se pide otro nombre explicando el motivo. | RN-18, HU-01 |
| P-06 | Plazo de inscripción | Hasta el **20/12**. Un webmaster puede abrir o cerrar a mano. Los administradores contactan con quien no haya pagado. | RN-16, HU-12, HU-16 |
| P-07 | Contacto de emergencia del menor | Teléfono del tutor por defecto + segundo contacto opcional. | HU-07 |
| P-08 | Privacidad en juvenil/sénior | Se añade la casilla obligatoria de protección de datos. No se piden datos de salud a adultos. | HU-06 |
| P-09 | Inscripciones sin verificar | Recordatorio a las **24 h** y borrado a las **48 h**. | HU-09 |
| P-10 | Pago | **10 € por jugador**, por transferencia, concepto «Nombre equipo - Nombre jugador». | RN-17, HU-11 |
| P-11 | Confirmación a adultos | Se incluye HU-14. | HU-14 |
| P-12 | Panel del capitán | Se desarrolla HU-15. | HU-15 |
| — | Código del equipo | Numérico de 6 dígitos, distinto para cada equipo. | RN-07, HU-03, HU-05 |
| P-13 | Conservación de datos | Los plazos del registro de tratamientos ya revisado con Montca. | RN-20, 8.4, HU-18 |
| P-14 | Jugadores de 16–17 años | Se inscriben sin tutor en juvenil/sénior. | HU-06 |
| P-15 | Inicio de sesión del webmaster | Supabase Auth con correo, cuentas creadas a mano. | 8.3, HU-12 |
| P-16 | Equipos que no llegan al mínimo | Tres estados de equipo: `creado`, `inscrito` (llega al mínimo) y `completo`. | RN-19, HU-17 |
| P-17 | Plazo de pago | Antes de que empiece el torneo, pero **no aparece en ningún sitio**; Montca controla los pagos. | HU-11 |
| P-18 | Verificación tras el cierre | Se acepta si está dentro de las 48 h y el equipo no está completo. | HU-09 |

| P-19 | Conservación de los datos de salud | Se borran con T3, hasta el 03/04/2027. Hay que añadirlos al registro y a la política de privacidad. | 8.4, HU-18 |
| P-20 | Diferencias con `docs/legal/` | **Mandan estas historias.** Los documentos legales se actualizan para coincidir con ellas. | Sección 11 |

### 9.2 Pendientes

No queda ninguna pregunta abierta.

> Nota: este documento no sustituye a un asesoramiento legal. Conviene que alguien con conocimientos de protección de datos revise la política de privacidad antes de abrir las inscripciones.

---

## 10. Trazabilidad (aclaraciones → historias)

| Punto de las aclaraciones | Historia(s) |
|---|---|
| El capitán registra el equipo con sus datos básicos | HU-01 |
| La categoría se decide por la fecha de nacimiento del capitán | HU-01, RN-01–RN-05 |
| Capitán infantil/cadete: correo del tutor, teléfono y fecha solo para la categoría | HU-01, HU-02 |
| Enlace + código por correo; dos formas de entrar | HU-03, HU-04, HU-05 |
| Código numérico de 6 dígitos | HU-03, HU-05 |
| Explicar el funcionamiento en el formulario | HU-02 |
| Límites de equipos y jugadores | RN-13, RN-14, HU-01, HU-04, HU-06, HU-09 |
| Un jugador en un solo equipo | RN-15, HU-05b |
| Moderación de nombres | RN-18, HU-01, HU-12 |
| Formulario juvenil/sénior | HU-06 |
| Formulario infantil/cadete lo rellena el tutor | HU-07 |
| Casillas del tutor y datos de salud | HU-08 |
| Código de verificación, recordatorio y borrado | HU-09 |
| Datos que hay que guardar de la verificación | HU-10 |
| Correo de pago (10 €, transferencia, concepto) | HU-11 |
| Marcar pagado y contactar con quien no paga | HU-12 |
| Confirmación con justificante (tutor) | HU-13 |
| Confirmación (juvenil/sénior) | HU-14 |
| Panel del capitán | HU-15 |
| Cierre el 20/12 y apertura/cierre manual | HU-16 |
| Estados del equipo (creado, inscrito, completo) | RN-19, HU-17 |
| Conservación y borrado de datos | RN-20, 8.4, HU-18 |
| Plazas libres por categoría en lugar de la lista pública | HU-19 |

---

## 11. Diferencias con los documentos legales ya redactados

Los documentos de `docs/legal/` (registro de tratamientos, política de privacidad y consentimientos) se escribieron antes de estas aclaraciones. **Decisión (28/11/2026): mandan estas historias**, y los documentos legales se actualizan para coincidir con la columna de la derecha.

| # | Tema | Documentos legales | Estas historias (aclaraciones de Montca) |
|---|---|---|---|
| D-1 | **DNI de los jugadores** | Obligatorio para **todos** los jugadores, porque la aseguradora lo exige para darles de alta | No se pide DNI a ningún jugador; solo al tutor. Montca confirma que el seguro no lo necesita: le bastan los datos de los formularios |
| D-2 | **Teléfono** | Solo del administrador del equipo y de los tutores | También de cada jugador juvenil/sénior |
| D-3 | **Dorsal** | Obligatorio (1–99, único por equipo) y público | No aparece |
| D-4 | **Lista pública de equipos** | Se publican los equipos confirmados (adultos: nombre y primer apellido; menores: solo nombre) hasta una semana después del torneo | Se suprime. Públicamente solo se muestran las plazas libres por categoría, sin datos personales (HU-19) |
| D-5 | **Capitán menor** | Da él mismo su correo y su teléfono, y recibe el enlace del equipo | Se dan el correo del tutor y un teléfono de contacto; el enlace lo recibe el tutor |
| D-6 | **Autorización del tutor** | Casilla en la web, firma digital o papel entregado en Softco | Solo en la web, con código de verificación por correo |
| D-7 | **Derechos de imagen** | Solo Instagram y TikTok, sin nombrar ni etiquetar al menor | Texto nuevo: «en la web y en los perfiles oficiales de la asociación» |
| D-8 | **Textos de las casillas** | Versiones con identificador (por ejemplo, `imagen-menor-v1`) | Textos literales del Anexo A, distintos |
| D-9 | **Datos de salud** | No se tratan | Se piden (opcionales) con consentimiento explícito (A4) |

---

## Anexo A — Textos literales de las autorizaciones (infantil/cadete)

Estos textos se muestran tal cual junto a cada casilla y se guardan literalmente en el registro de HU-10. Cualquier cambio debe crear una nueva versión.

- **A1 · Declaración de representación legal (obligatoria):**
  «Declaro que soy el padre, la madre o el tutor legal del menor cuyos datos facilito y que estoy autorizado/a para realizar esta inscripción. Confirmo que los datos proporcionados son correctos».
- **A2 · Autorización de participación (obligatoria):**
  «Autorizo al menor a participar en el torneo organizado por la Associació Juvenil i Esportiva Montca Actiu y manifiesto que conozco y acepto sus normas, condiciones de participación y medidas de seguridad».
- **A3 · Protección de datos (obligatoria):**
  «He leído la información sobre protección de datos y la política de privacidad de Montca Actiu».
- **A4 · Datos de salud (obligatoria solo si se rellenan datos de salud):**
  «Autorizo expresamente el tratamiento de los datos de salud que facilito sobre el menor, exclusivamente para valorar y atender las necesidades de seguridad y asistencia durante el torneo, conforme a la información de privacidad».
- **A5 · Emergencias médicas (obligatoria):**
  «Autorizo a Montca Actiu a contactar con los servicios de emergencia cuando resulte necesario, facilitar a los profesionales sanitarios la información relevante disponible y avisar a los contactos de emergencia indicados».
- **A6 · Derechos de imagen (opcional):**
  «Como tutor legal, y respetando la opinión del menor, autorizo a Montca Actiu a realizar y publicar fotografías y vídeos en los que aparezca durante el torneo, en la web y en los perfiles oficiales de la asociación».
- **A7 · Futuras actividades (opcional):**
  «Quiero recibir por correo electrónico información sobre futuras actividades y eventos organizados por Montca Actiu».

**Juvenil/sénior:** los textos de las cinco casillas (normas y condiciones, aptitud, protección de datos, derechos de imagen y futuras actividades) están en `docs/legal/consentimientos.md`, aprobados por Montca el 28/11/2026.
