# Borrador · Textos de las casillas y autorización del tutor

Borrador de A-18 en castellano, para la revisión legal de Montca. Cuando esté revisado se traduce al valenciano y se pasa a `src/content` en B-08. Sale de [tratamientos.md](tratamientos.md) (T4, T5, T6 y T9) y de las [historias de usuario de las inscripciones](../historias-usuario-inscripciones.md) v3.1 (HU-06, HU-08 y Anexo A), y completa la [política de privacidad](privacidad.md) y la [información de cada formulario](capas-formularios.md). Adaptado el 2026-11-28.

Notas para quien lo revise (no forman parte de los textos):

- Cada texto tiene un **identificador de versión**. La web guarda qué versión aceptó cada persona (T4, T5, T6, T9). Si un texto cambia después de publicarse, se crea una versión nueva y la anterior no se borra de este archivo.
- **Los textos `-v1` anteriores a esta actualización quedan sustituidos** por los `-v2` (`autorizacion-tutor-v1`, `imagen-menor-v1`, `info-actividades-tutor-v1`, `imagen-adulto-v1` e `info-actividades-v1`) y no se usan. Ya no existe la autorización en papel.
- Los textos de las casillas de menores (A1 a A7) son **los literales del Anexo A de las historias de usuario**, sin cambiar ni una palabra. Cualquier cambio crea una versión nueva.
- Los textos de las casillas del formulario juvenil/sénior (apartado 1) están **aprobados por Montca (28/11/2026)**. Se redactaron a partir de los de menores, adaptados a un adulto que se inscribe a sí mismo. Las casillas de imagen y de futuras actividades no repiten que el permiso se puede retirar: eso se dice en el recuadro informativo del formulario ([capas-formularios.md](capas-formularios.md)) y en la [política de privacidad](privacidad.md).
- En todos los formularios, **ninguna casilla viene marcada** y no hay una casilla de "aceptar todo".
- Los huecos entre llaves se rellenan con los datos de cada evento. Así los textos sirven para el siguiente evento sin cambiarlos. Para el torneo de Navidad:
  - `{evento}`: Torneo de Navidad de Montca Sports
  - `{fechas}`: los días 27 de diciembre de 2026 y 3 de enero de 2027
  - `{lugar}`: el Poliesportiu Municipal de Cocentaina
- **Imagen de menores de 14 a 17 años.** La LO 1/1982 dice que el menor con madurez suficiente presta él mismo el consentimiento sobre su imagen. El texto A6 dice que el tutor da el permiso "respetando la opinión del menor". Hay que confirmar en la revisión legal que esto es suficiente (ver [tratamientos.md](tratamientos.md), pendientes).
- El enlace a las normas (`/ruta-de-las-normas`) se cambia por la ruta real de la página del torneo cuando exista (C-04).
- Las casillas opcionales llevan debajo el aviso "Opcional". No marcarlas no impide inscribirse.
- La casilla "He leído la política de privacidad" de cada formulario ([capas-formularios.md](capas-formularios.md)) deja constancia de que se ha informado y **no es un consentimiento**.

---

## 1. Formulario juvenil/sénior · aprobado por Montca (28/11/2026)

Lo rellena el propio jugador. No se piden datos de salud.

| Casilla | Identificador | Obligatoria |
| --- | --- | --- |
| Normas y condiciones del torneo | `normas-adulto-v1` | Sí |
| Declaración de aptitud para participar | `aptitud-adulto-v1` | Sí |
| Protección de datos | `proteccion-datos-adulto-v1` | Sí |
| Derechos de imagen | `imagen-adulto-v2` | No |
| Información sobre futuras actividades | `info-actividades-v2` | No |

### Normas y condiciones del torneo · `normas-adulto-v1` · obligatoria

- [ ] Conozco y acepto las [normas y condiciones de participación del {evento}](/ruta-de-las-normas) y sus medidas de seguridad. El torneo se celebra {fechas} en {lugar}.

> Obligatoria. Sin marcarla no puede inscribirse.

### Declaración de aptitud · `aptitud-adulto-v1` · obligatoria

- [ ] Declaro que estoy en condiciones de participar en el {evento} y que los datos que facilito son correctos.

> Obligatoria. Sin marcarla no puede inscribirse.

### Protección de datos · `proteccion-datos-adulto-v1` · obligatoria

