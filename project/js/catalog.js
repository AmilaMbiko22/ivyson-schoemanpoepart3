/* =========================================================
   catalog.js  (services.html)
   - Loads the product list from data/products.json (fetch / AJAX)
   - Category tabs, live search and sorting
   - Product details modal (native <dialog>)
   ========================================================= */
(function () {
  "use strict";
  var grid = document.getElementById("product-grid");
  if (!grid) return;

  var searchInput = document.getElementById("product-search");
  var sortSelect = document.getElementById("product-sort");
  var tabs = Array.prototype.slice.call(document.querySelectorAll("#category-tabs .tab"));
  var countEl = document.getElementById("result-count");
  var modal = document.getElementById("product-modal");

  var products = [];
  var labels = { cameras: "Cameras", sensors: "Sensors", "smart-locks": "Smart Locks" };
  var state = { category: "all", query: "", sort: "featured" };
  var lastFocus = null;

  /* ---------- Filtering / sorting ---------- */

  function visibleProducts() {
    var q = state.query.trim().toLowerCase();
    var list = products.filter(function (p) {
      if (state.category !== "all" && p.category !== state.category) return false;
      if (!q) return true;
      var haystack = [p.name, p.summary, labels[p.category], p.specs.join(" ")].join(" ").toLowerCase();
      return q.split(/\s+/).every(function (word) { return haystack.indexOf(word) !== -1; });
    });
    var sorters = {
      "price-asc": function (a, b) { return a.price - b.price; },
      "price-desc": function (a, b) { return b.price - a.price; },
      "name-asc": function (a, b) { return a.name.localeCompare(b.name); }
    };
    if (sorters[state.sort]) list = list.slice().sort(sorters[state.sort]);
    return list;
  }

  /* ---------- Rendering ---------- */

  function card(p) {
    var c = IS.el("article", { class: "card product-card" });
    var img = IS.el("img", { src: p.image, alt: p.alt, class: "product-image", loading: "lazy", width: "275", height: "160" });
    c.appendChild(img);
    c.appendChild(IS.el("span", { class: "category-tag" }, labels[p.category]));
    c.appendChild(IS.el("h3", null, p.name));
    c.appendChild(IS.el("p", null, p.summary));
    c.appendChild(IS.el("p", { class: "price" }, "From " + IS.rand(p.price)));
    var btn = IS.el("button", { type: "button", class: "btn-details", "aria-haspopup": "dialog" }, "View details");
    btn.setAttribute("aria-label", "View details for " + p.name);
    btn.addEventListener("click", function () { openModal(p, btn); });
    c.appendChild(btn);
    return c;
  }

  function render() {
    var list = visibleProducts();
    grid.textContent = "";
    if (!list.length) {
      var msg = IS.el("div", { class: "status-msg" });
      msg.appendChild(document.createTextNode("No products match your search. "));
      var reset = IS.el("button", { type: "button", class: "chip" }, "Clear filters");
      reset.addEventListener("click", function () {
        searchInput.value = ""; sortSelect.value = "featured";
        state = { category: "all", query: "", sort: "featured" };
        syncTabs(); render();
      });
      msg.appendChild(reset);
      grid.appendChild(msg);
    } else {
      list.forEach(function (p) { grid.appendChild(card(p)); });
      IS.reveal(grid);
    }
    countEl.textContent = "Showing " + list.length + " of " + products.length + " products";
  }

  /* ---------- Tabs (arrow-key navigation, ARIA selected state) ---------- */

  function syncTabs() {
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-category") === state.category;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on) grid.setAttribute("aria-labelledby", t.id);
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      state.category = tab.getAttribute("data-category");
      syncTabs(); render();
    });
    tab.addEventListener("keydown", function (e) {
      var j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); tabs[j].focus(); tabs[j].click(); }
    });
  });

  /* ---------- Search & sort ---------- */

  var timer = null;
  searchInput.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(function () { state.query = searchInput.value; render(); }, 150);
  });
  sortSelect.addEventListener("change", function () { state.sort = sortSelect.value; render(); });
  document.getElementById("catalog-controls").addEventListener("submit", function (e) { e.preventDefault(); });

  /* ---------- Modal ---------- */

  function openModal(p, opener) {
    lastFocus = opener;
    var img = document.getElementById("modal-image");
    img.src = p.image; img.alt = p.alt;
    document.getElementById("modal-category").textContent = labels[p.category];
    document.getElementById("modal-title").textContent = p.name;
    document.getElementById("modal-summary").textContent = p.summary;
    document.getElementById("modal-price").textContent = "From " + IS.rand(p.price) + " (incl. VAT, installation extra)";
    var specs = document.getElementById("modal-specs");
    specs.textContent = "";
    p.specs.forEach(function (s) { specs.appendChild(IS.el("li", null, s)); });
    document.getElementById("modal-quote").href =
      "enquiry.html?interest=" + encodeURIComponent(p.category) + "&product=" + encodeURIComponent(p.id);
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
  }

  modal.addEventListener("click", function (e) {
    // click on the close button or on the backdrop (the dialog element itself)
    if (e.target === modal || e.target.hasAttribute("data-close")) modal.close();
  });
  modal.addEventListener("close", function () { if (lastFocus) lastFocus.focus(); });

  /* ---------- Load data ---------- */

  IS.getJSON("data/products.json")
    .then(function (data) { products = data.products; syncTabs(); render(); })
    .catch(function () {
      grid.textContent = "";
      var p = IS.el("p", { class: "status-msg error" },
        "Sorry, the product list could not be loaded. Please refresh the page. " +
        "(If you opened this file directly from your computer, use a local server such as VS Code Live Server.)");
      grid.appendChild(p);
      countEl.textContent = "";
    });
})();
