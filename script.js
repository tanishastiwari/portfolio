/* Tanisha Tiwari, portfolio. Vanilla JS, no dependencies.
   Everything on the page is readable without this file; it only adds
   tabs, the project filter, copy-to-clipboard and nav highlighting. */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- skills tabs ---------- */
  $$("[data-tabs]").forEach((list) => {
    const tabs = $$("[role='tab']", list);
    const panelFor = (tab) => document.getElementById(tab.getAttribute("aria-controls"));

    function select(tab, focus) {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        panelFor(t).hidden = !on;
      });
      if (focus) tab.focus({ preventScroll: true });
    }

    // On small screens the tab list scrolls sideways: bring the chosen tab into view
    // without moving the page itself.
    function revealInStrip(tab) {
      if (list.scrollWidth <= list.clientWidth) return;
      const target = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2;
      list.scrollTo({ left: Math.max(0, target), behavior: reduceMotion.matches ? "auto" : "smooth" });
    }

    // first tab is the default view
    select(tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0], false);

    tabs.forEach((t) => t.addEventListener("click", () => { select(t, false); revealInStrip(t); }));
    list.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const next = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      let n = null;
      if (next) n = (i + next + tabs.length) % tabs.length;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      select(tabs[n], true);
      revealInStrip(tabs[n]);
    });
  });

  /* ---------- project filter (signature interaction) ---------- */
  const filter = $("[data-filter]");
  if (filter) {
    const buttons = $$("button[data-cat]", filter);
    const projects = $$(".project");
    const count = $("[data-filter-count]");
    const empty = $("[data-filter-empty]");
    const total = projects.length;

    function apply(cat) {
      let shown = 0;
      projects.forEach((p) => {
        const match = cat === "all" || p.dataset.cats.split(" ").includes(cat);
        const wasHidden = p.hidden;
        p.hidden = !match;
        if (match) {
          shown += 1;
          if (wasHidden && !reduceMotion.matches) {
            p.classList.remove("is-entering");
            void p.offsetWidth; // restart the short fade
            p.classList.add("is-entering");
          }
        }
      });
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === cat)));
      const label = buttons.find((b) => b.dataset.cat === cat).textContent.trim();
      count.textContent = cat === "all"
        ? `Showing all ${total} projects`
        : `Showing ${shown} of ${total} projects: ${label}`;
      empty.hidden = shown > 0;
    }

    buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.cat)));
    projects.forEach((p) => p.addEventListener("animationend", () => p.classList.remove("is-entering")));
  }

  /* ---------- copy email ---------- */
  const copyBtn = $("[data-copy]");
  const status = $("[data-copy-status]");
  let resetTimer;

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove();
      return ok;
    }
  }

  if (copyBtn && status) {
    const label = $("[data-copy-label]", copyBtn);
    copyBtn.addEventListener("click", async () => {
      const ok = await copy(copyBtn.dataset.copy);
      status.textContent = ok
        ? "Email address copied to your clipboard."
        : "Copying didn’t work here. Select the address above to copy it.";
      label.textContent = ok ? "Copied" : "Copy email";
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        label.textContent = "Copy email";
        status.textContent = "";
      }, 4000);
    });
  }

  /* ---------- nav: highlight the section in view ---------- */
  const links = $$(".nav__links a");
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.removeAttribute("aria-current"));
          const link = byId.get(entry.target.id);
          if (link) {
            link.setAttribute("aria-current", "true");
            // keep the active link visible in the scrollable mobile nav
            const bar = link.parentElement;
            const l = link.offsetLeft, r = l + link.offsetWidth;
            if (l < bar.scrollLeft || r > bar.scrollLeft + bar.clientWidth) {
              bar.scrollTo({ left: l - 16, behavior: reduceMotion.matches ? "auto" : "smooth" });
            }
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }
})();
