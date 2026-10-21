import { environments, projectTypes, priorities } from "../content.ts";
import { whatsappUrl } from "../config.ts";
export interface BriefingValues {
  environment: string;
  type: string;
  priorities: string[];
  name: string;
  location: string;
  measurements: string;
  description: string;
}
export type Field = keyof BriefingValues;
export type Errors = Partial<Record<Field, string>>;
export const initialValues: BriefingValues = {
  environment: "",
  type: "",
  priorities: [],
  name: "",
  location: "",
  measurements: "",
  description: "",
};
export const stepOf = (key: Field) =>
  key === "environment" ? 0 : key === "type" ? 1 : key === "priorities" ? 2 : 3;
export function validate(values: BriefingValues, step?: number): Errors {
  const errors: Errors = {};
  if (
    (step === undefined || step === 0) &&
    !environments.some((x) => x.id === values.environment)
  )
    errors.environment = "Escolha um ambiente.";
  if (
    (step === undefined || step === 1) &&
    !projectTypes.some((x) => x.id === values.type)
  )
    errors.type = "Escolha o tipo de projeto.";
  if (
    (step === undefined || step === 2) &&
    (!values.priorities.length ||
      values.priorities.some((x) => !priorities.some((p) => p.id === x)))
  )
    errors.priorities = "Selecione pelo menos uma prioridade válida.";
  if (step === undefined || step === 3) {
    if (!values.name.trim()) errors.name = "Informe seu nome.";
    if (!values.location.trim())
      errors.location = "Informe sua cidade ou bairro.";
    if (!values.description.trim())
      errors.description = "Conte um pouco sobre o projeto.";
  }
  return errors;
}
export function buildBriefing(values: BriefingValues) {
  if (Object.keys(validate(values)).length)
    throw new Error("Revise os campos obrigatórios.");
  const message = `Olá! Conheci o site da Movelaria Curitiba e gostaria de solicitar informações sobre um projeto sob medida.\n\nNome: ${values.name.trim()}\nAmbiente: ${environments.find((x) => x.id === values.environment)!.label}\nTipo de projeto: ${projectTypes.find((x) => x.id === values.type)!.label}\nPrioridades: ${priorities
    .filter((x) => values.priorities.includes(x.id))
    .map((x) => x.label)
    .join(
      ", ",
    )}\nLocalização: ${values.location.trim()}\nMedidas: ${values.measurements.trim() || "Ainda não informadas"}\nDescrição: ${values.description.trim()}`;
  return { message, url: whatsappUrl(message) };
}
