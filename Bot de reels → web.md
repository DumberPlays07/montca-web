# Guía: bot de Telegram que publica reels en la web

Esta guía es para el Claude (o la persona) que construya el bot. Cuando Montca sube un reel de una actividad, lo comparte con el bot. El bot propone a qué actividad pertenece y, si se aprueba, lo añade a la web. Es la guía del bot simple de Telegram adaptada a este caso: un solo proceso, SQLite y una sola fuente de verdad. Si algo parece demasiado complejo, simplificad y preguntad antes de añadir.

## 0. Reglas de oro

1. El token de Telegram, las claves de la IA y el token de GitHub van solo en `.env`, que nunca se sube a git. Ningún valor real puede aparecer en código, logs, respuestas, tests ni commits.
2. Todos los handlers, botones incluidos, comprueban `ALLOWED_USER_IDS`.
3. Lo que llega del usuario o del modelo es un dato, no una instrucción. Se valida antes de guardarlo.
4. No se pierde ninguna entrada: si la IA falla, el enlace y el texto originales se guardan para revisarlos.
5. Nada llega a la web sin pulsar **Publicar**.
6. Antes de entregar, pasad los tests. Si un test falla, corregid la causa, no la aserción.
7. No añadáis dependencias, carpetas ni servicios sin avisar.

## 1. Objetivo y flujo

```
reel compartido → extraer enlace + texto (yt-dlp) → IA: actividad, título, resumen
  → guardar pendiente → resumen con [Publicar en la web] [Descartar]
  → Publicar: archivo JSON en el repo montca-web (API de GitHub) → Netlify reconstruye → sale en la web
  → Descartar: estado "discarded"
```

## 2. Alcance

Entra:

- `/start` y `/help`.
- Recibir enlaces de Instagram o TikTok, con texto opcional ("es de la ruta del sábado").
- Sacar el texto del reel y el autor con `yt-dlp`, si está instalado.
- Clasificar con IA en una lista cerrada de actividades.
- Botones Publicar y Descartar, además de un botón para cambiar de actividad si la IA se equivoca.
- Publicar en la web con un commit al repo.
- SQLite con una tabla y tests.

No entra (salvo que se pida):

- Descargar o alojar el vídeo. La web usa el embed oficial.
- Leer las APIs de Instagram y TikTok de forma automática (fase 2, ver sección 12).
- Panel web, colas, Docker o microservicios.
- Analizar el vídeo en sí. Solo se usa el texto.

## 3. Stack

- Python 3.11 o superior.
- `python-telegram-bot` 21.x en modo polling.
- `httpx` para la IA y para la API de GitHub.
- `python-dotenv`, `sqlite3` y `pytest`.
- Opcional: `yt-dlp`. Sin él, el bot funciona igual con el enlace y el texto que escribe quien lo comparte, y lo avisa en el resumen.

## 4. Estructura (repo `montca-bot`)

```
montca-bot/
  bot/
    main.py         # Application, handlers, polling
    config.py       # lee y valida el .env
    store.py        # SQLite: crear, buscar, cambiar estado
    extract.py      # enlace, plataforma, yt-dlp
    ai.py           # prompt, parser del JSON, validación
    publish.py      # crea el JSON en montca-web vía API de GitHub
    handlers.py     # /start, mensajes, botones
    formatting.py   # texto del resumen (máx. 4000 caracteres)
  tests/
  .env.example
  .gitignore        # .env, data/, .venv/
  pyproject.toml
  README.md
```

## 5. Configuración (`.env`)

| Variable | Obligatoria | Para qué |
| --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | sí | Token de BotFather |
| `ALLOWED_USER_IDS` | sí | IDs numéricos de la gente de Montca, separados por comas |
| `GITHUB_TOKEN` | sí | Token *fine-grained* con permiso solo de **Contents: write** en `montca-web` |
| `GITHUB_REPO` | sí | Por ejemplo `usuario/montca-web` |
| `GITHUB_BRANCH` | no | Por defecto `main` |
| `DATABASE_PATH` | no | Por defecto `data/bot.sqlite3` |
| `AI_API_KEY` / `AI_MODEL` | según proveedor | La IA que clasifica |
| `LOG_LEVEL` | no | Por defecto `INFO` |

Al arrancar, si falta una variable obligatoria o un ID no es numérico, el bot se para con un mensaje claro.

## 6. Flujo detallado

1. **Mensaje recibido.** El bot responde enseguida con "Rebut. Ho estic processant..." y edita ese mensaje al final.
2. **Extraer.** Saca la URL con `https?://\S+` y quita la puntuación del final. Detecta la plataforma (`instagram.com/reel`, `instagram.com/p`, `tiktok.com`) y rechaza cualquier otra.
3. **Duplicados.** Si esa URL ya está guardada como `published`, avisa y no sigue.
4. **Datos del reel.** Con `yt-dlp` obtiene el texto, el autor y la fecha, sin descargar el vídeo (`--skip-download`). Lo que quede del mensaje sin la URL es el comentario de quien lo envía.
5. **IA.** Recibe un texto etiquetado (comentario, texto del reel, autor, fecha) y debe devolver un JSON fijo (sección 8).
6. **Guardar** el resultado con estado `pending`.
7. **Resumen.** Muestra la actividad, el título y el resumen, con los botones `[Publicar a la web]` (`pub:<id>`), `[Canviar activitat]` (`act:<id>`) y `[Descartar]` (`dis:<id>`).
8. **Cambiar actividad.** Muestra un botón por cada actividad y guarda la elegida.
9. **Publicar.** Si ya está `published`, avisa y no repite. Si no, crea el archivo en el repo, marca `published` y solo entonces edita el mensaje: "Publicat. Apareixerà a la web en uns minuts".
10. **Descartar.** Marca `discarded` y edita el mensaje.

