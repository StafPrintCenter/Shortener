export const SITE = {
  name: "STAF PRINT CENTER",
  slogan: 'L\'empreinte de votre succès',
  activity: 'Studio de design et d\'impression',
  manager: "Steve Aster Afovo",
  city: "Porto-Novo, Bénin",
  phone: "+229 01 66 52 36 39",
  whatsapp: "+229 01 60 30 06 07",
  whatsappLink: "https://wa.me/2290160300607",
  email: "stafprintcenter@gmail.com",
  url: import.meta.env.VITE_SITE_URL,
  shortAlias: import.meta.env.VITE_SITE_URL,
};

export const NAV_LINKS = [
  { label: "Services", to: "/services" },
  { label: "Réalisations", to: "/projects" },
  { label: "Formations", to: "/training" },
  { label: "Blog", to: "/articles" },
  { label: "FAQs", to: "/faqs" },
] as const;

export const FOOTER_LINKS = [
  { label: "Mentions légales", to: "/legal/mentions" },
  { label: "Conditions Générales de Vente", to: "/legal/cgv" },
  { label: "Confidentialité", to: "/legal/privacy" },
] as const;