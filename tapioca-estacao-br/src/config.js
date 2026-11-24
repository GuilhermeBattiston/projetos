const baseUrl = import.meta.env?.BASE_URL ?? "/";
// Dados fornecidos pelo usuário. Telefone principal provisório; confirmar antes da operação.
export const business = {
  name: "Estação da Tapioca",
  instagramHandle: "@tapiocaestacaobr",
  instagram: "https://www.instagram.com/tapiocaestacaobr/",
  whatsapp: "5587988619978",
  whatsappSecondary: "5587981810168",
  phones: [
    { name: "Delivery", number: "5587988619978", formatted: "(87) 98861-9978" },
    {
      name: "Delivery alternativo",
      number: "5587981810168",
      formatted: "(87) 98181-0168",
    },
  ],
  whatsappConfirmed: false,
  demo: true,
  pickupConfirmed: false,
  deliveryFee: null,
  logo: `${baseUrl}brand/logo-header.webp`,
  logoHero: `${baseUrl}brand/logo.webp`,
  logoFooter: `${baseUrl}brand/logo-footer.webp`,
  logoOriginal: `${baseUrl}brand/logo-original.jpeg`,
  favicon: `${baseUrl}brand/favicon.png`,
  ogImage: `${baseUrl}brand/og-image.webp`,
  seasoning:
    "Orégano, pimenta-do-reino e azeite. Solicite sem tempero se preferir.",
};
