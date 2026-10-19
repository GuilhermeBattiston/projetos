import { ArrowUpRight } from "lucide-react";
export function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label="Unitudo Planejados, início">
      <strong>
        unitudo<span>.</span>
      </strong>
      <small>PLANEJADOS</small>
    </a>
  );
}
export function BriefLink({
  children = "Solicitar orçamento",
  className = "",
  onClick,
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a className={`button ${className}`} href="#briefing" onClick={onClick}>
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </a>
  );
}
export function Label({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span>{children}</span>
      <i aria-hidden="true" />
    </div>
  );
}
