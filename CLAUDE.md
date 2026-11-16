# CLAUDE.md — Forma de trabajar

Estas instrucciones se aplican a cualquier proyecto de programación de este repositorio (Java, web u otros), trabajado con Git/GitHub de forma individual o en pareja.

Orden de prioridad cuando haya conflicto: 1) lo que el usuario pida en la conversación, 2) la constitución (`.specify/memory/constitution.md`), 3) las convenciones que ya existan en el proyecto, 4) este archivo.

---

## Flujo de trabajo de este proyecto

- **Tipo de tarea:** `docs/tareas.md` dice si una tarea es tipo B o tipo C.
- **Tareas pequeñas (tipo B):** issue, rama y PR, sin spec.
- **Features con lógica, datos o varios estados (tipo C):** el flujo acordado en `docs/decisiones.md`: `/speckit-specify` → `/speckit-clarify` → `/impeccable shape` (si hay interfaz) → `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` → PR de la spec revisado por el otro → issues por zonas → `/speckit-implement` por issue → `/impeccable audit` → PR. Los comandos de Spec Kit van con guion, no con punto.
- **Todo lo visual** pasa por la skill Impeccable y respeta `PRODUCT.md` y `DESIGN.md`.
- **Zonas:** cada uno trabaja en su zona según `docs/decisiones.md`. Pablo: componentes, layouts, estilos y `DESIGN.md`. Saúl: contenido, i18n, formularios y `netlify.toml`. Compartido: `pages`, `CLAUDE.md` y `docs`. Se avisa antes de tocar la zona del otro o lo compartido.

---

## 1. Forma de pensar ante un problema

**Entiende antes de escribir.**

- Lee la petición entera y reformúlala en una frase: "Se pide X para conseguir Y". Si no puedes escribir esa frase, todavía no has entendido la tarea.
- Si existe un enunciado, una especificación o una rúbrica, trátalo como la fuente de verdad y repásalo punto por punto. No des por hecho que el resumen del usuario lo incluye todo.
- Lee el código existente antes de añadir nada. Ejemplo: si tienes que crear `ClienteRepositorio`, abre primero `ProductoRepositorio` y sigue su misma forma (nombres, manejo de errores, estilo).

**Hazte siempre estas preguntas:**

1. ¿Qué entra y qué sale exactamente? (tipos, formato, unidades)
2. ¿Qué pasa en los casos límite? (vacío, `null`, cero, negativo, duplicado, texto muy largo)
3. ¿Qué hay ya hecho que pueda reutilizar?
4. ¿Cuál es el cambio más pequeño que resuelve esto?
5. ¿Cómo voy a comprobar que funciona?
6. ¿Qué puede romperse en otras partes al tocar esto?

**Detecta ambigüedades.** Sospecha cuando veas:

- Palabras vagas: "mejora", "arregla", "que quede bien", "optimiza".
- Datos que faltan: formato de fecha, longitud máxima, qué hacer si el dato ya existe.
- Dos interpretaciones razonables. Ejemplo: "ordena los clientes" (¿por nombre, por fecha de alta, ascendente o descendente?).
- Contradicción entre lo que se pide y lo que hace el código actual.

**Pregunta o asume según el coste de equivocarte:**

| Situación | Qué hacer |
|---|---|
| Error caro o irreversible: borrar datos, cambiar el esquema de la base de datos, mover o renombrar muchos archivos, elegir tecnología, reescribir historial de Git | **Pregunta antes de actuar.** |
| Error barato de corregir: un nombre de variable, el texto de un mensaje, el orden de un menú | **Asume la opción más razonable y dilo.** |

- Cuando preguntes, haz una pregunta concreta con opciones y una propuesta por defecto. Bien: "¿Guardo los datos en fichero o en MySQL? Si no me dices nada uso fichero, porque el proyecto no tiene base de datos". Mal: "¿Cómo quieres que lo haga?".
- Cuando asumas, déjalo escrito en la respuesta: "He asumido que el DNI es único. Si puede repetirse, hay que cambiar `ClienteServicio.alta()`".

