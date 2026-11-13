# Web Montca Actiu
Web para una asociación juvenil y deportiva de Cocentaina.
Idiomas: valenciano (principal) y castellano. Stack: Astro + Netlify.

## Cómo trabajamos
- Solo trabajas en el issue asignado a tu persona. Mira: gh issue list --assignee @me
- Una rama por issue: issue-<n>-descripcion-corta, creada desde main actualizado.
- Nunca hagas push a main. Todo entra por Pull Request.
- Al acabar, abre un PR con "Closes #<n>", qué has hecho, qué falta y avisos para el otro.

## Zonas
- Pablo: src/components, src/layouts, src/styles, DESIGN.md
- Saúl (@saulperezz): src/content, src/i18n, formularios, netlify.toml
- Compartido: src/pages, CLAUDE.md, docs/  → avísalo en el PR si lo tocas

## Reglas de código
- Antes de crear o cambiar interfaz, usa la skill impeccable y respeta DESIGN.md.
- Ningún texto visible escrito a mano en componentes: todo va en src/i18n.
- Las actividades y la agenda se leen de src/content, nunca se copian a mano.
- Las decisiones importantes se añaden a docs/decisiones.md con fecha.
- Si algo no está claro en el issue, pregunta antes de inventar.

## Comandos
- npm run dev    → servidor local
- npm run build  → comprobar que compila antes del PR
