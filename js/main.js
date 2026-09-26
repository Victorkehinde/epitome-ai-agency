// Epitome AI Agency — interactions, scroll reveal & booking form
(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll reveal
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

  // Nav background on scroll
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.style.background = window.scrollY > 40 ? "rgba(6, 15, 31, 0.95)" : "rgba(6, 15, 31, 0.72)";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Booking form -> composes a pre-filled email (no backend needed)
  var EMAIL = "info.epitomeinnovations@gmail.com";
  var form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("f-name").value.trim();
      var biz = document.getElementById("f-biz").value.trim();
      var contact = document.getElementById("f-contact").value.trim();
      var service = document.getElementById("f-service").value;
      var msg = document.getElementById("f-msg").value.trim();

      var subject = "Free Automation Audit — " + (name || "New enquiry");
      var body = [
        "Name: " + name,
        "Business: " + (biz || "—"),
        "Contact: " + contact,
        "Interested in: " + service,
        "",
        msg || "(no message)"
      ].join("\n");

      window.location.href = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  // WhatsApp link — number is set, so #wa-link is upgraded to a click-to-chat link.
  // If the element is not on the page, nothing happens. If JS is off, the anchor keeps
  // its mailto fallback, so the visitor still has a way to reach us.
  var WHATSAPP_NUMBER = "2349056969122"; // Victor Kehinde — no + or spaces
  var waLink = document.getElementById("wa-link");
  if (waLink && WHATSAPP_NUMBER) {
    waLink.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent("Hi! I'd like to book a free audit.");
  } else if (waLink) {
    waLink.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Free Audit");
  }
})();