**No amplíes el alcance.** Si te piden corregir un error, corrige ese error. Si ves otra cosa mejorable, apúntala al final como sugerencia; no la cambies por tu cuenta.

**Usa lo que el proyecto ya usa.** Si el código está hecho con bucles `for` y `ArrayList`, no introduzcas streams, genéricos avanzados o una librería nueva sin necesidad. Si algo nuevo es realmente la mejor opción, explícalo en dos líneas antes de usarlo.

---

## 2. Planificación

- Escribe un plan numerado antes de programar si la tarea tiene más de tres pasos o toca más de dos archivos. Si es grande, enséñalo antes de empezar.
- Divide en pasos que dejen el proyecto **compilando y funcionando** al terminar cada uno. Cada paso debe poder probarse y guardarse en un commit.
- Compila y ejecuta después de cada paso. No acumules 200 líneas sin haberlas ejecutado nunca.

**Orden por defecto y motivo:**

1. **Comprueba el punto de partida**: que compila y que las pruebas existentes pasan. Así sabes que lo que falle después es tuyo.
2. **Modelo de datos**: clases, tablas, estructuras. Todo lo demás depende de esto y es lo más caro de cambiar tarde.
3. **Lógica** (servicios, cálculos, reglas): se puede probar sin interfaz.
4. **Persistencia** (ficheros, base de datos).
5. **Interfaz** (consola, ventanas, HTML): va al final porque solo muestra lo que la lógica ya hace.
6. **Validaciones y errores**.
7. **Pruebas, limpieza y documentación**.

**Dos reglas que modifican ese orden:**

- **Primero un camino completo y simple.** En un CRUD, haz "alta + listar" funcionando de punta a punta antes de añadir modificar, borrar y validaciones. Un programa pequeño que funciona es mejor base que cinco capas a medias.
- **Lo más incierto, primero.** Si no sabes si la conexión a la base de datos o una librería funcionan, pruébalo con un ejemplo mínimo de diez líneas antes de construir encima.

**Ejemplo de plan** para "añadir búsqueda de productos por nombre":

```
1. Añadir buscarPorNombre(String) en ProductoRepositorio      → probar con un main temporal o un test
2. Añadir buscarPorNombre en ProductoServicio (validar vacío) → test: texto vacío, sin resultados, varios resultados
3. Añadir la opción "Buscar" en el menú                       → probar a mano
4. Revisar el diff, quitar código temporal, commit
```

Si a mitad del trabajo el plan cambia, dilo: "El paso 2 no sirve porque…; lo sustituyo por…".

---

## 3. Estructura de proyectos

**Principios:**

- **Respeta la estructura existente.** No reorganices carpetas de un proyecto en marcha sin que te lo pidan.
- **Una responsabilidad por clase o archivo.** Si para describir una clase necesitas la palabra "y" ("lee el fichero *y* calcula el total *y* lo imprime"), divídela.
- **Dependencias en un solo sentido:** vista → controlador → servicio → repositorio → modelo. El modelo no conoce a nadie.
- **Cada cosa en su capa.** Nada de `System.out.println` ni `Scanner` en modelo o servicio. Nada de SQL en la vista. Nada de lógica de negocio en el HTML.
- **Configuración fuera del código** (`config.properties`, `.env`) y **contraseñas fuera del repositorio**.
- **No fuerces capas en proyectos pequeños.** Con menos de cinco clases, bastan `modelo` y una clase principal. Añade capas cuando aparezca la necesidad.

**Proyecto Java (Maven):**

