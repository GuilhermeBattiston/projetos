import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation } from "../content.js";
import { Brand, WhatsApp } from "./Shared.jsx";
export default function Header() {
  const [open, setOpen] = useState(false);
  const button = useRef(null);
  const nav = useRef(null);
  useEffect(() => {
    if (!open) return;
    const keydown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (event.key === "Tab" && window.innerWidth < 900) {
        const elements = [button.current, ...nav.current.querySelectorAll("a")];
        if (event.shiftKey && document.activeElement === elements[0]) {
          event.preventDefault();
          elements.at(-1).focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === elements.at(-1)
        ) {
          event.preventDefault();
          elements[0].focus();
        }
      }
    };
    const outside = (event) => {
      if (!event.target.closest("header")) setOpen(false);
    };
    document.addEventListener("keydown", keydown);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className="header">
      <div className="container header-inner">
        <Brand />
        <button
          className="menu-button"
          ref={button}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
        <nav
          className={`navigation${open ? " is-open" : ""}`}
          id="main-navigation"
          ref={nav}
          aria-label="Navegação principal"
        >
          {navigation.map(([id, text]) => (
            <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>
              {text}
            </a>
          ))}
          <WhatsApp className="header-cta" />
        </nav>
      </div>
    </header>
  );
}
