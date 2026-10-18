
/* ===== HEADER: mobile menu + Products dropdown =====
   The phone menu did not exist before — the links were simply hidden at 900px, so a
   visitor on a phone had no navigation at all. This is the whole control surface. */
(function () {
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  var productsBtn = document.getElementById("nav-products");
  var productsGroup = productsBtn ? productsBtn.closest(".nav__has-drop") : null;
  if (!nav || !toggle || !menu) return;

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (!open && productsGroup) {
      productsGroup.classList.remove("is-open");
      productsBtn.setAttribute("aria-expanded", "false");
    }
  }

  function setProducts(open) {
    if (!productsGroup) return;
    productsGroup.classList.toggle("is-open", open);
    productsBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });

  if (productsBtn) {
    productsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      setProducts(!productsGroup.classList.contains("is-open"));
    });
  }

  // Tapping any real link closes the menu (including the product links inside the dropdown).
  menu.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (a) setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setMenu(false); setProducts(false); }
  });

  document.addEventListener("click", function (e) {
    if (productsGroup && !productsGroup.contains(e.target)) setProducts(false);
    if (nav.classList.contains("is-open") && !nav.contains(e.target)) setMenu(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setMenu(false);
  });
})();
