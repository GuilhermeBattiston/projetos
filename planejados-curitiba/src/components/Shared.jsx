import { ArrowUpRight } from "lucide-react";
import { company } from "../config.js";
export function Brand() {
  return (
    <a className="brand" href="#inicio" aria-label={`${company.name}, início`}>
      <strong>
        planejados<span>.</span>
      </strong>
      <span>
        CURITIBA <i /> COZINHAS PLANEJADAS
      </span>
    </a>
  );
}
export function PlanningLink({
  children = "Solicitar orçamento",
  className = "",
  onClick,
}) {
  return (
    <a className={`button ${className}`} href="#preferencias" onClick={onClick}>
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
export function KitchenPlan({ type = "linear", large = false }) {
  const paths = {
    linear: "M20 20h80v17H20z",
    l: "M20 20h80v17H37v63H20z",
    u: "M20 20h80v80H83V37H37v63H20z",
    ilha: "M20 20h80v17H20z M42 62h45v22H42z",
    indefinida: "",
  };
  return (
    <svg
      className={large ? "kitchen-plan large" : "kitchen-plan"}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <path className="plan-room" d="M10 104V10h100v94H87m-54 0H10" />
      <path className="plan-cabinet" d={paths[type] || paths.linear} />
      {type === "indefinida" ? (
        <>
          <path
            className="plan-question"
            d="M49 49a13 13 0 1 1 20 11c-7 4-9 7-9 14"
          />
          <circle cx="60" cy="84" r="2" fill="currentColor" />
        </>
      ) : (
        <>
          <path className="plan-details" d="M58 21v15m-15-8h7m22-3h12v8H72z" />
          <circle className="plan-details" cx="91" cy="28" r="3" />
        </>
      )}
    </svg>
  );
}
