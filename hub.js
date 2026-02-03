/* DIGIY HUB — F16 V2 (data-driven + overlay + fallback)
   - garde le style vitrine
   - rend les 19 modules gérables en 1 endroit
   - overlay iframe + fallback (si WP / XFO bloque)
*/

(() => {
  const $ = (q, root=document) => root.querySelector(q);
  const $$ = (q, root=document) => Array.from(root.querySelectorAll(q));

  // ====== 1) CONFIG : mets tes liens ici (tu peux garder les tiens existants) ======
  // IMPORTANT: fret ajouté (liens PIN directs)
  const LINKS = {
    // ⚠️ Ici tu gardes tes URL existantes (je mets quelques placeholders)
    bonneAffaire:     "https://beauville.github.io/digiy-market/",         // exemple
    driverPro:        "https://beauville.github.io/digiy-driver-pro/",
    driverClient:     "https://beauville.github.io/digiy-driver-client/",
    caissePro:        "https://beauville.github.io/digiy-caisse-pro/",
    loc:              "https://beauville.github.io/digiy-loc-pro/",
    resto:            "https://beauville.github.io/digiy-resto/",
    pay:              "https://beauville.github.io/digiy-pay/",
    build:            "https://beauville.github.io/digiy-build-pro/",
    market:           "https://beauville.github.io/digiy-market/",
    jobs:             "https://beauville.github.io/digiy-jobs/",
    ndimbalMap:       "https://beauville.github.io/digiy-mdimbal-map/",
    resa:             "https://beauville.github.io/digiy-resa/",
    resaTable:        "https://beauville.github.io/digiy-resa-table/",
    notable:          "https://beauville.github.io/digiy-notable/",
    explore:          "https://beauville.github.io/digiy-explore/",
    inscriptionPro:   "https://beauville.github.io/inscription-digiy/",
    espacePro:        "https://beauville.github.io/digiy-espace-pro/",

    // ✅ FRET PRO (PIN direct)
    fretClientPro:    "https://beauville.github.io/fret-client-pro/pin.html",
    fretChauffeurPro: "https://beauville.github.io/fret-chauffeur-pro/pin.html",
  };

  // ====== 2) DATA : 19 modules en 1 liste ======
  // mode:
  //  - "iframe" : tente overlay
  //  - "tab"    : ouvre direct en onglet (utile WP / sécurité)
  const MODULES = [
    { key:"bonneAffaire",  icon:"💥", name:"DIGIY BONNE AFFAIRE",  tag:"BONS PLANS • PROMOS", desc:"Les meilleures opportunités locales : promos, deals, bonnes affaires terrain.", badge:{text:"OFFICIEL", cls:"new"}, mode:"iframe" },
    { key:"driverPro",     icon:"🚗", name:"DIGIY DRIVER PRO",     tag:"CHAUFFEUR PROFESSIONNEL", desc:"Accepter courses, GPS temps réel, encaissements directs.", badge:{text:"LIVE", cls:""}, mode:"iframe" },
    { key:"driverClient",  icon:"🚕", name:"DIGIY DRIVER CLIENT",  tag:"COMMANDER UNE COURSE", desc:"Commande ta course VTC au Sénégal. Paiement direct. 0% commission.", badge:{text:"LIVE", cls:""}, mode:"iframe" },
    { key:"caissePro",     icon:"🧾", name:"DIGIY CAISSE PRO",     tag:"POS + SYNC BATCH", desc:"Caisse pro + sync ultra-légère. Encaissement terrain.", badge:{text:"NOUVEAU", cls:"new"}, mode:"iframe" },
    { key:"loc",           icon:"🏠", name:"DIGIY LOC",           tag:"LOCATION SANS OTA", desc:"Alternative Booking/Airbnb, sans commission, en direct propriétaire.", badge:{text:"LIVE", cls:""}, mode:"iframe" },
    { key:"resto",         icon:"🍽️", name:"DIGIY RESTO",         tag:"VITRINE RESTAURANT", desc:"Menus, photos, horaires, localisation. Réservation directe.", badge:{text:"LIVE", cls:""}, mode:"iframe" },
    { key:"pay",           icon:"💳", name:"DIGIY PAY",           tag:"WALLET UNIFIÉ", desc:"Wave / OM / CB. Historique, suivi, activation modules.", badge:{text:"PRIORITÉ", cls:"prio"}, mode:"iframe" },
    { key:"build",         icon:"🏗️", name:"DIGIY BUILD",         tag:"ARTISANS & BTP", desc:"Devis, galerie, contact. Humain. Direct. Sans commission.", badge:{text:"LIVE", cls:""}, mode:"iframe" },
    { key:"market",        icon:"🛍️", name:"DIGIY MARKET",        tag:"MARKETPLACE LOCALE", desc:"Acheter/vendre local. Annonces propres. Sans commission.", badge:{text:"PRIORITÉ", cls:"prio"}, mode:"iframe" },
    { key:"jobs",          icon:"💼", name:"DIGIY JOBS",          tag:"EMPLOI & TALENTS", desc:"Offres, candidatures, profils. Pont talents–employeurs.", badge:{text:"PRIORITÉ", cls:"prio"}, mode:"iframe" },
    { key:"ndimbalMap",    icon:"🗺️", name:"DIGIY NDIMBAL MAP",    tag:"CARTE COMMUNAUTÉ", desc:"Annuaire géolocalisé du Sénégal : pros, quartiers, filtres.", badge:{text:"GRATUIT", cls:"free"}, mode:"iframe" },
    { key:"resa",          icon:"📅", name:"DIGIY RESA",          tag:"RÉSERVATIONS", desc:"Planning, confirmations, gestion des réservations. Direct, sans commission.", badge:{text:"LIVE", cls:""}, mode:"iframe" },
    { key:"resaTable",     icon:"🪑", name:"DIGIY RESA TABLE",     tag:"RÉSA RESTAURANT", desc:"Réservations de tables restaurant. Plan de salle, dispos temps réel.", badge:{text:"LIVE", cls:""}, mode:"iframe" },
    { key:"notable",       icon:"📓", name:"DIGIY NOTABLE",       tag:"NOTES & DOCS", desc:"Notes, fiches terrain, procédures. Organise ton savoir pro.", badge:{text:"PRIORITÉ", cls:"prio"}, mode:"iframe" },
    { key:"explore",       icon:"🧭", name:"DIGIY EXPLORE",       tag:"TOURISME & DÉCOUVERTE", desc:"Découvrir l'Afrique • guides • visibilité • expériences authentiques.", badge:{text:"LIVE", cls:""}, mode:"iframe" },
    { key:"inscriptionPro",icon:"📝", name:"INSCRIPTION PRO",     tag:"NOUVEAU COMPTE PRO", desc:"Inscription intelligente. Choisis ton module, on calcule ton tarif.", badge:{text:"NOUVEAU", cls:"new"}, mode:"iframe" },
    { key:"espacePro",     icon:"🧰", name:"ESPACE PRO",          tag:"PORTAIL PRO", desc:"Ouvre tes modules (après paiement). Slug + PIN. Tour de contrôle.", badge:{text:"LIVE", cls:""}, mode:"iframe" },

    // ✅ FRET
    { key:"fretClientPro", icon:"📦", name:"DIGIY FRET CLIENT PRO", tag:"DEMANDER UN TRANSPORT", desc:"Créer une demande fret (colis / transport). Accès PRO via PIN.", badge:{text:"NOUVEAU", cls:"new"}, mode:"iframe" },
    { key:"fretChauffeurPro", icon:"🚚", name:"DIGIY FRET CHAUFFEUR PRO", tag:"ACCEPTER DES MISSIONS", desc:"Recevoir/Accepter missions fret. Paiement direct. Accès PRO via PIN.", badge:{text:"PRIORITÉ", cls:"prio"}, mode:"iframe" },
  ];

  // ====== 3) DOM refs (tes IDs existants) ======
  const grid = $(".modules-grid");
  const overlay = $("#hubOverlay");
  const frame = $("#hubFrame");
  const backBtn = $("#hubBackBtn");
  const closeBtn = $("#hubCloseBtn");

  const btnDeals = $("#btnDeals");
  const btnGetHub = $("#btnGetHub");
  const btnLogin = $("#btnLogin");
  const homeBrand = $("#homeBrand");

  const ndimbalBtn = $("#digiy-help-btn");
  const ndimbalBox = $("#digiy-ndimbal");
  const ndimbalClose = $("#digiyCloseBtn");

  const qrModal = $("#qrModal");
  const qrClose = $("#qrClose");
  const tarifBtn = $("#tarif-bubble-btn");
  const espaceBtn = $("#espace-pro-btn");

  // ====== 4) Helpers ======
  function safeOpenTab(url){
    window.open(url, "_blank", "noopener");
  }

  function showOverlay(){
    if(!overlay) return;
    overlay.setAttribute("aria-hidden","false");
    document.documentElement.style.overflow = "hidden";
  }
  function hideOverlay(){
    if(!overlay) return;
    overlay.setAttribute("aria-hidden","true");
    document.documentElement.style.overflow = "";
    if(frame) frame.src = "about:blank";
    removeFallbackBanner();
  }

  // Bandeau fallback si iframe bloqué / WordPress / sécurité
  let fallbackTimer = null;
  function ensureFallbackBanner(url){
    // crée un petit bandeau au-dessus de l’iframe (dans .hubTop si présent)
    const top = $(".hubTop");
    if(!top) return;
    if($("#digiyFallback")) return;

    const bar = document.createElement("div");
    bar.id = "digiyFallback";
    bar.style.cssText = `
      margin:10px 0 0;
      padding:10px 12px;
      border:1px solid rgba(148,163,184,.35);
      border-radius:12px;
      background:rgba(2,6,23,.55);
      color:#e5e7eb;
      font-weight:650;
      display:flex;
      gap:10px;
      align-items:center;
      justify-content:space-between;
    `;
    bar.innerHTML = `
      <div style="line-height:1.25">
        Si tu vois “refused to connect” ou un écran vide, c’est normal : certains modules bloquent l’iframe.
      </div>
      <button id="digiyOpenTab" type="button" style="
        padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.22);
        background:rgba(255,255,255,.10);color:#fff;font-weight:900;cursor:pointer
      ">Ouvrir en onglet →</button>
    `;
    top.appendChild(bar);

    $("#digiyOpenTab")?.addEventListener("click", () => safeOpenTab(url));
  }
  function removeFallbackBanner(){
    const el = $("#digiyFallback");
    if(el) el.remove();
  }

  function openInHub(url, mode="iframe"){
    if(!url) return;

    // Mode onglet direct
    if(mode === "tab"){
      safeOpenTab(url);
      return;
    }

    // Tente overlay iframe
    showOverlay();
    if(frame) frame.src = url;

    // Fallback : on affiche toujours le bandeau (ça évite les “je vois rien”)
    ensureFallbackBanner(url);

    // Et on met un timer au cas où (si ça charge pas vite, l’utilisateur a la sortie)
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(() => {
      // rien à faire de plus : le bouton est déjà là
    }, 1200);
  }

  function moduleCardHTML(m){
    const badge = m.badge?.text
      ? `<div class="badge ${m.badge.cls || ""}">${m.badge.text}</div>`
      : "";
    return `
      <div class="module" data-open="${m.key}">
        <div class="module-top">
          <div style="display:flex;gap:10px;align-items:center">
            <div class="module-icon">${m.icon}</div>
            <div>
              <div class="module-name">${m.name}</div>
              <div class="module-tag">${m.tag}</div>
            </div>
          </div>
          ${badge}
        </div>
        <div class="module-body">${m.desc}</div>
      </div>
    `.trim();
  }

  // ====== 5) Render (si tu veux du 100% data-driven) ======
  // Si tu gardes ton HTML en dur, ça marche aussi : on attache juste les events.
  function renderIfNeeded(){
    if(!grid) return;
    // Si déjà rempli par ton HTML, on ne casse rien.
    const already = $$(".module", grid).length;
    if(already > 0) return;

    grid.innerHTML = MODULES.map(moduleCardHTML).join("\n");
  }

  function bindModuleClicks(){
    if(!grid) return;

    $$(".module", grid).forEach((card) => {
      card.addEventListener("click", () => {
        const key = card.dataset.open;
        const m = MODULES.find(x => x.key === key);
        const url = LINKS[key];

        if(!url){
          console.warn("❌ URL manquante pour:", key);
          // petit fallback : si pas d’URL, pas de crash
          alert("Module pas encore branché (URL manquante): " + key);
          return;
        }

        // si module existe dans data, on respecte son mode, sinon iframe par défaut
        openInHub(url, m?.mode || "iframe");
      });
    });
  }

  // ====== 6) Boutons vitrine / flottants ======
  function bindVitrineUX(){
    // CTA “Je veux mon HUB” → scroll vers modules
    btnGetHub?.addEventListener("click", () => {
      const section = $(".section");
      section?.scrollIntoView({behavior:"smooth", block:"start"});
    });

    // CTA deals
    btnDeals?.addEventListener("click", () => {
      const url = LINKS.bonneAffaire;
      if(url) openInHub(url, "iframe");
    });

    // Connexion = Espace PRO
    btnLogin?.addEventListener("click", () => {
      const url = LINKS.espacePro;
      if(url) openInHub(url, "iframe");
    });

    // brand = retour top
    homeBrand?.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({top:0, behavior:"smooth"});
    });

    // overlay controls
    backBtn?.addEventListener("click", hideOverlay);
    closeBtn?.addEventListener("click", hideOverlay);
    overlay?.addEventListener("click", (e) => {
      // ferme si click en dehors de la card
      const card = $(".hubCard");
      if(card && !card.contains(e.target)) hideOverlay();
    });

    // NDIMBAL popup
    ndimbalBtn?.addEventListener("click", () => {
      if(!ndimbalBox) return;
      ndimbalBox.setAttribute("aria-hidden","false");
    });
    ndimbalClose?.addEventListener("click", () => {
      ndimbalBox?.setAttribute("aria-hidden","true");
    });
    ndimbalBox?.addEventListener("click", (e) => {
      const box = $(".digiyBox");
      if(box && !box.contains(e.target)) ndimbalBox.setAttribute("aria-hidden","true");
    });

    // QR modal: tu as un bouton NDIMBAL “qr” → on l’écoute
    $$('[data-action="qr"]').forEach(btn => {
      btn.addEventListener("click", () => {
        ndimbalBox?.setAttribute("aria-hidden","true");
        qrModal?.setAttribute("aria-hidden","false");
      });
    });
    qrClose?.addEventListener("click", () => qrModal?.setAttribute("aria-hidden","true"));
    qrModal?.addEventListener("click", (e) => {
      const c = $(".qrContent");
      if(c && !c.contains(e.target)) qrModal.setAttribute("aria-hidden","true");
    });

    // Tarifs flottant
    tarifBtn?.addEventListener("click", () => {
      // Mets ton lien tarif ici (tu as déjà un lien dans le footer)
      safeOpenTab("https://beauville.github.io/DIGIY/");
    });

    // Espace PRO flottant
    espaceBtn?.addEventListener("click", () => {
      const url = LINKS.espacePro;
      if(url) openInHub(url, "iframe");
    });
  }

  // ====== GO ======
  renderIfNeeded();
  bindModuleClicks();
  bindVitrineUX();

})();
