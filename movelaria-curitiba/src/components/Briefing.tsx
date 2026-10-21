import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, ArrowLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import { environments, projectTypes, priorities } from "../content.ts";
import type { Option } from "../content.ts";
import { validate, buildBriefing, stepOf } from "../utils/briefing.ts";
import type { BriefingValues, Errors, Field } from "../utils/briefing.ts";
import { Eyebrow } from "./Shared.tsx";
const steps = [
  "Ambiente",
  "Tipo de projeto",
  "Prioridades",
  "Informações",
  "Revisão",
  "WhatsApp",
];
function Choices({
  name,
  options,
  values,
  onChange,
  error,
  multiple = false,
}: {
  name: "environment" | "type" | "priorities";
  options: Option[];
  values: string[];
  onChange: (value: string) => void;
  error?: string;
  multiple?: boolean;
}) {
  return (
    <fieldset
      id={`brief-${name}`}
      aria-describedby={error ? `error-${name}` : undefined}
    >
      <legend>
        {multiple ? "Selecione uma ou mais opções." : "Selecione uma opção."}
      </legend>
      <div className="choices">
        {options.map((item, index) => (
          <label
            className={`choice ${values.includes(item.id) ? "selected" : ""}`}
            key={item.id}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={item.id}
              checked={values.includes(item.id)}
              onChange={() => onChange(item.id)}
              aria-invalid={Boolean(error)}
            />
            <span className="choice-number" aria-hidden="true">
              0{index + 1}
            </span>
            <span>{item.label}</span>
            <i aria-hidden="true">
              {values.includes(item.id) && <Check size={14} />}
            </i>
          </label>
        ))}
      </div>
      {error && (
        <p className="field-error" id={`error-${name}`} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}
export default function Briefing({
  values,
  setValues,
  step,
  setStep,
}: {
  values: BriefingValues;
  setValues: (value: BriefingValues) => void;
  step: number;
  setStep: (value: number) => void;
}) {
  const [submitted, setErrors] = useState<Errors>({});
  const [visited, setVisited] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const actual = validate(values);
  const errors = Object.fromEntries(
    Object.entries(submitted).filter(([field]) => actual[field as Field]),
  ) as Errors;
  const focusHeading = () =>
    requestAnimationFrame(() =>
      heading.current?.focus({ preventScroll: true }),
    );
  const focusError = (issues: Errors) =>
    requestAnimationFrame(() => {
      const el = document.getElementById(`brief-${Object.keys(issues)[0]}`);
      (el?.querySelector("input") || el)?.focus();
    });
  const go = (index: number) => {
    if (index >= 4) {
      const issues = validate(values);
      if (Object.keys(issues).length) {
        setStep(stepOf(Object.keys(issues)[0] as Field));
        setErrors(issues);
        focusError(issues);
        return;
      }
    }
    setStep(index);
    setErrors({});
    setCopyStatus("");
    focusHeading();
  };
  const update = (field: Field, value: string | string[]) => {
    setValues({ ...values, [field]: value });
    setCopyStatus("");
  };
  const next = (event: FormEvent) => {
    event.preventDefault();
    const issues = validate(values, step);
    if (Object.keys(issues).length) {
      setErrors(issues);
      focusError(issues);
      return;
    }
    setVisited(Math.max(visited, step + 1));
    go(step + 1);
  };
  const review =
    step >= 4 && !Object.keys(actual).length ? buildBriefing(values) : null;
  const copy = async () => {
    if (!review) return;
    try {
      await navigator.clipboard.writeText(review.message);
      setCopyStatus("Briefing copiado.");
    } catch {
      setCopyStatus(
        "Não foi possível copiar. Você pode continuar pelo WhatsApp.",
      );
    }
  };
  const attributes = (field: Field) => ({
    id: `brief-${field}`,
    name: field,
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `error-${field}` : undefined,
  });
  return (
    <section className="section briefing" id="briefing">
      <div className="container">
        <Eyebrow number="05">DO REPERTÓRIO À SUA IDEIA</Eyebrow>
        <div className="section-heading">
          <h2>
            O seu projeto começa <br />
            com uma boa <em>conversa.</em>
          </h2>
          <p>
            Organize o que você imagina. <br />
            Sem calcular preços ou enviar dados automaticamente.
          </p>
        </div>
        <div className="briefing-layout">
          <aside className="brief-sidebar">
            <p className="eyebrow">UM PRIMEIRO ESBOÇO</p>
            <ol className="brief-progress" aria-label="Etapas do briefing">
              {steps.map((title, index) => (
                <li key={title}>
                  <button
                    onClick={() => go(index)}
                    disabled={index > visited}
                    aria-current={index === step ? "step" : undefined}
                  >
                    <span>
                      {index < step ? (
                        <Check size={15} />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>
                    {title}
                  </button>
                </li>
              ))}
            </ol>
            <p>
              As respostas ficam apenas nesta página. Você decide quando abrir o
              WhatsApp.
            </p>
          </aside>
          <div className="brief-main">
            <p className="eyebrow">
              ETAPA {String(step + 1).padStart(2, "0")} / 06
            </p>
            {review ? (
              <div className="brief-review">
                <h3 id="brief-heading" ref={heading} tabIndex={-1}>
                  {step === 4
                    ? "Vamos conferir sua ideia?"
                    : "Tudo pronto para conversar."}
                </h3>
                <p>
                  {step === 4
                    ? "Confira o resumo. Você pode voltar e ajustar qualquer resposta."
                    : "Ao abrir o WhatsApp, revise a mensagem e envie por lá. Nenhum pedido foi enviado por este site."}
                </p>
                <pre>{review.message}</pre>
                <div className="review-actions">
                  {step === 4 ? (
                    <button
                      className="button"
                      onClick={() => {
                        setVisited(5);
                        go(5);
                      }}
                    >
                      Continuar para o WhatsApp <ArrowRight size={17} />
                    </button>
                  ) : (
                    <a
                      className="button"
                      href={review.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enviar briefing pelo WhatsApp <ArrowUpRight size={17} />
                    </a>
                  )}
                  <button className="copy-button" onClick={copy}>
                    <Copy size={16} />
                    Copiar briefing
                  </button>
                </div>
                <p className="copy-status" role="status">
                  {copyStatus}
                </p>
                <button className="back-button" onClick={() => go(0)}>
                  <ArrowLeft size={15} />
                  Editar respostas
                </button>
              </div>
            ) : (
              <form onSubmit={next} noValidate>
                <h3 id="brief-heading" ref={heading} tabIndex={-1}>
                  {
                    [
                      "Qual ambiente você imagina?",
                      "O que você quer planejar?",
                      "O que faz diferença para você?",
                      "Conte um pouco sobre a sua ideia.",
                    ][step]
                  }
                </h3>
                {step === 0 && (
                  <Choices
                    name="environment"
                    options={environments}
                    values={[values.environment]}
                    onChange={(value) => update("environment", value)}
                    error={errors.environment}
                  />
                )}
                {step === 1 && (
                  <Choices
                    name="type"
                    options={projectTypes}
                    values={[values.type]}
                    onChange={(value) => update("type", value)}
                    error={errors.type}
                  />
                )}
                {step === 2 && (
                  <Choices
                    name="priorities"
                    options={priorities}
                    multiple
                    values={values.priorities}
                    onChange={(value) =>
                      update(
                        "priorities",
                        values.priorities.includes(value)
                          ? values.priorities.filter((x) => x !== value)
                          : [...values.priorities, value],
                      )
                    }
                    error={errors.priorities}
                  />
                )}
                {step === 3 && (
                  <div className="fields">
                    <label>
                      Nome *
                      <input
                        {...attributes("name")}
                        value={values.name}
                        autoComplete="given-name"
                        maxLength={100}
                        onChange={(e) => update("name", e.target.value)}
                      />
                      {errors.name && (
                        <span
                          className="field-error"
                          id="error-name"
                          role="alert"
                        >
                          {errors.name}
                        </span>
                      )}
                    </label>
                    <label>
                      Cidade ou bairro *
                      <input
                        {...attributes("location")}
                        value={values.location}
                        autoComplete="address-level2"
                        maxLength={150}
                        onChange={(e) => update("location", e.target.value)}
                      />
                      {errors.location && (
                        <span
                          className="field-error"
                          id="error-location"
                          role="alert"
                        >
                          {errors.location}
                        </span>
                      )}
                    </label>
                    <label className="full">
                      Medidas aproximadas{" "}
                      <span className="optional">(opcional)</span>
                      <input
                        {...attributes("measurements")}
                        value={values.measurements}
                        maxLength={180}
                        placeholder="Se souber, informe as medidas do espaço."
                        onChange={(e) => update("measurements", e.target.value)}
                      />
                    </label>
                    <label className="full">
                      Descrição do projeto *
                      <textarea
                        {...attributes("description")}
                        value={values.description}
                        maxLength={2000}
                        rows={4}
                        placeholder="Como você usa o espaço? O que gostaria de mudar?"
                        onChange={(e) => update("description", e.target.value)}
                      />
                      {errors.description && (
                        <span
                          className="field-error"
                          id="error-description"
                          role="alert"
                        >
                          {errors.description}
                        </span>
                      )}
                    </label>
                    <p className="note full">
                      * Campos obrigatórios. Não informe documentos, senhas ou
                      dados sensíveis.
                    </p>
                  </div>
                )}
                <div className="brief-navigation">
                  {step > 0 ? (
                    <button
                      type="button"
                      className="back-button"
                      onClick={() => go(step - 1)}
                    >
                      <ArrowLeft size={16} />
                      Voltar
                    </button>
                  ) : (
                    <span className="note">Leva só algumas escolhas.</span>
                  )}
                  <button className="button" type="submit">
                    {step === 3 ? "Revisar briefing" : "Continuar"}
                    <ArrowRight size={17} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
