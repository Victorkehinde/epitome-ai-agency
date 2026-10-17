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

  // Enquiry form -> EnquiryDesk (our own product), with an email fallback so a lead is never
  // lost if the API is unreachable. The form is on the agency site; the enquiry is scored,
  // acknowledged and answered by the pipeline we sell.
  var EMAIL = "info@epitomeinnovations.com";
  // window.ENQUIRY_ENDPOINT lets a local preview point at the dev server; production uses the live API.
  var ENQUIRY_ENDPOINT = window.ENQUIRY_ENDPOINT || "https://app.epitomeinnovations.com/api/web-form";
  var enquiryForm = document.getElementById("enquiry-form");
  if (enquiryForm) {
    var statusEl = document.getElementById("f-status");
    var sendBtn = document.getElementById("f-send");

    var setStatus = function (html) { if (statusEl) statusEl.innerHTML = html; };

    var fallbackToEmail = function (data) {
      var subject = "Website enquiry — " + (data.name || "New enquiry");
      var body = [
        "Name: " + (data.name || ""),
        "Business: " + (data.company || ""),
        "Email: " + (data.email || ""),
        "Phone: " + (data.phone || ""),
        "Interested in: " + (data.need || ""),
        "",
        data.message || ""
      ].join("\n");
      window.location.href = "mailto:" + EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    };

    enquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
      var data = {
        name: val("f-name"),
        company: val("f-biz"),
        email: val("f-email"),
        phone: val("f-phone"),
        need: val("f-service"),
        message: val("f-msg"),
        website: val("f-website")   // honeypot — a person leaves this empty
      };

      if (!data.name || (!data.email && !data.phone) || data.message.length < 10) {
        setStatus("Please add your name, an email or phone number, and a line or two about what you need.");
        return;
      }

      if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = "Sending…"; }
      setStatus("Sending…");

      fetch(ENQUIRY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (res) {
          if (res && res.ok) {
            enquiryForm.innerHTML =
              '<p class="booking__note" style="text-align:left;font-size:15px;color:var(--cream)">' +
              '<strong>Thank you — it has arrived.</strong><br>' +
              'We reply to every enquiry within minutes, and a person will come back to you on this.' +
              '</p>';
            return;
          }
          throw new Error((res && res.error) || "failed");
        })
        .catch(function () {
          if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = "Send — we answer in minutes"; }
          setStatus("We could not send that just now — opening your email app instead so nothing is lost.");
          fallbackToEmail(data);
        });
    });
  }

  // Email links: on a phone or in-app browser with no mail app configured, a mailto: link
  // does nothing at all — the visitor clicks and nothing happens. If the handoff never
  // happened, say so and offer the form instead of leaving them stuck.
  var mailLinks = document.querySelectorAll('a[data-mailto-fallback]');
  Array.prototype.forEach.call(mailLinks, function (a) {
    a.addEventListener('click', function () {
      var target = a.getAttribute('data-mailto-fallback');
      setTimeout(function () {
        if (document.hidden) return;                       // the mail app took over
        if (a.parentNode.querySelector('.mailto-note')) return;
        var note = document.createElement('span');
        note.className = 'mailto-note';
        note.innerHTML = ' No email app opened on this device — ' +
          '<a href="' + target + '">send it with the form instead</a>.';
        a.parentNode.appendChild(note);
      }, 1300);
    });
  });

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
