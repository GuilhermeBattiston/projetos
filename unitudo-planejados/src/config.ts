export const company = Object.freeze({
  name: "Unitudo Planejados",
  phone: "5541995935907",
  phoneLabel: "(41) 99593-5907",
  address: "Rua Olivio Domingos Leonardi, 89",
  city: "Curitiba — PR",
  instagram: "https://www.instagram.com/unitudo.planejados/",
  instagramLabel: "@unitudo.planejados",
});
export const mapSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.address}, Curitiba, PR`)}`;
export const imageUrl = (name: string) =>
  `${import.meta.env.BASE_URL}images/${name}.webp`;
export const whatsappUrl = (
  text = "Olá! Conheci a Unitudo Planejados e gostaria de conversar sobre móveis planejados.",
) => `https://wa.me/${company.phone}?text=${encodeURIComponent(text)}`;