```
mi-proyecto/
├── pom.xml
├── README.md                         # qué es, cómo se compila y cómo se ejecuta
├── .gitignore
├── docs/                             # diagramas, enunciado, capturas
└── src/
    ├── main/
    │   ├── java/com/ejemplo/miproyecto/
    │   │   ├── App.java              # punto de entrada: solo crea objetos y arranca
    │   │   ├── modelo/               # clases de datos, sin entrada/salida
    │   │   │   └── Cliente.java
    │   │   ├── repositorio/          # acceso a datos: ficheros o base de datos
    │   │   │   ├── ClienteRepositorio.java        # interfaz
    │   │   │   └── ClienteRepositorioJdbc.java    # implementación
    │   │   ├── servicio/             # reglas de negocio y validaciones
    │   │   │   └── ClienteServicio.java
    │   │   ├── controlador/          # recibe la acción del usuario y llama al servicio
    │   │   │   └── ClienteControlador.java
    │   │   ├── vista/                # consola o ventanas: pedir y mostrar datos
    │   │   │   └── MenuConsola.java
    │   │   ├── excepcion/            # excepciones propias
    │   │   │   └── ClienteNoEncontradoException.java
    │   │   └── util/                 # funciones generales usadas en varios sitios
    │   │       └── Validador.java
    │   └── resources/
    │       └── config.properties
    └── test/java/com/ejemplo/miproyecto/
        └── servicio/
            └── ClienteServicioTest.java   # misma ruta de paquete que la clase probada
```

**Proyecto web (HTML, CSS y JavaScript):**

```
mi-web/
├── index.html
├── README.md
├── .gitignore
├── paginas/                  # resto de páginas
│   └── contacto.html
├── css/
│   ├── base.css              # variables, reset, tipografía
│   ├── layout.css            # cabecera, pie, rejillas
│   └── componentes.css       # botones, tarjetas, formularios
├── js/
│   ├── main.js               # arranque: conecta eventos con funciones
│   ├── api.js                # llamadas fetch al servidor
│   ├── ui.js                 # crear y actualizar elementos del DOM
│   └── utilidades.js         # formatear fechas, validar campos
├── assets/
│   ├── img/
│   └── fuentes/
└── docs/
```

Si la web tiene servidor propio, sepáralo en dos carpetas en la raíz, `cliente/` y `servidor/`, y dentro de `servidor/` repite las capas: `rutas/`, `controladores/`, `servicios/`, `modelos/`.

**Reglas de archivos y carpetas:**

- Nombres de carpetas en minúsculas, sin espacios ni tildes (`paginas`, no `Páginas Web`).
- Un solo idioma para nombres en todo el proyecto. No mezcles `servicio/` con `utils/`.
- `util` no es un cajón de sastre: si una función solo la usa una clase, vive en esa clase.
- Crea `.gitignore` en el primer commit. Como mínimo: `target/`, `bin/`, `*.class`, `.idea/`, `.vscode/`, `node_modules/`, `.env`.
- El `README.md` debe permitir a otra persona ejecutar el proyecto desde cero con los comandos exactos.

---

## 4. Estilo de código

**Nombres:**

| Elemento | Regla | Ejemplo |
|---|---|---|
| Clase (Java) | Sustantivo en `PascalCase` | `Pedido`, `ClienteServicio` |
| Método / función | Verbo en `camelCase` | `calcularTotal()`, `buscarPorDni()` |
| Variable | Sustantivo en `camelCase` que diga qué contiene | `diasHastaEntrega`, no `d` ni `aux` |
| Booleano | Empieza por `es`, `tiene`, `puede` | `esValido`, `tieneStock` |
| Constante | `MAYUSCULAS_CON_GUIONES` | `MAX_INTENTOS` |
| Paquete (Java) | Minúsculas, una palabra | `modelo`, `servicio` |
| Clase CSS | `kebab-case` | `.tarjeta-producto` |
| Tabla y columna SQL | `snake_case` | `linea_pedido`, `fecha_alta` |

- No uses tildes ni `ñ` en identificadores: `anio`, no `año`.
- No abrevies: `cantidad`, no `cant`. `i` y `j` solo en bucles cortos.
- No mezcles idiomas en un mismo proyecto: `getNombre()` junto a `setName()` está mal.

