import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, ArrowLeft, ArrowUpRight, Copy, Check } from "lucide-react";
import { environments, needs, styles } from "../content.ts";
import {
  buildBriefing,
  validateBriefing,
  fieldStep,
} from "../utils/briefing.ts";
import type {
  BriefingValues,
  BriefingErrors,
  BriefingField,
} from "../utils/briefing.ts";
import { Label } from "./Shared.tsx";
import ChoiceGroup from "./ChoiceGroup.tsx";
const steps = ["Ambiente", "Necessidade", "Estilo", "Informações", "Revisão"];
interface Props {
  values: BriefingValues;
  setValues: (values: BriefingValues) => void;
  step: number;
  setStep: (step: number) => void;
}
export default function Briefing({ values, setValues, step, setStep }: Props) {
  const [submittedErrors, setErrors] = useState<BriefingErrors>({});
  const currentErrors = validateBriefing(values);
  const errors = Object.fromEntries(
    Object.entries(submittedErrors).filter(
      ([key]) => currentErrors[key as BriefingField],
    ),
  ) as BriefingErrors;
  const [visited, setVisited] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const focusHeading = () =>
    requestAnimationFrame(() =>
      document.getElementById("brief-heading")?.focus({ preventScroll: true }),
    );
  const go = (index: number) => {
    if (index === 4) {
      const issues = validateBriefing(values);
      if (Object.keys(issues).length) {
        setStep(fieldStep(Object.keys(issues)[0] as BriefingField));
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
  const update = (name: BriefingField, value: string) => {
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: undefined });
    setCopyStatus("");
  };
  const focusError = (issues: BriefingErrors) =>
    requestAnimationFrame(() => {
      const name = Object.keys(issues)[0];
      const element = document.getElementById(`brief-${name}`);
      (element?.querySelector("input") || element)?.focus();
    });
  const next = (event: FormEvent) => {
    event.preventDefault();
    const issues = validateBriefing(values, step);
    setErrors(issues);
    if (Object.keys(issues).length) {
      focusError(issues);
      return;
    }
    if (step === 3) {
      const all = validateBriefing(values);
      if (Object.keys(all).length) {
        setStep(fieldStep(Object.keys(all)[0] as BriefingField));
        setErrors(all);
        focusError(all);
        return;
      }
    }
    setVisited(Math.max(visited, step + 1));
    setStep(step + 1);
    setCopyStatus("");
    focusHeading();
  };
  const review =
    step === 4 && !Object.keys(validateBriefing(values)).length
      ? buildBriefing(values)
      : null;
  const copy = async () => {
    if (!review) return;
    try {
      await navigator.clipboard.writeText(review.message);
      setCopyStatus("Briefing copiado.");
    } catch {
      setCopyStatus(
        "Não foi possível copiar. Selecione o texto ou continue no WhatsApp.",
      );
    }
  };
  const attributes = (name: BriefingField) => ({
    id: `brief-${name}`,
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `error-${name}` : undefined,
  });
  return (
    <section className="briefing section" id="briefing">
      <div className="container">
        <Label number="04">VAMOS DESENHAR O PRIMEIRO CONTATO</Label>
        <div className="section-heading">
          <h2>
            Conte a sua ideia. <br />O próximo passo <br />é uma{" "}
            <em>conversa.</em>
          </h2>
          <p>
            Um briefing curto para organizar o que você procura. <br />
            Você revisa tudo antes de abrir o WhatsApp.
          </p>
        </div>
        <div className="briefing-layout">
          <div className="briefing-main">
            <ol className="briefing-progress" aria-label="Etapas do briefing">
              {steps.map((title, index) => (
                <li key={title}>
                  <button
                    type="button"
                    disabled={index > visited}
                    aria-current={step === index ? "step" : undefined}
                    onClick={() => go(index)}
                  >
                    <span>
                      {step > index ? (
                        <Check size={13} aria-hidden="true" />
                      ) : (
                        `0${index + 1}`
                      )}
                    </span>
                    <small>{title}</small>
                  </button>
                </li>
              ))}
            </ol>
            {review ? (
              <section className="brief-review" aria-live="polite">
                <span className="eyebrow">SEU BRIEFING ESTÁ ORGANIZADO</span>
                <h3 id="brief-heading" tabIndex={-1}>
                  Vamos conferir?
                </h3>
                <p>
                  Revise as informações. A mensagem só é enviada por você,
                  dentro do WhatsApp.
                </p>
                <pre>{review.message}</pre>
                <div className="review-actions">
                  <a
                    className="button"
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enviar meu briefing pelo WhatsApp
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                  <button type="button" className="copy-button" onClick={copy}>
                    <Copy size={15} aria-hidden="true" />
                    Copiar briefing
                  </button>
                </div>
                <button
                  className="back-button"
                  type="button"
                  onClick={() => go(0)}
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  Revisar respostas
                </button>
                <p className="copy-status" role="status">
                  {copyStatus ||
                    "Nenhuma mensagem foi enviada. Abrir a conversa não confirma atendimento."}
                </p>
              </section>
            ) : (
              <form onSubmit={next} noValidate>
                <div className="briefing-heading">
                  <span className="eyebrow">PASSO 0{step + 1} DE 05</span>
                  <h3 id="brief-heading" tabIndex={-1}>
                    {
                      [
                        "Qual ambiente você tem em mente?",
                        "O que você gostaria de mudar?",
                        "O que combina com você?",
                        "Agora, um pouco de contexto.",
                      ][step]
                    }
                  </h3>
                </div>
                {step === 0 && (
                  <>
                    <ChoiceGroup
                      name="environment"
                      title="Escolha um ambiente"
                      options={environments}
                      value={values.environment}
                      onChange={update}
                      error={errors.environment}
                      visual
                    />
                    <p className="field-help">
                      Referências para o briefing. Consulte com a Unitudo os
                      ambientes efetivamente atendidos.
                    </p>
                  </>
                )}
                {step === 1 && (
                  <ChoiceGroup
                    name="need"
                    title="Sua principal necessidade"
                    options={needs}
                    value={values.need}
                    onChange={update}
                    error={errors.need}
                  />
                )}
                {step === 2 && (
                  <ChoiceGroup
                    name="style"
                    title="Preferência estética"
                    options={styles}
                    value={values.style}
                    onChange={update}
                    error={errors.style}
                  />
                )}
                {step === 3 && (
                  <>
                    <div className="form-row">
                      <div className="field">
                        <label htmlFor="brief-name">
                          Nome<span>*</span>
                        </label>
                        <input
                          {...attributes("name")}
                          value={values.name}
                          onChange={(event) =>
                            update("name", event.target.value)
                          }
                          autoComplete="name"
                          maxLength={100}
                          placeholder="Como podemos chamar você?"
                          required
                        />
                        {errors.name && (
                          <p className="field-error" id="error-name">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="field">
                        <label htmlFor="brief-location">
                          Bairro ou cidade<span>*</span>
                        </label>
                        <input
                          {...attributes("location")}
                          value={values.location}
                          onChange={(event) =>
                            update("location", event.target.value)
                          }
                          autoComplete="address-level2"
                          maxLength={150}
                          placeholder="Onde fica o ambiente?"
                          required
                        />
                        {errors.location && (
                          <p className="field-error" id="error-location">
                            {errors.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="brief-measurements">
                        Medidas aproximadas<small>Se souber</small>
                      </label>
                      <input
                        {...attributes("measurements")}
                        value={values.measurements}
                        onChange={(event) =>
                          update("measurements", event.target.value)
                        }
                        maxLength={250}
                        placeholder="Ex.: parede de aproximadamente 2,80 m"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="brief-notes">
                        Descrição ou referências<small>Opcional</small>
                      </label>
                      <textarea
                        {...attributes("notes")}
                        value={values.notes}
                        onChange={(event) =>
                          update("notes", event.target.value)
                        }
                        maxLength={2000}
                        rows={4}
                        placeholder="Conte o que considera importante para o seu projeto."
                      />
                    </div>
                  </>
                )}
                <div className="briefing-actions">
                  {step > 0 ? (
                    <button
                      className="back-button"
                      type="button"
                      onClick={() => go(step - 1)}
                    >
                      <ArrowLeft size={16} aria-hidden="true" />
                      Voltar
                    </button>
                  ) : (
                    <span className="required-note">
                      * Escolhas obrigatórias
                    </span>
                  )}
                  <button className="button" type="submit">
                    {step === 3 ? "Revisar meu briefing" : "Continuar"}
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
                <p className="form-note">
                  Os dados ficam somente nesta página. Nada é armazenado pelo
                  site ou enviado automaticamente.
                </p>
              </form>
            )}
          </div>
          <aside className="briefing-summary" aria-label="Resumo do briefing">
            <span className="eyebrow">O SEU PROJETO COMEÇA POR AQUI</span>
            <p>
              Espaço para <br />a sua{" "}
              <em>
                maneira <br />
                de viver.
              </em>
            </p>
            <dl>
              <div>
                <dt>Ambiente</dt>
                <dd>
                  {environments.find((item) => item.id === values.environment)
                    ?.label || "Vamos descobrir"}
                </dd>
              </div>
              <div>
                <dt>Necessidade</dt>
                <dd>
                  {needs.find((item) => item.id === values.need)?.label ||
                    "O que faz diferença?"}
                </dd>
              </div>
              <div>
                <dt>Estilo</dt>
                <dd>
                  {styles.find((item) => item.id === values.style)?.label ||
                    "Ainda em aberto"}
                </dd>
              </div>
            </dl>
            <span className="summary-note">
              Um ponto de partida para a conversa, sem estimativa de preço ou
              compromisso de contratação.
            </span>
          </aside>
        </div>
      </div>
    </section>
  );
}
