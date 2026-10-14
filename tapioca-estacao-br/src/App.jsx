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
import { useCart } from "./hooks/useCart";
import { products } from "./data/products";
import { orderLines, subtotal, currency } from "./utils/order";
export default function App() {
  const [open, setOpen] = useState(false);
  const { cart, change, remove, storageUnavailable } = useCart();
  const lines = orderLines(cart, products);
  const count = lines.reduce((s, p) => s + p.quantity, 0);
  return (
    <>
      <a className="skip-link" href="#cardapio">
        Pular para o cardápio
      </a>
      <div className="demo-bar">
        UMA PROPOSTA DIGITAL PARA A TAPIOCA ESTAÇÃO BR <span>·</span> PROTÓTIPO
        DEMONSTRATIVO
      </div>
      <Header count={count} openCart={() => setOpen(true)} />
      <main>
        <Hero onOrder={() => setOpen(true)} />
        <MenuSection cart={cart} change={change} />
        <About />
        <Contact />
      </main>
      <Footer />
      {count > 0 && (
        <button className="mobile-cart" onClick={() => setOpen(true)}>
          <ShoppingBag size={19} />
          <span>
            Ver meu pedido · {count} {count === 1 ? "item" : "itens"}
          </span>
          <strong>{currency(subtotal(lines))}</strong>
        </button>
      )}
      <span className="sr-only" aria-live="polite">
        {count} itens no pedido. Subtotal {currency(subtotal(lines))}.
      </span>
      <Cart
        open={open}
        onClose={() => setOpen(false)}
        lines={lines}
        change={change}
        remove={remove}
        storageUnavailable={storageUnavailable}
      />
    </>
  );
}