**Funciones y métodos:**

- Cada función hace una sola cosa. Si supera unas 25–30 líneas o tres niveles de sangría, divídela.
- Máximo tres o cuatro parámetros. Si necesitas más, agrúpalos en un objeto.
- Comprueba los casos inválidos al principio y sal pronto, en vez de anidar `if`:

```java
public Cliente buscarPorDni(String dni) {
    if (dni == null || dni.isBlank()) {
        throw new IllegalArgumentException("El DNI no puede estar vacío");
    }
    Cliente cliente = repositorio.buscarPorDni(dni);
    if (cliente == null) {
        throw new ClienteNoEncontradoException(dni);
    }
    return cliente;
}
```

- Sin números mágicos: `if (edad >= EDAD_MINIMA)`, no `if (edad >= 18)`.
- Sin duplicados: la tercera vez que copies un bloque, extráelo a un método.
- Usa siempre llaves en `if`, `for` y `while`, aunque sea una sola línea.
- Sigue el formato del proyecto (sangría, posición de llaves). No reformatees archivos enteros.

**Comentarios:**

- Explica el **porqué**, no el qué.
  - Mal: `// suma 1 a i`
  - Bien: `// El fichero empieza con una línea de cabecera; la saltamos`
- Documenta los métodos públicos de servicios y repositorios: qué hacen, qué devuelven y qué excepciones lanzan.
- No dejes código comentado "por si acaso": Git ya guarda las versiones anteriores.
- Un `TODO` lleva siempre el motivo: `// TODO: validar la letra del DNI (falta el algoritmo)`.

**Manejo de errores:**

- Nunca dejes un `catch` vacío ni uno que solo imprima y siga como si nada.
- Captura la excepción concreta (`FileNotFoundException`), no `Exception`.
- Los mensajes dicen qué ha pasado y qué hacer. Bien: "No existe el fichero clientes.csv. Comprueba la ruta en config.properties". Mal: "Error".
- Cierra los recursos con `try-with-resources` (ficheros, conexiones, `Scanner` sobre fichero).
- No uses excepciones para el flujo normal. Para saber si una lista está vacía, usa `isEmpty()`.
- En JavaScript: comprueba `response.ok` después de cada `fetch`, envuelve cada `await` que pueda fallar en `try/catch` y muestra el error al usuario, no solo en la consola.

**Validaciones:**

- Valida en la entrada (lo que escribe el usuario, lo que se lee de un fichero o llega de la red) y confía en los datos una vez dentro.
- Comprueba como mínimo: nulo o vacío, rango, formato y duplicados.
- Valida también en el servicio aunque la vista ya lo haga: la vista puede cambiar.
- En SQL usa siempre `PreparedStatement` con parámetros. Nunca construyas consultas concatenando texto del usuario.

---

## 5. Calidad y verificación

**"Funciona" significa que lo has ejecutado y lo has visto funcionar.** Si no has podido ejecutarlo, dilo así: "No lo he podido ejecutar; falta probar X".

**Orden de comprobación:**

1. Compila sin errores y sin avisos nuevos.
2. Caso normal: el uso típico da el resultado esperado.
3. Casos límite (tabla de abajo).
4. Casos de error: el programa avisa con un mensaje claro y no se cierra con una traza.
5. Lo que ya funcionaba sigue funcionando: ejecuta las pruebas existentes y prueba a mano las funciones vecinas a lo que has tocado.

**Casos que debes probar siempre que apliquen:**

| Tipo de dato | Prueba con |
|---|---|
| Texto | vacío, solo espacios, muy largo, con `ñ`, tildes y comillas |
| Número | 0, negativo, el valor justo del límite y los de al lado (17, 18, 19), letras en vez de número |
| Colección | vacía, con un elemento, con duplicados |
| Fichero | inexistente, vacío, con una línea mal formada |
| Base de datos | sin conexión, tabla vacía, clave repetida |
| Formulario web | campos vacíos, formato incorrecto, doble clic en "Enviar" |

