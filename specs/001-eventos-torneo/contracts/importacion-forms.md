# Contrato · Importación del Google Forms de Montca (Saúl, con A-14)

## Uso

```sh
node scripts/importar-forms/importar.ts --evento torneig-nadal-2026 --csv /ruta/fuera/del/repo/respuestas.csv [--simular]
```

- `--simular`: no escribe nada; solo muestra el informe. Es lo primero que se ejecuta siempre.
- La clave de servicio de Supabase y la URL se leen de `.env` (ya está en `.gitignore`), nunca de argumentos ni del código.

## Reglas

1. **El CSV nunca entra en el repo.** El script se niega a leer una ruta que esté dentro del repositorio. Después de importar, el CSV se borra del ordenador.
2. **Una fila = un jugador** (clarify, provisional hasta que Montca confirme su Forms, A-26).
3. **Categoría**: la que diga la respuesta. Si no la pregunta, se deduce del año de nacimiento con los rangos del YAML del evento.
4. **Equipo**: se busca por `(evento, categoria, nombre_normalizado)`. Normalizar es pasar a minúsculas, quitar tildes, recortar los espacios de los extremos y unificar los del medio. Si no existe, se crea con `estado = pendiente` y `origen = forms`.
5. **Nombres parecidos sin ser iguales** (por ejemplo, "els tigres" y "tigres"): **no** se unen. Salen en el informe para que decidan Montca o Saúl, que corrigen la hoja o la base de datos y vuelven a importar.
6. **Capitán**: quien lo marque en el Forms; si nadie lo marca, la primera respuesta (la de "Marca temporal" más antigua) del equipo.
7. **Autorización** de los menores: `autorizacion_entrega` es `papel` o `softco` según la respuesta o lo que diga Montca. `autorizacion_registrada` vale `false` hasta que Montca confirme que la ha recibido (C-06; mientras tanto, a mano en Supabase).
8. **Repetible**: cada jugador lleva una `clave_importacion` estable, sacada de la "Marca temporal" y del correo o DNI de la respuesta (se guarda un *hash*, no el dato). Si se vuelve a ejecutar, se actualizan las filas existentes, no se duplican, y nunca se cambia el `estado` de un equipo.
9. **Informe** en pantalla, sin datos personales completos (solo nombre e inicial):
   - equipos nuevos y jugadores nuevos o actualizados;
   - nombres de equipo parecidos;
   - jugadores fuera del año de su categoría;
   - el mismo jugador en dos respuestas;
   - equipos por debajo del mínimo o por encima del máximo de jugadores.

## Pendiente de Montca (A-26)

Columnas exactas del Forms: si hay pregunta de capitán y de dorsal, cómo viene la categoría y cómo se indica la autorización. El script lee las columnas por un mapa de nombres al principio del archivo, para ajustarlo sin tocar la lógica.
