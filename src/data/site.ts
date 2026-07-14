const isProd = import.meta.env.PROD;
const alias = isProd ? "ebdu5x" : "spc.local";

// Message rédigé de façon humaine sous forme de tableau
export const CONTACT_PRESET_MESSAGE = [
  "Bonjour STAF PRINT CENTER,",
  "",
  "Je découvre votre site internet et je souhaiterais échanger avec votre équipe concernant vos services.",
  "",
  "Pouvez-vous me recontacter lorsque vous serez disponible ?",
  "",
  "Merci et à bientôt.",
].join("\n");

// URL construite proprement avec l'encodage du navigateur
export const CONTACT_PRESET_URL = `?${new URLSearchParams({
  quote: "autre",
  custom: "Prise de contact",
  details: CONTACT_PRESET_MESSAGE,
}).toString()}`;

export const SITE = {
  name: "STAF PRINT CENTER",
  slogan: "L'empreinte de votre succès",
  activity: "Studio de design et d'impression",
  url: import.meta.env.VITE_SITE_URL,
  alias,
};