**Pruebas automáticas (JUnit u otro framework del proyecto):**

- Prueba la lógica: servicios, validadores y cálculos. No hace falta probar *getters*.
- Una prueba por comportamiento, con nombre descriptivo: `calcularTotal_conCarritoVacio_devuelveCero`.
- Estructura cada prueba en tres bloques: preparar los datos, ejecutar, comprobar.
- Al corregir un error, escribe primero la prueba que lo reproduce, comprueba que falla y luego arréglalo.
- No modifiques una prueba para que pase. Si la prueba está mal, explica por qué antes de cambiarla.

**Web:**

- Abre la página en el navegador con la consola abierta: cero errores en rojo.
- Prueba en ancho de móvil (unos 375 px) y de escritorio.
- Recorre los formularios solo con el teclado.
- Mira la pestaña de red si hay `fetch`: ninguna petición fallida.

**Base de datos:**

- Después de un `INSERT`, `UPDATE` o `DELETE`, comprueba con un `SELECT` que el dato cambió de verdad.
- Ejecuta el script de creación sobre una base de datos vacía para confirmar que funciona desde cero.

**Revisión propia antes de terminar:**

- Lee el diff completo (`git diff`) como si fuera el código de otra persona.
- Busca restos: `System.out.println` o `console.log` de depuración, código comentado, archivos que no tienen que ver con la tarea.
- Relee la petición o el enunciado punto por punto y marca cada uno como hecho.

---

## 6. Depuración

Sigue estos pasos en orden. No saltes al paso 6 sin pasar por los anteriores.

1. **Lee el error completo.** Tipo de excepción, mensaje y la primera línea de la traza que pertenezca al código del proyecto (no a la librería). Ahí se empieza a mirar.
2. **Reproduce el fallo.** Anota los pasos exactos y los datos que lo provocan. Si no puedes reproducirlo, no lo "arregles" a ciegas.
3. **Acota.** ¿Cuándo funcionó por última vez? Mira `git log` y `git diff`. Si el código es largo, descarta mitades: comprueba si el dato es correcto a mitad del recorrido y repite con la mitad que falla.
4. **Formula una hipótesis que se pueda comprobar.** Ejemplo: "Creo que `lista` llega vacía porque el fichero no se lee. Lo compruebo mostrando su tamaño justo después de leer".
5. **Observa, no adivines.** Usa el depurador con un punto de parada o impresiones temporales con etiqueta (`"[DEBUG] tamaño lista = " + lista.size()`). Comprueba también lo obvio: ¿está guardado el archivo?, ¿se ha recompilado?, ¿es este el archivo o la base de datos que se está usando?
6. **Cambia una sola cosa cada vez.** Si el cambio no arregla nada, deshazlo antes de probar otra cosa.
7. **Arregla la causa, no el síntoma.** Ante un `NullPointerException`, no lo tapes con `if (x != null)`: averigua por qué `x` es nulo y corrígelo ahí.
8. **Verifica** con los mismos pasos del punto 2 y busca si el mismo error existe en código parecido.
9. **Limpia** las impresiones de depuración, añade una prueba que cubra el caso y explica la causa en el mensaje del commit.

**Regla de parada:** tras dos o tres intentos fallidos, detente. Resume qué sabes, qué has descartado y cambia de enfoque o pregunta. No sigas probando variaciones al azar.

**Sospechosos habituales que conviene mirar primero:**

- Java: comparar cadenas con `==` en vez de `equals()`; `nextInt()` seguido de `nextLine()` con `Scanner`; índices que empiezan en 1 o llegan a `length`; variable sin inicializar; modificar una lista mientras se recorre.
- JavaScript: usar el resultado de un `fetch` sin `await`; buscar un elemento del DOM antes de que la página haya cargado; `id` o clase mal escritos; ruta relativa incorrecta.
- SQL: estar conectado a otra base de datos; falta de `commit`; `WHERE` olvidado; comparar con `= NULL` en vez de `IS NULL`.

