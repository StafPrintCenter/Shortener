const isProd = import.meta.env.PROD;
const alias = isProd ? "ebdu5x" : "spc.local";

export const SITE = {
  name: "STAF PRINT CENTER",
  slogan: "L'empreinte de votre succès",
  activity: "Studio de design et d'impression",
  url: import.meta.env.VITE_SITE_URL,
  alias,
};

// Message rédigé
export const CONTACT_PRESET_MESSAGE = [
  `Bonjour ${SITE.name},`,
  "",
  "Je découvre votre site internet et je souhaiterais échanger avec votre équipe concernant vos services.",
  "",
  "Pouvez-vous me recontacter lorsque vous serez disponible ?",
  "",
  "Merci et à bientôt.",
].join("\n");

// URL brute
export const CONTACT_PRESET_HUMAN_URL = `?quote=autre&custom=Prise de contact&details=${CONTACT_PRESET_MESSAGE}`;

// Encodage par le navigateur
export const CONTACT_PRESET_URL = `?${new URLSearchParams({
  quote: "autre",
  custom: "Prise de contact",
  details: CONTACT_PRESET_MESSAGE,
}).toString()}`;