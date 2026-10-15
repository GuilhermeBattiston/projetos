import { ArrowUpRight } from "lucide-react";
import { steps } from "../content.js";
import { Label } from "./Shared.jsx";
export default function Process() {
  return (
    <section className="process section">
      <div className="container">
        <Label number="04">ANTES DE TUDO, UMA CONVERSA</Label>
        <div className="section-heading">
          <h2>
            Uma ideia abre <br />o <em>caminho.</em>
          </h2>
          <a href="#orcamento" className="text-link">
            Conte a sua
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="process-grid">
          {steps.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <p className="content-note">
          Jornada ilustrativa, não um processo oficial da empresa. Proposta,
          etapas, condições e disponibilidade devem ser combinadas com a
          Casttini Curitiba.
        </p>
      </div>
    </section>
  );
}
