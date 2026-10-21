export const company = {
  name: "Movelaria Curitiba",
  city: "Curitiba — PR",
  phone: "(41) 99615-2584",
  whatsapp: "5541996152584",
  email: "contato@movelariacuritiba.com.br",
  website: "https://www.movelariacuritiba.com.br/",
};
export const imageUrl = (name: string) =>
  `${import.meta.env.BASE_URL}images/${name}.webp`;
export const whatsappUrl = (
  message = "Olá! Gostaria de conversar com a Movelaria Curitiba sobre um projeto sob medida.",
) => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
