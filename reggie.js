/* ==========================================================
   REGGIE – button-based FAQ chatbot (no typing, no server)
   Reads its questions and answers from faqs.js
   ========================================================== */

(function () {
  "use strict";

  const FAQ = window.REGGIE_FAQ;
  if (!FAQ) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Reggie's face (inline SVG) ---------- */
  const AVATAR = `
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#4163E5"/>
      <line x1="24" y1="9" x2="24" y2="14" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="24" cy="8" r="2.6" fill="#67BAF4"/>
      <rect x="11" y="14" width="26" height="22" rx="9" fill="#fff"/>
      <circle cx="19" cy="25" r="2.7" fill="#1B1FA3"/>
      <circle cx="29" cy="25" r="2.7" fill="#1B1FA3"/>
      <path d="M19 30.5c1.6 1.8 8.4 1.8 10 0" stroke="#1B1FA3" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`;

  const CLOSE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  /* ---------- Build the widget ---------- */
  const root = document.createElement("div");
  root.className = "reggie";
  root.innerHTML = `
    <div class="reggie-teaser" id="reggieTeaser" hidden>
      <button type="button" class="reggie-teaser-close" aria-label="Dismiss">${CLOSE_ICON}</button>
      Hi! Need help with your request? Ask <strong>Reggie</strong>.
    </div>

    <button type="button" class="reggie-fab" id="reggieFab" aria-expanded="false" aria-controls="reggiePanel">
      <span class="reggie-avatar">${AVATAR}</span>
      <span class="reggie-fab-label">Ask Reggie</span>
    </button>

    <section class="reggie-panel" id="reggiePanel" role="dialog" aria-label="Reggie, FAQ assistant" hidden>
      <header class="reggie-head">
        <span class="reggie-avatar reggie-avatar-lg">${AVATAR}</span>
        <div class="reggie-title">
          <strong>Reggie</strong>
          <small><span class="reggie-dot"></span> Registrar's virtual assistant</small>
        </div>
        <button type="button" class="reggie-close" id="reggieClose" aria-label="Close chat">${CLOSE_ICON}</button>
      </header>

      <div class="reggie-messages" id="reggieMessages" aria-live="polite"></div>

      <div class="reggie-options" id="reggieOptions"></div>
    </section>
  `;
  document.body.appendChild(root);

  const fab = document.getElementById("reggieFab");
  const panel = document.getElementById("reggiePanel");
  const closeBtn = document.getElementById("reggieClose");
  const messagesEl = document.getElementById("reggieMessages");
  const optionsEl = document.getElementById("reggieOptions");
  const teaser = document.getElementById("reggieTeaser");

  /* ---------- State ---------- */
  let current = null;       // null = main menu
  let history = [];         // previous nodes, for the Back button
  let started = false;
  let busy = false;

  /* ---------- Helpers ---------- */
  function format(text) {
    return text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\[\[([\s\S]+?)\]\]/g, '<mark class="todo">$1</mark>')
      .replace(/\n/g, "<br>");
  }

  function scrollDown() {
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function addMessage(role, text) {
    const wrap = document.createElement("div");
    wrap.className = "reggie-msg reggie-msg-" + role;
    if (role === "bot") {
      wrap.innerHTML = '<span class="reggie-avatar reggie-avatar-sm">' + AVATAR + '</span><div class="reggie-bubble">' + format(text) + "</div>";
    } else {
      wrap.innerHTML = '<div class="reggie-bubble">' + format(text) + "</div>";
    }
    messagesEl.appendChild(wrap);
    scrollDown();
  }

  function showTyping() {
    const wrap = document.createElement("div");
    wrap.className = "reggie-msg reggie-msg-bot reggie-typing";
    wrap.innerHTML = '<span class="reggie-avatar reggie-avatar-sm">' + AVATAR + '</span><div class="reggie-bubble"><i></i><i></i><i></i></div>';
    messagesEl.appendChild(wrap);
    scrollDown();
    return wrap;
  }

  function botSay(text, done) {
    busy = true;
    optionsEl.innerHTML = "";
    const typing = showTyping();
    const delay = reduceMotion ? 0 : Math.min(450 + text.length * 4, 1100);
    setTimeout(function () {
      typing.remove();
      addMessage("bot", text);
      busy = false;
      if (done) done();
    }, delay);
  }

  /* ---------- Options (buttons) ---------- */
  function button(label, cls, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "reggie-opt " + (cls || "");
    b.textContent = label;
    b.addEventListener("click", onClick);
    return b;
  }

  function renderOptions(node) {
    optionsEl.innerHTML = "";

    const ids = node ? node.next : FAQ.root;
    const label = document.createElement("p");
    label.className = "reggie-options-label";
    label.textContent = ids.length ? (node ? "You can also ask:" : "Choose a topic:") : "";
    if (ids.length) optionsEl.appendChild(label);

    const list = document.createElement("div");
    list.className = "reggie-opt-list";

    // Action buttons (open the form / contact details)
    if (node && node.link) {
      const a = document.createElement("a");
      a.className = "reggie-opt reggie-opt-action";
      a.href = node.link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = node.link.label + " ↗";
      list.appendChild(a);
    }
    if (node && node.action === "contact") {
      list.appendChild(button("Open contact details", "reggie-opt-action", function () {
        const contactBtn = document.getElementById("contactBtn");
        if (contactBtn) contactBtn.click();
      }));
    }

    ids.forEach(function (id) {
      const n = FAQ.nodes[id];
      if (n) list.appendChild(button(n.label, "", function () { choose(id); }));
    });

    // Navigation
    if (node) {
      const nav = document.createElement("div");
      nav.className = "reggie-nav";
      nav.appendChild(button("← Back", "reggie-opt-nav", goBack));
      nav.appendChild(button("Main menu", "reggie-opt-nav", goHome));
      list.appendChild(nav);
    }

    optionsEl.appendChild(list);
    optionsEl.scrollTop = 0;
  }

  /* ---------- Navigation ---------- */
  function choose(id) {
    if (busy) return;
    const node = FAQ.nodes[id];
    if (!node) return;
    addMessage("user", node.label);
    history.push(current);
    current = id;
    botSay(node.answer, function () { renderOptions(node); });
  }

  function goBack() {
    if (busy || !history.length) return;
    addMessage("user", "Back");
    current = history.pop();
    const node = current ? FAQ.nodes[current] : null;
    const text = node ? "Sure! Here are the other options for “" + node.label + "”." : FAQ.rootPrompt;
    botSay(text, function () { renderOptions(node); });
  }

  function goHome() {
    if (busy) return;
    addMessage("user", "Main menu");
    current = null;
    history = [];
    botSay(FAQ.rootPrompt, function () { renderOptions(null); });
  }

  /* ---------- Open / close ---------- */
  function openChat() {
    panel.hidden = false;
    root.classList.add("open");
    fab.setAttribute("aria-expanded", "true");
    hideTeaser(true);
    if (!started) {
      started = true;
      botSay(FAQ.greeting, function () { renderOptions(null); });
    }
    closeBtn.focus({ preventScroll: true });
  }

  function closeChat() {
    panel.hidden = true;
    root.classList.remove("open");
    fab.setAttribute("aria-expanded", "false");
    fab.focus({ preventScroll: true });
  }

  fab.addEventListener("click", function () { panel.hidden ? openChat() : closeChat(); });
  closeBtn.addEventListener("click", closeChat);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) closeChat();
  });

  /* ---------- Friendly teaser (shown once per visit) ---------- */
  function hideTeaser(remember) {
    teaser.hidden = true;
    if (remember) { try { sessionStorage.setItem("reggie-teaser", "1"); } catch (e) { /* ignore */ } }
  }

  teaser.querySelector(".reggie-teaser-close").addEventListener("click", function () { hideTeaser(true); });
  teaser.addEventListener("click", function (e) {
    if (!e.target.closest(".reggie-teaser-close")) openChat();
  });

  let seen = false;
  try { seen = sessionStorage.getItem("reggie-teaser") === "1"; } catch (e) { /* ignore */ }
  if (!seen) setTimeout(function () { if (panel.hidden) teaser.hidden = false; }, 2500);

  /* ---------- Developer helper: count unfilled placeholders ---------- */
  const unfilled = Object.keys(FAQ.nodes).filter(function (id) {
    return FAQ.nodes[id].answer.indexOf("[[") !== -1;
  }).length;
  if (unfilled) console.info("[Reggie] " + unfilled + " answers still contain [[placeholders]] in faqs.js");
})();
