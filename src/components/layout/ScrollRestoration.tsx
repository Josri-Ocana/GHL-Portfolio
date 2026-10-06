"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { returnPosition, type ReturnPosition } from "@/lib/navigationScroll";

const STATE_KEY = "portfolioReturnPosition";

/** Preserve each history entry without patching the router, URLs or navigation controls. */
export function ScrollRestoration() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const routeReady = useRef<(path: string) => void>(() => {});

  useEffect(() => {
    let renderedPath = window.location.pathname + window.location.search;
    let pending: ReturnPosition | null = null;
    let frozen = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let started = 0;
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const url = () => window.location.pathname + window.location.search + window.location.hash;

    const save = (source?: Element) => {
      if (frozen) return;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
      const section = source?.closest("section") || sections.findLast((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.top <= 1 && bounds.bottom > 0;
      });
      const index = section ? sections.indexOf(section as HTMLElement) : -1;
      const position: ReturnPosition = {
        url: url(), x: window.scrollX, y: window.scrollY,
        ...(index >= 0 ? { section: index, offset: -section!.getBoundingClientRect().top } : {}),
      };
      // Preserve every Next.js history key; replace only our own metadata on this entry.
      window.history.replaceState({ ...window.history.state, [STATE_KEY]: position }, "");
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      pending = null;
      frozen = false;
    };
    const restore = () => {
      const position = pending;
      if (!position || position.url !== url()) return;
      if (renderedPath !== window.location.pathname + window.location.search) return;
      if (!started) started = performance.now();
      const section = position.section === undefined ? undefined
        : document.querySelectorAll<HTMLElement>("main section")[position.section];
      const y = section ? section.getBoundingClientRect().top + window.scrollY + position.offset! : position.y;
      if (Math.abs(window.scrollY - y) > 1 || Math.abs(window.scrollX - position.x) > 1) {
        window.scrollTo({ left: position.x, top: Math.max(0, y), behavior: "instant" });
        window.dispatchEvent(new Event("portfolio:scroll-restored"));
      }
      // Allow font/pin layout to settle, but stop immediately when the visitor takes control.
      if (performance.now() - started < 1000) frame = requestAnimationFrame(restore);
      else stop();
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      if (pending) frame = requestAnimationFrame(restore);
    };
    const pop = (event: PopStateEvent) => {
      stop();
      pending = returnPosition(event.state?.[STATE_KEY], url());
      frozen = Boolean(pending);
      started = 0;
      schedule();
    };
    const scroll = () => {
      clearTimeout(timer);
      if (!frozen) timer = setTimeout(save, 120);
    };
    const click = (event: MouseEvent) => {
      if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.target && link.target !== "_self" || link.hasAttribute("download")) return;
      const destination = new URL(link.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
      stop();
      save(link);
      if (destination.pathname !== window.location.pathname || destination.search !== window.location.search) frozen = true;
    };
    const userControl = () => {
      if (pending) stop();
      else frozen = false;
    };
    const pagehide = () => save();
    routeReady.current = (path) => {
      renderedPath = path;
      if (pending) schedule();
      else {
        frozen = false;
        if (!returnPosition(window.history.state?.[STATE_KEY], url())) save();
      }
    };
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("click", click, true);
    window.addEventListener("popstate", pop);
    window.addEventListener("pagehide", pagehide);
    window.addEventListener("wheel", userControl, { passive: true });
    window.addEventListener("touchstart", userControl, { passive: true });
    window.addEventListener("pointerdown", userControl);
    window.addEventListener("keydown", userControl);
    ScrollTrigger.addEventListener("refresh", schedule);
    return () => {
      stop();
      routeReady.current = () => {};
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("click", click, true);
      window.removeEventListener("popstate", pop);
      window.removeEventListener("pagehide", pagehide);
      window.removeEventListener("wheel", userControl);
      window.removeEventListener("touchstart", userControl);
      window.removeEventListener("pointerdown", userControl);
      window.removeEventListener("keydown", userControl);
      ScrollTrigger.removeEventListener("refresh", schedule);
    };
  }, []);

  useEffect(() => {
    routeReady.current(window.location.pathname + window.location.search);
  }, [pathname, search]);
  return null;
}
