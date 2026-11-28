# Diseño · Eventos y torneo de Navidad (C-04)

Resumen del `/impeccable shape` del 2026-11-24, confirmado por Pablo. Sistema visual: `DESIGN.md` ("Senda senyalitzada"). No hay colores, tipos ni formas nuevos. Boceto elegido de la primera pantalla: [boceto-cartell.html](boceto-cartell.html) (390 × 844, solo referencia de composición; los textos de interfaz definitivos van en los diccionarios).

## 1. Para quién y para qué

- **Página del torneo** (modo *Persuade*): quien llega desde un reel en el móvil entiende el torneo y pulsa **Inscriure's**. Éxito: llegar al formulario con un toque desde la página y con dos desde la portada.
- **Sección Eventos** (modo *Operate*): ver de un vistazo qué eventos hay y entrar en uno.
- **Franja de la portada** (modo *Persuade*, pequeña): avisar de que las inscripciones están abiertas, sin quitarle el protagonismo al buscador y al mapa (C-02).

## 2. Página del torneo: "Cartell de les dues jornades"

### Primera pantalla (375–390 px, sin scroll)

```
┌─────────────────────────────────────┐
│ Montca Actiu          [CAST] [Menú] │  Cabecera (existente)
├─────────────────────────────────────┤
│ ← Tornar                            │  EnlaceVolver → /esdeveniments/
│ Montca Sports · Esdeveniment        │  label, Verd fulla
│ Torneig de Nadal                    │  h1, Display 800
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬   ▬▬▬▬▬▬▬▬▬▬▬▬▬▬    │  raya Verd bosc 5 px
│ 27·12            03·01              │  numerales Display 800 (~3.5rem)
│ Diumenge,        Diumenge,          │
│ 1a jornada       2a jornada         │
│ ┌─────────────────────────────────┐ │
│ │ Futbol sala, bàsquet i pàdel.   │ │  plano Pedra (crema)
│ │ Cada equip juga les tres. Màxim │ │
│ │ 10 € per jugador (preu pendent) │ │
│ └─────────────────────────────────┘ │
│ Poliesportiu Municipal…  Com arribar│  enlace externo a Google Maps
│ ▰ Inscripcions obertes fins al 20/12│  marca de pintura + estado
│ [         Inscriure's             ] │  botón teja, ancho completo
├─────────────────────────────────────┤
│  Agenda   Activitats   Contacte     │  BarraInferior (existente)
└─────────────────────────────────────┘
```

- Las fechas son el gancho: numerales grandes, una columna por jornada, con la raya Verd bosc encima (el "bancal").
- Teja solo en "Inscriure's" (regla "Paint Mark": la teja es la acción y el "estás aquí"). La marca de pintura de la línea de estado va en Verd bosc: informa, no es una acción (decidido en el audit de la fase 7, T046).
- Sin foto: no hay fotos de Montca Sports todavía (PRODUCT.md). Cuando lleguen, la foto va **debajo** de la primera pantalla, nunca en lugar de las fechas.

### Debajo del pliegue, en este orden

1. **Places**: un bloque por categoría (plano Herba clara) con el nombre, los años de nacimiento y "N de M equips" (HU-19). Arriba, el estado de las inscripciones y la fecha de cierre.
   - Categoría llena: "Completa". Sin lista de espera.
   - El estado se entiende por el texto, no solo por el color.
   - Sin fuente de plazas (antes de la consulta pública): este bloque no sale.
   - Error al cargar: "No s'han pogut carregar les places"; el resto de la página sigue.
   - No hay lista de equipos ni de jugadores: la web no publica ningún dato personal.
2. **Inscriure's** (segunda vez, debajo de las plazas, como pide la spec).
3. **Què cal saber**: tabla de categorías (años, máximo de equipos, mínimo y máximo de jugadores), precio, plazo de inscripción y normas (solo cuando Montca las pase).
4. **Preguntes freqüents**: desplegables (`<details>`), una pregunta por fila de al menos 44 px.
5. **Com arribar**: lugar y enlace a Google Maps (sin mapa incrustado).

### Estados de la primera pantalla

| Estado | Línea de estado | Botón |
|---|---|---|
| pròximament | "Inscripcions a partir del 25/11" | no sale |
| obertes | marca de pintura + "Inscripcions obertes fins al 20/12" | Inscriure's |
| completes | "Places completes" | no sale |
| tancades | "Inscripcions tancades" | no sale |
| sin dirección de inscripción | estado normal | en su lugar, "Escriu-nos per a apuntar-te" (WhatsApp o correo) |

## 3. Sección Eventos (`/esdeveniments/`)

- Título "Esdeveniments" y una tarjeta por evento próximo: nombre, fechas, lugar y línea de estado (la misma que en la página). Toda la tarjeta es un enlace (mínimo 44 px), plano Pedra solo si el evento tiene las inscripciones abiertas; si no, Herba clara.
- Sin eventos próximos: mensaje y contacto (WhatsApp o correo).
- Los eventos que ya han pasado no salen en la lista; su página sigue accesible.

## 4. Franja de la portada

```
┌─────────────────────────────────────┐
│ Montca Actiu          [CAST] [Menú] │
├─────────────────────────────────────┤
│ Torneig de Nadal                    │  banda Verd bosc, texto Boira
│ Inscripcions obertes fins al 20/12 →│  flecha y foco en Teula clara
├─────────────────────────────────────┤
│ (portada: C-02)                     │
```

- Justo debajo de la cabecera, a todo el ancho, no fija al hacer scroll. Toda la banda es un enlace a la página del evento (mínimo 44 px de alto).
- Sin teja: sobre Verd bosc la marca y el foco van en Teula clara (regla "Dark Ground"). La teja queda para la acción principal de la portada.
- Solo sale con el estado "obertes".

## 5. Navegación

- "Esdeveniments" entra en el menú móvil y en el pie y, en el menú de escritorio, en el lugar de "Montca Sports". La barra inferior no cambia.
- La clave nueva (texto y ruta) va en `src/components/textos-navegacion.ts`, con su forma `{ ca, es }` y `rutasValenciano`. No se toca `src/i18n` (zona de Saúl, B-07).
- No existe ninguna tarea para una página de Montca Sports; si se crea, se decide si vuelve al menú.

## 6. Componentes

- **Se reutilizan**: `BaseLayout`, `Cabecera`, `Pie`, `BarraInferior`, `EnlaceVolver`, `Icono` (con dos iconos nuevos: lugar y enlace externo).
- **Nuevos** (zona de Pablo): estado de las inscripciones, botón de inscripción, plazas de una categoría, preguntas frecuentes, tarjeta de evento y franja del evento.
- `DESIGN.md` se actualiza con `/impeccable document` al terminar la implementación (tamaño Display ya construido, componentes nuevos), no antes.

## 7. Restricciones que no se pueden inventar al construir

- Ningún texto escrito en los componentes: todo sale de los datos del evento o del diccionario provisional (constitución II).
- Precio, normas, premios y dirección de inscripción: solo los de Montca; si faltan, se muestra "pendent" o no se muestra.
- Datos de prueba de plazas: marcados como prueba y nunca en producción.
- Zonas pulsables de 44 px como mínimo, foco visible, comprobación en 375 px y en escritorio, y `prefers-reduced-motion` si se añade movimiento (no está previsto).
