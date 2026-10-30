/* Tanisha Tiwari, portfolio (v2). Vanilla JS, no dependencies.
   The page is fully readable without this file. Everything here is
   progressive: motion effects switch off for reduced-motion users,
   and cursor effects only run on devices with a precise pointer. */
(() => {
  "use strict";

  const EMAIL = "tanishatiwari42010@gmail.com";
  const LINKEDIN = "https://www.linkedin.com/in/tanisha-tiwari-/";
  const BOOK = "https://amzn.in/d/0hTImbpe";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const motionOK = () => !reduce.matches;

  $$("[data-mod-key]").forEach((k) => (k.textContent = isMac ? "⌘K" : "Ctrl K"));

  /* =====================================================
     Scroll-reveal with a light stagger
     ===================================================== */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && motionOK()) {
    // stagger siblings that share a parent
    const groups = new Map();
    reveals.forEach((el) => {
      const list = groups.get(el.parentElement) || [];
      list.push(el);
      groups.set(el.parentElement, list);
    });
    groups.forEach((list) => list.forEach((el, i) => el.style.setProperty("--d", `${Math.min(i, 6) * 70}ms`)));

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* =====================================================
     Count-up numbers (final values are already in the HTML)
     ===================================================== */
  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window && motionOK()) {
    const run = (el) => {
      const final = el.textContent.trim();
      const m = final.match(/^([\d.]+)(.*)$/);
      if (!m) return;
      const target = parseFloat(m[1]);
      const decimals = (m[1].split(".")[1] || "").length;
      const suffix = m[2];
      const start = performance.now();
      const dur = 1300;
      el.setAttribute("aria-label", final); // screen readers get the final value straight away
      const step = (now) => {
        const t = clamp((now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = final;
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => cio.observe(el));
  }

  /* =====================================================
     Statement: words light up as you scroll
     ===================================================== */
  const scrub = $("[data-scrub]");
  let words = [];
  if (scrub && motionOK()) {
    const keys = new Set(["stories", "demand."]);
    const text = scrub.textContent.trim();
    scrub.setAttribute("aria-label", text);
    scrub.textContent = "";
    text.split(" ").forEach((w, i, all) => {
      const span = document.createElement("span");
      span.className = "w" + (keys.has(w) ? " is-key" : "");
      span.textContent = w;
      span.setAttribute("aria-hidden", "true");
      scrub.append(span, i < all.length - 1 ? " " : "");
    });
    words = $$(".w", scrub);
  }

  /* =====================================================
     One scroll loop: progress bar, dock ring, rails, parallax, statement
     ===================================================== */
  const progressBar = $("[data-progress]");
  const ring = $("[data-ring]");
  const rails = $$("[data-rail]");
  const parallax = $$("[data-parallax]");
  let ticking = false;

  function onScroll() {
    ticking = false;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const p = max > 0 ? clamp(window.scrollY / max) : 0;
    if (progressBar) progressBar.style.setProperty("--p", p.toFixed(4));
    if (ring) ring.style.setProperty("--p", p.toFixed(4));

    rails.forEach((rail) => {
      const r = rail.getBoundingClientRect();
      const line = vh * 0.6;
      rail.style.setProperty("--fill", clamp((line - r.top) / r.height).toFixed(4));
      [...rail.children].forEach((item) => {
        item.classList.toggle("is-active", item.getBoundingClientRect().top < line);
      });
    });

    if (!motionOK()) return;

    if (words.length) {
      const r = scrub.getBoundingClientRect();
      const prog = clamp((vh * 0.9 - r.top) / (r.height + vh * 0.6));
      const n = words.length;
      words.forEach((w, i) => w.style.setProperty("--o", (0.14 + 0.86 * clamp(prog * n * 1.15 - i)).toFixed(3)));
    }

    parallax.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const offset = (r.top + r.height / 2 - vh / 2) * -0.07;
      img.style.setProperty("--py", `${offset.toFixed(1)}px`);
    });
  }
  const requestTick = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  onScroll();

  /* =====================================================
     Dock: highlight the section in view
     ===================================================== */
  const dockLinks = $$("[data-dock]");
  const byId = new Map(dockLinks.map((a) => [a.getAttribute("href").slice(1), a]));
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        dockLinks.forEach((a) => a.removeAttribute("aria-current"));
        const link = byId.get(e.target.id);
        if (link) link.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main > section[id]").forEach((s) => spy.observe(s));
  }

  /* =====================================================
     Cursor effects (precise pointers only)
     ===================================================== */
  if (fine.matches) {
    // spotlight glow on hero, tiles, tool cards and contact
    $$(".spot").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        el.classList.add("is-lit");
      });
      el.addEventListener("pointerleave", () => el.classList.remove("is-lit"));
    });

    if (motionOK()) {
      // magnetic buttons: lean slightly toward the cursor
      $$(".magnetic").forEach((btn) => {
        btn.addEventListener("pointermove", (e) => {
          const r = btn.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          btn.style.setProperty("--tx", `${(dx * 8).toFixed(1)}px`);
          btn.style.setProperty("--ty", `${(dy * 6).toFixed(1)}px`);
        });
        btn.addEventListener("pointerleave", () => { btn.style.setProperty("--tx", "0px"); btn.style.setProperty("--ty", "0px"); });
      });

      // hero: portrait and tags drift with the cursor at different depths
      const hero = $(".hero");
      const layers = $$("[data-depth]", hero);
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        layers.forEach((l) => {
          const d = parseFloat(l.dataset.depth);
          l.style.setProperty("--x", `${(nx * d * 14).toFixed(1)}px`);
          l.style.setProperty("--y", `${(ny * d * 14).toFixed(1)}px`);
        });
      });
      hero.addEventListener("pointerleave", () => layers.forEach((l) => { l.style.setProperty("--x", "0px"); l.style.setProperty("--y", "0px"); }));

      // book tilts and catches the light
      const book = $("[data-tilt]");
      if (book) {
        const cover = $(".book__cover", book);
        book.addEventListener("pointermove", (e) => {
          const r = book.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          const ny = (e.clientY - r.top) / r.height;
          cover.style.setProperty("--ry", `${((nx - 0.5) * 22).toFixed(1)}deg`);
          cover.style.setProperty("--rx", `${((0.5 - ny) * 14).toFixed(1)}deg`);
          cover.style.setProperty("--gx", `${(nx * 100).toFixed(0)}%`);
          cover.style.setProperty("--gy", `${(ny * 100).toFixed(0)}%`);
        });
        book.addEventListener("pointerleave", () => ["--ry", "--rx"].forEach((p) => cover.style.setProperty(p, "0deg")));
      }
    }
  }

  /* =====================================================
     Sliding pill for segmented controls
     ===================================================== */
  function movePill(seg, btn) {
    const pill = $("[data-pill]", seg);
    if (!pill || !btn) return;
    pill.style.width = `${btn.offsetWidth}px`;
    pill.style.transform = `translateX(${btn.offsetLeft}px)`;
  }
  function keepInView(seg, btn) {
    if (seg.scrollWidth <= seg.clientWidth) return;
    seg.scrollTo({ left: Math.max(0, btn.offsetLeft - (seg.clientWidth - btn.offsetWidth) / 2), behavior: motionOK() ? "smooth" : "auto" });
  }

  /* =====================================================
     Skills tabs
     ===================================================== */
  $$("[data-tabs]").forEach((list) => {
    const tabs = $$("[role='tab']", list);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      movePill(list, tab);
      if (focus) { tab.focus({ preventScroll: true }); keepInView(list, tab); }
    };
    select(tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0], false);
    tabs.forEach((t) => t.addEventListener("click", () => { select(t, false); keepInView(list, t); }));
    list.addEventListener("keydown", (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      let n = step ? (i + step + tabs.length) % tabs.length : null;
      if (e.key === "Home") n = 0;
      if (e.key === "End") n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      select(tabs[n], true);
    });
    const refresh = () => movePill(list, tabs.find((t) => t.getAttribute("aria-selected") === "true"));
    window.addEventListener("resize", refresh);
    document.fonts && document.fonts.ready.then(refresh);
  });

  /* =====================================================
     Project filter (signature interaction)
     ===================================================== */
  const filter = $("[data-filter]");
  if (filter) {
    const seg = $(".seg", filter);
    const buttons = $$("button[data-cat]", filter);
    const projects = $$(".project");
    const count = $("[data-filter-count]");
    const empty = $("[data-filter-empty]");
    const total = projects.length;
    const pressed = () => buttons.find((b) => b.getAttribute("aria-pressed") === "true");

    const apply = (cat) => {
      let shown = 0;
      projects.forEach((p) => {
        const match = cat === "all" || p.dataset.cats.split(" ").includes(cat);
        const wasHidden = p.hidden;
        p.hidden = !match;
        if (match) {
          shown += 1;
          if (wasHidden && motionOK()) { p.classList.remove("is-entering"); void p.offsetWidth; p.classList.add("is-entering"); }
        }
      });
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === cat)));
      const btn = pressed();
      movePill(seg, btn);
      keepInView(seg, btn);
      const name = btn.firstChild.textContent.trim();
      count.textContent = cat === "all" ? `Showing all ${total} projects` : `Showing ${shown} of ${total}: ${name}`;
      empty.hidden = shown > 0;
      requestTick();
    };
    buttons.forEach((b) => b.addEventListener("click", () => apply(b.dataset.cat)));
    projects.forEach((p) => p.addEventListener("animationend", () => p.classList.remove("is-entering")));
    const refresh = () => movePill(seg, pressed());
    refresh();
    window.addEventListener("resize", refresh);
    document.fonts && document.fonts.ready.then(refresh);
  }

  /* =====================================================
     Ticker pause / play
     ===================================================== */
  const tickerBtn = $("[data-ticker-toggle]");
  if (tickerBtn) {
    const ticker = tickerBtn.closest(".ticker");
    const useEl = $("use", tickerBtn);
    const label = $(".sr-only", tickerBtn);
    tickerBtn.addEventListener("click", () => {
      const paused = ticker.classList.toggle("is-paused");
      tickerBtn.setAttribute("aria-pressed", String(paused));
      useEl.setAttribute("href", paused ? "#i-play" : "#i-pause");
      label.textContent = paused ? "Play the scrolling list" : "Pause the scrolling list";
    });
  }

  /* =====================================================
     Copy email
     ===================================================== */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.append(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch { ok = false; }
      ta.remove(); return ok;
    }
  }
  const copyBtn = $("[data-copy]");
  const status = $("[data-copy-status]");
  let copyTimer;
  async function copyEmail() {
    const ok = await copyText(EMAIL);
    if (status) status.textContent = ok ? "Email address copied to your clipboard." : "Copying didn’t work here. Select the address above to copy it.";
    if (copyBtn && ok) {
      $("[data-copy-label]", copyBtn).textContent = "Copied";
      $("[data-copy-icon] use", copyBtn).setAttribute("href", "#i-check");
    }
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      if (status) status.textContent = "";
      if (copyBtn) { $("[data-copy-label]", copyBtn).textContent = "Copy email"; $("[data-copy-icon] use", copyBtn).setAttribute("href", "#i-copy"); }
    }, 4000);
    return ok;
  }
  if (copyBtn) copyBtn.addEventListener("click", copyEmail);

  /* =====================================================
     Command menu (Ctrl/⌘ K or /)
     ===================================================== */
  const dialog = $(".cmdk");
  const input = $("input", dialog);
  const listEl = $(".cmdk__list", dialog);

  function go(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "start" });
    history.replaceState(null, "", hash === "#top" ? location.pathname + location.search : hash);
  }
  const sec = (label, hash, icon, words = "") => ({ group: "Sections", label, words, icon, run: () => go(hash) });
  const commands = [
    sec("Achievements", "#achievements", "trophy", "results numbers mql roi leads"),
    sec("How I work", "#approach", "path", "process approach steps"),
    sec("Skills and channels", "#skills", "squares-four", "abm gtm demand content events analytics"),
    sec("Projects", "#projects", "folders", "work campaigns case highlights zs g20 trell iot"),
    sec("Professional experience", "#experience", "briefcase", "career jobs roles cv resume"),
    sec("Education", "#education", "graduation-cap", "mba degree university"),
    sec("Tools", "#tools", "wrench", "hubspot salesforce ga4 stack software"),
    sec("Certifications and languages", "#certifications", "certificate", "courses english hindi"),
    sec("Publications", "#publications", "book-open", "book author writing"),
    sec("Contact", "#contact", "chat-circle-dots", "email hire reach"),
    { group: "Actions", label: "Copy email address", words: "contact clipboard mail", icon: "copy", run: async () => { const ok = await copyEmail(); if (ok) go("#contact"); } },
    { group: "Actions", label: "Open LinkedIn profile", words: "social connect", icon: "linkedin-logo", hint: "↗", run: () => window.open(LINKEDIN, "_blank", "noopener") },
    { group: "Actions", label: "Get the book on Amazon", words: "buy purchase i will win without war", icon: "amazon-logo", hint: "↗", run: () => window.open(BOOK, "_blank", "noopener") },
    { group: "Actions", label: "Back to top", words: "home start hero", icon: "arrow-up", run: () => go("#top") },
  ];
  let filtered = commands;
  let active = 0;

  function render() {
    const q = input.value.trim().toLowerCase();
    filtered = commands.filter((c) => `${c.label} ${c.words}`.toLowerCase().includes(q));
    active = clamp(active, 0, Math.max(filtered.length - 1, 0));
    listEl.innerHTML = "";
    if (!filtered.length) {
      const li = document.createElement("li");
      li.className = "cmdk__empty"; li.setAttribute("role", "presentation");
      li.textContent = "Nothing matches. Try “projects”, “email” or “book”.";
      listEl.append(li);
      input.removeAttribute("aria-activedescendant");
      return;
    }
    let lastGroup = "";
    filtered.forEach((c, i) => {
      if (c.group !== lastGroup) {
        const g = document.createElement("li");
        g.className = "cmdk__group"; g.setAttribute("role", "presentation"); g.textContent = c.group;
        listEl.append(g); lastGroup = c.group;
      }
      const li = document.createElement("li");
      li.className = "cmdk__item"; li.id = `cmd-${i}`; li.setAttribute("role", "option");
      li.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-${c.icon}"/></svg><span></span>${c.hint ? `<span class="cmdk__hint" aria-hidden="true">${c.hint}</span>` : ""}`;
      li.querySelector("span").textContent = c.label;
      li.addEventListener("click", () => runCmd(i));
      li.addEventListener("pointermove", () => { if (active !== i) { active = i; mark(); } });
      listEl.append(li);
    });
    mark();
  }
  function mark() {
    $$(".cmdk__item", listEl).forEach((li) => li.setAttribute("aria-selected", String(li.id === `cmd-${active}`)));
    const cur = $(`#cmd-${active}`, listEl);
    if (cur) { input.setAttribute("aria-activedescendant", cur.id); cur.scrollIntoView({ block: "nearest" }); }
  }
  function runCmd(i) {
    const c = filtered[i];
    if (!c) return;
    dialog.close();
    requestAnimationFrame(() => c.run());
  }
  function openMenu() {
    if (dialog.open) return;
    input.value = ""; active = 0; render();
    dialog.showModal(); input.focus();
  }

  input.addEventListener("input", () => { active = 0; render(); });
  input.addEventListener("keydown", (e) => {
    if (!filtered.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % filtered.length; mark(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + filtered.length) % filtered.length; mark(); }
    else if (e.key === "Enter") { e.preventDefault(); runCmd(active); }
  });
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  $$("[data-cmdk-open]").forEach((b) => b.addEventListener("click", openMenu));
  $$("[data-cmdk-close]").forEach((b) => b.addEventListener("click", () => dialog.close()));

  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dialog.open ? dialog.close() : openMenu(); return; }
    if (e.key === "/" && !typing && !dialog.open) { e.preventDefault(); openMenu(); }
  });
})();
