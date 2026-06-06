# ADR 0001 — Elección de stack para el sitio web

- **Estado:** Aceptada
- **Fecha:** 2026-06-04
- **Autor:** Gianpierre Terrazas Tello

## Contexto

La Organización Juvenil "Socializando Junto A Ti" migra de una presencia
únicamente en redes sociales hacia un sitio web propio. El proyecto está
planteado en tres etapas (ver `Propuesta-Pagina-Web-SOJAT-2026.pdf`):

1. **Etapa 1 — Sitio de presentación:** landing informativa, pública, SEO-first.
2. **Etapa 2 — Contenido dinámico:** blog de salud mental, calendario.
3. **Etapa 3 — Sistema de gestión interna:** registro de voluntarios, login,
   asistencia, certificados. Catalogada como "futuro difuso", sin fecha.

Se evaluó entre **Astro** y **Next.js** como framework inicial. La duda central
fue la escalabilidad: si la Etapa 3 (una aplicación con estado y autenticación)
llegara, ¿conviene arrancar ya en Next.js?

## Decisión

Iniciar con **Astro + Tailwind CSS + TypeScript** para las Etapas 1 y 2.

Cuando la Etapa 3 sea un requisito real, se construirá como una **aplicación
independiente** en **Next.js + NestJS + Prisma + PostgreSQL** (stack estándar
del equipo), desplegada en un subdominio separado:

- `socializandojuntoati.org` → sitio público (Astro), permanente.
- `app.socializandojuntoati.org` → aplicación (Next.js), cuando exista.

## Fundamento

- El sitio de contenido y una aplicación SaaS son productos de naturaleza
  distinta. La herramienta óptima para cada uno no es la misma.
- Astro genera HTML estático: rendimiento y SEO superiores para contenido,
  requisito clave de la Etapa 2. Sus Content Collections modelan datos
  (actividades, equipo, aliados, artículos) con esquemas tipados en lugar de
  contenido incrustado en el marcado.
- Astro no es un callejón sin salida: soporta SSR, endpoints, Server Islands y
  Actions si se necesitara interactividad puntual.
- Adoptar Next.js desde el inicio implicaría pagar complejidad por un requisito
  incierto y lejano (over-engineering / YAGNI).
- La Etapa 3 **no se migra**, se yuxtapone: el sitio de contenido permanece en
  Astro y la aplicación nace en paralelo, en su propio subdominio.

## Mitigación del doble stack

Para evitar duplicación de interfaz entre el sitio (Astro) y la futura
aplicación (Next.js):

- **Tailwind CSS en ambos** → mismos tokens de diseño e identidad de marca.
- **Componentes de UI en React** → consumidos como islas en Astro y de forma
  nativa en Next.js. Un único design system, dos consumidores.

## Condición de reevaluación

Si la Etapa 3 dejara de ser "futuro difuso" y se volviera necesaria en el corto
plazo (menos de 6 meses) con un sitio de contenido mínimo, se reevaluaría
iniciar directamente en Next.js para evitar el costo de mantener dos stacks.

## Consecuencias

- **Positivas:** mejor rendimiento y SEO, menor complejidad inicial, hosting de
  bajo costo o gratuito, identidad de marca reutilizable.
- **Negativas / a vigilar:** el día que exista la aplicación habrá dos stacks
  que mantener; se asume conscientemente y se mitiga con el design system
  compartido.
