import { useState } from "react";
import {
  Minus,
  Plus,
  Trash2,
  Copy,
  ArrowUpRight,
  ShoppingBag,
} from "lucide-react";
import Modal from "./Modal";
import { business } from "../config";
import { categoryInfo } from "../data/products";
import {
  currency,
  subtotal,
  groupLines,
  buildMessage,
  whatsappUrl,
} from "../utils/order";
function Groups({ lines, change, remove, editable }) {
  return groupLines(lines).map((g) => (
    <section
      key={g.category}
      className="cart-group"
      style={
        /** @type {import('react').CSSProperties} */ ({
          "--category": categoryInfo[g.category]?.color,
        })
      }
      aria-label={g.category}
    >
      <h3>{g.category}</h3>
      <ul className="cart-lines">
        {g.lines.map((p) => (
          <li key={p.id}>
            <div className="cart-line-top">
              <div>
                <h4>{p.name}</h4>
                <small>{currency(p.price)} / unidade</small>
                {p.semTempero && <p className="line-notes">Sem tempero</p>}
                {p.notes && <p className="line-notes">{p.notes}</p>}
              </div>
              {editable && (
                <button
                  className="icon-button"
                  aria-label={
                    "Remover " + p.name + (p.semTempero ? " sem tempero" : "")
                  }
                  onClick={() => remove(p.id)}
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>
            <div className="cart-line-bottom">
              {editable ? (
                <div className="quantity">
                  <button
                    aria-label={"Diminuir " + p.name}
                    onClick={() => change(p.id, -1)}
                  >
                    <Minus size={15} />
                  </button>
                  <output>{p.quantity}</output>
                  <button
                    disabled={p.quantity >= 99}
                    aria-label={"Aumentar " + p.name}
                    onClick={() => change(p.id, 1)}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              ) : (
                <span>{p.quantity} unidades</span>
              )}
              <strong>{currency(p.price * p.quantity)}</strong>
            </div>
          </li>
        ))}
      </ul>
      <div className="category-subtotal">
        <span>
          {g.quantity} {g.quantity === 1 ? "unidade" : "unidades"}
        </span>
        <b>Subtotal: {currency(g.subtotal)}</b>
      </div>
    </section>
  ));
}
const emptyDetails = {
  name: "",
  method: "delivery",
  address: {
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
    reference: "",
  },
  notes: "",
};
export default function Cart({
  onClose,
  lines,
  change,
  remove,
  clear,
  storageUnavailable,
}) {
  const [step, setStep] = useState("cart"),
    [details, setDetails] = useState(emptyDetails),
    [copied, setCopied] = useState(""),
    [confirmClear, setConfirmClear] = useState(false);
  const total = subtotal(lines),
    message = buildMessage(details, lines),
    url = whatsappUrl(business.whatsapp, message);
  const personal = (key, value) => {
    setDetails((d) => ({ ...d, [key]: value }));
    setCopied("");
  };
  const address = (key, value) =>
    setDetails((d) => ({ ...d, address: { ...d.address, [key]: value } }));
  return (
    <Modal
      title="Seu pedido na Estação da Tapioca"
      onClose={onClose}
      className="cart-dialog"
    >
      <div className="cart-panel">
        <div className="cart-heading">
          <img
            src={business.logo}
            alt="Estação da Tapioca"
            width="100"
            height="100"
          />
          <div>
            <span className="eyebrow">FEITO DO SEU JEITO</span>
            <h2>
              Seu pedido<span>.</span>
            </h2>
          </div>
        </div>
        {!lines.length ? (
          <div className="empty-cart">
            <ShoppingBag size={45} />
            <h3>Vamos escolher um sabor?</h3>
            <p>Explore o cardápio para montar seu pedido.</p>
            <button className="button primary" onClick={onClose}>
              Ver cardápio
            </button>
          </div>
        ) : (
          <>
            <div className="cart-content">
              <ol className="checkout-steps">
                <li aria-current={step === "cart" ? "step" : undefined}>
                  01 Sacola
                </li>
                <li aria-current={step === "checkout" ? "step" : undefined}>
                  02 Seus dados
                </li>
                <li aria-current={step === "review" ? "step" : undefined}>
                  03 Revisão
                </li>
              </ol>
              <Groups
                lines={lines}
                change={change}
                remove={remove}
                editable={step === "cart"}
              />
              {step === "cart" &&
                (confirmClear ? (
                  <div className="clear-confirm">
                    <p>Remover todos os itens do pedido?</p>
                    <button
                      className="button outline"
                      onClick={() => {
                        clear();
                        setConfirmClear(false);
                      }}
                    >
                      Confirmar limpeza
                    </button>
                    <button
                      className="text-button"
                      onClick={() => setConfirmClear(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-button"
                    onClick={() => setConfirmClear(true)}
                  >
                    Limpar pedido
                  </button>
                ))}
              {step === "checkout" && (
                <form
                  id="order-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep("review");
                    setCopied("");
                  }}
                >
                  <h3>Como podemos te atender?</h3>
                  <label className="field">
                    Seu nome
                    <input
                      name="name"
                      required
                      pattern=".*\S.*"
                      maxLength={80}
                      autoComplete="name"
                      value={details.name}
                      onChange={(e) => personal("name", e.target.value)}
                    />
                  </label>
                  <fieldset className="fulfillment">
                    <legend>Modalidade</legend>
                    <label>
                      <input
                        type="radio"
                        name="method"
                        checked={details.method === "delivery"}
                        onChange={() => personal("method", "delivery")}
                      />
                      Delivery
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="method"
                        checked={details.method === "pickup"}
                        onChange={() => personal("method", "pickup")}
                      />
                      Retirada (demonstrativa)
                    </label>
                  </fieldset>
                  {details.method === "delivery" && (
                    <>
                      <div className="address-grid">
                        {
                          /** @type {[string,string,boolean][]} */ ([
                            ["street", "Rua", true],
                            ["number", "Número", true],
                            ["neighborhood", "Bairro", true],
                            ["complement", "Complemento", false],
                            ["reference", "Ponto de referência", false],
                          ]).map(([key, label, required]) => (
                            <label className="field" key={key}>
                              {label}
                              {!required && <span>opcional</span>}
                              <input
                                required={required}
                                pattern={required ? ".*\\S.*" : undefined}
                                maxLength={key === "number" ? 20 : 100}
                                autoComplete={
                                  key === "street"
                                    ? "address-line1"
                                    : key === "complement"
                                      ? "address-line2"
                                      : "off"
                                }
                                value={details.address[key]}
                                onChange={(e) => address(key, e.target.value)}
                              />
                            </label>
                          ))
                        }
                      </div>
                      <p className="fine">
                        Taxa de entrega a confirmar pelo atendimento.
                      </p>
                    </>
                  )}
                  <label className="field">
                    Observações gerais <span>(opcional)</span>
                    <textarea
                      maxLength={500}
                      value={details.notes}
                      onChange={(e) => personal("notes", e.target.value)}
                    />
                  </label>
                </form>
              )}
              {step === "review" && (
                <section
                  className="order-review"
                  aria-label="Revisão do pedido"
                >
                  <h3>Confira sua mensagem</h3>
                  <label className="field">
                    Mensagem para WhatsApp
                    <textarea readOnly value={message} rows={12} />
                  </label>
                  <button
                    className="button outline"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(message);
                        setCopied("Mensagem copiada.");
                      } catch {
                        setCopied(
                          "Cópia indisponível. Selecione o texto acima e copie manualmente.",
                        );
                      }
                    }}
                  >
                    <Copy size={17} />
                    Copiar mensagem
                  </button>
                  <p role="status">{copied}</p>
                  <p className="fine">
                    O pedido ainda não foi enviado nem confirmado. Ao abrir o
                    WhatsApp, confira o número e envie a mensagem se desejar.
                  </p>
                </section>
              )}
              {storageUnavailable && (
                <p className="storage-warning" role="status">
                  Não foi possível salvar o carrinho neste navegador. Seu pedido
                  fica disponível nesta sessão.
                </p>
              )}
            </div>
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total dos produtos</span>
                <strong data-testid="subtotal">{currency(total)}</strong>
              </div>
              <p className="fine">
                {details.method === "delivery"
                  ? "Taxa de entrega a confirmar pelo atendimento."
                  : "Retirada demonstrativa, a confirmar com o atendimento."}
              </p>
              <div className="cart-footer-actions">
                {step !== "cart" && (
                  <button
                    className="button outline"
                    onClick={() =>
                      setStep(step === "review" ? "checkout" : "cart")
                    }
                  >
                    Voltar
                  </button>
                )}
                {step === "cart" ? (
                  <button
                    className="button primary"
                    onClick={() => setStep("checkout")}
                  >
                    Continuar pedido <ArrowUpRight size={18} />
                  </button>
                ) : step === "checkout" ? (
                  <button
                    className="button primary"
                    form="order-form"
                    type="submit"
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
                  <p>WhatsApp a configurar</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
