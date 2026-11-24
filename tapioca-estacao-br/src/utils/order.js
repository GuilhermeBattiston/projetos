export const CATEGORY_ORDER = [
  "Tapiocas tradicionais",
  "Tapiocas especiais",
  "Tapiocas doces",
  "Sanduíches",
  "Bebidas",
];
export const CART_VERSION = 2;
export const CART_KEY = "estacao-da-tapioca.cart.v2";
export const LEGACY_CART_KEY = "tapioca-estacao-br.cart.v1";
export const currency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value / 100,
  );

const isTapioca = (product) => product.category.startsWith("Tapiocas ");
const cleanNotes = (value) =>
  typeof value === "string" ? value.slice(0, 300).trim() : "";
const signature = (line) =>
  JSON.stringify([line.productId, line.semTempero, line.notes]);

// v1 used a product/quantity object with fictitious IDs and prices. It is never
// interpreted as a new order, even if an old identifier resembles a current one.
export function normalizeCart(raw, products) {
  const items = Array.isArray(raw)
    ? raw
    : raw?.version === CART_VERSION && Array.isArray(raw.items)
      ? raw.items
      : [];
  const catalog = new Map(
    products.filter((p) => p.available !== false).map((p) => [p.id, p]),
  );
  const result = [],
    signatures = new Map(),
    usedIds = new Set();
  for (const [index, value] of items.slice(0, 250).entries()) {
    if (
      !value ||
      typeof value !== "object" ||
      !Number.isInteger(value.quantity) ||
      value.quantity <= 0
    )
      continue;
    const product = catalog.get(value.productId);
    if (!product) continue;
    let id =
      typeof value.id === "string" &&
      value.id.length > 0 &&
      value.id.length <= 120 &&
      !usedIds.has(value.id)
        ? value.id
        : `line-${index}-${product.id}`;
    while (usedIds.has(id)) id += "-";
    const line = {
      id,
      productId: product.id,
      quantity: Math.min(99, value.quantity),
      semTempero: isTapioca(product) && value.semTempero === true,
      notes: cleanNotes(value.notes),
    };
    const key = signature(line);
    if (signatures.has(key)) {
      const existing = result[signatures.get(key)];
      existing.quantity = Math.min(99, existing.quantity + line.quantity);
    } else {
      signatures.set(key, result.length);
      usedIds.add(id);
      result.push(line);
    }
  }
  return result;
}

// Current catalog values always win over values serialized in storage.
export function orderLines(cart, products) {
  const catalog = new Map(products.map((p) => [p.id, p]));
  return normalizeCart(cart, products).map((line) => ({
    ...catalog.get(line.productId),
    ...line,
  }));
}
export const subtotal = (lines) =>
  lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
export function groupLines(lines) {
  const ordered = [
    ...CATEGORY_ORDER,
    ...new Set(
      lines.map((p) => p.category).filter((c) => !CATEGORY_ORDER.includes(c)),
    ),
  ];
  return ordered
    .map((category) => {
      const grouped = lines.filter((line) => line.category === category);
      return {
        category,
        lines: grouped,
        quantity: grouped.reduce((sum, p) => sum + p.quantity, 0),
        subtotal: subtotal(grouped),
      };
    })
    .filter((group) => group.lines.length > 0);
}

function addressLines(address) {
  if (typeof address === "string")
    return address.trim() ? [address.trim()] : [];
  if (!address || typeof address !== "object") return [];
  const fields = [
    ["Rua", address.street ?? address.rua],
    ["Número", address.number ?? address.numero],
    ["Bairro", address.neighborhood ?? address.bairro],
    ["Complemento", address.complement ?? address.complemento],
    ["Referência", address.reference ?? address.referencia],
  ];
  return fields
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`);
}
export function buildMessage(
  { name = "", method = "delivery", address = undefined, notes = "" } = {},
  lines = [],
) {
  const blocks = [
    "Olá! Gostaria de fazer um pedido na Estação da Tapioca.",
    [
      "*CLIENTE*",
      name.trim() ? `Nome: ${name.trim()}` : null,
      `Modalidade: ${method === "delivery" ? "Delivery" : "Retirada (demonstrativa, a confirmar)"}`,
    ]
      .filter(Boolean)
      .join("\n"),
    ...groupLines(lines).map((group) =>
      [
        `*${group.category.toLocaleUpperCase("pt-BR")}*`,
        ...group.lines.map((p) =>
          [
            `${p.quantity}x ${p.name} — ${currency(p.price)} cada — ${currency(p.quantity * p.price)}`,
            p.semTempero ? "Personalização: Sem tempero." : null,
            p.notes?.trim() ? `Observação: ${p.notes.trim()}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        ),
        `Quantidade de unidades: ${group.quantity}`,
        `Subtotal: ${currency(group.subtotal)}`,
      ].join("\n"),
    ),
    `*TOTAL DOS PRODUTOS: ${currency(subtotal(lines))}*`,
    method === "delivery"
      ? "Taxa de entrega a confirmar pelo atendimento."
      : null,
  ];
  const deliveryAddress = method === "delivery" ? addressLines(address) : [];
  if (deliveryAddress.length)
    blocks.push(["*ENDEREÇO*", ...deliveryAddress].join("\n"));
  if (notes.trim()) blocks.push(`*OBSERVAÇÕES GERAIS*\n${notes.trim()}`);
  blocks.push("Aguardo a confirmação do pedido e do valor final.");
  return blocks.filter(Boolean).join("\n\n");
}
export function whatsappUrl(phone, message) {
  if (!/^[1-9]\d{9,14}$/.test(phone)) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