---

## 7. Git y trabajo en equipo

**Commits:**

- Un commit = un cambio lógico que compila. No mezcles un arreglo con una funcionalidad nueva.
- Formato del mensaje: `tipo: resumen en imperativo` (hasta unos 60 caracteres). Si hace falta, deja una línea en blanco y explica el porqué.
- Tipos: `feat` (funcionalidad), `fix` (corrección), `docs`, `refactor`, `test`, `style` (formato), `chore` (configuración).

```
Bien:  feat: añadir búsqueda de productos por nombre
Bien:  fix: evitar total negativo cuando el descuento supera el precio
Mal:   cambios
Mal:   arreglado todo ya funciona
```

- Antes de cada commit ejecuta `git status` y `git diff`. Añade archivos concretos (`git add src/.../ClienteServicio.java`), no `git add .` sin mirar.
- Nunca subas: contraseñas, `.env`, `target/`, `bin/`, `node_modules/`, configuración personal del IDE ni archivos binarios grandes.
- Usa el mismo idioma en todos los mensajes del repositorio.

**Ramas:**

- `main` siempre compila y funciona.
- Una rama por tarea, con nombre `tipo/descripcion-corta`: `feat/login`, `fix/total-negativo`.
- Ramas cortas: de uno a tres días. Cuanto más vive una rama, más conflictos trae.
- Al trabajar dos personas, integra en `main` mediante *pull request* y que la otra persona lo revise antes de fusionar.

**Evitar conflictos entre dos personas:**

- Haz `git pull` antes de empezar a trabajar y otra vez antes de hacer `push`.
- Repartid las tareas por archivos o módulos distintos. Ejemplo: una persona lleva `servicio/` y `repositorio/` de clientes, la otra los de productos.
- Avisa antes de tocar archivos compartidos: `pom.xml`, el CSS principal, el script de la base de datos, el menú principal.
- Sube cambios pequeños y frecuentes; como mínimo, una vez por sesión de trabajo.
- Usad el mismo formato de código y no reformatees archivos enteros: genera diffs enormes y conflictos en cada línea.
- No renombres ni muevas archivos sin avisar.
- Al resolver un conflicto, lee las dos versiones y entiende qué quería hacer cada una. No aceptes "la mía" sin mirar. Después compila y prueba. Si no entiendes el cambio de la otra persona, pregúntale.
- Nunca hagas `git push --force` sobre `main` ni sobre una rama que use otra persona.

**Si eres una IA trabajando en el repositorio:**

- No hagas `commit` ni `push` si no te lo han pedido.
- Comprueba en qué rama estás (`git status`) antes de modificar nada.
- No ejecutes órdenes destructivas (`git reset --hard`, `git clean -fd`, `git checkout .`, borrar ramas) sin confirmación expresa.
- No toques cambios sin confirmar que no sean de tu tarea: pueden ser trabajo a medias de otra persona.

---

## 8. Comunicación

**Empieza por el resultado.** Orden de toda respuesta final:

1. Qué has hecho y si funciona (una o dos frases).
2. Qué archivos has cambiado y para qué.
3. Cómo probarlo: el comando o los pasos exactos.
4. Suposiciones, dudas, riesgos y lo que queda pendiente.

**Ajusta el detalle al tamaño del cambio.** Un cambio pequeño se explica en dos o tres líneas. Uno grande, con una lista corta por archivo. No cuentes todo lo que has ido probando; cuenta cómo ha quedado.

**Separa lo comprobado de lo supuesto.** Ejemplo: "Probado: alta y listado con datos válidos y con DNI repetido. Sin probar: conexión a la base de datos real".

**Señala los riesgos antes que nada y sin suavizarlos.** Ejemplo: "Atención: este cambio modifica la tabla `cliente`. Los datos que ya existan hay que migrarlos con el script `docs/migracion.sql`".

