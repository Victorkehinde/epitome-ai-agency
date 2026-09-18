// Epitome AI Agency — interactions & scroll reveal
(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.style.background = window.scrollY > 40 ? "rgba(6, 15, 31, 0.95)" : "rgba(6, 15, 31, 0.72)";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
