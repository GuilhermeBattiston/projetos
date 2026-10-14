export const currency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value / 100,
  );
export function normalizeCart(raw, products) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return Object.fromEntries(
    products
      .filter((p) => Number.isInteger(raw[p.id]) && raw[p.id] > 0)
      .map((p) => [p.id, Math.min(raw[p.id], 99)]),
  );
}
export const orderLines = (cart, products) =>
  products
    .filter((p) => cart[p.id] > 0)
    .map((p) => ({ ...p, quantity: cart[p.id] }));
export const subtotal = (lines) =>
  lines.reduce((sum, p) => sum + p.price * p.quantity, 0);
export function buildMessage({ name, method, address, notes }, lines) {
  return [
    "Olá, Tapioca Estação BR! Gostaria de solicitar este pedido:",
    "",
    `Nome: ${name.trim()}`,
    ...lines.map(
      (p) =>
        `${p.quantity}x ${p.name} — ${currency(p.price)} cada — ${currency(p.quantity * p.price)}`,
    ),
    "",
    `Subtotal dos produtos: ${currency(subtotal(lines))}`,
    `Atendimento: ${method === "delivery" ? "Entrega" : "Retirada"}`,
    method === "delivery" ? `Endereço: ${address.trim()}` : null,
    notes.trim() ? `Observações: ${notes.trim()}` : null,
    "",
    "Disponibilidade, atendimento e eventual frete a confirmar com a equipe.",
  ]
    .filter((v) => v !== null)
    .join("\n");
}
export function whatsappUrl(phone, message) {
  if (!/^[1-9]\d{9,14}$/.test(phone)) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