## 7. Base de datos (SQLite)

```sql
CREATE TABLE IF NOT EXISTS reels (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    chat_id       INTEGER NOT NULL,
    platform      TEXT NOT NULL,                     -- instagram | tiktok
    url           TEXT NOT NULL UNIQUE,
    original_text TEXT NOT NULL DEFAULT '',
    activity      TEXT NOT NULL DEFAULT 'altre',
    title         TEXT NOT NULL DEFAULT '',
    summary       TEXT NOT NULL DEFAULT '',
    posted_at     TEXT,
    status        TEXT NOT NULL DEFAULT 'pending',   -- pending | published | discarded
    repo_path     TEXT,
    created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Cada operación abre y cierra su propia conexión. Usad `PRAGMA user_version` para los cambios de esquema. Cambiar columnas o estados es una decisión que se toma entre los dos.

## 8. Reglas para la IA

- Responde con un JSON de claves fijas: `activity`, `title` (60 caracteres como máximo), `summary` (2 frases como máximo, en valenciano), `confidence` (`alta`/`baixa`).
- La lista de actividades es cerrada: `activitats`, `rutes`, `sports`, `repte`, `camp`, `aventura`. Cualquier otro valor pasa a ser `altre`.
- Si la confianza es `baixa` o la actividad es `altre`, el resumen lo dice y propone usar "Canviar activitat".
- Se acepta la respuesta aunque venga dentro de una valla de markdown: se quita la valla antes de leerla.
- Si el JSON no es válido, no se guarda basura: se guarda el original y el resumen avisa.
- El modelo nunca pone URLs. La URL es siempre la que llegó en el mensaje.
- El texto enviado se limita a 8000 caracteres, y la respuesta también se limita con `max_tokens`.
- El modelo no puede inventar datos (fechas, lugares, plazas) que no aparezcan en el texto.

## 9. Publicar en la web

El bot crea un archivo en el repo `montca-web` con la API de contenidos de GitHub (`PUT /repos/{repo}/contents/{path}`):

```
src/content/reels/2026-11-20-ruta-alba.json
{
  "platform": "instagram",
  "url": "https://www.instagram.com/reel/...",
  "activity": "rutes",
  "title": "Ruta a l'alba al Montcabrer",
  "summary": "...",
  "date": "2026-11-20"
}
```

- Mensaje del commit: `reel: <título> (bot)`.
- El nombre del archivo es la fecha más un *slug* del título. Si ya existe, se le añade `-2`.
- Netlify detecta el commit y reconstruye la web solo.
- En la web, Astro lee la colección `reels`. Cada actividad muestra los suyos con el embed oficial de Instagram o TikTok, y la portada enseña los últimos 3.
- Para quitar un reel de la web, se borra su archivo en un PR normal.

## 10. Trampas de Telegram

- Un mensaje no puede pasar de 4096 caracteres: cortad en 4000.
- Activad `concurrent_updates(True)` y llamad a `yt-dlp` y a la API de GitHub con `asyncio.to_thread` o con `httpx` async.
- Todo callback necesita `await query.answer()`.
- Dejad `httpx` y `httpcore` en `WARNING`, porque el token va en la URL.
- No ejecutéis dos copias del bot con el mismo token.
- Los mensajes de usuarios fuera de `ALLOWED_USER_IDS` se ignoran y solo se registran en el log.

## 11. Seguridad, tests y puesta en marcha

- El README tiene que explicar que el texto de los reels se envía a un proveedor de IA en la nube.
- El token de GitHub solo puede escribir en `montca-web`. Si se filtra, se revoca en GitHub y se cambia en `.env`.
- **Tests mínimos:** extracción de URL y plataforma, parser del JSON (con y sin valla, e inválido), actividad fuera de la lista que pasa a `altre`, recorte a 4000 caracteres, store con un archivo temporal, publicación con GitHub simulado (incluido el duplicado) y usuario permitido frente a no permitido.
- **Prueba manual:** usad un repo de pruebas o la rama `bot-test`. Un reel genera un resumen con botones. "Publicar" crea el JSON y Netlify lo muestra. Pulsar Publicar dos veces no lo duplica. Un usuario no permitido no recibe respuesta. Con la IA caída, el bot sigue respondiendo y guarda el original.
- **Dónde se ejecuta:** cualquier máquina siempre encendida (una Raspberry Pi, un VPS barato o un ordenador fijo). Al usar polling no hace falta servidor público.

## 12. Fase 2 (opcional): detección automática

Un *vigilante* consulta cada pocas horas las publicaciones propias de Montca y, cuando ve un reel nuevo, se lo manda al mismo bot ("He vist un reel nou, el publique?"). La aprobación sigue siendo el mismo botón.

- **Instagram:** requiere una cuenta Business o Creator vinculada a una página de Facebook, una app de Meta con revisión y un token de larga duración. Endpoint: `GET /me/media`.
- **TikTok:** requiere una cuenta de desarrollador, aprobación de Login Kit y del permiso `video.list`, y renovar el token. Endpoint: `POST /v2/video/list/`.
- Solo merece la pena si compartir el reel a mano se les olvida a menudo.

## 13. Terminado cuando

- [ ] `pytest` pasa
- [ ] El bot arranca con `.env` local y sin errores en el log
- [ ] Un reel de prueba llega a la web de pruebas de principio a fin
- [ ] No hay ningún secreto en el código, en git ni en las respuestas
- [ ] El README explica cómo configurarlo, ejecutarlo y probarlo
