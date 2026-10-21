import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X, Plus } from "lucide-react";
import { gallery } from "../content.ts";
import Photo from "./Photo.tsx";
import { Eyebrow } from "./Shared.tsx";
export default function Gallery({
  onChoose,
}: {
  onChoose: (value: string) => void;
}) {
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const visible = gallery.filter(
    (x) => filter === "Todos" || x.category === filter,
  );
  const current = visible.find((x) => x.id === selected);
  const close = () => {
    dialog.current?.close();
    setSelected(null);
    trigger.current?.focus();
  };
  const move = (amount: number) => {
    const index = visible.findIndex((x) => x.id === selected);
    setSelected(visible[(index + amount + visible.length) % visible.length].id);
  };
  useEffect(() => {
    if (selected && !dialog.current?.open) {
      dialog.current?.showModal();
      closeRef.current?.focus();
    }
  }, [selected]);
  return (
    <section className="section container portfolio" id="projetos">
      <div className="portfolio-intro">
        <Eyebrow number="02">UM OLHAR POR AMBIENTE</Eyebrow>
        <h2>
          Possibilidades <br />
          para cada <br />
          <em>jeito de viver.</em>
        </h2>
        <p>
          Explore composições, encontre referências e leve suas ideias para a
          primeira conversa.
        </p>
        <p className="note">
          Galeria demonstrativa. As imagens são geradas e não representam
          projetos executados pela Movelaria Curitiba.
        </p>
        <a href="#briefing" className="text-link">
          Planejar meu ambiente <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="portfolio-content">
        <div
          className="filters"
          role="group"
          aria-label="Filtrar referências por ambiente"
        >
          {["Todos", ...gallery.map((x) => x.category)].map((label) => (
            <button
              key={label}
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="filter-status" role="status">
          {visible.length} {visible.length === 1 ? "referência" : "referências"}{" "}
          de inspiração
        </p>
        <div className={`gallery-grid ${filter !== "Todos" ? "filtered" : ""}`}>
          {visible.map((item) => (
            <figure className={`gallery-item gallery-${item.id}`} key={item.id}>
              <button
                className="gallery-open"
                aria-label={`Ampliar: ${item.title}`}
                onClick={(e) => {
                  trigger.current = e.currentTarget;
                  setSelected(item.id);
                }}
              >
                <Photo name={item.image} alt={item.alt} />
                <span className="image-tag">ILUSTRATIVO</span>
                <span className="gallery-plus">
                  <Plus aria-hidden="true" size={20} />
                </span>
              </button>
              <figcaption>
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <a
                  href="#briefing"
                  onClick={() => onChoose(item.environment)}
                  className="text-link"
                >
                  Quero conversar sobre{" "}
                  {item.category.toLocaleLowerCase("pt-BR")}{" "}
                  <ArrowUpRight size={15} />
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-labelledby="lightbox-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            const buttons = Array.from(
              dialog.current?.querySelectorAll<HTMLButtonElement>("button") ||
                [],
            );
            if (e.shiftKey && document.activeElement === buttons[0]) {
              e.preventDefault();
              buttons.at(-1)?.focus();
            } else if (
              !e.shiftKey &&
              document.activeElement === buttons.at(-1)
            ) {
              e.preventDefault();
              buttons[0]?.focus();
            }
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          }
        }}
      >
        <button
          className="lightbox-close"
          ref={closeRef}
          aria-label="Fechar imagem"
          onClick={close}
        >
          <X />
        </button>
        {current && (
          <>
            <Photo name={current.image} alt={current.alt} />
            <div className="lightbox-bottom">
              <div aria-live="polite">
                <p className="eyebrow">
                  {current.category} / REFERÊNCIA ILUSTRATIVA
                </p>
                <h3 id="lightbox-title">{current.title}</h3>
                <p>Imagem gerada. Não é obra da empresa.</p>
              </div>
              <div className="lightbox-controls">
                <button aria-label="Imagem anterior" onClick={() => move(-1)}>
                  <ArrowLeft />
                </button>
                <button aria-label="Próxima imagem" onClick={() => move(1)}>
                  <ArrowRight />
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
