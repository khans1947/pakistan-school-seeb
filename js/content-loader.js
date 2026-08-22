/**
 * Loads content — live from Firebase when configured, else local / JSON
 */
(function () {
  "use strict";
  var DATA_URL = "data/content.json";

  function setStats(stats) {
    if (!stats) return;
    var els = document.querySelectorAll(".stat-value[data-count]");
    var values = [stats.students, stats.faculty, stats.passRate, stats.grades];
    var suffixes = ["+", "+", "%", ""];
    els.forEach(function (el, i) {
      if (values[i] != null) {
        el.dataset.count = String(values[i]);
        el.dataset.suffix = suffixes[i] || "";
        el.textContent = "0";
      }
    });
    animateStats();
  }

  function animateStats() {
    document.querySelectorAll(".stat-value[data-count]").forEach(function (el) {
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix || "";
      if (isNaN(target)) return;
      var current = 0;
      var step = Math.max(1, Math.ceil(target / 40));
      var timer = setInterval(function () {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current.toLocaleString() + suffix;
      }, 30);
    });
  }

  function setTicker(items) {
    var ticker = document.querySelector(".ticker");
    if (!ticker || !items || !items.length) return;
    var html = items.map(function (t) {
      return '<span class="ticker-item">' + escapeHtml(t) + "</span>";
    }).join("");
    ticker.innerHTML = html + html;
  }

  function setNotices(notices) {
    var list = document.querySelector(".notice-list");
    if (!list || !notices) return;
    var catLabel = { exams: "Exams", circulars: "Circulars", events: "Events", holidays: "Holidays" };
    list.innerHTML = notices.map(function (n) {
      var high = n.priority === "high" ? " high" : "";
      var label = catLabel[n.category] || n.category;
      var icsBtn = "";
      if (n.icsStart) {
        var ics = JSON.stringify({
          title: n.title, start: n.icsStart, end: n.icsEnd || n.icsStart,
          desc: n.summary || "", location: "Pakistan School Seeb"
        });
        icsBtn = '<button class="btn btn-sm btn-secondary mt-1" data-ics=\'' + ics.replace(/'/g, "&#39;") + "'>Add to Calendar</button>";
      }
      return '<article class="glass-card notice-item" data-category="' + escapeAttr(n.category) + '">' +
        '<div class="notice-date"><span class="day">' + escapeHtml(n.day) + '</span><span class="month">' + escapeHtml(n.month) + "</span></div>" +
        '<div class="notice-body"><div class="notice-meta"><span class="notice-cat' + high + '">' + escapeHtml(label) + "</span></div>" +
        "<h4>" + escapeHtml(n.title) + "</h4><p>" + escapeHtml(n.summary || "") + "</p>" + icsBtn + "</div></article>";
    }).join("");
    list.querySelectorAll("[data-ics]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try {
          var data = JSON.parse(btn.getAttribute("data-ics"));
          var ics = ["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT","DTSTART:"+data.start,"DTEND:"+data.end,"SUMMARY:"+data.title,"END:VEVENT","END:VCALENDAR"].join("\r\n");
          var a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
          a.download = "event.ics"; a.click();
        } catch (e) {}
      });
    });
  }

  function applyData(data) {
    if (!data) return;
    setStats(data.stats);
    setTicker(data.ticker);
    setNotices(data.notices);
  }

  function escapeHtml(s) {
    return String(s || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }

  async function boot() {
    if (window.PSSCloud) {
      await window.PSSCloud.init();
      window.PSSCloud.subscribeContent(applyData);
      var cloudData = await window.PSSCloud.getContent();
      if (!cloudData) {
        try {
          var data = await fetch(DATA_URL + "?t=" + Date.now()).then(function (r) { return r.json(); });
          applyData(data);
        } catch (e) { animateStats(); }
      }
      return;
    }
    try {
      var local = localStorage.getItem("pss-admin-content");
      if (local) applyData(JSON.parse(local));
    } catch (e) {}
    fetch(DATA_URL + "?t=" + Date.now()).then(function (r) { return r.json(); }).then(applyData).catch(function () { animateStats(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
