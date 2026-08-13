// Capa de datos del sitio público: consume la API del backend y mapea
// las respuestas a las formas que usan los componentes.

const API_URL =
  import.meta.env.PUBLIC_API_URL ??
  "https://backend-production-98ca.up.railway.app";

async function obtener<T>(ruta: string, porDefecto: T): Promise<T> {
  try {
    const respuesta = await fetch(`${API_URL}/api${ruta}`);
    if (!respuesta.ok) return porDefecto;
    return (await respuesta.json()) as T;
  } catch {
    // Si la API no responde, el sitio degrada a contenido vacío en vez de caerse.
    return porDefecto;
  }
}

const VARIANTES: Record<string, string> = {
  BRAND: "brand",
  GOLD: "gold",
  ROSE: "rose",
  GREEN: "green",
  DEEP: "deep",
  SUBTLE: "subtle",
};

export interface Banner {
  titulo: string;
  etiqueta: string;
  descripcion: string | null;
  enlace: string;
  textoBoton: string | null;
  variante: "brand" | "gold" | "green";
  imagenUrl: string | null;
  textoAlternativo: string | null;
}

export async function obtenerBanners(): Promise<Banner[]> {
  const datos = await obtener<Record<string, unknown>[]>(
    "/banners/publicos",
    [],
  );
  return datos.map((b) => ({
    titulo: String(b.titulo),
    etiqueta: String(b.etiqueta),
    descripcion: (b.descripcion as string) ?? null,
    enlace: String(b.enlace),
    textoBoton: (b.textoBoton as string) ?? null,
    variante: (VARIANTES[String(b.variante)] ?? "brand") as Banner["variante"],
    imagenUrl: (b.imagenUrl as string) ?? null,
    textoAlternativo: (b.textoAlternativo as string) ?? null,
  }));
}

export interface Programa {
  titulo: string;
  subtitulo: string;
  enlace: string;
  variante: string;
  imagenUrl: string | null;
  textoAlternativo: string | null;
}

export async function obtenerProgramas(): Promise<Programa[]> {
  const datos = await obtener<Record<string, unknown>[]>(
    "/programas/publicos",
    [],
  );
  return datos.map((p) => ({
    titulo: String(p.titulo),
    subtitulo: String(p.subtitulo),
    enlace: String(p.enlace),
    variante: VARIANTES[String(p.variante)] ?? "brand",
    imagenUrl: (p.imagenUrl as string) ?? null,
    textoAlternativo: (p.textoAlternativo as string) ?? null,
  }));
}

export interface Actividad {
  titulo: string;
  resumen: string;
  descripcion: string;
  costo: string;
  modalidad: "presencial" | "online" | "mixto";
  proximamente: boolean;
}

const MODALIDADES: Record<string, Actividad["modalidad"]> = {
  PRESENCIAL: "presencial",
  ONLINE: "online",
  MIXTO: "mixto",
};

export async function obtenerActividades(): Promise<Actividad[]> {
  const datos = await obtener<Record<string, unknown>[]>(
    "/actividades/publicas",
    [],
  );
  return datos.map((a) => ({
    titulo: String(a.titulo),
    resumen: String(a.resumen),
    descripcion: String(a.descripcion),
    costo: String(a.costo),
    modalidad: MODALIDADES[String(a.modalidad)] ?? "presencial",
    proximamente: a.estado === "EN_DESARROLLO",
  }));
}

export interface Miembro {
  nombre: string;
  usuarioRedes: string;
  rol: string;
  fotoUrl: string | null;
}

export async function obtenerEquipo(): Promise<Miembro[]> {
  const datos = await obtener<Record<string, unknown>[]>("/equipo/publico", []);
  return datos.map((m) => ({
    nombre: String(m.nombre),
    usuarioRedes: String(m.usuarioRedes),
    rol: String(m.rol),
    fotoUrl: (m.fotoUrl as string) ?? null,
  }));
}

export interface Aliado {
  nombre: string;
  usuarioRedes: string;
  enlace: string | null;
}

export async function obtenerAliados(): Promise<Aliado[]> {
  const datos = await obtener<Record<string, unknown>[]>(
    "/aliados/publicos",
    [],
  );
  return datos.map((a) => ({
    nombre: String(a.nombre),
    usuarioRedes: String(a.usuarioRedes),
    enlace: (a.enlace as string) ?? null,
  }));
}

export interface Valor {
  titulo: string;
  descripcion: string;
}

export async function obtenerValores(): Promise<Valor[]> {
  const datos = await obtener<Record<string, unknown>[]>(
    "/valores/publicos",
    [],
  );
  return datos.map((v) => ({
    titulo: String(v.titulo),
    descripcion: String(v.descripcion),
  }));
}

export interface DatosDonaciones {
  intro: string;
  yapeNumero: string | null;
  yapeQrUrl: string | null;
  plinNumero: string | null;
  plinQrUrl: string | null;
  paypalUrl: string | null;
  cuentas: { banco: string; titular: string; numero: string; cci: string }[];
  impactos: { monto: string; descripcion: string }[];
}

export async function obtenerDonaciones(): Promise<DatosDonaciones | null> {
  return obtener<DatosDonaciones | null>("/donaciones/publica", null);
}

export const API_PUBLICA_URL = API_URL;
