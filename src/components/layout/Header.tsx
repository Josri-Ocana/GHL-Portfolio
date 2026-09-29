"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/navigation";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const wide = window.matchMedia("(min-width: 900px)");
    const reset = () => {
      if (wide.matches) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    wide.addEventListener("change", reset);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
      wide.removeEventListener("change", reset);
    };
  }, [open]);
  return (
    <header
      className="site-header"
      ref={header}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Link
        href="/"
        className="wordmark"
        aria-label="Josri Ocaña, home"
        onClick={() => setOpen(false)}
      >
        JOSRI OCAÑA
      </Link>
      <button
        ref={toggle}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="main-navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        id="main-navigation"
        aria-label="Main navigation"
        className={`main-nav ${open ? "is-open" : ""}`}
      >
        {navigation.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          className="nav-contact button button-dark"
          href="/#contact"
          onClick={() => setOpen(false)}
        >
          <span className="cta-label">Let’s talk</span>
        </Link>
      </nav>
    </header>
  );
}
