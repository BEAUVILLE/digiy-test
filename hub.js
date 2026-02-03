/* DIGIY HUB F16 — hub.js (PRO CLEAN: all PRO -> inscription) */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const STORAGE_PHONE  = "DIGIY_HUB_PHONE";
const STORAGE_FILTER = "DIGIY_HUB_FILTER";
const STORAGE_SEARCH = "DIGIY_HUB_SEARCH";

const state = {
  phone: "",
  filter: "all", // all | public | pro
  q: ""
};

/* =========================
   LINKS (EDIT ICI)
   ========================= */
const LINKS = {
  digiylyfe:    "https://digiylyfe.com",
  tarifs:       "https://beauville.github.io/digiy/",
  ndimbalMap:   "https://beauville.github.io/digiy-mdimbal-map/",
  hubDrive:     "https://beauville.github.io/digiy-hub-drive/",

  // Public
  bonneAffaire: "https://beauville.github.io/digiy-bonne-affaire/",
  driverClient: "https://beauville.github.io/digiy-driver-client/",
  loc:          "https://beauville.github.io/digiy-loc/",
  resto:        "https://beauville.github.io/digiy-resto/",
  build:        "https://beauville.github.io/digiy-build/",
  explore:      "https://beauville.github.io/digiy-explore/",
  market:       "https://beauville.github.io/digiy-market/",
  jobs:         "https://beauville.github.io/digiy-jobs/",
  pay:          "https://beauville.github.io/digiy-pay/",
  resa:         "https://beauville.github.io/digiy-resa/",
  resaTable:    "https://beauville.github.io/digiy-resa-table/",
  notable:      "https://beauville.github.io/digiy-notable/",

  // PRO (BASE)
  inscriptionPro: "https://beauville.github.io/inscription-digiy/",

  // FRET PIN direct (PRO)
  fretClientProPin:     "https://beauville.github.io/fret-client-pro/pin.html",
  fretChauffeurProPin:  "https://beauville.github.io/fret-chauffeur-pro/pin.html"
};

// ✅ règle demandée : TOUS les PRO ouvrent inscription
const PRO_DEFAULT_URL = LINKS.inscriptionPro;

/* =========================
   MODULES (DATA)
   ========================= */
