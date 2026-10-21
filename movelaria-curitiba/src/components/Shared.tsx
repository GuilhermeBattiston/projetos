import { ArrowUpRight } from "lucide-react";
export function Brand() {
  return (
    <a
      href="#inicio"
      className="brand"
      aria-label="Movelaria Curitiba — início"
    >
      <span className="brand-monogram" aria-hidden="true">
        m<span>c</span>
      </span>
      <span>
        movelaria
        <br />
        <strong>curitiba</strong>
      </span>
    </a>
  );
}
export function BriefLink({
  children = "Solicitar orçamento",
  onClick,
}: {
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a className="button" href="#briefing" onClick={onClick}>
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}
export function Eyebrow({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="eyebrow">
      <span>{number}</span>
      {children}
    </p>
  );
}
