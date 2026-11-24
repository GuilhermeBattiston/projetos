import { useState } from "react";
import { Menu, X, ShoppingBag, ArrowUpRight } from "lucide-react";
import { business } from "../config";
export function Brand({ footer = false }) {
  return (
    <a className="brand" href="#inicio" aria-label={business.name + ", início"}>
      <img
        src={footer ? business.logoFooter : business.logo}
        width="160"
        height="160"
        alt="Estação da Tapioca"
      />
    </a>
  );
}
export default function Header({ count, openCart }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner section-shell">
        <Brand />
        <nav
          id="main-navigation"
          aria-label="Navegação principal"
          className={menu ? "navigation is-open" : "navigation"}
        >
          {[
            ["cardapio", "Cardápio"],
            ["sobre", "Sabor e tradição"],
            ["contato", "Delivery"],
          ].map(([id, label]) => (
            <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
              {label}
              {id === "contato" && <ArrowUpRight size={15} />}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="cart-toggle"
            onClick={openCart}
            aria-label={"Abrir meu pedido, " + count + " itens"}
          >
            <ShoppingBag size={21} />
            <span>Meu pedido</span>
            <b>{count}</b>
          </button>
          <button
            className="menu-toggle icon-button"
            aria-expanded={menu}
            aria-controls="main-navigation"
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
