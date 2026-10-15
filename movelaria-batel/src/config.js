export const company = Object.freeze({
  name: "Movelaria Batel - Planejados Curitiba",
  phone: "5541996318510",
  phoneLabel: "(41) 99631-8510",
  address: "Avenida Sete de Setembro, 4682",
  neighborhood: "Batel, Curitiba — PR",
  cep: "80240-000",
  maps: "https://maps.google.com/?cid=14432097110645917681",
});
export const image = (name) => `${import.meta.env.BASE_URL}images/${name}.webp`;
export function whatsappUrl(environment = "") {
  const text =
    "Olá! Conheci a Movelaria Batel pelo site e gostaria de conversar sobre móveis planejados." +
    (environment ? ` Tenho interesse em ${environment}.` : "");
  return `https://wa.me/${company.phone}?text=${encodeURIComponent(text)}`;
}
