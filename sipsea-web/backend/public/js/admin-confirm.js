/**
 * Admin silme formları: native confirm yerine modal; onayda data-confirmed ile tekrar submit.
 */
(function () {
  const overlay = document.getElementById("adminConfirmOverlay");
  const messageEl = document.getElementById("adminConfirmMessage");
  const cancelBtn = document.getElementById("adminConfirmCancel");
  const okBtn = document.getElementById("adminConfirmOk");

  if (!overlay || !messageEl || !cancelBtn || !okBtn) return;

  let pendingForm = null;

  function closeModal() {
    overlay.hidden = true;
    overlay.setAttribute("aria-hidden", "true");
    pendingForm = null;
  }

  function openModal(form) {
    pendingForm = form;
    messageEl.textContent = form.getAttribute("data-confirm") || "Bu islemi onayliyor musunuz?";
    overlay.hidden = false;
    overlay.setAttribute("aria-hidden", "false");
    okBtn.focus();
  }

  document.querySelectorAll("form.js-admin-confirm-form[data-confirm]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (form.dataset.confirmed === "1") {
        form.dataset.confirmed = "";
        return;
      }
      event.preventDefault();
      openModal(form);
    });
  });

  cancelBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal();
  });

  okBtn.addEventListener("click", () => {
    if (!pendingForm) return;
    const form = pendingForm;
    closeModal();
    form.dataset.confirmed = "1";
    if (typeof form.requestSubmit === "function") {
      form.requestSubmit();
    } else {
      form.submit();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (overlay.hidden) return;
    if (event.key === "Escape") closeModal();
  });
})();
