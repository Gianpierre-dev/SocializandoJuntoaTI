// Configuración declarativa de los recursos que administra el panel.

export interface CampoRecurso {
  nombre: string;
  etiqueta: string;
  tipo: "texto" | "textarea" | "numero" | "booleano" | "select" | "imagen";
  opciones?: { valor: string; etiqueta: string }[];
  carpeta?: string;
  opcional?: boolean;
  enTabla?: boolean;
}

export interface RecursoConfig {
  clave: string;
  etiqueta: string;
  endpoint: string;
  campos: CampoRecurso[];
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
    etiqueta: "Banners de portada",
    endpoint: "/banners",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", enTabla: true },
      { nombre: "etiqueta", etiqueta: "Etiqueta superior", tipo: "texto" },
      {
        nombre: "descripcion",
        etiqueta: "Descripción",
        tipo: "textarea",
        opcional: true,
      },
      { nombre: "enlace", etiqueta: "Enlace de destino", tipo: "texto" },
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
      { nombre: "orden", etiqueta: "Orden", tipo: "numero", enTabla: true },
      { nombre: "activo", etiqueta: "Activo", tipo: "booleano", enTabla: true },
    ],
  },
  {
    clave: "programas",
    etiqueta: "Programas (mosaico)",
    endpoint: "/programas",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", enTabla: true },
      { nombre: "subtitulo", etiqueta: "Subtítulo", tipo: "texto" },
      { nombre: "enlace", etiqueta: "Enlace de destino", tipo: "texto" },
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
      { nombre: "orden", etiqueta: "Orden", tipo: "numero", enTabla: true },
      { nombre: "activo", etiqueta: "Activo", tipo: "booleano", enTabla: true },
    ],
  },
  {
    clave: "actividades",
    etiqueta: "Actividades",
    endpoint: "/actividades",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", enTabla: true },
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
      { nombre: "orden", etiqueta: "Orden", tipo: "numero", enTabla: true },
    ],
  },
  {
    clave: "equipo",
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
      { nombre: "orden", etiqueta: "Orden", tipo: "numero", enTabla: true },
    ],
  },
  {
    clave: "aliados",
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
      { nombre: "orden", etiqueta: "Orden", tipo: "numero", enTabla: true },
    ],
  },
  {
    clave: "valores",
    etiqueta: "Valores",
    endpoint: "/valores",
    campos: [
      { nombre: "titulo", etiqueta: "Título", tipo: "texto", enTabla: true },
      { nombre: "descripcion", etiqueta: "Descripción", tipo: "textarea" },
      { nombre: "orden", etiqueta: "Orden", tipo: "numero", enTabla: true },
    ],
  },
];
