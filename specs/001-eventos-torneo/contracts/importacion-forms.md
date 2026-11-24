# Contrato · Importación del Google Forms de Montca (Saúl, con A-14)

> **Pendiente de decidir por Saúl en A-30 (issue #70).** La forma de importar no está cerrada. Lo que sí está cerrado son las **restricciones** y las **reglas** de abajo, que valen para cualquiera de las dos opciones.

## Restricciones (`docs/legal/tratamientos.md`, §5)

- **Ningún dato de la hoja pasa por un ordenador personal**: las exportaciones se guardan en el Drive de Montca, nunca en dispositivos personales.
- **La clave de servicio de Supabase solo está en las variables de entorno de Netlify**: nunca en el repositorio, en el navegador ni en un ordenador.
- **Nada de la hoja entra en el repositorio**, ni siquiera de forma temporal (FR-034).
- Ningún registro (*log*) guarda datos personales.

## Opciones

### (a) Apps Script + Netlify Function · **recomendada**

Ningún dato pasa por un ordenador personal y no hay que cambiar el registro de tratamientos.

1. Un **Apps Script vinculado a la hoja de respuestas**, en la cuenta de Google de Montca, lee las filas y las envía por HTTPS a una **Netlify Function** de importación. Se lanza a mano desde un menú de la hoja ("Importar a la web" / "Simular").
2. La petición lleva un **secreto compartido**: en las propiedades del script (Apps Script) y en una variable de entorno de Netlify. Nunca en el código ni en el repo.
3. La Function comprueba el secreto, aplica las reglas de abajo y escribe en Supabase con la clave de servicio que **ya está en Netlify**.
4. La Function devuelve el informe y el Apps Script lo muestra en la hoja. El informe sigue la regla 10.
5. En modo **simular**, la Function no escribe nada y solo devuelve el informe. Es lo primero que se ejecuta siempre.

Notas:
- Las Functions están en EE. UU. y ya figuran en `tratamientos.md` §4 (Netlify, Marco de Privacidad UE-EE. UU.).
- Si la Function necesita configuración en `netlify.toml`, la hace Saúl (es su zona).

### (b) Importación puntual desde un ordenador

Solo si Saúl **cambia antes el registro de tratamientos** en A-30 para permitirlo: exportación temporal en un dispositivo y uso local de la clave de servicio. El contrato concreto de esta opción (dónde se guarda el archivo, cuándo se borra, cómo se protege la clave) se escribe entonces. Hasta que eso pase, esta opción no se puede usar.

## Reglas (para cualquier opción)

1. **Nada de la hoja va al repositorio** (FR-034).
2. **Una fila = un jugador** (clarify, provisional hasta que Montca confirme su Forms, A-26).
3. **Categoría**: la que diga la respuesta. Si no la pregunta, se deduce del año de nacimiento con los rangos del YAML del evento.
4. **Equipo**: se busca por `(evento, categoria, nombre_normalizado)`. Normalizar es pasar a minúsculas, quitar tildes, recortar los espacios de los extremos y unificar los del medio. Si no existe, se crea con `estado = pendiente` y `origen = forms`.
5. **Nombres parecidos sin ser iguales** (por ejemplo, "els tigres" y "tigres"): **no** se unen. Salen en el informe para que decidan Montca o Saúl, que corrigen la hoja o la base de datos y vuelven a importar.
6. **Capitán**: quien lo marque en el Forms; si nadie lo marca, la primera respuesta (la de "Marca temporal" más antigua) del equipo.
7. **Dorsal**: opcional. Si el Forms lo trae, se guarda solo si es un entero del 1 al 99 y no está repetido en el equipo; si no, se guarda vacío y sale en el informe.
8. **Autorización** de los menores: se crea una fila en `autorizaciones` (aparte de `jugadores`, T4) con los datos del menor y del tutor, `forma = firma_digital` o `forma = papel` (papel entregado en Softco), según lo que indique la respuesta o Montca, y `recibida = false`. Pasa a `true` cuando Montca confirma que la ha recibido (C-06; mientras tanto, a mano en Supabase).
9. **Repetible**: un jugador ya importado se reconoce por su **DNI** dentro del evento (`jugadores.dni`, que ya está en T2 y T3). Si se vuelve a importar, se actualizan las filas existentes, no se duplican, y nunca se cambia el `estado` de un equipo. Si el mismo DNI aparece en dos respuestas con equipos distintos, no se elige solo: sale en el informe.
10. **Informe**, sin datos personales completos (solo el nombre público, como en la web):
    - equipos nuevos y jugadores nuevos o actualizados;
    - nombres de equipo parecidos;
    - jugadores fuera del año de su categoría;
    - el mismo jugador en dos respuestas;
    - equipos por debajo del mínimo o por encima del máximo de jugadores.

## Pendiente de Montca (A-26)

Columnas exactas del Forms: si hay pregunta de capitán y de dorsal, cómo viene la categoría y cómo se indica la autorización. Las columnas se leen por un mapa de nombres al principio del código, para ajustarlo sin tocar la lógica.
