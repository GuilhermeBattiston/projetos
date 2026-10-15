import { steps } from "../content.js";
import { Label } from "./Shared.jsx";
export default function Process() {
  return (
    <section className="process section">
      <div className="container">
        <Label number="03">COMEÇAR PODE SER SIMPLES</Label>
        <div className="section-heading">
          <h2>
            Da primeira ideia <br />à próxima <em>conversa.</em>
          </h2>
          <p>
            Algumas perguntas ajudam a organizar <br />o que você procura para a
            sua cozinha.
          </p>
        </div>
        <div className="process-steps">
          {steps.map(([title, text], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <p className="content-note">
          Jornada ilustrativa de primeiro contato. Condições, etapas e
          disponibilidade devem ser confirmadas com a empresa. Não é um processo
          oficial.
        </p>
      </div>
    </section>
  );
}
