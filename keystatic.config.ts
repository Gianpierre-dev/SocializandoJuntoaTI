import { config, collection, fields, singleton } from "@keystatic/core";

// Panel administrativo (/keystatic). En desarrollo edita archivos locales;
// en producción hace commits al repositorio de GitHub.
const storage =
  import.meta.env.PROD
    ? ({
        kind: "github",
        repo: { owner: "Gianpierre-dev", name: "SocializandoJuntoaTI" },
      } as const)
    : ({ kind: "local" } as const);

const campoOrden = fields.number({
  label: "Orden",
  description: "Posición en la lista (menor = primero).",
  validation: { isRequired: true },
});

export default config({
  storage,
  ui: {
    brand: { name: "Socializando Junto A Ti" },
    navigation: {
      Portada: ["banners", "programas"],
      Contenido: ["activities", "team", "allies", "values"],
      Configuración: ["site"],
    },
  },

  singletons: {
    site: singleton({
      label: "Datos generales",
      path: "src/content/site",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Nombre de la organización" }),
        slogan: fields.text({ label: "Eslogan" }),
        foundedDate: fields.text({ label: "Fecha de fundación" }),
        audience: fields.text({ label: "Público objetivo" }),
        mission: fields.text({ label: "Misión", multiline: true }),
        vision: fields.text({ label: "Visión", multiline: true }),
        objective: fields.text({ label: "Objetivo", multiline: true }),
        locations: fields.array(fields.text({ label: "Sede" }), {
          label: "Sedes presenciales",
          itemLabel: (props) => props.value,
        }),
        online: fields.array(fields.text({ label: "Plataforma" }), {
          label: "Plataformas en línea",
          itemLabel: (props) => props.value,
        }),
        socials: fields.object(
          {
            instagram: fields.text({ label: "Instagram (URL)" }),
            tiktok: fields.text({ label: "TikTok (URL)" }),
            facebook: fields.text({ label: "Facebook (URL)" }),
            linktree: fields.text({ label: "Linktree (URL)" }),
            whatsapp: fields.text({ label: "WhatsApp (URL)" }),
          },
          { label: "Redes sociales" },
        ),
        volunteerForm: fields.text({
          label: "Formulario de voluntariado (URL externa)",
        }),
        volunteerEndpoint: fields.text({
          label: "Endpoint de inscripciones (Apps Script)",
          description: "URL del Web App de Google Apps Script (termina en /exec).",
        }),
        requirements: fields.array(fields.text({ label: "Requisito" }), {
          label: "Requisitos de voluntariado",
          itemLabel: (props) => props.value,
        }),
        benefits: fields.array(fields.text({ label: "Beneficio" }), {
          label: "Beneficios de voluntariado",
          itemLabel: (props) => props.value,
        }),
        areas: fields.array(
          fields.object({
            title: fields.text({ label: "Área" }),
            description: fields.text({ label: "Descripción", multiline: true }),
          }),
          {
            label: "Áreas de trabajo",
            itemLabel: (props) => props.fields.title.value,
          },
        ),
      },
    }),
  },

  collections: {
    banners: collection({
      label: "Banners de portada",
      path: "src/content/banners/*",
      format: { data: "yaml" },
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: "Título" } }),
        kicker: fields.text({ label: "Etiqueta superior (kicker)" }),
        description: fields.text({
          label: "Descripción",
          multiline: true,
        }),
        href: fields.text({ label: "Enlace de destino" }),
        ctaLabel: fields.text({
          label: "Texto del botón (opcional)",
          description: "Solo aplica a banners sin imagen.",
        }),
        variant: fields.select({
          label: "Color (banners sin imagen)",
          options: [
            { label: "Morado", value: "brand" },
            { label: "Dorado", value: "gold" },
            { label: "Verde", value: "green" },
          ],
          defaultValue: "brand",
        }),
        image: fields.image({
          label: "Imagen del banner (opcional)",
          description:
            "Pieza gráfica completa, recomendado 1940x582 (ratio 10:3). Si se define, reemplaza al banner de color.",
          directory: "src/assets/banners",
          publicPath: "../../assets/banners/",
        }),
        alt: fields.text({
          label: "Texto alternativo de la imagen",
          description: "Obligatorio si el banner tiene imagen.",
        }),
        order: campoOrden,
      },
    }),

    programas: collection({
      label: "Programas (mosaico)",
      path: "src/content/programas/*",
      format: { data: "yaml" },
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: "Título" } }),
        subtitle: fields.text({ label: "Subtítulo" }),
        href: fields.text({ label: "Enlace de destino" }),
        variant: fields.select({
          label: "Color (tiles sin imagen)",
          options: [
            { label: "Morado", value: "brand" },
            { label: "Dorado", value: "gold" },
            { label: "Rosa", value: "rose" },
            { label: "Verde", value: "green" },
            { label: "Morado oscuro", value: "deep" },
            { label: "Claro", value: "subtle" },
          ],
          defaultValue: "brand",
        }),
        image: fields.image({
          label: "Imagen del tile (opcional)",
          description:
            "Pieza gráfica, recomendado 924x616 (ratio 3:2). Si se define, reemplaza al tile de color.",
          directory: "src/assets/programas",
          publicPath: "../../assets/programas/",
        }),
        alt: fields.text({
          label: "Texto alternativo de la imagen",
          description: "Obligatorio si el tile tiene imagen.",
        }),
        order: campoOrden,
      },
    }),

    activities: collection({
      label: "Actividades",
      path: "src/content/activities/*",
      format: { data: "yaml" },
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: "Título" } }),
        summary: fields.text({ label: "Resumen corto", multiline: true }),
        description: fields.text({
          label: "Descripción completa",
          multiline: true,
        }),
        cost: fields.text({ label: "Costo" }),
        modality: fields.select({
          label: "Modalidad",
          options: [
            { label: "Presencial", value: "presencial" },
            { label: "En línea", value: "online" },
            { label: "Mixto", value: "mixto" },
          ],
          defaultValue: "presencial",
        }),
        status: fields.select({
          label: "Estado",
          options: [
            { label: "Activa", value: "active" },
            { label: "En desarrollo", value: "in-development" },
          ],
          defaultValue: "active",
        }),
        order: campoOrden,
      },
    }),

    team: collection({
      label: "Equipo",
      path: "src/content/team/*",
      format: { data: "yaml" },
      slugField: "name",
      schema: {
        name: fields.slug({ name: { label: "Nombre" } }),
        handle: fields.text({ label: "Usuario/handle (redes)" }),
        role: fields.text({ label: "Rol" }),
        photo: fields.text({
          label: "Foto (ruta, opcional)",
          description: "Pendiente de uso en el sitio.",
        }),
        order: campoOrden,
      },
    }),

    allies: collection({
      label: "Aliados",
      path: "src/content/allies/*",
      format: { data: "yaml" },
      slugField: "name",
      schema: {
        name: fields.slug({ name: { label: "Nombre" } }),
        handle: fields.text({ label: "Usuario/handle (redes)" }),
        url: fields.text({ label: "Enlace (opcional)" }),
        order: campoOrden,
      },
    }),

    values: collection({
      label: "Valores",
      path: "src/content/values/*",
      format: { data: "yaml" },
      slugField: "title",
      schema: {
        title: fields.slug({ name: { label: "Título" } }),
        description: fields.text({ label: "Descripción", multiline: true }),
        order: campoOrden,
      },
    }),
  },
});
