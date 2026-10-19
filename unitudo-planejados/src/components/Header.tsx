import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navigation } from "../content.ts";
import { Brand, BriefLink } from "./Shared.tsx";
export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key === "Tab" && window.innerWidth < 1100) {
        const items = [
          toggle.current,
          ...Array.from(
            nav.current?.querySelectorAll<HTMLAnchorElement>("a") || [],
          ),
        ].filter((item): item is HTMLButtonElement | HTMLAnchorElement =>
          Boolean(item),
        );
        if (event.shiftKey && document.activeElement === items[0]) {
          event.preventDefault();
          items.at(-1)?.focus();
        } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
          event.preventDefault();
          items[0]?.focus();
        }
      }
    };
    const outside = (event: PointerEvent) => {
      if (!(event.target as Element).closest("header")) setOpen(false);
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
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          ref={nav}
          id="main-nav"
          className={`main-nav${open ? " open" : ""}`}
          aria-label="Navegação principal"
        >
          {navigation.map(([id, title]) => (
            <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>
              {title}
            </a>
          ))}
          <BriefLink onClick={() => setOpen(false)} />
        </nav>
      </div>
    </header>
  );
}
