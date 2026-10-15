import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation } from "../content.js";
import { Brand, PlanningLink } from "./Shared.jsx";
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
      if (event.key === "Tab" && innerWidth < 1050) {
        const items = [button.current, ...nav.current.querySelectorAll("a")];
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items.at(-1).focus();
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault();
          items[0].focus();
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
          className="menu-toggle"
          ref={button}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          className={`main-nav${open ? " open" : ""}`}
          ref={nav}
          id="main-nav"
          aria-label="Navegação principal"
        >
          {navigation.map(([id, text]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {text}
            </a>
          ))}
          <PlanningLink onClick={() => setOpen(false)} />
        </nav>
      </div>
    </header>
  );
}
