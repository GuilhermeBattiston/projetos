import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { services } from "../data/content";
import { business } from "../config";
import { buildQuote, validateQuote, whatsappUrl } from "../utils/quote";
import { ContactDetails } from "./Information";
export default function QuoteForm({ service, setService }) {
  const [details, setDetails] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [review, setReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const form = useRef(null);
  const reviewTitle = useRef(null);
  useEffect(() => {
    if (review) reviewTitle.current?.focus();
  }, [review]);
  const allDetails = { ...details, service };
  const message = buildQuote(allDetails);
  const url = whatsappUrl(business.phone, message);
  const change = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setReview(false);
    setCopied(false);
  };
  const submit = (e) => {
    e.preventDefault();
    const next = validateQuote(allDetails);
    setErrors(next);
    if (Object.keys(next).length) {
      form.current.elements[Object.keys(next)[0]].focus();
      return;
    }
    setReview(true);
    setCopied(false);
    setCopyError(false);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <section className="quote-section section" id="contato">
      <div className="container quote-layout">
        <div className="quote-copy">
          <span className="eyebrow">07 / CONTE O QUE VOCÊ PRECISA</span>
          <h2>
            Seu próximo passo
            <br />
            começa aqui<span>.</span>
          </h2>
          <p>
            Descreva sua necessidade. Nós organizamos a mensagem para você
            continuar a conversa diretamente no WhatsApp.
          </p>
          <ContactDetails />
        </div>
        <div className="quote-form-wrap" id="orcamento">
          <div className="form-heading">
            <span className="eyebrow">SOLICITAÇÃO DE ORÇAMENTO</span>
            <span>SEM ENVIO AUTOMÁTICO</span>
          </div>
          {!review ? (
            <form ref={form} onSubmit={submit} noValidate>
              <div className="form-row">
                <label className="field">
                  Seu nome
                  <input
                    name="name"
                    value={details.name}
                    onChange={change}
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Como podemos te chamar?"
                    required
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <span className="field-error" id="name-error">
                      {errors.name}
                    </span>
                  )}
                </label>
                <label className="field">
                  Cidade ou bairro
                  <input
                    name="location"
                    value={details.location}
                    onChange={change}
                    maxLength={120}
                    autoComplete="address-level2"
                    placeholder="Onde é o atendimento?"
                    required
                    aria-invalid={!!errors.location}
                    aria-describedby={
                      errors.location ? "location-error" : undefined
                    }
                  />
                  {errors.location && (
                    <span className="field-error" id="location-error">
                      {errors.location}
                    </span>
                  )}
                </label>
              </div>
              <label className="field">
                Sobre o que deseja conversar?
                <select
                  name="service"
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    setErrors({ ...errors, service: "" });
                  }}
                  required
                  aria-invalid={!!errors.service}
                  aria-describedby={
                    errors.service ? "service-error" : undefined
                  }
                >
                  <option value="">Selecione uma opção</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Outra necessidade / preciso de orientação">
                    Outra necessidade / preciso de orientação
                  </option>
                </select>
                {errors.service && (
                  <span className="field-error" id="service-error">
                    {errors.service}
                  </span>
                )}
                <small>
                  Opções demonstrativas. Serviços sujeitos à confirmação.
                </small>
              </label>
              <label className="field">
                Descreva sua necessidade
                <textarea
                  name="description"
                  value={details.description}
                  onChange={change}
                  maxLength={1500}
                  rows={4}
                  placeholder="Conte sobre o ambiente, o equipamento ou o problema que deseja avaliar."
                  required
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                />
                {errors.description && (
                  <span className="field-error" id="description-error">
                    {errors.description}
                  </span>
                )}
              </label>
              <button type="submit" className="button orange form-button">
                Preparar mensagem <ArrowUpRight size={19} />
              </button>
              <p className="form-note">
                Seus dados não são armazenados pelo site. O envio será concluído
                por você no WhatsApp e não confirma um atendimento.
              </p>
            </form>
          ) : (
            <div
              className="quote-review"
              role="region"
              aria-label="Revisão da solicitação"
            >
              <h3 ref={reviewTitle} tabIndex={-1}>
                Confira antes de continuar.
              </h3>
              <p>Esta mensagem ainda não foi enviada.</p>
              <pre>{message}</pre>
              <a
                className="button orange form-button"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                Continuar no WhatsApp <ArrowUpRight size={18} />
              </a>
              <div className="review-actions">
                <button onClick={() => setReview(false)}>
                  <ArrowLeft size={16} />
                  Editar informações
                </button>
                <button onClick={copy}>
                  {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
                  {copied ? "Mensagem copiada" : "Copiar mensagem"}
                </button>
              </div>
              <span aria-live="polite" className="form-note">
                {copied ? "Mensagem copiada para a área de transferência." : ""}
              </span>
              {copyError && (
                <p role="alert">
                  Não foi possível copiar. Selecione o texto da mensagem acima.
                </p>
              )}
              <p className="form-note">
                Ao continuar, você sairá deste site. Disponibilidade, valores e
                condições devem ser combinados com a empresa.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
