import { layouts, styles, priorities } from "../content.js";
import { whatsappUrl } from "../config.js";
export const initialPreferences = {
  layout: "",
  style: "",
  priority: "",
  location: "",
  name: "",
  description: "",
};
const findLabel = (choices, id) =>
  choices.find((item) => item.id === id)?.label;
export function validatePreferences(values, step) {
  const errors = {};
  if (step === undefined || step === 0) {
    if (!findLabel(layouts, values.layout))
      errors.layout = "Escolha um formato, ou selecione “Ainda não sei”.";
    if (!findLabel(styles, values.style))
      errors.style = "Escolha um estilo de referência.";
  }
  if (step === undefined || step === 1) {
    if (!findLabel(priorities, values.priority))
      errors.priority = "Selecione sua principal prioridade.";
    if (!values.location.trim())
      errors.location = "Informe sua cidade ou bairro.";
  }
  if (step === undefined || step === 2) {
    if (!values.name.trim()) errors.name = "Informe seu nome.";
  }
  return errors;
}
export function buildPreferences(values) {
  if (Object.keys(validatePreferences(values)).length)
    throw new Error("Preencha as preferências obrigatórias.");
  const message = [
    "Olá! Gostaria de conversar com a Planejados Curitiba sobre uma cozinha planejada.",
    "",
    `Nome: ${values.name.trim()}`,
    `Tipo de cozinha: ${findLabel(layouts, values.layout)}`,
    `Estilo: ${findLabel(styles, values.style)}`,
    `Prioridade: ${findLabel(priorities, values.priority)}`,
    `Localização: ${values.location.trim()}`,
    `Observações: ${values.description.trim() || "Prefiro conversar sobre os detalhes."}`,
  ].join("\n");
  return { message, url: whatsappUrl(message) };
}
