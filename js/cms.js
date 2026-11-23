/* Odinin CMS loader.
   Pages ship with their text built in, so they work even if this file or the data files fail to load.
   When the JSON files in /content are available, their values replace the built in text. */
(function () {
  var page = (document.querySelector('meta[name="odinin-page"]') || {}).content;
  if (!page || location.protocol === "file:") return;
  var bust = "?v=" + Math.floor(Date.now() / 60000);
  function get(url) { return fetch(url + bust, { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function rich(t) { return esc(t).replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\n/g, "<br>"); }
  function pick(o, path) { return path.split(".").reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function has(v) { return typeof v === "string" ? v.trim() !== "" : v != null; }

  Promise.all([get("/content/settings.json"), get("/content/pages/" + page + ".json"),
               document.getElementById("fdBox") ? get("/content/faq/" + page + ".json") : null,
               document.getElementById("evList") ? get("/content/events.json") : null]).then(function (r) {
    var root = { site: r[0] || {}, page: r[1] || {} };
    document.querySelectorAll("[data-cms]").forEach(function (el) { var v = pick(root, el.getAttribute("data-cms")); if (has(v)) el.textContent = v; });
    document.querySelectorAll("[data-cms-rich]").forEach(function (el) { var v = pick(root, el.getAttribute("data-cms-rich")); if (has(v)) el.innerHTML = rich(v); });
    document.querySelectorAll("[data-cms-hero]").forEach(function (el) {
      var h = pick(root, el.getAttribute("data-cms-hero")); if (!h || !has(h.title)) return;
      el.innerHTML = esc(h.title) + (has(h.accent) ? " <span>" + esc(h.accent) + "</span>" : "");
    });
    var s = root.site;
    if (has(s.email)) window.ODININ_EMAIL = s.email.trim();
    if (has(s.logo)) document.querySelectorAll(".top .logo svg, header .logo svg").forEach(function (svg) {
      var img = document.createElement("img"); img.src = s.logo; img.alt = ""; img.style.cssText = "height:34px;width:auto;display:block"; svg.replaceWith(img);
    });
    if (has(s.share_image)) { var m = document.querySelector('meta[property="og:image"]') || document.head.appendChild(Object.assign(document.createElement("meta"), { })); m.setAttribute("property", "og:image"); m.setAttribute("content", s.share_image); }
    if (r[1] && has(r[1].seo_title)) document.title = r[1].seo_title;
    if (r[1] && has(r[1].seo_description)) { var d = document.querySelector('meta[name="description"]') || document.head.appendChild(document.createElement("meta")); d.setAttribute("name", "description"); d.setAttribute("content", r[1].seo_description); }

    // FAQ cards
    var faq = r[2], deck = document.getElementById("fdBox");
    if (deck && faq && Array.isArray(faq.items) && faq.items.length && deck.setItems) {
      deck.setItems(faq.items.filter(function (q) { return has(q.question) && has(q.answer); }).map(function (q) { return [q.question, q.answer]; }));
    }

    // Event announcements
    var ev = r[3], list = document.getElementById("evList");
    if (list && ev && Array.isArray(ev.items)) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var items = ev.items.filter(function (e) { return e.published && has(e.title) && (!e.date || new Date(e.date) >= today); })
        .sort(function (a, b) { return new Date(a.date || 0) - new Date(b.date || 0); });
      var MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      list.innerHTML = items.map(function (e) {
        var d = e.date ? new Date(e.date) : null;
        var date = d && !isNaN(d) ? '<span class="evc-date"><b>' + d.getDate() + "</b><span>" + MON[d.getMonth()] + "</span></span>" : "";
        var img = has(e.image) ? '<img src="' + esc(e.image) + '" alt="" loading="lazy">' : "";
        var meta = [e.time, e.location].filter(has).map(esc).join(" · ");
        var href = has(e.link) ? esc(e.link) : "index.html#need-s-ev";
        var ext = /^https?:/i.test(e.link || "") ? ' target="_blank" rel="noopener"' : "";
        return '<article class="evc"><div class="evc-img">' + img + date + '</div><div class="evc-b">' + (meta ? '<span class="evc-k">' + meta + "</span>" : "") +
          "<h3>" + esc(e.title) + "</h3>" + (has(e.summary) ? "<p>" + esc(e.summary) + "</p>" : "") +
          '<a class="cta" href="' + href + '"' + ext + ">" + esc(has(e.button) ? e.button : "Register interest") + "</a></div></article>";
      }).join("");
      list.hidden = !items.length;
    }
    document.documentElement.classList.add("cms-ready");
  });
})();
