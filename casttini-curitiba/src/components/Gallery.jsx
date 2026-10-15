import { useEffect, useRef, useState } from "react";
import { Plus, X, ArrowLeft, ArrowRight } from "lucide-react";
import { inspirations } from "../content.js";
import { image } from "../config.js";
import { Label } from "./Shared.jsx";
const categories = [
  "Todos",
  ...new Set(inspirations.map((item) => item.category)),
];
export default function Gallery() {
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const closeButton = useRef(null);
  const visible = inspirations.filter(
    (item) => filter === "Todos" || item.category === filter,
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
      <Label number="03">INSPIRAÇÕES PARA COMEÇAR</Label>
      <div className="section-heading">
        <h2>
          Um repertório <br />
          de <em>possibilidades.</em>
        </h2>
        <p>
          Formas, texturas e novas perspectivas. <br />
          Referências para a nossa conversa.
        </p>
      </div>
      <div
        className="gallery-filters"
        role="group"
        aria-label="Filtrar inspirações"
      >
        {categories.map((category) => (
          <button
            key={category}
            aria-pressed={category === filter}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={`gallery-grid${filter !== "Todos" ? " filtered" : ""}`}>
        {visible.map((item, index) => (
          <figure className={`gallery-item gallery-${item.id}`} key={item.id}>
            <button
              className="gallery-open"
              aria-label={`Ampliar inspiração: ${item.title}`}
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setSelected(item.id);
              }}
            >
              <img
                src={image(item.image)}
                alt={`${item.alt} Imagem gerada; não é obra da empresa.`}
                width="1536"
                height="1024"
                loading="lazy"
              />
              <span className="gallery-plus">
                <Plus size={20} aria-hidden="true" />
              </span>
              <span className="image-tag">ILUSTRATIVA</span>
            </button>
            <figcaption>
              <span>
                0{index + 1} / {item.category}
              </span>
              <h3>{item.title}</h3>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="content-note">
        Imagens geradas para esta apresentação. Não representam projetos
        executados pela Casttini. Fotografias reais serão incluídas após envio e
        autorização.
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
            <div className="lightbox-bottom">
              <div aria-live="polite">
                <span className="eyebrow">REFERÊNCIA ILUSTRATIVA</span>
                <h3 id="lightbox-title">{current.title}</h3>
                <p>Imagem gerada; não é projeto da empresa.</p>
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
