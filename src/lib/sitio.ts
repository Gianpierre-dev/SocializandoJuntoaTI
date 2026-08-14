// Datos generales del sitio: se leen de la API (editables desde el panel)
// con degradación al snapshot local si la API no responde.
import respaldo from "./sitio-fallback.json";

const API_URL =
  import.meta.env.PUBLIC_API_URL ??
  "https://backend-production-98ca.up.railway.app";

export interface SiteSocials {
  instagram: string;
  tiktok: string;
  facebook: string;
  linktree: string;
  whatsapp: string;
}

export interface SiteArea {
  title: string;
  description: string;
}

export interface Site {
  name: string;
  slogan: string;
  foundedDate: string;
  audience: string;
  mission: string;
  vision: string;
  objective: string;
  locations: string[];
  online: string[];
  socials: SiteSocials;
  requirements: string[];
  benefits: string[];
  /** Beneficios para quienes participan de las actividades. */
  participantBenefits: string[];
  areas: SiteArea[];
}

const SITIO_RESPALDO: Site = {
  name: respaldo.name,
  slogan: respaldo.slogan,
  foundedDate: respaldo.foundedDate,
  audience: respaldo.audience,
  mission: respaldo.mission,
  vision: respaldo.vision,
  objective: respaldo.objective,
  locations: respaldo.locations,
  online: respaldo.online,
  socials: respaldo.socials,
  requirements: respaldo.requirements,
  benefits: respaldo.benefits,
  participantBenefits: [],
  areas: respaldo.areas,
};

interface ConfiguracionApi {
  nombre: string;
  eslogan: string;
  fechaFundacion: string;
  publicoObjetivo: string;
  mision: string;
  vision: string;
  objetivo: string;
  instagramUrl: string | null;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  linktreeUrl: string | null;
  whatsappUrl: string | null;
  sedes: { nombre: string }[];
  plataformas: { nombre: string }[];
  requisitos: { texto: string }[];
  beneficios: { texto: string }[];
  beneficiosParticipante?: { texto: string }[];
  areas: { titulo: string; descripcion: string }[];
}

export async function obtenerSitio(): Promise<Site> {
  try {
    const respuesta = await fetch(`${API_URL}/api/configuracion/publica`);
    if (!respuesta.ok) return SITIO_RESPALDO;
    const datos = (await respuesta.json()) as ConfiguracionApi | null;
    if (!datos) return SITIO_RESPALDO;

    return {
      name: datos.nombre,
      slogan: datos.eslogan,
      foundedDate: datos.fechaFundacion,
      audience: datos.publicoObjetivo,
      mission: datos.mision,
      vision: datos.vision,
      objective: datos.objetivo,
      locations: datos.sedes.map((s) => s.nombre),
      online: datos.plataformas.map((p) => p.nombre),
      socials: {
        instagram: datos.instagramUrl ?? "",
        tiktok: datos.tiktokUrl ?? "",
        facebook: datos.facebookUrl ?? "",
        linktree: datos.linktreeUrl ?? "",
        whatsapp: datos.whatsappUrl ?? "",
      },
      requirements: datos.requisitos.map((r) => r.texto),
      benefits: datos.beneficios.map((b) => b.texto),
      participantBenefits: (datos.beneficiosParticipante ?? []).map(
        (b) => b.texto,
      ),
      areas: datos.areas.map((a) => ({
        title: a.titulo,
        description: a.descripcion,
      })),
    };
  } catch {
    return SITIO_RESPALDO;
  }
}
