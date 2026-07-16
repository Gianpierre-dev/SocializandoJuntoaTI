import datos from "../content/site.json";

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
  volunteerForm: string;
  /** Public Google Apps Script Web App URL that stores volunteer submissions. */
  volunteerEndpoint: string;
  requirements: string[];
  benefits: string[];
  areas: SiteArea[];
}

// El contenido vive en src/content/site.json y se edita desde el panel
// administrativo (/keystatic). Este módulo solo aporta el tipado.
export const site: Site = datos;