**Explica lo nuevo.** Si usas algo que el proyecto no usaba (una clase, un patrón, una orden de Git), explícalo en una o dos frases. Quien firma el proyecto tiene que poder explicar y defender cada línea.

**Di lo que no sabes.** No inventes métodos, parámetros ni comportamientos de una librería: consulta la documentación o di "no estoy seguro; hay que comprobarlo".

**Si no estás de acuerdo con lo que se pide,** dilo una vez con el motivo y una alternativa, y después haz lo que el usuario decida.

**Ejemplo de respuesta final:**

```
Añadida la búsqueda de productos por nombre; funciona con coincidencias parciales
y sin distinguir mayúsculas.

Cambios:
- ProductoRepositorio: nuevo método buscarPorNombre(String)
- ProductoServicio: valida que el texto no esté vacío
- MenuConsola: nueva opción 4, "Buscar producto"

Cómo probarlo: ejecutar App, opción 4, escribir "tecl".

Probado: texto vacío, sin resultados, varios resultados.
Suposición: la búsqueda ignora tildes solo si la base de datos lo hace; no lo he cambiado.
```

---

## 9. Lo que NUNCA debes hacer

1. Decir que algo funciona sin haberlo ejecutado.
2. Escribir código sin haber leído antes los archivos relacionados.
3. Inventar métodos, clases, librerías o datos que no existen.
4. Ampliar el alcance: refactorizar, renombrar o "mejorar" lo que no se ha pedido.
5. Borrar o sobrescribir archivos, datos o tablas sin confirmación.
6. Dejar un `catch` vacío o capturar `Exception` para que "no salga el error".
7. Tapar un síntoma (un `if` de más, un `try` alrededor) sin entender la causa.
8. Cambiar o borrar una prueba para que pase.
9. Construir SQL concatenando texto introducido por el usuario.
10. Subir contraseñas, claves o archivos `.env` al repositorio.
11. Hacer `git push --force` o reescribir historial ya compartido.
12. Hacer `commit` o `push` sin que te lo pidan, o directamente a `main` cuando se trabaja en pareja.
13. Usar `git add .` sin revisar antes qué se va a subir.
14. Mezclar varios cambios sin relación en un mismo commit.
15. Reformatear archivos enteros que no has tenido que modificar.
16. Dejar `System.out.println` o `console.log` de depuración, código comentado o archivos temporales.
17. Copiar y pegar un bloque por tercera vez en lugar de extraer un método.
18. Poner lógica de negocio en la vista o entrada/salida en el modelo.
19. Introducir una librería o una técnica avanzada sin necesidad y sin explicarla.
20. Ocultar una duda, una suposición o una parte sin terminar.
21. Seguir probando cambios al azar después de tres intentos fallidos en vez de parar y replantear.

---

## 10. Checklist final

Repasa esta lista antes de dar cualquier tarea por terminada:

- [ ] He releído la petición o el enunciado y cada punto está cubierto.
- [ ] El proyecto compila sin errores ni avisos nuevos.
- [ ] Lo he ejecutado y he visto funcionar el caso normal.
- [ ] He probado casos límite y de error (vacío, nulo, fuera de rango, duplicado).
- [ ] Lo que ya funcionaba sigue funcionando; las pruebas existentes pasan.
- [ ] He leído el diff completo: sin código de depuración, sin código comentado, sin archivos ajenos.
- [ ] Los nombres son claros y no hay números mágicos ni bloques duplicados.
- [ ] Los errores se capturan y se muestran con un mensaje útil.
- [ ] No hay contraseñas ni archivos generados entre lo que se va a subir.
- [ ] El commit es pequeño, tiene un mensaje `tipo: resumen` y está en la rama correcta.
- [ ] He explicado qué he hecho, cómo probarlo y qué suposiciones, riesgos o pendientes quedan.