- [ ] He leído la información sobre protección de datos y la [política de privacidad](/privacidad) de Montca Actiu.

> Obligatoria. Sin marcarla no puede inscribirse.

### Derechos de imagen · `imagen-adulto-v2` · opcional

- [ ] Autorizo a Montca Actiu a realizar y publicar fotografías y vídeos en los que yo aparezca durante el {evento}, en la web y en los perfiles oficiales de la asociación.

> Opcional. Puede inscribirse igualmente sin marcar esta casilla.

### Información sobre futuras actividades · `info-actividades-v2` · opcional

- [ ] Quiero recibir por correo electrónico información sobre futuras actividades y eventos organizados por Montca Actiu.

> Opcional. Puede inscribirse igualmente sin marcar esta casilla.

---

## 2. Formulario infantil/cadete (tutor)

Lo rellena el padre, la madre o el tutor legal del menor. Los textos son los literales del Anexo A de las historias de usuario.

| # | Casilla | Identificador | Obligatoria |
| --- | --- | --- | --- |
| A1 | Declaración de representación legal | `representacion-tutor-v2` | Sí |
| A2 | Autorización de participación | `participacion-menor-v2` | Sí |
| A3 | Protección de datos | `proteccion-datos-menor-v2` | Sí |
| A4 | Consentimiento específico de datos de salud | `salud-menor-v2` | **Solo si** se rellena algún campo de salud |
| A5 | Emergencias médicas | `emergencias-menor-v2` | Sí |
| A6 | Derechos de imagen | `imagen-menor-v2` | No |
| A7 | Información sobre futuras actividades | `info-actividades-tutor-v2` | No |

Los campos de salud del menor (alergias, lesiones actuales, enfermedad o circunstancia relevante para la práctica deportiva, medicación de emergencia y otras observaciones) son todos opcionales. Si no se rellena ninguno, no se exige A4 y no se guarda ningún dato de salud.

### A1 · Declaración de representación legal · `representacion-tutor-v2` · obligatoria

- [ ] Declaro que soy el padre, la madre o el tutor legal del menor cuyos datos facilito y que estoy autorizado/a para realizar esta inscripción. Confirmo que los datos proporcionados son correctos.

> Obligatoria. Sin esta declaración el menor no queda inscrito.

### A2 · Autorización de participación · `participacion-menor-v2` · obligatoria

- [ ] Autorizo al menor a participar en el torneo organizado por la Associació Juvenil i Esportiva Montca Actiu y manifiesto que conozco y acepto sus normas, condiciones de participación y medidas de seguridad.

> Obligatoria. Sin esta autorización el menor no queda inscrito.

### A3 · Protección de datos · `proteccion-datos-menor-v2` · obligatoria

- [ ] He leído la información sobre protección de datos y la política de privacidad de Montca Actiu.

> Obligatoria. Debe enlazar a la [política de privacidad](/privacidad), que se abre en una pestaña nueva sin perder lo rellenado.

### A4 · Datos de salud · `salud-menor-v2` · obligatoria solo si se rellenan datos de salud

- [ ] Autorizo expresamente el tratamiento de los datos de salud que facilito sobre el menor, exclusivamente para valorar y atender las necesidades de seguridad y asistencia durante el torneo, conforme a la información de privacidad.

> Obligatoria solo si rellena algún dato de salud. Si no rellena ninguno, no se guarda ningún dato de salud.

### A5 · Emergencias médicas · `emergencias-menor-v2` · obligatoria

- [ ] Autorizo a Montca Actiu a contactar con los servicios de emergencia cuando resulte necesario, facilitar a los profesionales sanitarios la información relevante disponible y avisar a los contactos de emergencia indicados.

> Obligatoria. Sin esta autorización el menor no queda inscrito.

### A6 · Derechos de imagen · `imagen-menor-v2` · opcional

- [ ] Como tutor legal, y respetando la opinión del menor, autorizo a Montca Actiu a realizar y publicar fotografías y vídeos en los que aparezca durante el torneo, en la web y en los perfiles oficiales de la asociación.

> Opcional. El menor puede inscribirse igualmente sin marcar esta casilla.

### A7 · Información sobre futuras actividades · `info-actividades-tutor-v2` · opcional

- [ ] Quiero recibir por correo electrónico información sobre futuras actividades y eventos organizados por Montca Actiu.

> Opcional. El menor puede inscribirse igualmente sin marcar esta casilla.
