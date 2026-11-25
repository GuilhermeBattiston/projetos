import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Modal from "./Modal";
import { ProductImage } from "./ProductCard";
import { currency } from "../utils/order";
import { business } from "../config";
export default function ProductDetails({ product: p, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1),
    [semTempero, setSemTempero] = useState(false),
    [notes, setNotes] = useState("");
  return (
    <Modal
      title={"Personalizar " + p.name}
      onClose={onClose}
      className="product-dialog"
    >
      <div className="detail-photo">
        <ProductImage product={p} eager />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAdd(p.id, { quantity, semTempero, notes });
          onClose();
        }}
      >
        <div className="detail-copy">
          <span className="eyebrow">{p.category}</span>
          <h2>{p.name}</h2>
          <p>{p.description}</p>
          <strong className="detail-price">
            {currency(p.price)} / unidade
          </strong>
          {p.customizable && (
            <fieldset>
              <legend>Tempero</legend>
              <p>Orégano, pimenta-do-reino e azeite.</p>
              <label className="check-option">
                <input
                  type="checkbox"
                  checked={semTempero}
                  onChange={(e) => setSemTempero(e.target.checked)}
                />
                Solicitar sem tempero
              </label>
            </fieldset>
          )}
          <label className="field">
            Observações do produto <span>(opcional)</span>
            <textarea
              value={notes}
              maxLength={300}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como você prefere seu pedido?"
            />
          </label>
          <p className="fine">
            Informe suas preferências nas observações e confirme restrições
            alimentares com o atendimento.
          </p>
          <p className="fine">
            {p.packagingPending && "Embalagem ilustrativa. "}
            Imagem ilustrativa. {business.name}.
          </p>
        </div>
        <div className="detail-bottom">
          <div className="quantity">
            <button
              type="button"
              disabled={quantity === 1}
              aria-label="Diminuir quantidade"
              onClick={() => setQuantity((q) => q - 1)}
            >
              <Minus size={16} />
            </button>
            <output aria-label="Quantidade">{quantity}</output>
            <button
              type="button"
              disabled={quantity === 99}
              aria-label="Aumentar quantidade"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus size={16} />
            </button>
          </div>
          <button className="button primary" type="submit">
            Adicionar · {currency(p.price * quantity)}
          </button>
        </div>
      </form>
    </Modal>
  );
}
