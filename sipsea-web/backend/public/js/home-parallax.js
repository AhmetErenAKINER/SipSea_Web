/**
 * Anasayfa scroll parallax: arka plan rengi, dalga katmanları ve derinlik opaklığı kaydırmaya bağlanır.
 * requestAnimationFrame ile scroll handler throttle edilir.
 */
(function () {
  "use strict";

  function readScrollY() {
    var se = document.scrollingElement || document.documentElement;
    return (
      window.scrollY ||
      window.pageYOffset ||
      se.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  function tick() {
    var scrollY = readScrollY();
    var windowHeight = window.innerHeight;
    var docHeight = document.documentElement.scrollHeight;
    var scrollRange = Math.max(1, docHeight - windowHeight);
    var scrollPercent = scrollY / scrollRange;

    var baseR = 18;
    var baseG = 20;
    var baseB = 20;
    var abyssR = 0;
    var abyssG = 0;
    var abyssB = 0;

    var divingProgress = Math.min(1, scrollPercent * 1.25);
    var r = Math.max(
      abyssR,
      Math.floor(baseR - (baseR - abyssR) * divingProgress)
    );
    var g = Math.max(
      abyssG,
      Math.floor(baseG - (baseG - abyssG) * divingProgress)
    );
    var b = Math.max(
      abyssB,
      Math.floor(baseB - (baseB - abyssB) * divingProgress)
    );
    document.body.style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")";

    var divingGlow = document.getElementById("divingGlow");
    var atmos = document.getElementById("atmos");
    var surfaceWaveLayer = document.getElementById("surfaceWaveLayer");
    var depthDarkenLayer = document.getElementById("depthDarkenLayer");

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

    var seigaiha = document.getElementById("seigaiha");
    var heroWave = document.getElementById("heroWave");
    var surfaceFade = Math.max(0, 1 - scrollPercent * 2.2);

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

  var rafScheduled = false;
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
