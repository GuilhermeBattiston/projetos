import { useState } from "react";
import { ArrowRight, ArrowLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import { layouts, styles, priorities } from "../content.js";
import { buildPreferences, validatePreferences } from "../utils/preferences.js";
import { Label, KitchenPlan } from "./Shared.jsx";
import ChoiceGroup from "./ChoiceGroup.jsx";
const titles = ["Seu espaço", "Sua rotina", "Sua ideia"];
export default function PreferenceWizard({ values, setValues, step, setStep }) {
  const [errors, setErrors] = useState({});
  const [visited, setVisited] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const focusHeading = () =>
    requestAnimationFrame(() => {
      document
        .querySelector("#preferencias .wizard-heading h3, #review-title")
        ?.focus({ preventScroll: true });
    });
  const update = (name, value) => {
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: undefined });
    setCopyStatus("");
  };
  const go = (index) => {
    setStep(index);
    setErrors({});
    setCopyStatus("");
    focusHeading();
  };
  const next = (event) => {
    event.preventDefault();
    const issues = validatePreferences(values, step);
    setErrors(issues);
    if (Object.keys(issues).length) {
      const field = document.getElementById(`pref-${Object.keys(issues)[0]}`);
      (field?.querySelector("input") || field)?.focus();
      return;
    }
    if (step === 2) {
      const remaining = validatePreferences(values);
      if (Object.keys(remaining).length) {
        const name = Object.keys(remaining)[0];
        setStep(
          ["layout", "style"].includes(name)
            ? 0
            : ["priority", "location"].includes(name)
              ? 1
              : 2,
        );
        setErrors(remaining);
        requestAnimationFrame(() => {
          const field = document.getElementById(`pref-${name}`);
          (field?.querySelector("input") || field)?.focus();
        });
        return;
      }
    }
    setVisited(Math.max(visited, Math.min(step + 1, 2)));
    setStep(step + 1);
    setCopyStatus("");
    focusHeading();
  };
  const summary =
    step === 3 && !Object.keys(validatePreferences(values)).length
      ? buildPreferences(values)
      : null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary.message);
      setCopyStatus("Mensagem copiada.");
    } catch {
      setCopyStatus(
        "Não foi possível copiar. Selecione o texto ou continue no WhatsApp.",
      );
    }
  };
  const inputAttributes = (name) => ({
    id: `pref-${name}`,
    name,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `error-${name}` : undefined,
  });
  return (
    <section className="preferences section" id="preferencias">
      <div className="container">
        <Label number="04">ANTES DO ORÇAMENTO, AS SUAS PREFERÊNCIAS</Label>
        <div className="section-heading">
          <h2>
            Imagine a cozinha. <br />
            Organize a <em>ideia.</em>
          </h2>
          <p>
            Um jeito simples de começar a conversa. <br />
            Sem cálculo de preço ou orçamento automático.
          </p>
        </div>
        <div className="preference-layout">
          <aside
            className="preference-summary"
            aria-label="Resumo das preferências"
          >
            <span className="eyebrow">SEU PONTO DE PARTIDA</span>
            <KitchenPlan type={values.layout || "indefinida"} large />
            <span className="plan-caption">
              ESQUEMA CONCEITUAL / SEM ESCALA
            </span>
            <dl>
              <div>
                <dt>Formato</dt>
                <dd>
                  {layouts.find((item) => item.id === values.layout)?.label ||
                    "Vamos descobrir"}
                </dd>
              </div>
              <div>
                <dt>Estilo</dt>
                <dd>
                  {styles.find((item) => item.id === values.style)?.label ||
                    "A escolher"}
                </dd>
              </div>
              <div>
                <dt>Prioridade</dt>
                <dd>
                  {priorities.find((item) => item.id === values.priority)
                    ?.label || "O que importa para você?"}
                </dd>
              </div>
            </dl>
            <p>
              As escolhas são referências para o primeiro contato. A viabilidade
              depende do espaço e deve ser confirmada com a empresa.
            </p>
          </aside>
          <div className="preference-content">
            <ol
              className="wizard-progress"
              aria-label="Etapas das preferências"
            >
              {titles.map((title, index) => (
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
                    {title}
                  </button>
                </li>
              ))}
            </ol>
            {summary ? (
              <section
                className="preference-review"
                aria-labelledby="review-title"
                aria-live="polite"
              >
                <span className="eyebrow">PRONTA PARA REVISAR</span>
                <h3 id="review-title" tabIndex={-1}>
                  Sua ideia, em palavras.
                </h3>
                <p>Revise o texto. Você decide quando abrir a conversa.</p>
                <pre>{summary.message}</pre>
                <div className="review-actions">
                  <a
                    className="button"
                    href={summary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Continuar no WhatsApp
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                  <button type="button" className="copy-button" onClick={copy}>
                    <Copy size={14} aria-hidden="true" />
                    Copiar texto
                  </button>
                </div>
                <button
                  className="edit-button"
                  type="button"
                  onClick={() => go(0)}
                >
                  <ArrowLeft size={15} aria-hidden="true" />
                  Editar preferências
                </button>
                <p className="copy-status" role="status">
                  {copyStatus ||
                    "Nenhuma mensagem foi enviada. Seus dados não são armazenados pelo site."}
                </p>
              </section>
            ) : (
              <form onSubmit={next} noValidate>
                <div className="wizard-heading">
                  <span className="eyebrow">PASSO 0{step + 1} / 03</span>
                  <h3 tabIndex={-1}>
                    {step === 0
                      ? "Como você imagina o espaço?"
                      : step === 1
                        ? "O que faz diferença na rotina?"
                        : "Conte um pouco mais."}
                  </h3>
                </div>
                {step === 0 && (
                  <>
                    <ChoiceGroup
                      name="layout"
                      title="Tipo de cozinha"
                      choices={layouts}
                      value={values.layout}
                      onChange={update}
                      error={errors.layout}
                      plans
                    />
                    <ChoiceGroup
                      name="style"
                      title="Estilo preferido"
                      choices={styles}
                      value={values.style}
                      onChange={update}
                      error={errors.style}
                    />
                  </>
                )}
                {step === 1 && (
                  <>
                    <ChoiceGroup
                      name="priority"
                      title="Sua principal prioridade"
                      choices={priorities}
                      value={values.priority}
                      onChange={update}
                      error={errors.priority}
                    />
                    <div className="field">
                      <label htmlFor="pref-location">
                        Cidade ou bairro<span>*</span>
                      </label>
                      <input
                        {...inputAttributes("location")}
                        value={values.location}
                        onChange={(event) =>
                          update("location", event.target.value)
                        }
                        required
                        autoComplete="address-level2"
                        maxLength={150}
                        placeholder="Onde fica a sua cozinha?"
                      />
                      {errors.location && (
                        <p id="error-location" className="field-error">
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="field">
                      <label htmlFor="pref-name">
                        Seu nome<span>*</span>
                      </label>
                      <input
                        {...inputAttributes("name")}
                        value={values.name}
                        onChange={(event) => update("name", event.target.value)}
                        required
                        autoComplete="name"
                        maxLength={100}
                        placeholder="Como podemos chamar você?"
                      />
                      {errors.name && (
                        <p id="error-name" className="field-error">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="field">
                      <label htmlFor="pref-description">
                        Sua ideia ou observações<small>Opcional</small>
                      </label>
                      <textarea
                        {...inputAttributes("description")}
                        value={values.description}
                        onChange={(event) =>
                          update("description", event.target.value)
                        }
                        maxLength={2000}
                        rows={5}
                        placeholder="Conte sobre o ambiente, hábitos, referências ou o que gostaria de mudar."
                      />
                    </div>
                  </>
                )}
                <div className="wizard-actions">
                  {step > 0 ? (
                    <button
                      type="button"
                      className="back-button"
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
                  <button type="submit" className="button">
                    {step === 2 ? "Revisar mensagem" : "Continuar"}
                    <ArrowRight size={17} aria-hidden="true" />
                  </button>
                </div>
                <p className="form-note">
                  As informações ficam apenas nesta página até você abrir o
                  WhatsApp. Nada é enviado automaticamente.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
