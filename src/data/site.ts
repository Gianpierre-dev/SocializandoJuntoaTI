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

export const site: Site = {
  name: "Socializando Junto A Ti",
  slogan: "Conectamos corazones, fortalecemos mentes",
  foundedDate: "17 de marzo de 2024",
  audience: "Adolescentes y jóvenes",
  mission:
    "Potenciar las habilidades interpersonales e intrapersonales de los jóvenes, mediante dinámicas interactivas, talleres psicológicos, actividades artísticas y propuestas psicoeducativas con especialistas en cada temática, con el fin de generar un impacto positivo en el bienestar de la salud mental de nuestro público juvenil.",
  vision:
    "Ser una Organización Juvenil reconocida y recomendada en Lima, acreditada y respaldada por entidades mayores, destacando por concientizar y promocionar la importancia y el cuidado de la salud mental en los adolescentes y jóvenes a través de nuestras actividades sociales y colaboraciones con otras organizaciones, instituciones, municipalidades y aliados.",
  objective:
    "Promover el cuidado de la salud mental en adolescentes y jóvenes a través de actividades sociales, talleres psicoeducativos y dinámicas interactivas, fomentando el bienestar emocional y el desarrollo personal.",
  locations: [
    "Campo de Marte",
    "Parque de la Exposición",
    "Parque María Reiche",
    "Parque de la Pera",
  ],
  online: ["Google Meet", "Zoom"],
  socials: {
    instagram: "https://www.instagram.com/socializandojuntoati/",
    tiktok: "#",
    facebook: "#",
    linktree: "https://linktr.ee/Socializandojuntoati",
    whatsapp: "#",
  },
  volunteerForm: "#",
  // Paste the Google Apps Script Web App URL here (ends in /exec).
  // See docs/integraciones/apps-script-inscripciones.gs for setup.
  volunteerEndpoint: "",
  requirements: [
    "Ser estudiante o egresado entre los 18 y 35 años.",
    "Tener disponibilidad de 3 a 5 horas los fines de semana.",
    "Tener interés y compromiso con la importancia y el bienestar de la salud mental.",
    "Compartir y recomendar nuestras redes sociales (TikTok, Instagram y Facebook).",
  ],
  benefits: [
    "Capacitaciones semanales mientras realizas tus funciones.",
    "Flexibilidad de horarios y días.",
    "Oportunidades de crecimiento personal, laboral y profesional.",
    "Reconocimiento por tus acciones voluntarias en redes sociales.",
    "Un buen clima dinámico de trabajo en equipo.",
    "Oportunidad de representar a la organización ante aliados y otras organizaciones.",
    "Certificado oficial al finalizar tu voluntariado.",
    "Posibilidad de ser director(a) de la organización a largo plazo, según tus evaluaciones.",
  ],
  areas: [
    {
      title: "Marketing y Publicidad",
      description:
        "Promover las actividades y eventos, maximizando el alcance y la participación juvenil.",
    },
    {
      title: "Proyectos Sociales",
      description:
        "Diseñar y coordinar programas y actividades: dinámicas, temáticas, materiales y cronograma.",
    },
    {
      title: "Logística",
      description:
        "Asegurar que los eventos se ejecuten de forma eficiente: asistencia, transporte, materiales y formularios de satisfacción.",
    },
    {
      title: "Recursos Humanos y Comunicaciones",
      description:
        "Gestionar y motivar al equipo y al público, asegurando un ambiente colaborativo.",
    },
    {
      title: "Capacitación Académica",
      description:
        "Investigar, actualizar y compartir conocimientos de psicología; proponer talleres y contenidos.",
    },
    {
      title: "Relaciones Públicas",
      description:
        "Gestionar la comunicación con el público interno y externo y fortalecer vínculos con aliados.",
    },
  ],
};
