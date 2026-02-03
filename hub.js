(() => {
  "use strict";

  // =========================
  // CONFIG — liens terrain
  // =========================
  const LINKS = {
    inscription: "https://beauville.github.io/inscription-digiy/",
    ndimbal:     "https://beauville.github.io/digiy-mdimbal-map/",
    qr:          "https://beauville.github.io/digiy-qr-pro/"
  };

  const STORAGE = { phone: "DIGIY_HUB_PHONE" };

  // =========================
  // Helpers safe
  // =========================
  const $ = (id) => document.getElementById(id);

  function beacon(ok, msg){
    const el = $("jsBeacon");
    if(!el) return;
    el.classList.remove("ok","ko");
    el.classList.add(ok ? "ok" : "ko");
    el.textContent = msg || (ok ? "🟢 JS OK" : "🔴 JS KO");
  }

  function on(el, evt, fn){
    if(!el) return;
    el.addEventListener(evt, fn);
  }

  function normPhone(v){
    return String(v || "").trim().replace(/\s+/g, "");
  }

  function getPhone(){
    const v = normPhone($("phoneInput")?.value);
    return v || (localStorage.getItem(STORAGE.phone) || "");
  }

  function savePhone(){
    const p = getPhone();
    const hint = $("phoneHint");
    if(!p){
      if(hint) hint.textContent = "⚠️ Mets un numéro (ex: +221778765785).";
      return;
    }
    localStorage.setItem(STORAGE.phone, p);
    if(hint) hint.textContent = `✅ Numéro mémorisé : ${p}`;
  }

  function loadPhone(){
    const p = localStorage.getItem(STORAGE.phone) || "";
    const input = $("phoneInput");
    const hint = $("phoneHint");
    if(input && p) input.value = p;
    if(hint) hint.textContent = p ? `✅ Numéro mémorisé : ${p}` : "Astuce : ton numéro sert à retrouver ton HUB plus vite.";
  }

  // =========================
  // Navigation (NO-IFRAME)
  // =========================
  function go(url){
    if(!url || url === "#") return;
    window.location.href = url;
  }

  function goPro(){
    const p = getPhone();
    const url = p ? `${LINKS.inscription}?phone=${encodeURIComponent(p)}` : LINKS.inscription;
    go(url);
  }

  function goNdimbal(){ go(LINKS.ndimbal); }
  function goQR(){ go(LINKS.qr); }

  // =========================
  // Overlay
  // =========================
  function openOverlay(){
    const overlay = $("overlay");
    if(!overlay) return;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeOverlay(){
    const overlay = $("overlay");
    if(!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  // =========================
  // Modules — data driven
  // =========================
  let MODULES = [];

  function escapeHtml(s){
    return String(s || "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function matches(mod, q){
    if(!q) return true;
    const hay = `${mod.name||""} ${mod.desc||""} ${(mod.tags||[]).join(" ")} ${mod.key||""}`.toLowerCase();
    return hay.includes(q);
  }

  function renderModules(){
    const grid = $("modulesGrid");
    if(!grid) return;

    const q = ($("searchInput")?.value || "").trim().toLowerCase();
    const list = MODULES.filter(m => matches(m, q));

    if(!list.length){
      grid.innerHTML = `
        <article class="cardMod">
          <h3 class="modName">Aucun résultat</h3>
          <p class="modDesc">Essaie un autre mot-clé (ex: loc, driver, market…).</p>
          <div class="modActions">
            <button class="aBtn primary" type="button" data-act="pro">🦅 Accès PRO</button>
            <button class="aBtn" type="button" data-act="reload">↻ Recharger</button>
          </div>
        </article>
      `;
    } else {
      grid.innerHTML = list.map(mod => {
        const icon = escapeHtml(mod.icon || "⚡");
        const name = escapeHtml(mod.name || "Module");
        const desc = escapeHtml(mod.desc || "");
        const access = (mod.access || "pro").toLowerCase(); // pro|public|mixed
        const badge = access === "public"
          ? `<span class="badge public">PUBLIC</span>`
          : `<span class="badge pro">PRO</span>`;

        const tags = Array.isArray(mod.tags) ? mod.tags.slice(0,3) : [];
        const tagBadges = tags.map(t => `<span class="badge">${escapeHtml(t)}</span>`).join("");

        // ✅ règle: PRO -> inscription
        const primary = access === "public"
          ? `<button class="aBtn primary" type="button" data-act="open" data-url="${escapeHtml(mod.url||"#")}">👀 Ouvrir</button>`
          : `<button class="aBtn primary" type="button" data-act="pro">🦅 Accès PRO</button>`;

        return `
          <article class="cardMod">
            <div class="modTop">
              <div class="modIcon">${icon}</div>
              <div class="modText">
                <h3 class="modName">${name}</h3>
                <p class="modDesc">${desc}</p>
              </div>
            </div>

            <div class="modBadges">
              ${badge}
              ${tagBadges}
            </div>

            <div class="modActions">
              ${primary}
              <button class="aBtn" type="button" data-act="overlay">ℹ️ Détails</button>
            </div>
          </article>
        `;
      }).join("");
    }

    // ✅ delegate actions
    grid.querySelectorAll("button[data-act]").forEach(btn => {
      btn.addEventListener("click", () => {
        const act = btn.getAttribute("data-act");
        if(act === "pro") return goPro();
        if(act === "overlay") return openOverlay();
        if(act === "reload") return fetchModules();
        if(act === "open"){
          const url = btn.getAttribute("data-url") || "#";
          if(!url.startsWith("http")) return goPro(); // fallback clean
          return go(url);
        }
      });
    });
  }

  async function fetchModules(){
    const reloadBtn = $("btnReloadModules");
    try{
      if(reloadBtn){ reloadBtn.disabled = true; reloadBtn.textContent = "…"; }

      const res = await fetch("./modules.json?v=" + Date.now(), { cache: "no-store" });
      if(!res.ok) throw new Error("modules.json not found");
      const data = await res.json();

      MODULES = Array.isArray(data) ? data : (Array.isArray(data.modules) ? data.modules : []);
      if(!MODULES.length) throw new Error("modules empty");

      renderModules();
    }catch(e){
      console.warn("modules fallback", e);
      // fallback intégré
      MODULES = [
        { key:"ndimbal", name:"NDIMBAL MAP", icon:"🧭", desc:"Carte terrain multi-QG.", access:"public", url:LINKS.ndimbal, tags:["terrain","map"] },
        { key:"loc", name:"DIGIY LOC PRO", icon:"🏠", desc:"Locations · hébergements · planning.", access:"pro", tags:["pro","planning"] },
        { key:"driver", name:"DIGIY DRIVER PRO", icon:"🚗", desc:"Chauffeur · courses · cockpit.", access:"pro", tags:["pro","transport"] },
        { key:"build", name:"DIGIY BUILD PRO", icon:"🧱", desc:"Artisans · devis · chantiers.", access:"pro", tags:["pro","devis"] },
        { key:"market", name:"DIGIY MARKET", icon:"🛒", desc:"Marketplace · deals · terrain.", access:"pro", tags:["pro","market"] },
        { key:"jobs", name:"DIGIY JOBS", icon:"🧰", desc:"Emploi · dossiers · accompagnement.", access:"pro", tags:["pro","jobs"] },
        { key:"qr", name:"DIGIY QR PRO", icon:"📷", desc:"QR pour pros · accès rapide.", access:"public", url:LINKS.qr, tags:["qr"] }
      ];
      renderModules();
    }finally{
      if(reloadBtn){ reloadBtn.disabled = false; reloadBtn.textContent = "↻"; }
    }
  }

  // =========================
  // Bind UI
  // =========================
  function bindUI(){
    on($("btnOpenOverlay"), "click", openOverlay);
    on($("btnCloseOverlay"), "click", closeOverlay);
    on($("btnAlreadyAccess"), "click", goPro);

    const overlay = $("overlay");
    if(overlay){
      on(overlay, "click", (e) => { if(e.target === overlay) closeOverlay(); });
    }
    on(window, "keydown", (e) => { if(e.key === "Escape") closeOverlay(); });

    on($("btnGoPro"), "click", goPro);
    on($("btnGoPublic"), "click", closeOverlay);
    on($("btnOpenNdimbal"), "click", goNdimbal);
    on($("btnOpenQR"), "click", goQR);

    on($("floatNdimbal"), "click", goNdimbal);
    on($("floatQR"), "click", goQR);
    on($("floatPro"), "click", goPro);

    on($("btnRemember"), "click", savePhone);
    on($("phoneInput"), "keydown", (e) => { if(e.key === "Enter") savePhone(); });

    on($("searchInput"), "input", renderModules);
    on($("btnReloadModules"), "click", fetchModules);
  }

  function boot(){
    // ✅ si on arrive ici, JS tourne => beacon OK
    beacon(true, "🟢 JS OK");
    bindUI();
    loadPhone();
    fetchModules();
  }

  document.addEventListener("DOMContentLoaded", () => {
    try{ boot(); }
    catch(e){
      console.error("BOOT CRASH", e);
      beacon(false, "🔴 JS KO (crash)");
    }
  });

})();
