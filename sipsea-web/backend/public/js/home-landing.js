/**
 * Sadece views/public/home.ejs (landing) için.
 *
 * - updateParallax: scroll oranına göre body/arka plan katmanları (dalga, glow).
 * - updateNavSpy: [data-nav-section] ile .home-nav-links içindeki a[data-nav-target] eşleştirilir;
 *   alt menü .nav-products-menu-desktop içindeki linkler hariç. Aktif alt çizgi Tailwind çakışmasına
 *   karşı scroll-spy sırasında inline border-bottom (!important) ile uygulanır.
 * Admin düğmesi: admin-return-button.js
 */
(function () {
  "use strict";

  const SECTION_ORDER = ["top", "products", "founders", "quote", "contact-info"];
  /** Okuma çizgisi: viewport üstü + sabit navbar; bu çizgiyi geçen son bölüm aktif */
  const NAV_OFFSET_PX = 72;
  /** Bölüm başlığı çizgiye gelmeden hafif erken vurgu (px) */
  const SECTION_ACTIVATE_LEAD_PX = 40;

  function readScrollY() {
    return (
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  /** Üst menüde scroll-spy: data-nav-target (alt menü linkleri hariç); sınıf adına bağlı kalınmaz */
  function getSpyNavLinks(nav) {
    const row = nav.querySelector(".home-nav-links");
    if (!row) return [];
    return Array.prototype.slice.call(row.querySelectorAll("a[data-nav-target]")).filter(
      function (a) {
        return !a.closest(".nav-products-menu-desktop");
      }
    );
  }

  function updateParallax(scrollY) {
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollRange = Math.max(1, docHeight - windowHeight);
    const scrollPercent = scrollY / scrollRange;

    const baseR = 18;
    const baseG = 20;
    const baseB = 20;
    const abyssR = 0;
    const abyssG = 0;
    const abyssB = 0;

    const divingProgress = Math.min(1, scrollPercent * 1.25);
    const r = Math.max(
      abyssR,
      Math.floor(baseR - (baseR - abyssR) * divingProgress)
    );
    const g = Math.max(
      abyssG,
      Math.floor(baseG - (baseG - abyssG) * divingProgress)
    );
    const b = Math.max(
      abyssB,
      Math.floor(baseB - (baseB - abyssB) * divingProgress)
    );
    document.body.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";

    const divingGlow = document.getElementById("divingGlow");
    const atmos = document.getElementById("atmos");
    const surfaceWaveLayer = document.getElementById("surfaceWaveLayer");
    const depthDarkenLayer = document.getElementById("depthDarkenLayer");

    if (divingGlow) {
      divingGlow.style.opacity = String(Math.max(0, 1 - scrollPercent * 1.25));
    }
    if (atmos) {
      atmos.style.opacity = String(Math.max(0, 1 - scrollPercent * 1.6));
    }
    if (surfaceWaveLayer) {
      surfaceWaveLayer.style.opacity = String(
        Math.max(0.04, 0.28 - scrollPercent * 0.24)
      );
      surfaceWaveLayer.style.transform =
        "translateY(" +
        scrollY * 0.08 +
        "px) scale(" +
        (1 + scrollPercent * 0.03) +
        ")";
    }
    if (depthDarkenLayer) {
      depthDarkenLayer.style.opacity = String(
        Math.min(0.95, 0.35 + scrollPercent * 0.55)
      );
    }

    const seigaiha = document.getElementById("seigaiha");
    const heroWave = document.getElementById("heroWave");
    const surfaceFade = Math.max(0, 1 - scrollPercent * 2.2);

    if (seigaiha) {
      seigaiha.style.opacity = String(0.15 * surfaceFade);
      seigaiha.style.transform = "translateY(" + scrollY * 0.15 + "px)";
    }
    if (heroWave) {
      heroWave.style.opacity = String(0.35 * surfaceFade);
      heroWave.style.transform =
        "translateY(" +
        scrollY * 0.25 +
        "px) scale(" +
        (1 + scrollPercent * 0.1) +
        ")";
    }
  }

  var spyLastActiveId = null;

  function updateNavSpy(scrollY) {
    const nav = document.querySelector(".home-top-navbar");
    if (!nav) return;

    const links = getSpyNavLinks(nav);
    if (!links.length) return;

    /*
     * Viewport tabanlı "rect.top <= çizgi" KULLANILMAZ: #top kayınca hep <= çizgi kalır;
     * #products görünürken üst kenarı hâlâ aşağıda olunca hiçbir şey Ürünler'e geçmez.
     * Bunun yerine: belgede bölüm başlangıcı, (scroll + navbar) çizgisini geçtiyse aktif.
     */
    const triggerY = scrollY + NAV_OFFSET_PX + SECTION_ACTIVATE_LEAD_PX;
    let activeId = "top";
    for (let i = 0; i < SECTION_ORDER.length; i++) {
      const id = SECTION_ORDER[i];
      const section = document.querySelector('[data-nav-section="' + id + '"]');
      if (!section) continue;
      const sectionTop = section.getBoundingClientRect().top + scrollY;
      if (triggerY >= sectionTop - 2) {
        activeId = id;
      }
    }

    const pageBottom = document.documentElement.scrollHeight;
    const scrollBottom = scrollY + window.innerHeight;
    if (pageBottom - scrollBottom <= 40) {
      activeId = "contact-info";
    }

    if (spyLastActiveId !== null && spyLastActiveId === activeId) {
      return;
    }
    spyLastActiveId = activeId;

    links.forEach(function (a) {
      var t = a.getAttribute("data-nav-target");
      if (!t) return;
      var on = t === activeId;
      a.classList.toggle("is-active", on);
      /* Tailwind CDN sırası / utility çakışmasında alt çizgi kaybolmasın */
      a.style.setProperty(
        "border-bottom",
        on ? "2px solid #bdc8d1" : "2px solid transparent",
        "important"
      );
      if (on) {
        a.style.setProperty("color", "#e2e2e2", "important");
      } else {
        a.style.removeProperty("color");
      }
    });
  }

  function tick() {
    const y = readScrollY();
    updateParallax(y);
    updateNavSpy(y);
  }

  let rafScheduled = false;
  function onScrollOrResize() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(function () {
      rafScheduled = false;
      tick();
    });
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize);
  window.addEventListener("load", tick);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tick);
  } else {
    tick();
  }
})();
