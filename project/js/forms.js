/* =========================================================
   forms.js  (enquiry.html and contact.html)

   Shared client-side validation (JavaScript on top of the HTML5
   attributes) plus the two form behaviours:

   enquiry.html  -> validates, loads data/products.json with fetch (AJAX),
                    and shows an estimated cost + availability response.
   contact.html  -> validates, then compiles the message into an email to
                    CONTACT_EMAIL that the visitor can send. If a form
                    service URL is added to FORM_ENDPOINT the same data is
                    also submitted asynchronously with fetch.
   ========================================================= */
(function () {
  "use strict";

  /* ---- Settings you can change ---- */
  var CONTACT_EMAIL = "info@ivysonschoeman.co.za"; // recipient of compiled emails
  var FORM_ENDPOINT = ""; // optional: e.g. a Formspree URL. Leave empty to use email only.

  /* ---------- Validation helpers ---------- */

  var NAME_RE = /^[A-Za-zÀ-ɏ][A-Za-zÀ-ɏ' .-]{1,59}$/;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^(?:\+27|0)[1-9]\d{8}$/; // South African numbers

  function val(form, name) {
    var f = form.elements[name];
    return f ? f.value.trim() : "";
  }
  function checkedValues(form, name) {
    return Array.prototype.slice.call(form.querySelectorAll('input[name="' + name + '"]:checked'))
      .map(function (i) { return i.value; });
  }
  function validName(v) {
    if (!v) return "Please enter your full name.";
    if (v.length < 2) return "Your name must be at least 2 characters.";
    if (!NAME_RE.test(v)) return "Names may only contain letters, spaces, apostrophes, full stops and hyphens.";
    return "";
  }
  function validEmail(v) {
    if (!v) return "Please enter your email address.";
    if (!EMAIL_RE.test(v)) return "Enter a valid email address, e.g. you@example.com.";
    return "";
  }
  function validPhone(v, required) {
    if (!v) return required ? "Please enter your phone number." : "";
    var digits = v.replace(/[\s\-()]/g, "");
    if (!PHONE_RE.test(digits)) return "Enter a valid South African number, e.g. 082 123 4567 or +27 82 123 4567.";
    return "";
  }
  function validText(v, label, min, max) {
    if (!v) return "Please enter " + label + ".";
    if (v.length < min) return label.charAt(0).toUpperCase() + label.slice(1) + " must be at least " + min + " characters (you have " + v.length + ").";
    if (v.length > max) return label.charAt(0).toUpperCase() + label.slice(1) + " must be " + max + " characters or fewer.";
    return "";
  }
  function parseDate(v) { // "YYYY-MM-DD" as a local date
    var p = v.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function startOfToday() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function isoDate(d) {
    var m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }
  function addBusinessDays(d, n) {
    var r = new Date(d);
    while (n > 0) { r.setDate(r.getDate() + 1); if (r.getDay() !== 0 && r.getDay() !== 6) n--; }
    return r;
  }
  function longDate(d) {
    return d.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  /* Attach error elements, live validation and a summary to a form.
     defs: [{ id: "g-fullName", check: function (form) { return "error text" or "" } }] */
  function setupValidation(form, defs) {
    form.noValidate = true; // we show our own messages (browser validation still works without JS)

    var summary = IS.el("div", { class: "form-summary", role: "alert", tabindex: "-1" });
    form.insertBefore(summary, form.firstChild);

    defs.forEach(function (d) {
      d.group = form.querySelector("#" + d.id);
      var err = IS.el("p", { class: "error-msg", id: d.id + "-error" });
      d.group.appendChild(err);
      d.inputs = d.group.querySelectorAll("input, select, textarea");
      d.inputs.forEach(function (inp) {
        var prev = inp.getAttribute("aria-describedby");
        inp.setAttribute("aria-describedby", (prev ? prev + " " : "") + err.id);
      });
      d.touched = false;
      d.validate = function () {
        var msg = d.check(form);
        err.textContent = msg;
        d.group.classList.toggle("invalid", !!msg);
        d.group.classList.toggle("valid", !msg && d.touched);
        d.inputs.forEach(function (i) { i.setAttribute("aria-invalid", msg ? "true" : "false"); });
        return !msg;
      };
      d.inputs.forEach(function (inp) {
        inp.addEventListener("blur", function () { d.touched = true; d.validate(); });
        var live = function () { if (d.touched || d.group.classList.contains("invalid")) d.validate(); };
        inp.addEventListener("input", live);
        inp.addEventListener("change", function () { d.touched = true; d.validate(); });
      });
    });

    return function validateAll() {
      var firstBad = null, bad = 0;
      defs.forEach(function (d) {
        d.touched = true;
        if (!d.validate()) { bad++; if (!firstBad) firstBad = d; }
      });
      if (bad) {
        summary.textContent = "Please fix " + bad + (bad === 1 ? " problem" : " problems") + " below before submitting.";
        summary.classList.add("show");
        var target = firstBad.inputs[0];
        if (target) target.focus();
      } else {
        summary.classList.remove("show");
      }
      return bad === 0;
    };
  }

  function setupCounter(textarea, counter, max) {
    if (!textarea || !counter) return;
    var update = function () { counter.textContent = textarea.value.length + " / " + max; };
    textarea.addEventListener("input", update);
    update();
  }

  function mailtoLink(to, subject, body) {
    return "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  /* =========================================================
     ENQUIRY FORM  (cost estimate response)
     ========================================================= */
  var enquiry = document.getElementById("enquiry-form");
  if (enquiry) {
    var out = document.getElementById("enquiry-result");
    var dateInput = document.getElementById("evalDate");

    // Date picker limits: tomorrow to 60 days ahead
    var tomorrow = new Date(startOfToday()); tomorrow.setDate(tomorrow.getDate() + 1);
    var limit = new Date(startOfToday()); limit.setDate(limit.getDate() + 60);
    dateInput.min = isoDate(tomorrow);
    dateInput.max = isoDate(limit);

    setupCounter(document.getElementById("message"), document.getElementById("message-count"), 500);

    // Pre-select products when arriving from the catalog (?interest=cameras)
    var params = new URLSearchParams(window.location.search);
    var pre = params.get("interest");
    if (pre) {
      var box = enquiry.querySelector('input[name="interest"][value="' + pre.replace(/[^a-z-]/g, "") + '"]');
      if (box) box.checked = true;
    }

    var validateEnquiry = setupValidation(enquiry, [
      { id: "g-fullName", check: function (f) { return validName(val(f, "fullName")); } },
      { id: "g-email", check: function (f) { return validEmail(val(f, "email")); } },
      { id: "g-phone", check: function (f) { return validPhone(val(f, "phone"), true); } },
      { id: "g-houseSize", check: function (f) { return val(f, "houseSize") ? "" : "Please choose your approximate house size."; } },
      { id: "g-interest", check: function (f) { return checkedValues(f, "interest").length ? "" : "Please select at least one product type."; } },
      { id: "g-evalDate", check: function (f) {
          var v = val(f, "evalDate");
          if (!v) return "";
          var d = parseDate(v);
          if (isNaN(d.getTime())) return "Please enter a valid date.";
          if (d <= startOfToday()) return "Please choose a date in the future.";
          if (d > limit) return "Please choose a date within the next 60 days.";
          if (d.getDay() === 0 || d.getDay() === 6) return "Evaluations take place Monday to Friday. Please choose a weekday.";
          return "";
        } },
      { id: "g-message", check: function (f) { return validText(val(f, "message"), "a message", 10, 500); } },
      { id: "g-consent", check: function (f) { return f.elements.consent.checked ? "" : "Please tick the box so we may contact you about this enquiry."; } }
    ]);

    enquiry.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateEnquiry()) return;

      var button = enquiry.querySelector('button[type="submit"]');
      button.disabled = true;
      out.textContent = "";
      out.appendChild(IS.el("p", { class: "status-msg" }, "Calculating your estimate…"));

      // AJAX: load current prices, then calculate without reloading the page
      IS.getJSON("data/products.json")
        .then(function (data) { showEstimate(data); })
        .catch(function () {
          out.textContent = "";
          out.appendChild(IS.el("p", { class: "status-msg error" },
            "Sorry, we could not calculate your estimate right now. Please try again, or contact us directly."));
        })
        .then(function () { button.disabled = false; });
    });

    function showEstimate(data) {
      var size = data.estimator.houseSizes[val(enquiry, "houseSize")];
      var cats = checkedValues(enquiry, "interest");
      var install = enquiry.elements.installation.checked;
      var rows = [], lowTotal = 0, highTotal = 0, devices = 0;

      cats.forEach(function (cat) {
        var prices = data.products.filter(function (p) { return p.category === cat; }).map(function (p) { return p.price; });
        var qty = size[cat], lo = Math.min.apply(null, prices) * qty, hi = Math.max.apply(null, prices) * qty;
        rows.push({ label: data.estimator.categoryLabels[cat], qty: qty, lo: lo, hi: hi });
        lowTotal += lo; highTotal += hi; devices += qty;
      });
      var instCost = install ? data.estimator.installation.callOut + devices * data.estimator.installation.perDevice : 0;
      if (install) rows.push({ label: "Professional installation", qty: devices + " devices", lo: instCost, hi: instCost });
      lowTotal += instCost; highTotal += instCost;

      // Availability response
      var wanted = val(enquiry, "evalDate");
      var earliest = addBusinessDays(startOfToday(), 2);
      var when = wanted ? parseDate(wanted) : earliest;
      var availability = wanted
        ? "We have provisionally reserved " + longDate(when) + " for your on-site evaluation. A consultant will confirm by email or phone within one business day."
        : "Our earliest available on-site evaluation is " + longDate(when) + ". A consultant will contact you within one business day to confirm a time.";

      var ref = "IS-" + isoDate(new Date()).replace(/-/g, "") + "-" + String(Math.floor(1000 + Math.random() * 9000));
      var name = val(enquiry, "fullName").split(" ")[0];

      out.textContent = "";
      var panel = IS.el("div", { class: "result-panel" });
      panel.appendChild(IS.el("h2", null, "Thank you, " + name + "!"));
      panel.appendChild(IS.el("p", null, "Your estimated cost for a " + size.label.toLowerCase() + " home (reference " + ref + "):"));
      panel.appendChild(IS.el("p", { class: "big-price" }, IS.rand(lowTotal) + " – " + IS.rand(highTotal)));

      var table = IS.el("table");
      var head = IS.el("tr");
      ["Item", "Qty", "Estimate"].forEach(function (h, i) { head.appendChild(IS.el("th", i ? { class: "num" } : null, h)); });
      table.appendChild(head);
      rows.forEach(function (r) {
        var tr = IS.el("tr");
        tr.appendChild(IS.el("td", null, r.label));
        tr.appendChild(IS.el("td", { class: "num" }, String(r.qty)));
        tr.appendChild(IS.el("td", { class: "num" }, r.lo === r.hi ? IS.rand(r.lo) : IS.rand(r.lo) + " – " + IS.rand(r.hi)));
        table.appendChild(tr);
      });
      panel.appendChild(table);
      panel.appendChild(IS.el("p", null, availability));
      panel.appendChild(IS.el("p", { class: "hint" }, data.note + " The range reflects our entry-level to premium products."));

      // Let the visitor send the request to our team as an email
      var body = [
        "Quote request " + ref, "",
        "Name: " + val(enquiry, "fullName"),
        "Email: " + val(enquiry, "email"),
        "Phone: " + val(enquiry, "phone"),
        "House size: " + size.label,
        "Interested in: " + cats.map(function (c) { return data.estimator.categoryLabels[c]; }).join(", "),
        "Installation: " + (install ? "Yes" : "No"),
        "Preferred evaluation date: " + (wanted ? longDate(when) : "No preference"),
        "Estimate shown: " + IS.rand(lowTotal) + " - " + IS.rand(highTotal), "",
        "Message:", val(enquiry, "message")
      ].join("\r\n");
      var actions = IS.el("div", { class: "result-actions" });
      actions.appendChild(IS.el("a", { class: "btn-secondary", href: mailtoLink(CONTACT_EMAIL, "Quote request " + ref, body) }, "Email this request to our team"));
      actions.appendChild(IS.el("a", { href: "services.html", class: "btn-link" }, "Browse the product catalog"));
      panel.appendChild(actions);
      out.appendChild(panel);
      out.focus();
    }
  }

  /* =========================================================
     CONTACT FORM  (compiles an email)
     ========================================================= */
  var contact = document.getElementById("contact-form");
  if (contact) {
    var cout = document.getElementById("contact-result");
    setupCounter(document.getElementById("contactMessage"), document.getElementById("contactMessage-count"), 1000);

    var validateContact = setupValidation(contact, [
      { id: "g-contactName", check: function (f) { return validName(val(f, "contactName")); } },
      { id: "g-contactEmail", check: function (f) { return validEmail(val(f, "contactEmail")); } },
      { id: "g-contactPhone", check: function (f) { return validPhone(val(f, "contactPhone"), false); } },
      { id: "g-branch", check: function (f) { return val(f, "branch") ? "" : "Please choose your nearest branch."; } },
      { id: "g-messageType", check: function (f) { return val(f, "messageType") ? "" : "Please choose the type of message."; } },
      { id: "g-subject", check: function (f) { return validText(val(f, "subject"), "a subject", 3, 80); } },
      { id: "g-contactMessage", check: function (f) { return validText(val(f, "contactMessage"), "a message", 10, 1000); } },
      { id: "g-contactConsent", check: function (f) { return f.elements.contactConsent.checked ? "" : "Please tick the box so we may reply to you."; } }
    ]);

    contact.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateContact()) return;

      var subject = "[" + val(contact, "messageType") + "] " + val(contact, "subject");
      var body = [
        "Hello Ivyson & Schoeman Home Security,", "",
        val(contact, "contactMessage"), "",
        "--",
        "Name: " + val(contact, "contactName"),
        "Email: " + val(contact, "contactEmail"),
        "Phone: " + (val(contact, "contactPhone") || "Not provided"),
        "Nearest branch: " + val(contact, "branch"),
        "Message type: " + val(contact, "messageType")
      ].join("\r\n");

      cout.textContent = "";
      var panel = IS.el("div", { class: "result-panel" });
      panel.appendChild(IS.el("h3", null, "Your email is ready to send"));
      panel.appendChild(IS.el("p", null, "Check the message below, then press the button to send it from your email app to " + CONTACT_EMAIL + "."));
      panel.appendChild(IS.el("p", { class: "email-preview" }, "To: " + CONTACT_EMAIL + "\nSubject: " + subject + "\n\n" + body.replace(/\r\n/g, "\n")));

      var actions = IS.el("div", { class: "result-actions" });
      actions.appendChild(IS.el("a", { class: "btn-secondary", href: mailtoLink(CONTACT_EMAIL, subject, body) }, "Open in my email app"));
      var copy = IS.el("button", { type: "button", class: "chip" }, "Copy message");
      copy.addEventListener("click", function () {
        var text = "To: " + CONTACT_EMAIL + "\nSubject: " + subject + "\n\n" + body.replace(/\r\n/g, "\n");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { copy.textContent = "Copied!"; });
        } else { copy.textContent = "Select the text above to copy"; }
      });
      actions.appendChild(copy);
      panel.appendChild(actions);
      var status = IS.el("p", { class: "hint", role: "status" });
      panel.appendChild(status);
      cout.appendChild(panel);
      cout.focus();

      // Optional AJAX submission to a form service (only when FORM_ENDPOINT is set)
      if (FORM_ENDPOINT) {
        status.textContent = "Sending your message…";
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: val(contact, "contactName"), email: val(contact, "contactEmail"),
            phone: val(contact, "contactPhone"), branch: val(contact, "branch"),
            type: val(contact, "messageType"), subject: subject, message: val(contact, "contactMessage")
          })
        }).then(function (res) {
          status.textContent = res.ok ? "Your message was also sent to our team. Thank you!" : "We could not send it automatically. Please use the email button above.";
        }).catch(function () {
          status.textContent = "We could not send it automatically. Please use the email button above.";
        });
      }
    });
  }
})();
