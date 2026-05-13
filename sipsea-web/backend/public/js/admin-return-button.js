/**
 * Admin Panel / Admin Girişi düğmesi: panelden gelindiyse ana sayfada history.back ile dön.
 * Kullanıldığı yerler: partials/footer.ejs, public/home.ejs.
 */
(function () {
  "use strict";
  var btn = document.getElementById("adminReturnButton");
  if (!btn) return;
  btn.addEventListener("click", function (event) {
    var ref = document.referrer || "";
    var sameOrigin = ref.indexOf(window.location.origin) === 0;
    var cameFromAdmin = sameOrigin && ref.indexOf("/admin") !== -1;
    if (cameFromAdmin && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  });
})();
