import { useEffect, useRef, useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowUpRight,
  MapPin,
  Store,
  Check,
  Copy,
} from "lucide-react";
import { currency, subtotal, buildMessage, whatsappUrl } from "../utils/order";
import { business } from "../config";
export default function Cart({
  open,
  onClose,
  lines,
  change,
  remove,
  storageUnavailable,
}) {
  const dialog = useRef(null);
  const [details, setDetails] = useState({
    name: "",
    method: "pickup",
    address: "",
    notes: "",
  });
  const [review, setReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const message = buildMessage(details, lines);
  const url = whatsappUrl(business.whatsapp, message);
  const total = subtotal(lines);
  useEffect(() => {
    const el = dialog.current;
    if (open && !el.open) {
      el.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!open && el.open) {
      el.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  const field = (e) => {
    e.target.setCustomValidity("");
    setDetails({ ...details, [e.target.name]: e.target.value });
    setReview(false);
  };
  const close = () => {
    onClose();
    setReview(false);
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
    <dialog
      className="cart-dialog"
      ref={dialog}
      onCancel={close}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
      aria-labelledby="cart-title"
    >
      <div className="cart-panel">
        <div className="cart-heading">
          <div>
            <span className="eyebrow">FEITO DO SEU JEITO</span>
            <h2 id="cart-title">
              Seu pedido<span>.</span>
            </h2>
          </div>
          <button
            className="icon-button"
            aria-label="Fechar pedido"
            onClick={close}
          >
            <X />
          </button>
        </div>
        {!lines.length ? (
          <div className="empty-cart">
            <ShoppingBag size={50} strokeWidth={1} />
            <h3>Sua pausa começa aqui.</h3>
            <p>Escolha uma tapioca e monte seu pedido.</p>
            <button className="button primary" onClick={close}>
              Explorar cardápio <ArrowUpRight size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-content">
              <div className="cart-demo">
                Cardápio demonstrativo · nenhum pedido será confirmado neste
                protótipo.
              </div>
              <ul className="cart-lines">
                {lines.map((p) => (
                  <li key={p.id}>
                    <div className="cart-line-top">
                      <div>
                        <h3>{p.name}</h3>
                        <small>{currency(p.price)} / unidade</small>
                      </div>
                      <button
                        className="icon-button"
                        aria-label={`Remover ${p.name}`}
                        onClick={() => remove(p.id)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <div className="cart-line-bottom">
                      <div className="quantity">
                        <button
                          aria-label={`Diminuir ${p.name}`}
                          onClick={() => change(p.id, -1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{p.quantity}</span>
                        <button
                          disabled={p.quantity >= 99}
                          aria-label={`Aumentar ${p.name}`}
                          onClick={() => change(p.id, 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <strong>{currency(p.price * p.quantity)}</strong>
                    </div>
                  </li>
                ))}
              </ul>
              <form
                id="order-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (details.method === "delivery" && !details.address.trim()) {
                    e.currentTarget.elements.address.setCustomValidity("Informe um endereço de entrega.");
                    e.currentTarget.reportValidity();
                    return;
                  }
                  setReview(true);
                  setCopied(false);
                }}
              >
                <h3>Como podemos te atender?</h3>
                <label className="field">
                  Seu nome
                  <input
                    name="name"
                    value={details.name}
                    onChange={field}
                    required
                    maxLength={80}
                    pattern=".*\S.*"
                    placeholder="Como você se chama?"
                    autoComplete="name"
                  />
                </label>
                <fieldset className="fulfillment">
                  <legend>Modalidade</legend>
                  <label
                    className={details.method === "pickup" ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="method"
                      value="pickup"
                      checked={details.method === "pickup"}
                      onChange={field}
                    />
                    <Store size={18} />
                    Retirada
                  </label>
                  <label
                    className={details.method === "delivery" ? "selected" : ""}
                  >
                    <input
                      type="radio"
                      name="method"
                      value="delivery"
                      checked={details.method === "delivery"}
                      onChange={field}
                    />
                    <MapPin size={18} />
                    Entrega
                  </label>
                </fieldset>
                {details.method === "delivery" && (
                  <>
                    <label className="field">
                      Endereço de entrega
                      <textarea
                        name="address"
                        value={details.address}
                        onChange={field}
                        required
                        maxLength={300}
                        placeholder="Rua, número, bairro e cidade"
                        autoComplete="street-address"
                      />
                    </label>
                    <p className="field-note">
                      Área de atendimento e eventual frete a confirmar com a
                      equipe.
                    </p>
                  </>
                )}
                <label className="field">
                  Alguma observação? <span>(opcional)</span>
                  <textarea
                    name="notes"
                    value={details.notes}
                    onChange={field}
                    maxLength={500}
                    placeholder="Conte como prefere seu pedido"
                  />
                </label>
              </form>
              {review && (
                <section
                  className="order-review"
                  aria-label="Revisão do pedido"
                >
                  <h3>Confira sua mensagem</h3>
                  <pre>{message}</pre>
                  {!url && (
                    <p className="configuration-note">
                      WhatsApp ainda não configurado. O envio está indisponível;
                      você pode copiar a mensagem para demonstrar o fluxo.
                    </p>
                  )}
                  <button className="copy-button" onClick={copy}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}{" "}
                    {copied ? "Mensagem copiada" : "Copiar mensagem"}
                  </button>
                  {copyError && (
                    <p role="alert">
                      Não foi possível copiar. Selecione o texto da mensagem
                      acima.
                    </p>
                  )}
                </section>
              )}
              {storageUnavailable && (
                <p role="status">
                  O navegador não permite salvar o carrinho. Seus itens ficam
                  disponíveis nesta sessão.
                </p>
              )}
            </div>
            <div className="cart-footer">
              <div>
                <span>Subtotal dos produtos</span>
                <strong data-testid="subtotal">{currency(total)}</strong>
              </div>
              <p>Sem pagamento online. Disponibilidade a confirmar.</p>
              {!review ? (
                <button
                  form="order-form"
                  type="submit"
                  className="button primary"
                >
                  Revisar pedido <ArrowUpRight size={18} />
                </button>
              ) : url ? (
                <a
                  className="button primary"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Continuar no WhatsApp <ArrowUpRight size={18} />
                </a>
              ) : (
                <button className="button primary" disabled>
                  WhatsApp não configurado
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