const MODULES = [
  /* -------- PUBLIC -------- */
  {
    key: "bonneAffaire",
    name: "DIGIY BONNE AFFAIRE",
    icon: "💥",
    tag: "BONS PLANS • PROMOS",
    desc: "Les meilleures opportunités locales : promos, deals, bonnes affaires terrain.",
    kind: "public",
    status: "live",
    phoneParam: false
  },
  {
    key: "ndimbalMap",
    name: "DIGIY NDIMBAL MAP",
    icon: "🗺️",
    tag: "CARTE COMMUNAUTÉ",
    desc: "Annuaire géolocalisé : pros, quartiers, filtres. Sénégal terrain.",
    kind: "public",
    status: "live",
    phoneParam: false
  },
  {
    key: "driverClient",
    name: "DIGIY DRIVER CLIENT",
    icon: "🚕",
    tag: "COMMANDER UNE COURSE",
    desc: "Commande ta course. Paiement direct. 0% commission.",
    kind: "public",
    status: "live",
    phoneParam: true
  },
  {
    key: "loc",
    name: "DIGIY LOC",
    icon: "🏠",
    tag: "LOCATION SANS OTA",
    desc: "Alternative Booking/Airbnb, direct propriétaire, sans commission.",
    kind: "public",
    status: "live",
    phoneParam: true
  },
  {
    key: "resto",
    name: "DIGIY RESTO",
    icon: "🍽️",
    tag: "VITRINE RESTAURANT",
    desc: "Menus, photos, horaires, localisation. Réservation directe.",
    kind: "public",
    status: "live",
    phoneParam: true
  },
  {
    key: "build",
    name: "DIGIY BUILD",
    icon: "🏗️",
    tag: "ARTISANS & BTP",
    desc: "Devis, galerie, contact. Humain. Direct. Sans commission.",
    kind: "public",
    status: "live",
    phoneParam: true
  },
  {
    key: "explore",
    name: "DIGIY EXPLORE",
    icon: "🧭",
    tag: "TOURISME & DÉCOUVERTE",
    desc: "Découvrir l'Afrique : guides, visibilité, expériences authentiques.",
    kind: "public",
    status: "live",
    phoneParam: false
  },
  {
    key: "market",
    name: "DIGIY MARKET",
    icon: "🛍️",
    tag: "MARKETPLACE LOCALE",
    desc: "Acheter/vendre local. Annonces propres. Sans commission.",
    kind: "public",
    status: "beta",
    phoneParam: true
  },
  {
    key: "jobs",
    name: "DIGIY JOBS",
    icon: "💼",
    tag: "EMPLOI & TALENTS",
    desc: "Offres, candidatures, profils. Pont talents–employeurs.",
    kind: "public",
    status: "beta",
    phoneParam: true
  },
  {
    key: "pay",
    name: "DIGIY PAY",
    icon: "💳",
    tag: "WAVE / OM / CB",
    desc: "Wallet unifié, activation modules (en cours).",
    kind: "public",
    status: "soon",
    phoneParam: true
  },
  {
    key: "resa",
    name: "DIGIY RESA",
    icon: "📅",
    tag: "RÉSERVATIONS",
    desc: "Planning, confirmations, gestion des réservations.",
    kind: "public",
    status: "beta",
    phoneParam: true
  },
  {
    key: "resaTable",
    name: "DIGIY RESA TABLE",
    icon: "🪑",
    tag: "RÉSA RESTAURANT",
    desc: "Réservation tables, plan de salle, disponibilités.",
    kind: "public",
    status: "beta",
    phoneParam: true
  },
  {
    key: "notable",
    name: "DIGIY NOTABLE",
    icon: "📓",
    tag: "NOTES & DOCS",
    desc: "Notes terrain, procédures, fiches.",
    kind: "public",
    status: "soon",
    phoneParam: false
  },

  /* -------- PRO (TOUS -> INSCRIPTION) -------- */
  {
    key: "espacePro",
    name: "ESPACE PRO",
    icon: "🧰",
    tag: "INSCRIPTION • ACCÈS",
    desc: "Portail PRO : création / accès (slug + PIN).",
    kind: "pro",
    status: "live",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "driverPro",
    name: "DIGIY DRIVER PRO",
    icon: "🚗",
    tag: "CHAUFFEUR PRO",
    desc: "Cockpit chauffeur, courses, encaissements.",
    kind: "pro",
    status: "live",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "locPro",
    name: "DIGIY LOC PRO",
    icon: "🏡",
    tag: "PROPRIÉTAIRES",
    desc: "Cockpit propriétaire, planning, réservations.",
    kind: "pro",
    status: "live",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "buildPro",
    name: "DIGIY BUILD PRO",
    icon: "🧱",
    tag: "ARTISANS • DEVIS",
    desc: "Devis, chantiers, pipeline.",
    kind: "pro",
    status: "beta",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "caissePro",
    name: "DIGIY CAISSE PRO",
    icon: "🧾",
    tag: "POS • ENCAISSEMENT",
    desc: "Caisse pro, encaissement terrain.",
    kind: "pro",
    status: "beta",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "marketPro",
    name: "DIGIY MARKET PRO",
    icon: "📦",
    tag: "BOUTIQUE • CATALOGUE",
    desc: "Gestion produits, commandes, stock.",
    kind: "pro",
    status: "soon",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "jobsPro",
    name: "DIGIY JOBS PRO",
    icon: "🧑🏾‍💼",
    tag: "EMPLOYEURS",
    desc: "Gestion offres, dossiers, suivi accompagnement.",
    kind: "pro",
    status: "soon",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "restoPro",
    name: "DIGIY RESTO PRO",
    icon: "👨🏾‍🍳",
    tag: "MENU • RÉSA • CAISSE",
    desc: "Gestion resto côté PRO.",
    kind: "pro",
    status: "soon",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "explorePro",
    name: "DIGIY EXPLORE PRO",
    icon: "🧭",
    tag: "SPOTS • GUIDES",
    desc: "Gestion spots et expériences côté PRO.",
    kind: "pro",
    status: "soon",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "payPro",
    name: "DIGIY PAY PRO",
    icon: "💸",
    tag: "WAVE • OM • QR",
    desc: "Encaissement + activation modules côté PRO.",
    kind: "pro",
    status: "soon",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  {
    key: "resaPro",
    name: "DIGIY RESA PRO",
    icon: "📆",
    tag: "PLANNING • CONFIRM",
    desc: "Gestion réservations côté PRO.",
    kind: "pro",
    status: "soon",
    phoneParam: true,
    directUrl: PRO_DEFAULT_URL
  },
  // FRET : tu voulais PRO -> inscription, mais on garde les PIN directs (c'est plus logique)
  {
    key: "fretClientProPin",
    name: "FRET CLIENT PRO",
    icon: "📦",
    tag: "PIN DIRECT",
    desc: "Portail FRET client — accès direct via PIN.",
    kind: "pro",
    status: "live",
    phoneParam: false,
    directUrl: LINKS.fretClientProPin
  },
  {
    key: "fretChauffeurProPin",
    name: "FRET CHAUFFEUR PRO",
    icon: "🚚",
    tag: "PIN DIRECT",
    desc: "Portail FRET chauffeur — accès direct via PIN.",
    kind: "pro",
    status: "live",
    phoneParam: false,
    directUrl: LINKS.fretChauffeurProPin
  }
];

/* =========================
   HELPERS
   ========================= */
function normPhone(p) {
  if (!p) return "";
  let s = String(p).trim();
  s = s.replace(/[^\d+]/g, "");
  if (s && !s.startsWith("+")) {
    if (s.startsWith("221")) s = "+" + s;
  }
  return s;
}

function withPhone(url, phone, param = "phone") {
  if (!url) return "";
  if (!phone) return url;
  try {
    const u = new URL(url);
    u.searchParams.set(param, phone);
    return u.toString();
  } catch (_) {
    const sep = url.includes("?") ? "&" : "?";
    return url + sep + encodeURIComponent(param) + "=" + encodeURIComponent(phone);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[m]));
}

