export const company = Object.freeze({
  name: 'Lucas Construções e Reformas em Geral',
  city: 'Curitiba', state: 'PR',
  phone: '5541998175073', phoneLabel: '(41) 99817-5073',
  address: 'Rua Idalino Francisco Túlio, 248',
  neighborhood: 'Santa Cândida, Curitiba — PR', cep: '82360-566',
  maps: 'https://maps.google.com/?cid=14687284506171798171',
});
export const asset = (name) => `${import.meta.env.BASE_URL}images/${name}`;
export function whatsappUrl(subject = '') {
  const message = 'Olá! Conheci a Lucas Construções e Reformas pelo site e gostaria de conversar sobre um orçamento.' + (subject ? ` Tenho interesse em ${subject}.` : '');
  return `https://wa.me/${company.phone}?text=${encodeURIComponent(message)}`;
}
