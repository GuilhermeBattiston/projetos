import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import Header from "./components/Header";
import {
  Hero,
  MenuSection,
  About,
  Contact,
  Footer,
} from "./components/Sections";
import Cart from "./components/Cart";
import ProductDetails from "./components/ProductDetails";
import { useCart } from "./hooks/useCart";
import { products } from "./data/products";
import { orderLines, subtotal, currency } from "./utils/order";
export default function App() {
  const [open, setOpen] = useState(false),
    [selected, setSelected] = useState(null),
    [notice, setNotice] = useState("");
  const { cart, add, change, remove, clear, storageUnavailable } = useCart();
  const lines = orderLines(cart, products),
    count = lines.reduce((s, p) => s + p.quantity, 0);
  const incluir = (id, options) => {
    add(id, options);
    setNotice("Produto adicionado ao pedido.");
  };
  return (
    <>
      <a className="skip-link" href="#cardapio">
        Pular para o cardápio
      </a>
      <div className="announcement-bar">
        Feita na hora <span>·</span> Delivery em Garanhuns
      </div>
      <Header
        count={count}
        openCart={() => {
          setNotice("");
          setOpen(true);
        }}
      />
      <main>
        <Hero onOrder={() => setOpen(true)} />
        <MenuSection onSelect={setSelected} />
        <About />
        <Contact />
      </main>
      <Footer />
      {count > 0 && (
        <button className="mobile-cart" onClick={() => setOpen(true)}>
          <ShoppingBag size={19} />
          <span>
            Meu pedido · {count} {count === 1 ? "item" : "itens"}
          </span>
          <strong>{currency(subtotal(lines))}</strong>
        </button>
      )}
      <span className="sr-only" aria-live="polite">
        {count} itens no pedido. Total {currency(subtotal(lines))}.
      </span>
      {notice && (
        <div className="notice" role="status">
          {notice}
          <button aria-label="Fechar aviso" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
      {open && (
        <Cart
          onClose={() => setOpen(false)}
          lines={lines}
          change={change}
          remove={remove}
          clear={clear}
          storageUnavailable={storageUnavailable}
        />
      )}{" "}
      {selected && (
        <ProductDetails
          key={selected.id}
          product={selected}
          onClose={() => setSelected(null)}
          onAdd={incluir}
        />
      )}
    </>
  );
}
