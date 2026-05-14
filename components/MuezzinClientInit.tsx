"use client";

import { useEffect } from "react";
import Swiper from "swiper";
import { Autoplay, Pagination } from "swiper/modules";
import { initMuezzinPrayerTimes } from "@/lib/muezzin-prayer-times";

const SIDE_MENU_BACKDROP_CLASS = "tq-side-menu-backdrop";

function setMenuExpanded(open: boolean) {
  document.querySelectorAll<HTMLElement>(".tq-menu-btn").forEach((btn) => {
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

export function MuezzinClientInit() {
  useEffect(() => {
    let swiper: Swiper | undefined;
    const root = document.querySelector<HTMLElement>(".tq-feat-caro");
    if (root) {
      swiper = new Swiper(root, {
        modules: [Autoplay, Pagination],
        loop: true,
        grabCursor: true,
        pagination: {
          el: ".tq-feat-pagination",
          clickable: true,
        },
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
        },
      });
    }

    void import("bootstrap/dist/js/bootstrap.bundle.min.js");

    const prayerAbort = new AbortController();
    void initMuezzinPrayerTimes(prayerAbort.signal);

    const panel = document.querySelector<HTMLElement>(".tq-side-menu");
    let backdrop = document.querySelector<HTMLElement>(`.${SIDE_MENU_BACKDROP_CLASS}`);
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = SIDE_MENU_BACKDROP_CLASS;
      backdrop.setAttribute("aria-hidden", "true");
      document.body.appendChild(backdrop);
    }

    const openMenu = () => {
      panel?.classList.add("active");
      backdrop?.classList.add("is-visible");
      document.body.classList.add("tq-side-menu-open");
      setMenuExpanded(true);
    };

    const closeMenu = () => {
      panel?.classList.remove("active");
      backdrop?.classList.remove("is-visible");
      document.body.classList.remove("tq-side-menu-open");
      setMenuExpanded(false);
    };

    const onDocClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest(".tq-menu-btn")) {
        e.preventDefault();
        if (panel?.classList.contains("active")) closeMenu();
        else openMenu();
        return;
      }
      if (t.closest(".tq-side-menu-close")) {
        e.preventDefault();
        closeMenu();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panel?.classList.contains("active")) closeMenu();
    };

    backdrop.addEventListener("click", closeMenu);
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      prayerAbort.abort();
      swiper?.destroy(true, true);
      backdrop.removeEventListener("click", closeMenu);
      document.removeEventListener("click", onDocClick, true);
      document.removeEventListener("keydown", onKeyDown);
      closeMenu();
      if (backdrop.parentNode === document.body) backdrop.remove();
    };
  }, []);

  return null;
}
