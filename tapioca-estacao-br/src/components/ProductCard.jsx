import { useState } from "react";
import { Coffee, Plus } from "lucide-react";
import { currency } from "../utils/order";
export function ProductImage({ product, eager = false }) {
  const [failed, setFailed] = useState(false);
  return product.image && !failed ? (
    <img
      src={product.image}
      srcSet={
        product.image.replace(".webp", "-360.webp") +
        " 360w, " +
        product.image +
        " 640w"
      }
      sizes={
        eager
          ? "(max-width: 760px) calc(100vw - 32px), 45vw"
          : "(max-width: 374px) calc(100vw - 40px), (max-width: 700px) calc((100vw - 52px)/2), (max-width: 1000px) 45vw, 360px"
      }
      alt={product.alt}
      width="640"
      height="640"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  ) : (
    <div
      className="image-placeholder"
      role="img"
      aria-label={"Foto de " + product.name + " a confirmar"}
    >
      <Coffee size={36} />
      <span>Foto a confirmar</span>
    </div>
  );
}
export default function ProductCard({ product, onSelect }) {
  return (
    <article className="product-card">
      <button
        className="product-photo"
        onClick={onSelect}
        aria-label={"Ver " + product.name}
      >
        <ProductImage product={product} />
        {product.number && (
          <span className="product-number">{product.number}</span>
        )}
      </button>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        {product.packagingPending && (
          <small className="packaging-note">
            Embalagem ilustrativa, sem rótulo. Foto oficial a confirmar.
          </small>
        )}
        <div className="product-bottom">
          <strong>{currency(product.price)}</strong>
          <button
            className="add-button"
            onClick={onSelect}
            disabled={!product.available}
            aria-label={"Escolher " + product.name}
          >
            <Plus size={18} />
            {product.available ? "Escolher" : "Indisponível"}
          </button>
        </div>
      </div>
    </article>
  );
}
