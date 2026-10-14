import { useState } from "react";
import { Menu, X, ShoppingBag, ArrowUpRight } from "lucide-react";
export function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Tapioca Estação BR, início">
      <span className="brand-symbol">
        <span />
      </span>
      <span>
        <b>
          estação<span className="brand-br">BR</span>
        </b>
        <small>T A P I O C A</small>
      </span>
    </a>
  );
}
export default function Header({ count, openCart }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav
          id="main-navigation" aria-label="Navegação principal"
          className={menu ? "navigation is-open" : "navigation"}
        >
          <a href="#cardapio" onClick={() => setMenu(false)}>
            Cardápio
          </a>
          <a href="#sobre" onClick={() => setMenu(false)}>
            Nossa proposta
          </a>
          <a href="#contato" onClick={() => setMenu(false)}>
            Contato <ArrowUpRight size={14} />
          </a>
        </nav>
        <div className="header-actions">
          <button className="cart-toggle" onClick={openCart}>
            <ShoppingBag size={18} />
            <span>Meu pedido</span>
            <b aria-label={`${count} itens`}>{count}</b>
          </button>
          <button
            className="menu-toggle icon-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="main-navigation"
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
