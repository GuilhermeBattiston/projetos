export function buildQuote({ name, service, location, description }) {
  return `Olá! Gostaria de solicitar um orçamento com a Lima Climatização.\n\nNome: ${name.trim()}\nServiço: ${service.trim()}\nLocalização: ${location.trim()}\nDescrição: ${description.trim()}`;
}
export function whatsappUrl(phone, message) {
  if (!/^[1-9]\d{9,14}$/.test(phone)) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
export function validateQuote(details) {
  return Object.fromEntries(
    ["name", "service", "location", "description"]
      .filter((key) => !String(details[key] ?? "").trim())
      .map((key) => [key, "Preencha este campo para continuar."]),
  );
}
