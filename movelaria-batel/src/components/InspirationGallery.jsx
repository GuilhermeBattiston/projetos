import { useEffect, useRef, useState } from "react";
import { Plus, X, ArrowLeft, ArrowRight } from "lucide-react";
import { inspirations } from "../content.js";
import { image } from "../config.js";
import { SectionLabel } from "./Shared.jsx";
export default function InspirationGallery() {
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const closeButton = useRef(null);
  const close = () => {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus();
  };
  const move = (amount) =>
    setSelected(
      (index) => (index + amount + inspirations.length) % inspirations.length,
    );
  useEffect(() => {
    if (selected !== null && dialog.current && !dialog.current.open) {
      dialog.current.showModal();
      closeButton.current?.focus();
    }
  }, [selected]);
  const current = selected !== null ? inspirations[selected] : null;
  return (
    <section className="inspirations section container" id="inspiracoes">
      <SectionLabel number="03">UM REPERTÓRIO DE IDEIAS</SectionLabel>
      <div className="section-heading">
        <h2>
          Inspirações para <br />
          seus <em>ambientes.</em>
        </h2>
        <p>
          Formas de organizar. Jeitos de viver. <br />
          Referências para a nossa conversa.
        </p>
      </div>
      <div className="inspiration-grid">
        {inspirations.map((item, index) => (
          <figure
            className={`inspiration inspiration-${index}`}
            key={item.image}
          >
            <button
              className="image-button"
              aria-label={`Ampliar inspiração: ${item.title}`}
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setSelected(index);
              }}
            >
              <img
                src={image(item.image)}
                alt={`${item.description} Imagem gerada; não é projeto da Movelaria Batel.`}
                width="1536"
                height="1024"
                loading="lazy"
              />
              <span className="image-plus">
                <Plus size={21} aria-hidden="true" />
              </span>
              <span className="image-tag">IMAGEM ILUSTRATIVA</span>
            </button>
            <figcaption>
              <span className="inspiration-number">0{index + 1}</span>
              <h3>{item.title}</h3>
              <span>{item.category}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="content-note">
        Imagens geradas para este protótipo. Não representam projetos executados
        pela Movelaria Batel. Fotografias reais serão incluídas após envio e
        autorização.
      </p>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-labelledby="inspiration-title"
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
          className="close-lightbox"
          ref={closeButton}
          aria-label="Fechar imagem"
          onClick={close}
        >
          <X aria-hidden="true" />
        </button>
        {current && (
          <>
            <img
              src={image(current.image)}
              alt={`${current.description} Imagem ilustrativa.`}
            />
            <div className="lightbox-footer">
              <div aria-live="polite">
                <span className="micro-label">
                  REFERÊNCIA {selected + 1} DE {inspirations.length}
                </span>
                <h3 id="inspiration-title">{current.title}</h3>
                <p>Imagem gerada e ilustrativa. Não é projeto da empresa.</p>
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
