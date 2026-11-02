/* =========================================================
   lightbox.js  (services.html)
   Gallery lightbox built on the native <dialog> element:
   click a thumbnail to open, arrow keys / buttons to move,
   Esc or the backdrop to close. Focus returns to the thumbnail.
   ========================================================= */
(function () {
  "use strict";
  var links = Array.prototype.slice.call(document.querySelectorAll("#gallery-grid a"));
  var box = document.getElementById("lightbox");
  if (!links.length || !box) return;

  var img = document.getElementById("lb-image");
  var cap = document.getElementById("lb-caption");
  var index = 0;
  var opener = null;

  function show(i) {
    index = (i + links.length) % links.length;
    var a = links[index];
    var thumb = a.querySelector("img");
    img.src = a.getAttribute("href");
    img.alt = thumb ? thumb.alt : "";
    cap.textContent = (a.getAttribute("data-caption") || "") + "  (" + (index + 1) + " of " + links.length + ")";
  }

  function open(i, trigger) {
    opener = trigger;
    show(i);
    if (typeof box.showModal === "function") box.showModal();
    else box.setAttribute("open", "");
  }

  links.forEach(function (a, i) {
    a.addEventListener("click", function (e) { e.preventDefault(); open(i, a); });
  });

  box.addEventListener("click", function (e) {
    var action = e.target.getAttribute && e.target.getAttribute("data-lb");
    if (action === "next") show(index + 1);
    else if (action === "prev") show(index - 1);
    else if (action === "close" || e.target === box) box.close();
  });

  box.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") show(index + 1);
    else if (e.key === "ArrowLeft") show(index - 1);
  });

  box.addEventListener("close", function () { if (opener) opener.focus(); });
})();
