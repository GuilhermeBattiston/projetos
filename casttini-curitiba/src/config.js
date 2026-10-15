export const company = Object.freeze({
  name: "Casttini Curitiba Móveis Planejados",
  phone: "554130422121",
  phoneLabel: "(41) 3042-2121",
  address: "Alameda Dr. Carlos de Carvalho, 982",
  neighborhood: "Batel, Curitiba — PR",
  cep: "80430-180",
  maps: "https://maps.google.com/?cid=15415016691241166023",
});
export const image = (name) => `${import.meta.env.BASE_URL}images/${name}.webp`;
export const whatsappUrl = (
  message = "Olá! Conheci a Casttini Curitiba pelo site e gostaria de conversar sobre um projeto de móveis planejados.",
) => `https://wa.me/${company.phone}?text=${encodeURIComponent(message)}`;
