import { useState } from "react";
import { Menu, X, ArrowUpRight, MapPin } from "lucide-react";
export function Brand({ light = false }) {
  return (
    <a
      href="#inicio"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="Lima Climatização, início"
    >
      <span className="brand-mark">
        <i />
        <i />
        <i />
      </span>
      <span className="brand-name">
        LIMA<small>CLIMATIZAÇÃO</small>
      </span>
    </a>
  );
}
const links = [
  ["inicio", "Início"],
  ["servicos", "Serviços"],
  ["sobre", "Sobre"],
  ["atendimento", "Atendimento"],
  ["contato", "Contato"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="proposal-bar">
        <div className="container">
          <span>
            PROPOSTA DE SITE INSTITUCIONAL <i /> CONTEÚDO DEMONSTRATIVO
          </span>
          <span>
            <MapPin size={12} />
            Curitiba, PR · localização informada no material de origem
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav
            id="main-menu"
            className={open ? "main-nav open" : "main-nav"}
            aria-label="Navegação principal"
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
          >
            {links.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
          </nav>
          <a className="button header-cta" href="#orcamento">
            Solicitar orçamento <ArrowUpRight size={16} />
          </a>
          <button
            className="menu-toggle"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="main-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
