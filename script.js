/* ==========================================================
   Office of the College Registrar – City College of Calamba
   Renders service cards, view switcher, search, nav helpers
   ========================================================== */

(function () {
  "use strict";

  /* ---------- Icons (inline SVG) ---------- */
  const svg = (inner) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

  const ICONS = {
    enrollment: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/>'),
    graduation: svg('<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2.5 9 2.5 12 0v-5"/><path d="M22 10v6"/>'),
    transcript: svg('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M9 7h7M9 11h7"/>'),
    transfer: svg('<path d="M17 3l4 4-4 4"/><path d="M3 7h18"/><path d="M7 21l-4-4 4-4"/><path d="M21 17H3"/>'),
    dropping: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9.5 12.5 5 5M14.5 12.5l-5 5"/>'),
    exit: svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>'),
    loa: svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 16h6"/>'),
    returning: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>'),
    ecav: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>')
  };

  const ARROW = svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>')
    .replace('viewBox', 'width="18" height="18" viewBox');

  /* ---------- Services data ---------- */
  const SERVICES = [
    {
      title: "Certificate of Enrollment",
      desc: "Request an official certificate proving your current enrollment status.",
      icon: "enrollment",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSf091uwlBRVmXDcVpq0WYJFYUq1FHQbF5RLgjJAzLFxPGc2Yw/viewform",
      tag: "Certificate"
    },
    {
      title: "Certificate of Graduation",
      desc: "Request a certificate confirming that you have completed your degree program.",
      icon: "graduation",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSf1_J5gfBsVhgMa9iGBUIlpV2n_A1SQrXUFDd6OkzBuXpTxXg/viewform",
      tag: "Certificate"
    },
    {
      title: "Request for Form 137-A / Transcript of Records",
      desc: "Apply for your Form 137-A or official Transcript of Records (TOR).",
      icon: "transcript",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSeYzAXg5go0nyN7nMqM4GXb8HWv93eHm8iYBRiL6gumHvTeeA/viewform",
      tag: "Records"
    },
    {
      title: "Certificate of Transfer / Honorable Dismissal",
      desc: "Request clearance and documents needed for transferring to another school.",
      icon: "transfer",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSeyfiij2evNzmSNOYeiUtiPX_E3viDzNS0kTcd8PO1_IKR_nw/viewform",
      tag: "Certificate"
    },
    {
      title: "Dropping Form",
      desc: "Submit a request to officially drop one or more of your enrolled subjects.",
      icon: "dropping",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSchTK7uHYYt8il1A6fC5y8rcBRKJCJahMJFubtDuMKXgsra5w/viewform",
      tag: "Form"
    },
    {
      title: "Application for Exit Clearance",
      desc: "Apply for your exit clearance before leaving or completing your studies.",
      icon: "exit",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSdabpg2aUjCSom_vd7hKhUYuUI3-nvFtNNUyeEOgkoTKH8fbA/viewform",
      tag: "Clearance"
    },
    {
      title: "Leave of Absence (LOA) Form",
      desc: "File a request for a leave of absence for the current semester.",
      icon: "loa",
      url: "https://docs.google.com/forms/d/e/1FAIpQLScvb7W7LfmLGvDgwwqf7ItEJPkuVqMsrGsVx74hsMfG_ZmWaQ/viewform",
      tag: "Form"
    },
    {
      title: "Application for Returning Student",
      desc: "Returning after a break? Apply here to be re-admitted to the college.",
      icon: "returning",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSfkd2PKublK5vVo5q0Bxzam7Aglxi1QAj1aNsnbz_pHpZdxLg/viewform",
      tag: "Application"
    },
    {
      title: "eCAV",
      desc: "Electronic Certification, Authentication and Verification through the CHED One Touch portal.",
      icon: "ecav",
      url: "https://onetouch.ched.gov.ph/app/login",
      tag: "CHED Portal"
    }
  ];

  /* ---------- Elements ---------- */
  const cardsEl = document.getElementById("cards");
  const searchEl = document.getElementById("searchInput");
  const emptyEl = document.getElementById("emptyState");
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  const toTop = document.getElementById("toTop");
  const yearEl = document.getElementById("year");
  const viewBtns = document.querySelectorAll(".view-btn");

  /* ---------- Render cards ---------- */
  function createCard(service) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.search = (service.title + " " + service.desc + " " + service.tag).toLowerCase();

    card.innerHTML = `
      <span class="card-tag">${service.tag}</span>
      <div class="card-icon">${ICONS[service.icon]}</div>
      <div class="card-text">
        <h3>${service.title}</h3>
        <p>${service.desc}</p>
      </div>
      <span class="card-cta"><span class="cta-label">Open form</span> ${ARROW}</span>
      <a class="card-link" href="${service.url}" target="_blank" rel="noopener noreferrer"
         aria-label="${service.title} – opens in a new tab"></a>
    `;
    return card;
  }

  const cardNodes = SERVICES.map(createCard);
  cardNodes.forEach((node) => cardsEl.appendChild(node));

  /* ---------- Reveal on scroll ---------- */
  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cardNodes.indexOf(entry.target);
            entry.target.style.transitionDelay = (idx % 3) * 80 + "ms";
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  cardNodes.forEach((node) => {
    if (observer) observer.observe(node);
    else node.classList.add("visible");
  });

  /* ---------- View switcher (cards / list / tiles) ---------- */
  const VIEWS = ["grid", "list", "tiles"];
  const STORAGE_KEY = "registrar-view";

  function setView(view, save) {
    if (!VIEWS.includes(view)) view = "grid";
    cardsEl.dataset.view = view;
    viewBtns.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.view === view));
    });
    if (save) {
      try { localStorage.setItem(STORAGE_KEY, view); } catch (e) { /* ignore */ }
    }
  }

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => setView(btn.dataset.view, true));
  });

  let savedView = "grid";
  try { savedView = localStorage.getItem(STORAGE_KEY) || "grid"; } catch (e) { /* ignore */ }
  setView(savedView, false);

  /* ---------- Search filter ---------- */
  searchEl.addEventListener("input", () => {
    const q = searchEl.value.trim().toLowerCase();
    let shown = 0;
    cardNodes.forEach((node) => {
      const match = !q || node.dataset.search.includes(q);
      node.hidden = !match;
      node.style.display = match ? "" : "none";
      if (match) {
        node.classList.add("visible");
        shown++;
      }
    });
    emptyEl.hidden = shown !== 0;
  });

  /* ---------- Mobile navigation ---------- */
  function closeNav() {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- Back to top ---------- */
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Contact pop-up ---------- */
  const contactBtn = document.getElementById("contactBtn");
  const contactModal = document.getElementById("contactModal");
  const contactClose = document.getElementById("contactClose");

  contactBtn.addEventListener("click", () => {
    closeNav();
    if (typeof contactModal.showModal === "function") contactModal.showModal();
    else contactModal.setAttribute("open", "");
  });

  contactClose.addEventListener("click", () => contactModal.close());

  // Close when clicking the dark area outside the box
  contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) contactModal.close();
  });

  /* ---------- Footer year ---------- */
  yearEl.textContent = new Date().getFullYear();
})();