/* =========================
   MODAL
   ========================= */
const modal = {
  root: null,
  titleEl: null,
  textEl: null,
  okBtn: null,
  cancelBtn: null,
  _onOk: null,
  _onCancel: null,

  init() {
    this.root = $("#modal");
    this.titleEl = $("#modalTitle");
    this.textEl = $("#modalText");
    this.okBtn = $("#modalOk");
    this.cancelBtn = $("#modalCancel");
    if (!this.root) return;

    this.okBtn?.addEventListener("click", () => {
      this.hide();
      if (typeof this._onOk === "function") this._onOk();
    });
    this.cancelBtn?.addEventListener("click", () => {
      this.hide();
      if (typeof this._onCancel === "function") this._onCancel();
    });

    this.root.addEventListener("click", (e) => {
      if (e.target === this.root) this.hide();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.root.classList.contains("hidden")) this.hide();
    });
  },

  show({ title, text, okText = "OK", cancelText = "Annuler", onOk = null, onCancel = null, hideCancel = false }) {
    if (!this.root) return;
    this.titleEl.textContent = title || "Info";
    this.textEl.innerHTML = text || "";
    this.okBtn.textContent = okText;
    this.cancelBtn.textContent = cancelText;
    this._onOk = onOk;
    this._onCancel = onCancel;
    this.cancelBtn.style.display = hideCancel ? "none" : "";
    this.root.classList.remove("hidden");
    this.root.setAttribute("aria-hidden", "false");
  },

  info({ title, text, okText = "OK" }) {
    this.show({ title, text, okText, hideCancel: true });
  },

  hide() {
    if (!this.root) return;
    this.root.classList.add("hidden");
    this.root.setAttribute("aria-hidden", "true");
    this._onOk = null;
    this._onCancel = null;
  }
};

