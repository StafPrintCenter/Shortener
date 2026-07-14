const isProd = import.meta.env.PROD;
const fallbackAlias = isProd ? "ebdu5x" : "spc.local";

export const SITE = {
  name: "STAF PRINT CENTER",
  slogan: 'L\'empreinte de votre succès',
  activity: 'Studio de design et d\'impression',
  url: import.meta.env.VITE_SITE_URL,
  alias: import.meta.env.VITE_SHORT_ALIAS || fallbackAlias,
};
