/* =========================================================
   Ivyson & Schoeman Home Security
   script.js

   Note: the site brief specifies HTML and CSS as the
   languages used to build the current version of the site,
   so this file is intentionally kept minimal. It highlights
   the active navigation link based on the current page,
   which is a small progressive-enhancement touch and does
   not affect the site if JavaScript is disabled.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Get the current page file name (e.g. "about.html")
  var currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Find all navigation links and mark the matching one as active
  var navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach(function (link) {
    var linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
});
