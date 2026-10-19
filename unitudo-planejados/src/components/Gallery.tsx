import { useEffect, useRef, useState } from "react";
import { Plus, X, ArrowLeft, ArrowRight } from "lucide-react";
import { gallery } from "../content.ts";
import Photo from "./Photo.tsx";
import { Label } from "./Shared.tsx";
const categories = ["Todos", ...gallery.map((item) => item.category)];
export default function Gallery() {
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const visible = gallery.filter(
    (item) => filter === "Todos" || item.category === filter,
  );
  const current = visible.find((item) => item.id === selected);
  const close = () => {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus();
  };
  const move = (amount: number) => {
    const index = visible.findIndex((item) => item.id === selected);
    setSelected(visible[(index + amount + visible.length) % visible.length].id);
  };
  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open) {
      dialog.current.showModal();
      closeButton.current?.focus();
    }
  }, [selected]);
  return (
    <section className="gallery section container" id="inspiracoes">
      <Label number="03">UM REPERTÓRIO DE IDEIAS</Label>
      <div className="section-heading">
        <h2>
          Inspiração é <br />
          um bom <em>começo.</em>
        </h2>
        <p>
          Formas de organizar. Jeitos de viver. <br />
          Escolha uma referência e olhe mais de perto.
        </p>
      </div>
      <div className="filters" role="group" aria-label="Filtrar inspirações">
        {categories.map((category) => (
          <button
            key={category}
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={`gallery-grid${filter !== "Todos" ? " filtered" : ""}`}>
        {visible.map((item, index) => (
          <figure key={item.id} className={`gallery-item gallery-${item.id}`}>
            <button
              className="gallery-open"
              aria-label={`Ampliar inspiração: ${item.title}`}
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setSelected(item.id);
              }}
            >
              <Photo
                name={item.image}
                alt={`${item.alt} Imagem gerada, não é obra da Unitudo.`}
              />
              <span className="gallery-plus">
                <Plus size={20} aria-hidden="true" />
              </span>
              <span className="image-tag">REFERÊNCIA ILUSTRATIVA</span>
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
        Imagens geradas para este protótipo, não são trabalhos da Unitudo.
        Ambientes apresentados como inspiração; disponibilidade e soluções
        precisam ser confirmadas com a empresa.
      </p>
      <dialog
        className="lightbox"
        ref={dialog}
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
            <Photo name={current.image} alt={current.alt} />
            <div className="lightbox-footer">
              <div aria-live="polite">
                <span className="eyebrow">INSPIRAÇÃO / IMAGEM ILUSTRATIVA</span>
                <h3 id="lightbox-title">{current.title}</h3>
                <p>Imagem gerada; não é trabalho da empresa.</p>
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
