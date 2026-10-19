import { environments, needs, styles } from "../content.ts";
import { whatsappUrl } from "../config.ts";
export type BriefingField =
  | "environment"
  | "need"
  | "style"
  | "name"
  | "location"
  | "measurements"
  | "notes";
export type BriefingValues = Record<BriefingField, string>;
export type BriefingErrors = Partial<Record<BriefingField, string>>;
export const initialBriefing: BriefingValues = {
  environment: "",
  need: "",
  style: "",
  name: "",
  location: "",
  measurements: "",
  notes: "",
};
export function validateBriefing(
  values: BriefingValues,
  step?: number,
): BriefingErrors {
  const errors: BriefingErrors = {};
  if (step === undefined || step === 0)
    if (!environments.some((item) => item.id === values.environment))
      errors.environment = "Escolha um ambiente, ou selecione “Outro”.";
  if (step === undefined || step === 1)
    if (!needs.some((item) => item.id === values.need))
      errors.need = "Selecione sua principal necessidade.";
  if (step === undefined || step === 2)
    if (!styles.some((item) => item.id === values.style))
      errors.style =
        "Escolha uma referência, ou indique que ainda não tem preferência.";
  if (step === undefined || step === 3) {
    if (!values.name.trim()) errors.name = "Informe seu nome.";
    if (!values.location.trim())
      errors.location = "Informe seu bairro ou cidade.";
  }
  return errors;
}
export function buildBriefing(values: BriefingValues) {
  if (Object.keys(validateBriefing(values)).length)
    throw new Error("Complete os campos obrigatórios.");
  const message = [
    "Olá! Conheci a Unitudo Planejados e gostaria de conversar sobre móveis planejados.",
    "",
    `Nome: ${values.name.trim()}`,
    `Ambiente: ${environments.find((item) => item.id === values.environment)!.label}`,
    `Necessidade: ${needs.find((item) => item.id === values.need)!.label}`,
    `Estilo: ${styles.find((item) => item.id === values.style)!.label}`,
    `Localização: ${values.location.trim()}`,
    `Medidas: ${values.measurements.trim() || "Ainda não informadas"}`,
    `Observações: ${values.notes.trim() || "Prefiro conversar sobre os detalhes."}`,
  ].join("\n");
  return { message, url: whatsappUrl(message) };
}
export const fieldStep = (field: BriefingField) =>
  field === "environment"
    ? 0
    : field === "need"
      ? 1
      : field === "style"
        ? 2
        : 3;
