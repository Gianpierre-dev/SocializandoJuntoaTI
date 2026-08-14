// Configuración declarativa de los recursos que administra el panel.

export interface CampoRecurso {
  nombre: string;
  etiqueta: string;
  tipo: "texto" | "textarea" | "numero" | "booleano" | "select" | "imagen";
  opciones?: { valor: string; etiqueta: string }[];
  carpeta?: string;
  opcional?: boolean;
  enTabla?: boolean;
  /** Largo máximo permitido (se valida antes de enviar). */
  maximo?: number;
  /** Patrón que debe cumplir el valor, con su mensaje de error. */
  patron?: RegExp;
  mensajePatron?: string;
}

export interface RecursoConfig {
  clave: string;
  etiqueta: string;
  endpoint: string;
  campos: CampoRecurso[];
  /** El recurso se reordena con las flechas de la tabla. */
  ordenable?: boolean;
  /** Página del sitio donde se ve este contenido. */
  enlaceSitio?: string;
}

const VARIANTES_BANNER = [
  { valor: "BRAND", etiqueta: "Morado" },
  { valor: "GOLD", etiqueta: "Dorado" },
  { valor: "GREEN", etiqueta: "Verde" },
];

const VARIANTES_TILE = [
  ...VARIANTES_BANNER,
  { valor: "ROSE", etiqueta: "Rosa" },
  { valor: "DEEP", etiqueta: "Morado oscuro" },
  { valor: "SUBTLE", etiqueta: "Claro" },
];

