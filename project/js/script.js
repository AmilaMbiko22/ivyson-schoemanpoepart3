/* =========================================================
   Ivyson & Schoeman Home Security
   script.js  (loaded on every page)

   - Marks the current page in the navigation (Part 1/2)
   - Scroll-reveal animations
   - Accessible accordion (FAQ)
   - Back-to-top button
   - Small helper namespace (window.IS) shared by the other scripts
   ========================================================= */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var IS = (window.IS = window.IS || {});

  /* ---------- Helpers shared by other scripts ---------- */

  // Format a number as South African Rand: 1899 -> "R 1 899"
  IS.rand = function (n) {
    return "R " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Create an element safely (text is always set with textContent, never innerHTML)
  IS.el = function (tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
    }
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // Fetch JSON (AJAX). Rejects with a readable error if it fails.
  IS.getJSON = function (url) {
    return fetch(url, { headers: { Accept: "application/json" } }).then(function (res) {
      if (!res.ok) throw new Error("Request failed (" + res.status + ")");
      return res.json();
    });
  };

  /* ---------- Scroll reveal ---------- */

  var observer = null;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }

  // Call again after injecting new cards into the page
  IS.reveal = function (root) {
    var items = (root || document).querySelectorAll(
      ".card, .team-card, .gallery li, .accordion, .form-wrapper, .pricing-table"
    );
    items.forEach(function (item) {
      if (item.classList.contains("reveal")) return;
      item.classList.add("reveal");
      if (observer) observer.observe(item);
      else item.classList.add("is-visible");
    });
  };

  /* ---------- Accordion ---------- */

  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach(function (acc) {
      var triggers = acc.querySelectorAll(".accordion-trigger");

      function setOpen(btn, open) {
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (panel) panel.hidden = !open;
      }

      triggers.forEach(function (btn, i) {
        btn.addEventListener("click", function () {
          var willOpen = btn.getAttribute("aria-expanded") !== "true";
          triggers.forEach(function (other) { setOpen(other, false); }); // one open at a time
          setOpen(btn, willOpen);
        });
        // Keyboard: up/down/home/end move between headers (WAI-ARIA pattern)
        btn.addEventListener("keydown", function (e) {
          var next = null;
          if (e.key === "ArrowDown") next = triggers[(i + 1) % triggers.length];
          else if (e.key === "ArrowUp") next = triggers[(i - 1 + triggers.length) % triggers.length];
          else if (e.key === "Home") next = triggers[0];
          else if (e.key === "End") next = triggers[triggers.length - 1];
          if (next) { e.preventDefault(); next.focus(); }
        });
      });
    });
  }

  /* ---------- Back to top ---------- */

  function initBackToTop() {
    var btn = IS.el("button", { type: "button", class: "back-to-top", "aria-label": "Back to top" }, "↑");
    document.body.appendChild(btn);
    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Active nav link (from Part 1) ---------- */

  function markActiveNav() {
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav ul li a").forEach(function (link) {
      if (link.getAttribute("href") === currentPage) link.classList.add("active");
    });
    // Close the CSS-only mobile menu after choosing a link on the same page
    var toggle = document.getElementById("nav-toggle");
    document.querySelectorAll("nav a").forEach(function (a) {
      a.addEventListener("click", function () { if (toggle) toggle.checked = false; });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    markActiveNav();
    initAccordions();
    initBackToTop();
    IS.reveal(document);
  });
})();
