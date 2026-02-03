/* DIGIY HUB — F16 (index.html compatible)
   - Tabs Tous/Public/PRO
   - Recherche + Reset
   - Stats (Total/Public/PRO)
   - Téléphone mémorisé (localStorage)
   - Rendu modules data-driven dans #modulesGrid
   - Modal simple (confirm / info)
*/

(() => {
  // ==============
  // Utils
  // ==============
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => Array.from(root.querySelectorAll(q));

  const store = {
    key: "DIGIY_HUB_PHONE",
    get() {
      try {
        const v = localStorage.getItem(this.key);
        return (v && v.trim()) ? v.trim() : "";
      } catch (_) { return ""; }
    },
    set(v) {
      try { localStorage.setItem(this.key, (v || "").trim()); } catch (_) {}
    },
    clear() {
      try { localStorage.removeItem(this.key); } catch (_) {}
    }
  };

  // ==============
  // LINKS / MODULES
  // ==============
  // helper: add phone param if supported & phone exists
  function withPhone(url, phone, paramName = "phone") {
    if (!phone) return url;
    try {
      const u = new URL(url, location.href);
      // évite de doubler si déjà présent
      if (!u.searchParams.get(paramName)) u.searchParams.set(paramName, phone);
      return u.toString();
    } catch (_) {
      // fallback simple
      const sep = url.includes("?") ? "&" : "?";
      return url + sep + encodeURIComponent(paramName) + "=" + encodeURIComponent(phone);
    }
  }

  // 🔧 Mets ici tes vrais liens (tu peux modifier tranquille)
  const LINKS = {
    // public / vitrine
    ndimbalMap:       "https://beauville.github.io/digiy-mdimbal-map/",
    bonneAffaire:     "https://beauville.github.io/digiy-market/",
    explore:          "https://beauville.github.io/digiy-explore/",
    driverClient:     "https://beauville.github.io/digiy-driver-client/",

    // pro
    driverPro:        "https://beauville.github.io/digiy-driver-pro/",
    loc:              "https://beauville.github.io/digiy-loc-pro/",
    resto:            "https://beauville.github.io/digiy-resto/",
    build:            "https://beauville.github.io/digiy-build-pro/",
    market:           "https://beauville.github.io/digiy-market/",
    jobs:             "https://beauville.github.io/digiy-jobs/",
    pay:              "https://beauville.github.io/digiy-pay/",
    caissePro:        "https://beauville.github.io/digiy-caisse-pro/",
    resa:             "https://beauville.github.io/digiy-resa/",
    resaTable:        "https://beauville.github.io/digiy-resa-table/",
    notable:          "https://beauville.github.io/digiy-notable/",
    inscriptionPro:   "https://beauville.github.io/inscription-digiy/",
    espacePro:        "https://beauville.github.io/digiy-espace-pro/",

    // fret (ce que tu viens d’ajouter)
    fretClientPro:    "https://beauville.github.io/fret-client-pro/pin.html",
    fretChauffeurPro: "https://beauville.github.io/fret-chauffeur-pro/pin.html",
  };

  // type: "public" | "pro"
  // status: "live" | "beta" | "soon"
  const MODULES = [
    // PUBLIC
    { key:"ndimbalMap",   type:"public", status:"live", icon:"🗺️", name:"DIGIY NDIMBAL MAP", tag:"CARTE COMMUNAUTÉ", desc:"Annuaire géolocalisé : pros, quartiers, filtres.", phoneParam:false },
    { key:"bonneAffaire", type:"public", status:"live", icon:"💥", name:"DIGIY BONNE AFFAIRE", tag:"BONS PLANS", desc:"Promos, deals, bonnes affaires terrain.", phoneParam:false },
    { key:"driverClient", type:"public", status:"live", icon:"🚕", name:"DIGIY DRIVER CLIENT", tag:"COMMANDER", desc:"Commande ta course. Paiement direct.", phoneParam:true },
    { key:"explore",      type:"public", status:"live", icon:"🧭", name:"DIGIY EXPLORE", tag:"DÉCOUVERTE", desc:"Spots & expériences authentiques.", phoneParam:false },

    // PRO
    { key:"driverPro",        type:"pro", status:"live", icon:"🚗", name:"DIGIY DRIVER PRO", tag:"CHAUFFEUR PRO", desc:"Courses, cockpit, encaissements directs.", phoneParam:true },
    { key:"loc",             type:"pro", status:"live", icon:"🏠", name:"DIGIY LOC", tag:"LOCATION SANS OTA", desc:"Planning & réservations direct propriétaire.", phoneParam:true },
    { key:"resto",           type:"pro", status:"live", icon:"🍽️", name:"DIGIY RESTO", tag:"VITRINE RESTAURANT", desc:"Menus, photos, résa directe.", phoneParam:true },
    { key:"build",           type:"pro", status:"live", icon:"🏗️", name:"DIGIY BUILD", tag:"ARTISANS & BTP", desc:"Devis, galerie, contact direct.", phoneParam:true },

    { key:"pay",             type:"pro", status:"beta", icon:"💳", name:"DIGIY PAY", tag:"WALLET", desc:"Wave/OM/CB • activation modules.", phoneParam:true },
    { key:"market",          type:"pro", status:"beta", icon:"🛍️", name:"DIGIY MARKET", tag:"MARKETPLACE", desc:"Acheter/vendre local. Sans commission.", phoneParam:true },
    { key:"jobs",            type:"pro", status:"beta", icon:"💼", name:"DIGIY JOBS", tag:"EMPLOI", desc:"Talents ↔ employeurs • accompagnement dossier.", phoneParam:true },
    { key:"caissePro",       type:"pro", status:"beta", icon:"🧾", name:"DIGIY CAISSE PRO", tag:"POS TERRAIN", desc:"Caisse + sync léger.", phoneParam:true },

    { key:"resa",            type:"pro", status:"beta", icon:"📅", name:"DIGIY RESA", tag:"RÉSERVATIONS", desc:"Planning, confirmations, gestion.", phoneParam:true },
    { key:"resaTable",       type:"pro", status:"beta", icon:"🪑", name:"DIGIY RESA TABLE", tag:"RÉSA RESTO", desc:"Dispos temps réel, plan de salle.", phoneParam:true },
    { key:"notable",         type:"pro", status:"beta", icon:"📓", name:"DIGIY NOTABLE", tag:"DOCS", desc:"Notes, procédures, fiches terrain.", phoneParam:true },

    { key:"inscriptionPro",  type:"pro", status:"live", icon:"📝", name:"INSCRIPTION PRO", tag:"NOUVEAU COMPTE", desc:"Onboard pro + choix module + tarif.", phoneParam:false },
    { key:"espacePro",       type:"pro", status:"live", icon:"🧰", name:"ESPACE PRO", tag:"PORTAIL PRO", desc:"Accès modules (slug + PIN).", phoneParam:false },

    // FRET
    { key:"fretClientPro",    type:"pro", status:"live", icon:"📦", name:"FRET CLIENT PRO", tag:"DEMANDE TRANSPORT", desc:"Créer une demande fret (PIN).", phoneParam:true },
    { key:"fretChauffeurPro", type:"pro", status:"live", icon:"🚚", name:"FRET CHAUFFEUR PRO", tag:"MISSIONS", desc:"Accepter missions fret (PIN).", phoneParam:true },
  ];

  // ==============
  // Modal
  // ==============
  const modal = {
    el: null,
    title: null,
    text: null,
    ok: null,
    cancel: null,
    resolver: null,

    init() {
      this.el = $("#modal");
      this.title = $("#modalTitle");
      this.text = $("#modalText");
      this.ok = $("#modalOk");
      this.cancel = $("#modalCancel");

      if (!this.el) return;

      const close = (value) => {
        this.el.classList.add("hidden");
        this.el.setAttribute("aria-hidden", "true");
        this.resolver && this.resolver(value);
        this.resolver = null;
      };

      this.ok?.addEventListener("click", () => close(true));
      this.cancel?.addEventListener("click", () => close(false));

      // click outside
      this.el.addEventListener("click", (e) => {
        if (e.target === this.el) close(false);
      });

      // esc
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !this.el.classList.contains("hidden")) close(false);
      });

      this._close = close;
    },

    confirm({ title = "Confirmer", text = "Tu es sûr ?", okText = "OK", cancelText = "Annuler" } = {}) {
      if (!this.el) return Promise.resolve(true);
      this.title.textContent = title;
      this.text.innerHTML = text;
      this.ok.textContent = okText;
      this.cancel.textContent = cancelText;

      this.el.classList.remove("hidden");
      this.el.setAttribute("aria-hidden", "false");

      return new Promise((resolve) => { this.resolver = resolve; });
    },

    info({ title = "Info", text = "OK", okText = "OK" } = {}) {
      if (!this.el) return Promise.resolve(true);
      this.title.textContent = title;
      this.text.innerHTML = text;
      this.ok.textContent = okText;
      this.cancel.textContent = "Fermer";

      this.el.classList.remove("hidden");
      this.el.setAttribute("aria-hidden", "false");

      return new Promise((resolve) => { this.resolver = resolve; });
    }
  };

  // ==============
  // UI state
  // ==============
  const state = {
    filter: "all",     // all | public | pro
    q: "",             // search query
    phone: ""
  };

  // ==============
  // Render
  // ==============
  function pillHTML(typeOrStatus) {
    // relies on your CSS: .pill.live/.pill.beta/.pill.soon/.pill.public/.pill.pro
    return `<span class="pill ${typeOrStatus}">${typeOrStatus.toUpperCase()}</span>`;
  }

  function cardHTML(m) {
  const url = LINKS[m.key] || "#";
  const isSoon = m.status === "soon";
  const status = m.status; // live/beta/soon
  const type = m.type;     // public/pro

  const openLabel = isSoon ? "Bientôt" : "Ouvrir";
  const openClass = isSoon ? "btn disabled" : "btn primary";

  return `
    <article class="card" data-key="${m.key}" data-type="${type}" data-status="${status}" tabindex="0" role="button" aria-label="${m.name}">
      <div class="cardTop">
        <div class="icon">${m.icon}</div>
        <div>
          <div class="cardTitle">${m.name}</div>
          <div class="cardDesc">${m.tag}</div>
        </div>
      </div>

      <div class="cardDesc">${m.desc}</div>

      <div class="badges">
        <span class="badge ${status}">${status.toUpperCase()}</span>
        <span class="badge kind-${type}">${type.toUpperCase()}</span>
      </div>

      <div class="cardActions">
        <button class="${openClass}" type="button" ${isSoon ? "disabled" : ""}>→ ${openLabel}</button>
        <button class="btn ghost" type="button" data-action="copy">📌 Copier lien</button>
      </div>

      <div class="cardUrl" aria-hidden="true" style="display:none">${url}</div>
    </article>
  `.trim();
}

  function match(m) {
    if (state.filter !== "all" && m.type !== state.filter) return false;
    if (!state.q) return true;

    const s = state.q.toLowerCase();
    const hay = `${m.key} ${m.name} ${m.tag} ${m.desc}`.toLowerCase();
    return hay.includes(s);
  }

  function updateStats() {
    const total = MODULES.length;
    const pub = MODULES.filter(x => x.type === "public").length;
    const pro = MODULES.filter(x => x.type === "pro").length;

    const stTotal = $("#statTotal");
    const stPublic = $("#statPublic");
    const stPro = $("#statPro");

    if (stTotal) stTotal.textContent = String(total);
    if (stPublic) stPublic.textContent = String(pub);
    if (stPro) stPro.textContent = String(pro);
  }

  function renderGrid() {
    const grid = $("#modulesGrid");
    if (!grid) return;

    const list = MODULES.filter(match);
    grid.innerHTML = list.map(cardHTML).join("\n") || `
      <div class="empty">
        Aucun module trouvé. Essaie : <b>map</b>, <b>loc</b>, <b>driver</b>, <b>pay</b>, <b>fret</b>.
      </div>
    `;

    // click / enter open
    $$(".card", grid).forEach((card) => {
      const key = card.getAttribute("data-key");
      card.addEventListener("click", () => openModule(key));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModule(key);
        }
      });
    });
  }
   // inside renderGrid(), after adding listeners:
