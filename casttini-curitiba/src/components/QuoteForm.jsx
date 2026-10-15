import { useState } from "react";
import { ArrowUpRight, ArrowRight, Check, Copy } from "lucide-react";
import { environments } from "../content.js";
import { buildQuote, validateQuote } from "../utils/quote.js";
import { Label } from "./Shared.jsx";
export default function QuoteForm({ environment, setEnvironment }) {
  const [fields, setFields] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [reviewed, setReviewed] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const values = { ...fields, environment };
  const valid = Object.keys(validateQuote(values)).length === 0;
  const review = reviewed && valid ? buildQuote(values) : null;
  const edit = (name, value) => {
    setFields({ ...fields, [name]: value });
    setReviewed(false);
    setCopyStatus("");
    setErrors({ ...errors, [name]: undefined });
  };
  const submit = (event) => {
    event.preventDefault();
    const issues = validateQuote(values);
    setErrors(issues);
    setCopyStatus("");
    if (Object.keys(issues).length) {
      setReviewed(false);
      document.getElementById(`quote-${Object.keys(issues)[0]}`)?.focus();
      return;
    }
    setReviewed(true);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(review.message);
      setCopyStatus("Mensagem copiada.");
    } catch {
      setCopyStatus(
        "Não foi possível copiar. Selecione o texto ou continue no WhatsApp.",
      );
    }
  };
  const attributes = (name) => ({
    id: `quote-${name}`,
    name,
    required: true,
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `error-${name}` : undefined,
  });
  return (
    <section className="quote section" id="orcamento">
      <div className="container">
        <Label number="05">O SEU PROJETO COMEÇA AQUI</Label>
        <div className="quote-layout">
          <div className="quote-intro">
            <span className="eyebrow">UMA IDEIA. UMA CONVERSA.</span>
            <h2>
              Vamos dar lugar <br />
              ao que você <br />
              <em>imagina?</em>
            </h2>
            <p>
              Conte um pouco sobre seu ambiente. Vamos organizar sua ideia em
              uma mensagem para a Casttini Curitiba.
            </p>
            <div className="quote-explanation">
              <span>01</span>
              <p>
                Preencha e revise a mensagem. <br />
                <strong>Você decide quando abrir o WhatsApp.</strong>
              </p>
            </div>
            <span className="quote-footnote">
              Os dados não são armazenados pelo site. Abrir a conversa não
              confirma atendimento ou envio.
            </span>
          </div>
          <div className="quote-content">
            <form onSubmit={submit} noValidate>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="quote-name">
                    Seu nome <span>*</span>
                  </label>
                  <input
                    {...attributes("name")}
                    value={fields.name}
                    onChange={(event) => edit("name", event.target.value)}
                    autoComplete="name"
                    maxLength={100}
                    placeholder="Como podemos chamar você?"
                  />
                  {errors.name && (
                    <p className="field-error" id="error-name">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="field">
                  <label htmlFor="quote-environment">
                    Ambiente <span>*</span>
                  </label>
                  <select
                    {...attributes("environment")}
                    value={environment}
                    onChange={(event) => {
                      setEnvironment(event.target.value);
                      setReviewed(false);
                      setCopyStatus("");
                      setErrors({ ...errors, environment: undefined });
                    }}
                  >
                    <option value="">Selecione uma possibilidade</option>
                    {environments.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {errors.environment && (
                    <p className="field-error" id="error-environment">
                      {errors.environment}
                    </p>
                  )}
                </div>
              </div>
              <div className="field">
                <label htmlFor="quote-location">
                  Cidade ou bairro <span>*</span>
                </label>
                <input
                  {...attributes("location")}
                  value={fields.location}
                  onChange={(event) => edit("location", event.target.value)}
                  autoComplete="address-level2"
                  maxLength={150}
                  placeholder="Onde fica o seu espaço?"
                />
                {errors.location && (
                  <p className="field-error" id="error-location">
                    {errors.location}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="quote-description">
                  Conte sobre a sua ideia <span>*</span>
                </label>
                <textarea
                  {...attributes("description")}
                  value={fields.description}
                  onChange={(event) => edit("description", event.target.value)}
                  maxLength={2000}
                  rows={4}
                  placeholder="O que você gostaria de planejar? Quais são as suas necessidades?"
                />
                {errors.description && (
                  <p className="field-error" id="error-description">
                    {errors.description}
                  </p>
                )}
              </div>
              <p className="form-note">
                * Campos obrigatórios. Categorias demonstrativas; confirme a
                disponibilidade com a empresa.
              </p>
              <button type="submit" className="button form-submit">
                Preparar mensagem
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
            {review && (
              <section
                className="quote-review"
                aria-labelledby="review-title"
                aria-live="polite"
              >
                <span className="eyebrow">
                  <Check size={14} aria-hidden="true" /> PRONTA PARA REVISAR
                </span>
                <h3 id="review-title">Sua mensagem, do seu jeito.</h3>
                <pre>{review.message}</pre>
                <div className="review-actions">
                  <a
                    className="button"
                    href={review.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Continuar no WhatsApp
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                  <button className="copy-button" type="button" onClick={copy}>
                    <Copy size={15} aria-hidden="true" />
                    Copiar texto
                  </button>
                </div>
                <p role="status" className="copy-status">
                  {copyStatus ||
                    "Nenhuma mensagem foi enviada. Revise o texto antes de continuar."}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