/* =========================
   HUB OVERLAY (IFRAME)
   ========================= */
const hub = {
  overlay: null,
  frame: null,
  backBtn: null,
  closeBtn: null,

  init() {
    this.overlay = $("#hubOverlay");
    this.frame = $("#hubFrame");
    this.backBtn = $("#hubBackBtn");
    this.closeBtn = $("#hubCloseBtn");
    if (!this.overlay || !this.frame) return;

    const close = () => this.close();
    this.closeBtn?.addEventListener("click", close);
    this.backBtn?.addEventListener("click", close);

    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) close();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.overlay.classList.contains("hidden")) close();
    });
  },

  open(url) {
    if (!url) return;
    this.frame.src = url;
    this.overlay.classList.remove("hidden");
    this.overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  },

  close() {
    if (!this.overlay) return;
    this.overlay.classList.add("hidden");
    this.overlay.setAttribute("aria-hidden", "true");
    this.frame.src = "about:blank";
    document.body.style.overflow = "";
  }
};

/* =========================
   UI REFS
   ========================= */
let modulesGridEl, phoneTextEl, searchInputEl;
let statTotalEl, statPublicEl, statProEl;

/* =========================
   FILTERS
   ========================= */
function setFilter(f) {
  state.filter = f;
  localStorage.setItem(STORAGE_FILTER, f);
  $$(".tab").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === f));
  render();
}

function setSearch(q) {
  state.q = q;
  localStorage.setItem(STORAGE_SEARCH, q);
  render();
}

