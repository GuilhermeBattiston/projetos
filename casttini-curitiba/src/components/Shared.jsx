import { ArrowUpRight } from "lucide-react";
export function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Casttini Curitiba, início">
      <strong>
        casttini<span>.</span>
      </strong>
      <small>CURITIBA / MÓVEIS PLANEJADOS</small>
    </a>
  );
}
export function QuoteLink({
  children = "Solicitar orçamento",
  className = "",
  onClick,
}) {
  return (
    <a href="#orcamento" className={`button ${className}`} onClick={onClick}>
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
export function Label({ number, children }) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span>{children}</span>
      <i aria-hidden="true" />
    </div>
  );
}
