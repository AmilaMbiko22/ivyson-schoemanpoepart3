/* =========================================================
   tips.js  (index.html)
   Loads home-safety tips from data/tips.json with fetch (AJAX),
   builds the cards with DOM methods and lets the visitor filter
   the tips by topic.
   ========================================================= */
(function () {
  "use strict";
  var grid = document.getElementById("tips-grid");
  var filters = document.getElementById("tip-filters");
  if (!grid || !filters) return;

  var tips = [];
  var active = "All";

  function render() {
    grid.textContent = "";
    var shown = tips.filter(function (t) { return active === "All" || t.topic === active; });
    shown.forEach(function (t) {
      var card = IS.el("article", { class: "card tip-card" });
      card.appendChild(IS.el("span", { class: "topic-tag" }, t.topic));
      card.appendChild(IS.el("h3", null, t.title));
      card.appendChild(IS.el("p", null, t.body));
      grid.appendChild(card);
    });
    IS.reveal(grid);
  }

  function buildFilters() {
    var topics = ["All"];
    tips.forEach(function (t) { if (topics.indexOf(t.topic) === -1) topics.push(t.topic); });
    topics.forEach(function (topic) {
      var chip = IS.el("button", { type: "button", class: "chip", "aria-pressed": topic === active ? "true" : "false" }, topic);
      chip.addEventListener("click", function () {
        active = topic;
        filters.querySelectorAll(".chip").forEach(function (c) {
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        render();
      });
      filters.appendChild(chip);
    });
  }

  IS.getJSON("data/tips.json")
    .then(function (data) { tips = data; buildFilters(); render(); })
    .catch(function () {
      grid.textContent = "";
      grid.appendChild(IS.el("p", { class: "status-msg error" },
        "Sorry, the safety tips could not be loaded. Please refresh the page or try again later."));
    });
})();
