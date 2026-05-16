/**
 * Kamu sayfalarında online kullanıcı sayacı için sekme heartbeat.
 * sessionStorage ile sekme başına benzersiz id; kapanınca /api/online-leave ile satır silinir.
 */
(function () {
  const STORAGE_KEY = "sipseaTabId";
  const PING_MS = 20000;

  function getTabId() {
    let id = sessionStorage.getItem(STORAGE_KEY);
    if (!id) {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        id = crypto.randomUUID();
      } else {
        id = "tab-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
      }
      sessionStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }

  function ping() {
    const tabId = getTabId();
    fetch("/api/online-ping?tab=" + encodeURIComponent(tabId), {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store"
    }).catch(function () {});
  }

  function leave() {
    const tabId = sessionStorage.getItem(STORAGE_KEY);
    if (!tabId) return;
    const url = "/api/online-leave?tab=" + encodeURIComponent(tabId);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url);
    } else {
      fetch(url, { method: "GET", credentials: "same-origin", keepalive: true }).catch(
        function () {}
      );
    }
  }

  ping();
  window.setInterval(ping, PING_MS);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") ping();
  });
  window.addEventListener("pagehide", leave);
  window.addEventListener("beforeunload", leave);
})();