$$(".card", grid).forEach((card) => {
  card.addEventListener("click", (e) => {
    const btn = e.target?.closest?.("button");
    if (btn && btn.dataset.action === "copy") {
      e.preventDefault();
      e.stopPropagation();
      const key = card.getAttribute("data-key");
      const m = MODULES.find(x => x.key === key);
      const base = LINKS[key] || "";
      const link = (m && m.phoneParam) ? withPhone(base, state.phone, "phone") : base;

      if (!link) return;
      navigator.clipboard?.writeText(link).catch(()=>{});
      modal.info({ title:"Copié ✅", text:`Lien copié.<br><small>${link}</small>`, okText:"OK" });
      return;
    }
    const key = card.getAttribute("data-key");
    openModule(key);
  });
});

  // ==============
  // Open module
  // ==============
  function openModule(key) {
    const m = MODULES.find(x => x.key === key);
    if (!m) return;

    const base = LINKS[key];
    if (!base) {
      modal.info({
        title: "Lien manquant",
        text: `Le module <b>${m.name}</b> n’a pas encore son URL branchée dans <b>hub.js</b>.`
      });
      return;
    }

    let url = base;
    if (m.phoneParam) url = withPhone(url, state.phone, "phone");

    // ouvre en nouvel onglet (simple & safe)
    window.open(url, "_blank", "noopener");
  }

  // ==============
  // Tabs / Search / Phone
  // ==============
  function setActiveTab(filter) {
    state.filter = filter;

    $$(".tab").forEach(btn => {
      const f = btn.getAttribute("data-filter");
      btn.classList.toggle("active", f === filter);
    });

    renderGrid();
  }

  function setSearch(v) {
    state.q = (v || "").trim();
    renderGrid();
  }

  function refreshPhoneUI() {
    const phoneText = $("#phoneText");
    if (phoneText) phoneText.textContent = state.phone || "non mémorisé";
  }

  async function editPhone() {
    const current = state.phone || "";
    await modal.info({
      title: "Téléphone",
      text: `Entre ton numéro (ex: <b>+22177xxxxxxx</b>).<br><small>Astuce: il sert à pré-remplir certains modules.</small>`,
      okText: "OK"
    });

    // prompt simple (terrain)
    const v = (window.prompt("Ton numéro (format international recommandé) :", current) || "").trim();
    if (!v) return;

    state.phone = v;
    store.set(v);
    refreshPhoneUI();
  }

  async function clearPhone() {
    const ok = await modal.confirm({
      title: "Effacer le numéro ?",
      text: "Ça enlève juste la mémorisation sur cet appareil.",
      okText: "Oui, effacer",
      cancelText: "Annuler"
    });
    if (!ok) return;

    state.phone = "";
    store.clear();
    refreshPhoneUI();
  }

  // ==============
  // CTA buttons (à brancher selon ton flow DIGIY)
  // ==============
  function wireCTAs() {
    $("#btnEnterHubPro")?.addEventListener("click", () => {
      // 👉 choisis ton entrée PRO : espacePro / inscription / pay
      // je te mets Espace Pro par défaut
      openModule("espacePro");
    });

    $("#btnAlreadyAccess")?.addEventListener("click", () => {
      // accès déjà -> Espace Pro direct
      openModule("espacePro");
    });

    $("#btnActivate")?.addEventListener("click", () => {
      // activation -> PAY (ou page tarifs)
      openModule("pay");
    });
  }

  // ==============
  // Boot
  // ==============
  function boot() {
    modal.init();

    // phone
    state.phone = store.get();
    refreshPhoneUI();

    // stats + render
    updateStats();
    renderGrid();

    // tabs
    $$(".tab").forEach(btn => {
      btn.addEventListener("click", () => {
        const f = btn.getAttribute("data-filter") || "all";
        setActiveTab(f);
      });
    });

    // search
    const search = $("#searchInput");
    const btnReset = $("#btnReset");

    search?.addEventListener("input", () => setSearch(search.value));
    btnReset?.addEventListener("click", () => {
      if (search) search.value = "";
      setSearch("");
      setActiveTab("all");
    });

    // phone buttons
    $("#btnEditPhone")?.addEventListener("click", editPhone);
    $("#btnClearPhone")?.addEventListener("click", clearPhone);

    // CTAs
    wireCTAs();

    // default tab active
    setActiveTab("all");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
