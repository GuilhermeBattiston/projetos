import { useState } from "react";
import { Plus, Check, Coffee, Citrus, Wheat } from "lucide-react";
import { currency } from "../utils/order";
export function ProductImage({ product }) {
  const [failed, setFailed] = useState(false);
  const Icon =
    product.id === "cafe" ? Coffee : product.id === "suco" ? Citrus : Wheat;
  return product.image && !failed ? (
    <img
      src={product.image}
      alt={`Imagem ilustrativa de ${product.name.toLowerCase()}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <div
      className={`image-placeholder ${product.category === "Doces" ? "sweet" : ""}`}
    >
      <Icon size={46} strokeWidth={1} />
      <span>Imagem em breve</span>
    </div>
  );
}
export default function ProductCard({ product, onAdd, quantity }) {
  const [added, setAdded] = useState(false);
  const add = () => {
    onAdd(product.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };
  return (
    <article className="product-card">
      <div className="product-photo">
        <ProductImage product={product} />
        {product.tag && <span className="product-tag">{product.tag}</span>}
      </div>
      <div className="product-info">
        <span className="eyebrow">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-bottom">
          <strong>{currency(product.price)}</strong>
          <button
            className={`add-button ${added ? "added" : ""}`}
            onClick={add}
            disabled={quantity >= 99}
            aria-label={`Adicionar ${product.name}`}
          >
            {added ? <Check size={19} /> : <Plus size={19} />}
            <span>
              {quantity >= 99 ? "Limite" : added ? "Adicionado" : "Adicionar"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
