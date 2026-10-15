export const company = Object.freeze({
  name: "Planejados Curitiba — Fábrica de Cozinhas Planejadas",
  phone: "5541984172689",
  phoneLabel: "(41) 98417-2689",
  address: "Alameda Dr. Carlos de Carvalho, 771",
  neighborhood: "Centro, Curitiba — PR",
  cep: "80430-180",
  maps: "https://maps.google.com/?cid=17027054168084007393",
});
export const image = (name) => `${import.meta.env.BASE_URL}images/${name}.webp`;
export const whatsappUrl = (
  message = "Olá! Conheci a Planejados Curitiba pelo site e gostaria de conversar sobre uma cozinha planejada.",
) => `https://wa.me/${company.phone}?text=${encodeURIComponent(message)}`;