function getFilteredModules() {
  const q = (state.q || "").trim().toLowerCase();

  return MODULES.filter(m => {
    if (state.filter === "public" && m.kind !== "public") return false;
    if (state.filter === "pro" && m.kind !== "pro") return false;
    if (!q) return true;

    const hay = [m.key, m.name, m.tag, m.desc, m.kind, m.status].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

function updateStats(filtered) {
  const total = filtered.length;
  const pub = filtered.filter(m => m.kind === "public").length;
  const pro = filtered.filter(m => m.kind === "pro").length;

  if (statTotalEl) statTotalEl.textContent = String(total);
  if (statPublicEl) statPublicEl.textContent = String(pub);
  if (statProEl) statProEl.textContent = String(pro);
}

/* =========================
   CARDS
   ========================= */
function badgeHTML(kind, status) {
  const kindBadge = `<span class="badge kind-${kind}">${kind === "pro" ? "PRO" : "PUBLIC"}</span>`;
  const st = status || "soon";
  const stBadge = `<span class="badge ${st}">${st.toUpperCase()}</span>`;
  return kindBadge + stBadge;
}

// ✅ règle PRO: si module PRO => inscription (sauf fret pin direct)
function getModuleUrl(m) {
  // directUrl priorité (ex: fret pin)
  let base = m.directUrl || LINKS[m.key] || "";

  if (m.kind === "pro") {
    // tout PRO sur inscription, sauf si directUrl explicit (fret pin)
    base = m.directUrl || PRO_DEFAULT_URL;
  }

  if (!base) return "";

  if (m.phoneParam && state.phone) {
    base = withPhone(base, state.phone, "phone");
  }
  return base;
}

function cardHTML(m) {
  const url = getModuleUrl(m);
  const disabled = !url;

  return `
    <div class="card" tabindex="0" role="button" aria-label="${escapeHtml(m.name)}" data-key="${escapeHtml(m.key)}">
      <div class="cardTop">
        <div class="icon">${escapeHtml(m.icon || "∞")}</div>
        <div style="flex:1;min-width:0">
          <div class="cardTitle">${escapeHtml(m.name)}</div>
          <div class="cardDesc">${escapeHtml(m.desc || "")}</div>

          <div class="badges">
            ${badgeHTML(m.kind, m.status)}
            ${m.tag ? `<span class="badge">${escapeHtml(m.tag)}</span>` : ""}
          </div>

          ${url ? `<div class="smallLink">${escapeHtml(url)}</div>` : ""}
        </div>
      </div>

      <div class="cardActions">
        <button class="btn ${disabled ? "disabled" : "primary"}" data-action="open" ${disabled ? "disabled" : ""} type="button">
          Ouvrir →
        </button>
        <button class="btn ${disabled ? "disabled" : ""}" data-action="copy" ${disabled ? "disabled" : ""} type="button">
          Copier lien
        </button>
      </div>
    </div>
  `;
}

/* =========================
   RENDER
   ========================= */
function renderGrid() {
  const grid = modulesGridEl;
  if (!grid) return;

  const filtered = getFilteredModules();
  grid.innerHTML = filtered.length
    ? filtered.map(cardHTML).join("")
    : `<div class="empty">Aucun module ne correspond à ta recherche.</div>`;

  $$(".card", grid).forEach(card => {
    card.addEventListener("click", (e) => {
      const btn = e.target?.closest?.("button");
      const key = card.getAttribute("data-key");
      const m = MODULES.find(x => x.key === key);
      if (!m) return;

      if (btn && btn.dataset.action === "copy") {
        e.preventDefault();
        e.stopPropagation();
        const link = getModuleUrl(m);
        if (!link) return;
        navigator.clipboard?.writeText(link).catch(() => {});
        modal.info({ title: "Copié ✅", text: `Lien copié.<br><small>${escapeHtml(link)}</small>` });
        return;
      }

      openModule(key);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModule(card.getAttribute("data-key"));
      }
    });
  });

  updateStats(filtered);
}

function renderPhone() {
  if (!phoneTextEl) return;
  phoneTextEl.textContent = state.phone ? state.phone : "non mémorisé";
}

function render() {
  renderPhone();
  renderGrid();
}

/* =========================
   ACTIONS
   ========================= */
function openModule(key) {
  const m = MODULES.find(x => x.key === key);
  if (!m) return;

  const url = getModuleUrl(m);
  if (!url) {
    modal.info({
      title: "Module non disponible",
      text: "Lien non défini."
    });
    return;
  }

  hub.open(url);
}

function askPhone() {
  modal.show({
    title: "Numéro (optionnel)",
    text:
      `Entre ton numéro (ex: <b>+221771234567</b>)<br>
       <small>Le HUB peut l'envoyer à certains modules.</small>
       <div style="margin-top:10px">
         <input id="phonePrompt"
           style="width:100%;padding:12px;border-radius:14px;border:1px solid rgba(148,163,184,.25);background:rgba(2,6,23,.18);color:#fff;outline:none"
           placeholder="+221..." value="${escapeHtml(state.phone)}"/>
       </div>`,
    okText: "Enregistrer",
    cancelText: "Annuler",
    onOk: () => {
      const inp = $("#phonePrompt");
      const val = normPhone(inp?.value || "");
      state.phone = val;
      localStorage.setItem(STORAGE_PHONE, val);
      render();
    }
  });

  setTimeout(() => $("#phonePrompt")?.focus(), 50);
}

/* =========================
   INIT
   ========================= */
function boot() {
  modulesGridEl = $("#modulesGrid");
  phoneTextEl   = $("#phoneText");
  searchInputEl = $("#searchInput");
  statTotalEl   = $("#statTotal");
  statPublicEl  = $("#statPublic");
  statProEl     = $("#statPro");

  modal.init();
  hub.init();

  // state load
  state.phone  = normPhone(localStorage.getItem(STORAGE_PHONE) || "");
  state.filter = localStorage.getItem(STORAGE_FILTER) || "all";
  state.q      = localStorage.getItem(STORAGE_SEARCH) || "";

  // phone buttons
  $("#btnEditPhone")?.addEventListener("click", askPhone);
  $("#btnClearPhone")?.addEventListener("click", () => {
    state.phone = "";
    localStorage.removeItem(STORAGE_PHONE);
    render();
  });

  // hero CTAs
  $("#btnEnterHubPro")?.addEventListener("click", () => hub.open(withPhone(PRO_DEFAULT_URL, state.phone, "phone")));
  $("#btnAlreadyAccess")?.addEventListener("click", () => modal.info({
    title: "Accès PRO",
    text: "Choisis un module PRO : tu seras redirigé vers l'inscription / accès."
  }));
  $("#btnActivate")?.addEventListener("click", () => hub.open(withPhone(PRO_DEFAULT_URL, state.phone, "phone")));

  // tabs
  $$(".tab").forEach(btn => btn.addEventListener("click", () => setFilter(btn.dataset.filter)));

  // search
  if (searchInputEl) {
    searchInputEl.value = state.q || "";
    searchInputEl.addEventListener("input", () => setSearch(searchInputEl.value));
  }

  $("#btnReset")?.addEventListener("click", () => {
    state.q = "";
    localStorage.removeItem(STORAGE_SEARCH);
    if (searchInputEl) searchInputEl.value = "";
    setFilter("all");
  });

  // brand scroll top
  $("#homeBrand")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ===========================
  // BOUTONS FLOTTANTS
  // ===========================
  
  // 🏷️ Tarifs DIGIY
  $("#tarif-bubble-btn")?.addEventListener("click", () => {
    hub.open(LINKS.tarifs);
  });

  // 🧰 ESPACE PRO
  $("#espace-pro-btn")?.addEventListener("click", () => {
    hub.open(withPhone(PRO_DEFAULT_URL, state.phone, "phone"));
  });

  // ♾️ NDIMBAL - ouvrir popup
  $("#digiy-help-btn")?.addEventListener("click", () => {
    const ndimbal = $("#digiy-ndimbal");
    if (ndimbal) {
      ndimbal.classList.remove("hidden");
      ndimbal.setAttribute("aria-hidden", "false");
    }
  });

  // NDIMBAL - fermer
  $("#digiyCloseBtn")?.addEventListener("click", () => {
    const ndimbal = $("#digiy-ndimbal");
    if (ndimbal) {
      ndimbal.classList.add("hidden");
      ndimbal.setAttribute("aria-hidden", "true");
    }
  });

  // NDIMBAL - actions (délégation)
  const ndimbalPopup = $("#digiy-ndimbal");
  if (ndimbalPopup) {
    ndimbalPopup.addEventListener("click", (e) => {
      // Fermer si clic sur fond
      if (e.target === ndimbalPopup) {
        ndimbalPopup.classList.add("hidden");
        ndimbalPopup.setAttribute("aria-hidden", "true");
        return;
      }

      // Actions boutons
      const btn = e.target?.closest?.("button");
      if (!btn || !btn.dataset.action) return;

      const action = btn.dataset.action;
      
      // Fermer popup
      ndimbalPopup.classList.add("hidden");
      ndimbalPopup.setAttribute("aria-hidden", "true");

      // Router l'action
      if (action === "sell") {
        hub.open(withPhone(LINKS.hubDrive, state.phone, "phone"));
      } else if (action === "job") {
        hub.open(withPhone(LINKS.jobs, state.phone, "phone"));
      } else if (action === "qr") {
        const qrModal = $("#qrModal");
        if (qrModal) {
          qrModal.classList.remove("hidden");
          qrModal.setAttribute("aria-hidden", "false");
        }
      }
    });
  }

  // QR Modal - fermer
  $("#qrClose")?.addEventListener("click", () => {
    const qrModal = $("#qrModal");
    if (qrModal) {
      qrModal.classList.add("hidden");
      qrModal.setAttribute("aria-hidden", "true");
    }
  });

  // QR Modal - fermer sur fond
  const qrModalPopup = $("#qrModal");
  if (qrModalPopup) {
    qrModalPopup.addEventListener("click", (e) => {
      if (e.target === qrModalPopup) {
        qrModalPopup.classList.add("hidden");
        qrModalPopup.setAttribute("aria-hidden", "true");
      }
    });
  }

  // apply tab active
  $$(".tab").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === state.filter));

  render();
}

document.addEventListener("DOMContentLoaded", boot);