export const RECURSOS: RecursoConfig[] = [
  {
    clave: "banners",
    ordenable: true,
    enlaceSitio: "/",
    etiqueta: "Banners de portada",
    endpoint: "/banners",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", enTabla: true, maximo: 120 },
      { nombre: "etiqueta", etiqueta: "Etiqueta superior", tipo: "texto" },
      {
        nombre: "descripcion",
        etiqueta: "Descripción",
        tipo: "textarea",
        opcional: true,
      },
      {
        nombre: "enlace",
        etiqueta: "Enlace de destino",
        tipo: "texto",
        maximo: 300,
        patron: /^(\/|https?:\/\/)/,
        mensajePatron: "Debe empezar con / o https://",
      },
      {
        nombre: "textoBoton",
        etiqueta: "Texto del botón",
        tipo: "texto",
        opcional: true,
      },
      {
        nombre: "variante",
        etiqueta: "Color (sin imagen)",
        tipo: "select",
        opciones: VARIANTES_BANNER,
      },
      {
        nombre: "imagenUrl",
        etiqueta: "Imagen (1940×582 recomendado)",
        tipo: "imagen",
        carpeta: "banners",
        opcional: true,
      },
      {
        nombre: "textoAlternativo",
        etiqueta: "Texto alternativo",
        tipo: "texto",
        opcional: true,
      },
      { nombre: "activo", etiqueta: "Activo", tipo: "booleano", enTabla: true },
    ],
  },
  {
    clave: "programas",
    ordenable: true,
    enlaceSitio: "/",
    etiqueta: "Programas (mosaico)",
    endpoint: "/programas",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", enTabla: true, maximo: 120 },
      { nombre: "subtitulo", etiqueta: "Subtítulo", tipo: "texto" },
      {
        nombre: "enlace",
        etiqueta: "Enlace de destino",
        tipo: "texto",
        maximo: 300,
        patron: /^(\/|https?:\/\/)/,
        mensajePatron: "Debe empezar con / o https://",
      },
      {
        nombre: "variante",
        etiqueta: "Color (sin imagen)",
        tipo: "select",
        opciones: VARIANTES_TILE,
      },
      {
        nombre: "imagenUrl",
        etiqueta: "Imagen (924×616 recomendado)",
        tipo: "imagen",
        carpeta: "programas",
        opcional: true,
      },
      {
        nombre: "textoAlternativo",
        etiqueta: "Texto alternativo",
        tipo: "texto",
        opcional: true,
      },
      { nombre: "activo", etiqueta: "Activo", tipo: "booleano", enTabla: true },
    ],
  },
  {
    clave: "actividades",
    ordenable: true,
    enlaceSitio: "/actividades",
    etiqueta: "Actividades",
    endpoint: "/actividades",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", enTabla: true, maximo: 120 },
      { nombre: "resumen", etiqueta: "Resumen corto", tipo: "textarea" },
      {
        nombre: "descripcion",
        etiqueta: "Descripción completa",
        tipo: "textarea",
      },
      { nombre: "costo", etiqueta: "Costo", tipo: "texto", enTabla: true },
      {
        nombre: "modalidad",
        etiqueta: "Modalidad",
        tipo: "select",
        opciones: [
          { valor: "PRESENCIAL", etiqueta: "Presencial" },
          { valor: "ONLINE", etiqueta: "En línea" },
          { valor: "MIXTO", etiqueta: "Mixto" },
        ],
      },
      {
        nombre: "estado",
        etiqueta: "Estado",
        tipo: "select",
        opciones: [
          { valor: "ACTIVA", etiqueta: "Activa" },
          { valor: "EN_DESARROLLO", etiqueta: "En desarrollo" },
        ],
        enTabla: true,
      },
      {
        nombre: "duracion",
        etiqueta: "Duración",
        tipo: "texto",
        opcional: true,
        maximo: 60,
      },
      {
        nombre: "frecuencia",
        etiqueta: "Frecuencia",
        tipo: "texto",
        opcional: true,
        maximo: 80,
      },
      {
        nombre: "imagenUrl",
        etiqueta: "Foto de la actividad (1200×800 recomendado)",
        tipo: "imagen",
        carpeta: "actividades",
        opcional: true,
      },
      {
        nombre: "textoAlternativo",
        etiqueta: "Texto alternativo de la foto",
        tipo: "texto",
        opcional: true,
      },
    ],
  },
  {
    clave: "equipo",
    ordenable: true,
    enlaceSitio: "/nosotros#equipo",
    etiqueta: "Equipo",
    endpoint: "/equipo",
    campos: [
      { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", enTabla: true },
      { nombre: "usuarioRedes", etiqueta: "Usuario en redes", tipo: "texto" },
      { nombre: "rol", etiqueta: "Rol", tipo: "texto", enTabla: true },
      {
        nombre: "fotoUrl",
        etiqueta: "Foto",
        tipo: "imagen",
        carpeta: "equipo",
        opcional: true,
      },
    ],
  },
  {
    clave: "aliados",
    ordenable: true,
    enlaceSitio: "/nosotros",
    etiqueta: "Aliados",
    endpoint: "/aliados",
    campos: [
      { nombre: "nombre", etiqueta: "Nombre", tipo: "texto", enTabla: true },
      { nombre: "usuarioRedes", etiqueta: "Usuario en redes", tipo: "texto" },
      {
        nombre: "enlace",
        etiqueta: "Enlace",
        tipo: "texto",
        opcional: true,
      },
    ],
  },
  {
    clave: "valores",
    ordenable: true,
    enlaceSitio: "/nosotros",
    etiqueta: "Valores",
    endpoint: "/valores",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", enTabla: true, maximo: 120 },
      { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea" },
    ],
  },
  {
    clave: "cifras",
    ordenable: true,
    enlaceSitio: "/",
    etiqueta: "Cifras de impacto",
    endpoint: "/cifras",
    campos: [
      {
        nombre: "valor",
        etiqueta: "Número o cifra (ej.: 200, +500, 3)",
        tipo: "texto",
        enTabla: true,
        maximo: 20,
      },
      {
        nombre: "etiqueta",
        etiqueta: "Qué representa (ej.: jóvenes acompañados)",
        tipo: "texto",
        enTabla: true,
        maximo: 60,
      },
    ],
  },
  {
    clave: "testimonios",
    ordenable: true,
    enlaceSitio: "/",
    etiqueta: "Testimonios",
    endpoint: "/testimonios",
    campos: [
      {
        nombre: "texto",
        etiqueta: "Testimonio (lo que dijo la persona)",
        tipo: "textarea",
        maximo: 400,
      },
      {
        nombre: "autor",
        etiqueta: "Nombre",
        tipo: "texto",
        enTabla: true,
        maximo: 80,
      },
      {
        nombre: "detalle",
        etiqueta: "Detalle (ej.: 19 años, participante)",
        tipo: "texto",
        opcional: true,
        enTabla: true,
        maximo: 80,
      },
      {
        nombre: "fotoUrl",
        etiqueta: "Foto de la persona",
        tipo: "imagen",
        carpeta: "testimonios",
        opcional: true,
      },
    ],
  },
];