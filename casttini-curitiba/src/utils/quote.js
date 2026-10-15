import { environments } from "../content.js";
import { whatsappUrl } from "../config.js";
export function validateQuote(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Informe seu nome.";
  if (!environments.some((item) => item.id === values.environment))
    errors.environment = "Escolha um ambiente.";
  if (!values.location.trim())
    errors.location = "Informe sua cidade ou bairro.";
  if (!values.description.trim())
    errors.description = "Conte um pouco sobre o seu projeto.";
  return errors;
}
export function buildQuote(values) {
  if (Object.keys(validateQuote(values)).length)
    throw new Error("Preencha os campos obrigatórios.");
  const name = environments.find((item) => item.id === values.environment).name;
  const message = [
    "Olá! Gostaria de conversar com a Casttini Curitiba sobre um projeto de móveis planejados.",
    "",
    `Nome: ${values.name.trim()}`,
    `Ambiente: ${name}`,
    `Localização: ${values.location.trim()}`,
    `Descrição: ${values.description.trim()}`,
  ].join("\n");
  return { message, url: whatsappUrl(message) };
}
