import { ArrowUpRight } from "lucide-react";
import { company, whatsappUrl } from "../config.js";
export function Brand() {
  return (
    <a href="#inicio" className="brand" aria-label={`${company.name}, início`}>
      <span className="brand-emblem" aria-hidden="true">
        m<span>b</span>
      </span>
      <span className="brand-type">
        Movelaria <strong>Batel</strong>
        <small>- Planejados Curitiba</small>
      </span>
    </a>
  );
}
export function WhatsApp({
  children = "Solicitar um orçamento",
  className = "",
  subject = "",
}) {
  return (
    <a
      className={`cta ${className}`}
      href={whatsappUrl(subject)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
export function SectionLabel({ number, children, light = false }) {
  return (
    <div className={`section-label${light ? " light" : ""}`}>
      <span>{number}</span>
      <span>{children}</span>
      <i aria-hidden="true" />
    </div>
  );
}
