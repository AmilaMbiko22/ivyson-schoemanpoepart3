/* =========================================================
   map.js  (contact.html)
   Interactive Leaflet map of both branches with popups and
   buttons to fly to a branch. Leaflet and OpenStreetMap tiles
   are loaded from external hosts (see the CSP in the page).
   ========================================================= */
(function () {
  "use strict";
  var holder = document.getElementById("branch-map");
  if (!holder) return;

  function start() {
    if (!window.L) {
      holder.textContent = "";
      holder.appendChild(IS.el("p", { class: "map-fallback" },
        "The interactive map could not be loaded. Please use the “Get directions” links above."));
      return;
    }
    holder.textContent = "";

    var branches = {
      "cape-town": { name: "Cape Town Branch", addr: "12 Protea Street, Bellville, Cape Town, 7530", tel: "+27 21 555 0134", pos: [-33.9008, 18.6296] },
      "johannesburg": { name: "Johannesburg Branch", addr: "45 Voortrekker Avenue, Randburg, Johannesburg, 2194", tel: "+27 11 555 0198", pos: [-26.0940, 28.0060] }
    };

    var map = L.map(holder, { scrollWheelZoom: false }).setView([-29.5, 24.5], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var markers = {};
    Object.keys(branches).forEach(function (key) {
      var b = branches[key];
      // Popup content is built with DOM nodes (no innerHTML) for safety
      var box = document.createElement("div");
      box.appendChild(IS.el("strong", null, b.name));
      box.appendChild(document.createElement("br"));
      box.appendChild(document.createTextNode(b.addr));
      box.appendChild(document.createElement("br"));
      box.appendChild(document.createTextNode(b.tel + " • Mon–Fri 08:00–17:00"));
      markers[key] = L.marker(b.pos, { title: b.name, alt: b.name }).addTo(map).bindPopup(box);
    });

    function show(which) {
      if (which === "all") {
        map.fitBounds(L.latLngBounds([branches["cape-town"].pos, branches.johannesburg.pos]), { padding: [40, 40] });
        map.closePopup();
      } else {
        map.flyTo(branches[which].pos, 14, { duration: 1.2 });
        markers[which].openPopup();
      }
    }

    document.querySelectorAll(".map-toolbar .chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".map-toolbar .chip").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        show(btn.getAttribute("data-branch"));
      });
    });

    // Let people zoom with the scroll wheel only after clicking the map
    map.on("click", function () { map.scrollWheelZoom.enable(); });
    show("all");
  }

  // Leaflet is loaded with defer before this script, so L should exist
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
