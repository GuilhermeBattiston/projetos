import { useEffect, useRef, useState } from "react";
import { Plus, X, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { references } from "../content.js";
import { image } from "../config.js";
import { Label } from "./Shared.jsx";
const filters = ["Todas", ...references.map((item) => item.category)];
export default function Gallery({ onChoose }) {
  const [filter, setFilter] = useState("Todas");
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const closeButton = useRef(null);
  const visible = references.filter(
    (item) => filter === "Todas" || item.category === filter,
  );
  const current = visible.find((item) => item.id === selected);
  const close = () => {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus();
  };
  const move = (amount) =>
    setSelected(
      visible[
        (visible.findIndex((item) => item.id === selected) +
          amount +
          visible.length) %
          visible.length
      ].id,
    );
  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open) {
      dialog.current.showModal();
      closeButton.current?.focus();
    }
  }, [selected]);
  return (
    <section className="gallery section container" id="inspiracoes">
      <Label number="02">INSPIRAÇÕES PARA A SUA COZINHA</Label>
      <div className="section-heading">
        <h2>
          Encontre o seu <br />
          <em>ponto de partida.</em>
        </h2>
        <p>
          Diferentes olhares sobre o mesmo espaço. <br />
          Qual deles conversa com você?
        </p>
      </div>
      <div className="filters" role="group" aria-label="Filtrar por inspiração">
        {filters.map((category) => (
          <button
            key={category}
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={`gallery-grid ${filter === "Todas" ? "" : "filtered"}`}>
        {visible.map((item, index) => (
          <article className={`reference reference-${item.id}`} key={item.id}>
            <button
              className="image-button"
              aria-label={`Ampliar inspiração: ${item.title}`}
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setSelected(item.id);
              }}
            >
              <img
                src={image(item.image)}
                alt={`${item.alt} Imagem gerada; não é projeto da empresa.`}
                width="1536"
                height="1024"
                loading="lazy"
              />
              <span className="image-plus">
                <Plus size={20} aria-hidden="true" />
              </span>
              <span className="image-tag">ILUSTRATIVA</span>
            </button>
            <div className="reference-caption">
              <span className="reference-index">
                0{index + 1} / {item.category}
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <a
                className="text-link"
                href="#preferencias"
                onClick={() => onChoose(item)}
              >
                Partir desta inspiração
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="content-note">
        Referências geradas e ilustrativas, não são obras da empresa. Categorias
        de inspiração não representam modelos ou serviços comerciais
        confirmados.
      </p>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-labelledby="lightbox-title"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        <button
          ref={closeButton}
          className="lightbox-close"
          onClick={close}
          aria-label="Fechar imagem"
        >
          <X aria-hidden="true" />
        </button>
        {current && (
          <>
            <img src={image(current.image)} alt={current.alt} />
            <div className="lightbox-footer">
              <div aria-live="polite">
                <span className="eyebrow">REFERÊNCIA ILUSTRATIVA</span>
                <h3 id="lightbox-title">{current.title}</h3>
                <p>Imagem gerada. Não é projeto da empresa.</p>
              </div>
              <div className="lightbox-controls">
                <button aria-label="Imagem anterior" onClick={() => move(-1)}>
                  <ArrowLeft aria-hidden="true" />
                </button>
                <button aria-label="Próxima imagem" onClick={() => move(1)}>
                  <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
