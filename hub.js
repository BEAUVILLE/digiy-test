/* DIGIY HUB — F16 data-driven (public + pro)
   - 1 source of truth: MODULES[]
   - filtre: all/public/pro
   - recherche
   - boutons auto (désactivés si url manquante)
   - téléphone mémorisé + option d'ajout param ?phone=
*/

(function(){
  "use strict";

  // ====== CONFIG ======
  const STORAGE_PHONE_KEY = "DIGIY_HUB_PHONE";
  const DEFAULT_PHONE = "+221778765785"; // tu peux laisser, ou vide si tu veux

  // ⚠️ Mets ici tes vraies routes "caisse/activation" si tu en as
  const HUB_PRO_URL = "https://beauville.github.io/digiy-hub/"; // ou ton vrai HUB PRO
  const ACCESS_URL  = "https://beauville.github.io/digiy-hub/"; // page "j'ai déjà mon accès" (pin/login si tu veux)
  const ACTIVATE_URL = "https://beauville.github.io/digiy-pay/"; // si pas encore, laisse, ça se désactive

  // ✅ Data: modules (mets tes vrais liens, le reste peut rester "à brancher")
  const MODULES = [
    // --- PUBLIC (accès libre) ---
    {
      key: "mdimbal_map",
      name: "NDIMBAL MAP",
      desc: "Carte terrain · entraide · repérage. Public.",
      icon: "🗺️",
      kind: "public",
      status: "live",
      url: "https://beauville.github.io/digiy-mdimbal-map/",
      supportsPhoneParam: false,
    },
    {
      key: "explore_public",
      name: "DIGIY EXPLORE",
      desc: "Spots · tourisme · bons plans. Public (si tu l’ouvres).",
      icon: "🧭",
      kind: "public",
      status: "beta",
      url: "https://beauville.github.io/digiy-explore/",
      supportsPhoneParam: false,
    },
    {
      key: "market_public",
      name: "DIGIY MARKET",
      desc: "Deals · marketplace · terrain. Public (si tu l’ouvres).",
      icon: "🛒",
      kind: "public",
      status: "soon",
      url: "https://beauville.github.io/digiy-market/",
      supportsPhoneParam: false,
    },
    {
      key: "jobs_public",
      name: "DIGIY JOBS",
      desc: "Infos emploi · orientation · dossiers. Public (si tu l’ouvres).",
      icon: "🧰",
      kind: "public",
      status: "soon",
      url: "https://beauville.github.io/digiy-jobs/",
      supportsPhoneParam: false,
    },

    // --- PRO (accès requis) ---
    {
      key: "loc_pro",
      name: "DIGIY LOC PRO",
      desc: "Locations · hébergements · planning. Accès PRO requis.",
      icon: "🏠",
      kind: "pro",
      status: "live",
      url: "https://beauville.github.io/digiy-loc-pro/",
      supportsPhoneParam: true, // si ton module sait lire ?phone=
      requiresAccess: true
    },
    {
      key: "driver_pro",
      name: "DIGIY DRIVER PRO",
      desc: "Chauffeur · courses · cockpit. Accès PRO requis.",
      icon: "🚗",
      kind: "pro",
      status: "live",
      url: "https://beauville.github.io/digiy-driver-pro/",
      supportsPhoneParam: true,
      requiresAccess: true
    },
    {
      key: "build_pro",
      name: "DIGIY BUILD PRO",
      desc: "Artisans · devis · chantiers. Accès PRO requis.",
      icon: "🧱",
      kind: "pro",
      status: "beta",
      url: "https://beauville.github.io/digiy-build-pro/",
      supportsPhoneParam: true,
      requiresAccess: true
    },
    {
      key: "store_pro",
      name: "DIGIY STORE PRO",
      desc: "Boutique · gestion · caisse terrain. Accès PRO requis.",
      icon: "🏪",
      kind: "pro",
      status: "soon",
      url: "", // à brancher
      supportsPhoneParam: false,
      requiresAccess: true
    },
    {
      key: "pay",
      name: "DIGIY PAY",
      desc: "Wave/QR · paiement direct au pro. (Activation / caisse)",
      icon: "💸",
      kind: "pro",
      status: "beta",
      url: ACTIVATE_URL, // si vide => bouton désactivé
      supportsPhoneParam: true,
      requiresAccess: false
    },
    {
      key: "langue",
      name: "DIGIY LANGUE",
      desc: "Langues locales · micro-copies · terrain.",
      icon: "🗣️",
      kind: "pro",
      status: "soon",
      url: "", // à brancher
      supportsPhoneParam: false,
      requiresAccess: false
    },
    {
      key: "style",
      name: "DIGIY STYLE",
      desc: "Mode · beauté · style local. (quand tu l’ouvres)",
      icon: "👗",
      kind: "pro",
      status: "soon",
      url: "", // à brancher
      supportsPhoneParam: false,
      requiresAccess: false
    },
    {
      key: "resto_caisse",
      name: "DIGIY RESTO / CAISSE",
      desc: "Resto · tickets · caisse terrain.",
      icon: "🍽️",
      kind: "pro",
      status: "soon",
      url: "", // à brancher
      supportsPhoneParam: false,
      requiresAccess: true
    },
    {
      key: "sap",
      name: "SAP DIGIYLYFE",
      desc: "Progiciel commerçant · back-office · souverain.",
      icon: "🧠",
      kind: "pro",
      status: "soon",
      url: "", // à brancher
      supportsPhoneParam: false,
      requiresAccess: true
    },
  ];

  // ====== STATE ======
  let activeFilter = "all";
  let searchTerm = "";

  // ====== HELPERS ======
  const $ = (id) => document.getElementById(id);
  const safeLower = (s) => (s || "").toString().toLowerCase();
  const hasUrl = (m) => typeof m.url === "string" && m.url.trim().length > 0;

  function getStoredPhone(){
    const v = (localStorage.getItem(STORAGE_PHONE_KEY) || "").trim();
    if(v) return v;
    // si rien stocké, on peut prefill par défaut (optionnel)
    return (DEFAULT_PHONE || "").trim();
  }

  function setStoredPhone(phone){
    const p = (phone || "").trim();
    if(p){
      localStorage.setItem(STORAGE_PHONE_KEY, p);
    }else{
      localStorage.removeItem(STORAGE_PHONE_KEY);
    }
    renderPhone();
    render();
  }

  function appendPhoneIfSupported(url, mod){
    const phone = getStoredPhone();
    if(!phone) return url;
    if(!mod.supportsPhoneParam) return url;

    try{
      const u = new URL(url);
      if(!u.searchParams.get("phone")) u.searchParams.set("phone", phone);
      return u.toString();
    }catch(e){
      // URL peut être relative/invalid -> fallback simple
      const glue = url.includes("?") ? "&" : "?";
      return url + glue + "phone=" + encodeURIComponent(phone);
    }
  }

  // ====== MODAL ======
  function showModal({title, text, okText="OK", cancelText="Annuler", onOk=null, showCancel=true}){
    const modal = $("modal");
    const mTitle = $("modalTitle");
    const mText = $("modalText");
    const btnOk = $("modalOk");
    const btnCancel = $("modalCancel");

    mTitle.textContent = title || "Info";
    mText.textContent = text || "";

    btnOk.textContent = okText;
    btnCancel.textContent = cancelText;

    btnCancel.style.display = showCancel ? "inline-flex" : "none";

    function close(){
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      btnOk.onclick = null;
      btnCancel.onclick = null;
      window.removeEventListener("keydown", onKey);
    }
    function onKey(e){
      if(e.key === "Escape") close();
    }

    btnOk.onclick = () => {
      try{ onOk && onOk(); } finally { close(); }
    };
    btnCancel.onclick = () => close();

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    window.addEventListener("keydown", onKey);
  }

  // ====== FILTERING ======
  function matchesFilter(mod){
    if(activeFilter === "all") return true;
    return mod.kind === activeFilter;
  }

  function matchesSearch(mod){
    if(!searchTerm) return true;
    const hay = safeLower([mod.name, mod.desc, mod.key].join(" "));
    return hay.includes(safeLower(searchTerm));
  }

  function getVisibleModules(){
    return MODULES.filter(m => matchesFilter(m) && matchesSearch(m));
  }

  // ====== RENDER ======
  function renderPhone(){
    const phone = getStoredPhone();
    $("phoneText").textContent = phone || "non mémorisé";
  }

  function renderStats(){
    $("statTotal").textContent = MODULES.length.toString();
    $("statPublic").textContent = MODULES.filter(m => m.kind === "public").length.toString();
    $("statPro").textContent = MODULES.filter(m => m.kind === "pro").length.toString();
  }

  function mkBadge(text, cls){
    const span = document.createElement("span");
    span.className = "badge " + cls;
    span.textContent = text;
    return span;
  }

  function mkButton(label, onClick, {variant="primary", disabled=false}={}){
    const b = document.createElement("button");
    b.className = "btn " + (variant || "");
    b.textContent = label;
    if(disabled){
      b.classList.add("disabled");
      b.disabled = true;
    }else{
      b.addEventListener("click", onClick);
    }
    return b;
  }

  function openUrl(url){
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function render(){
    const grid = $("modulesGrid");
    grid.innerHTML = "";

    const list = getVisibleModules();

    if(list.length === 0){
      const empty = document.createElement("div");
      empty.className = "card";
      empty.innerHTML = `
        <div class="cardTop">
          <div class="icon">😅</div>
          <div>
            <h3 class="cardTitle">Aucun module trouvé</h3>
            <p class="cardDesc">Change le filtre ou tape un autre mot-clé.</p>
          </div>
        </div>
      `;
      grid.appendChild(empty);
      return;
    }

    list.forEach(mod => {
      const card = document.createElement("div");
      card.className = "card";

      const top = document.createElement("div");
      top.className = "cardTop";

      const icon = document.createElement("div");
      icon.className = "icon";
      icon.textContent = mod.icon || "∞";

      const meta = document.createElement("div");
      const h = document.createElement("h3");
      h.className = "cardTitle";
      h.textContent = mod.name;

      const p = document.createElement("p");
      p.className = "cardDesc";
      p.textContent = mod.desc || "";

      meta.appendChild(h);
      meta.appendChild(p);

      top.appendChild(icon);
      top.appendChild(meta);

      const badges = document.createElement("div");
      badges.className = "badges";

      badges.appendChild(mkBadge(mod.kind === "public" ? "PUBLIC" : "PRO", mod.kind === "public" ? "kind-public" : "kind-pro"));
      badges.appendChild(mkBadge((mod.status || "soon").toUpperCase(), mod.status || "soon"));

      // extra: si url manquante
      if(!hasUrl(mod)){
        badges.appendChild(mkBadge("À BRANCHER", "soon"));
      }

      const actions = document.createElement("div");
      actions.className = "cardActions";

      // bouton principal : Ouvrir
      const canOpen = hasUrl(mod);

      const openLabel = mod.kind === "public" ? "Ouvrir" : (mod.requiresAccess ? "Espace PRO" : "Ouvrir");
      actions.appendChild(
        mkButton(
          canOpen ? `➡️ ${openLabel}` : "⛔ Lien manquant",
          () => {
            const url = appendPhoneIfSupported(mod.url, mod);
            if(mod.kind === "pro" && mod.requiresAccess){
              // si pro + accès requis, on laisse l'app gérer pin/guard
              openUrl(url);
            }else{
              openUrl(url);
            }
          },
          {variant:"primary", disabled: !canOpen}
        )
      );

      // bouton secondaire : Détails / Action
      actions.appendChild(
        mkButton(
          "ℹ️ Détails",
          () => {
            const phone = getStoredPhone();
            const urlInfo = hasUrl(mod) ? appendPhoneIfSupported(mod.url, mod) : "(pas encore branché)";
            showModal({
              title: mod.name,
              text:
                `Type: ${mod.kind.toUpperCase()} · Statut: ${(mod.status||"soon").toUpperCase()}\n` +
                `Téléphone: ${phone || "—"}\n` +
                `Lien: ${urlInfo}`,
              okText: "OK",
              showCancel: false
            });
          },
          {variant:"ghost", disabled:false}
        )
      );

      card.appendChild(top);
      card.appendChild(badges);
      card.appendChild(actions);

      grid.appendChild(card);
    });
  }

  // ====== EVENTS ======
  function setActiveTab(filter){
    activeFilter = filter;
    document.querySelectorAll(".tab").forEach(t => {
      t.classList.toggle("active", t.dataset.filter === filter);
    });
    render();
  }

  function bind(){
    // CTAs
    $("btnEnterHubPro").addEventListener("click", () => {
      if(HUB_PRO_URL && HUB_PRO_URL.startsWith("http")){
        openUrl(HUB_PRO_URL);
      }else{
        showModal({title:"HUB PRO", text:"Lien HUB_PRO_URL non défini.", showCancel:false});
      }
    });

    $("btnAlreadyAccess").addEventListener("click", () => {
      if(ACCESS_URL && ACCESS_URL.startsWith("http")){
        openUrl(ACCESS_URL);
      }else{
        showModal({title:"Accès", text:"Lien ACCESS_URL non défini.", showCancel:false});
      }
    });

    $("btnActivate").addEventListener("click", () => {
      if(ACTIVATE_URL && ACTIVATE_URL.startsWith("http")){
        const phone = getStoredPhone();
        const url = phone ? (ACTIVATE_URL + (ACTIVATE_URL.includes("?")?"&":"?") + "phone=" + encodeURIComponent(phone)) : ACTIVATE_URL;
        openUrl(url);
      }else{
        showModal({
          title:"Activation",
          text:"Lien ACTIVATE_URL non défini (ou pas encore prêt).",
          showCancel:false
        });
      }
    });

    $("btnEditPhone").addEventListener("click", () => {
      const current = getStoredPhone();
      showModal({
        title:"Modifier le numéro",
        text:"OK = je te demande le numéro via une petite prompt navigateur.",
        okText:"Continuer",
        cancelText:"Annuler",
        onOk: () => {
          const v = prompt("Ton numéro (format international, ex: +22177xxxxxxx) :", current || "");
          if(v === null) return;
          setStoredPhone(v);
        }
      });
    });

    $("btnClearPhone").addEventListener("click", () => {
      showModal({
        title:"Effacer le numéro",
        text:"Tu veux vraiment effacer le numéro mémorisé ?",
        okText:"Oui, effacer",
        cancelText:"Non",
        onOk: () => setStoredPhone("")
      });
    });

    // Tabs
    document.querySelectorAll(".tab").forEach(t => {
      t.addEventListener("click", () => setActiveTab(t.dataset.filter));
    });

    // Search
    $("searchInput").addEventListener("input", (e) => {
      Verdict: ;
      searchTerm = e.target.value || "";
      render();
    });

    $("btnReset").addEventListener("click", () => {
      $("searchInput").value = "";
      searchTerm = "";
      setActiveTab("all");
      render();
    });
  }

  // ====== INIT ======
  document.addEventListener("DOMContentLoaded", () => {
    // phone init: si vide en storage, on peut inject default (optionnel)
    const s = (localStorage.getItem(STORAGE_PHONE_KEY) || "").trim();
    if(!s && DEFAULT_PHONE){
      // ne force pas si tu veux pas: commente cette ligne
      localStorage.setItem(STORAGE_PHONE_KEY, DEFAULT_PHONE.trim());
    }

    renderPhone();
    renderStats();
    bind();
    render();
  });

})();
