# Contrato · Archivo de un evento (`src/content/eventos/<id>.yaml`)

Campos y reglas en [../data-model.md](../data-model.md), sección 1. Este es el archivo del torneo con los datos de `docs/info-montca.md`. Las traducciones al castellano las revisa Montca antes de publicar.

```yaml
nombre: { ca: "Torneig de Nadal", es: "Torneo de Navidad" }
marca: "Montca Sports"
resumen:
  ca: "Futbol sala, bàsquet i pàdel en dues jornades al Poliesportiu de Cocentaina."
  es: "Fútbol sala, básquet y pádel en dos jornadas en el Polideportivo de Cocentaina."
jornadas:
  - { fecha: "2026-12-27", nombre: { ca: "1a jornada", es: "1.ª jornada" } }
  - { fecha: "2027-01-03", nombre: { ca: "2a jornada", es: "2.ª jornada" } }
lugar:
  nombre: "Poliesportiu Municipal de Cocentaina"
  direccion: ""          # pendiente: dirección postal del polideportivo (pública)
  localidad: "Cocentaina"
deportes:
  ca: "Futbol sala, bàsquet i pàdel. Cada equip juga les tres modalitats."
  es: "Fútbol sala, básquet y pádel. Cada equipo juega las tres modalidades."
precio:
  texto: { ca: "Màxim 10 € per jugador", es: "Máximo 10 € por jugador" }
  confirmado: false
inscripcion:
  apertura: "2026-11-25T00:00:00+01:00"
  cierre: "2026-12-20T23:59:59+01:00"
  cerradaAMano: false
  modo: "canal-montca"
  url: ""                # pendiente: enlace del Google Forms de Montca
  nota:
    ca: "T'apuntes amb el formulari de Montca. L'autorització del tutor dels menors es lliura en paper, a Softco."
    es: "Te apuntas con el formulario de Montca. La autorización del tutor de los menores se entrega en papel, en Softco."
categorias:
  - id: "infantil-cadet"
    nombre: { ca: "Infantil/Cadet", es: "Infantil/Cadete" }
    nacidos: { ca: "2011, 2012, 2013 i 2014", es: "2011, 2012, 2013 y 2014" }
    maxEquipos: 8
    minJugadores: 5
    maxJugadores: 10
  - id: "juvenil-senior"
    nombre: { ca: "Juvenil/Sènior", es: "Juvenil/Sénior" }
    nacidos: { ca: "2010 o abans", es: "2010 o antes" }
    maxEquipos: 6
    minJugadores: 5
    maxJugadores: 12
preguntas:   # las seis de docs/info-montca.md, en ca y es
  - pregunta: { ca: "Què inclou la inscripció?", es: "¿Qué incluye la inscripción?" }
    respuesta:
      ca: "La participació de l'equip en el torneig i en les tres modalitats esportives."
      es: "La participación del equipo en el torneo y en las tres modalidades deportivas."
  # … el resto. En la de contacto, el teléfono de Iker NO va (está en el Drive):
  # se responde con el correo público, las redes y WhatsApp cuando haya número (A-24).
```

Notas:
- **Nombre de la categoría en castellano**: "Infantil/Cadete" y "Juvenil/Sénior" son una propuesta. Las categorías son nombres de Montca, así que se confirma con Montca si se traducen o se dejan igual.
- **`direccion` vacía**: "Com arribar" busca por nombre y localidad, y el JSON-LD lleva solo la localidad.
- **`url` vacía**: se muestra el contacto en lugar del botón (FR-019).
