(function () {
  "use strict";

  var SOURCE = "https://financegroup.store/";
  var PROXIES = [
    "https://r.jina.ai/" + SOURCE,
    "https://api.allorigins.win/raw?url=" + encodeURIComponent(SOURCE),
  ];
  var FALLBACK = { clients: 100115, kzt: 316000210737 };

  function parseStatsText(text) {
    var h = text.match(/serverH\s*=\s*(\d+)/);
    var k = text.match(/serverK\s*=\s*(\d+)/);
    if (h && k) {
      return { clients: parseInt(h[1], 10), kzt: parseInt(k[1], 10) };
    }
    var cEl = text.match(/id="stat-clients"[^>]*>\s*([0-9\s]+)/);
    var mEl = text.match(/id="stat-money"[^>]*>\s*([0-9\s]+)/);
    if (cEl && mEl) {
      return {
        clients: parseInt(cEl[1].replace(/\s/g, ""), 10),
        kzt: parseInt(mEl[1].replace(/\s/g, ""), 10),
      };
    }
    var cMd = text.match(
      /Клиенты, которым уже оказано сопровождение[\s\S]{0,120}?(\d[\d\s]{4,})/
    );
    var kMd = text.match(
      /Суммы в контуре сопровождения возвратов[\s\S]{0,160}?(\d[\d\s]{9,})/
    );
    if (cMd && kMd) {
      return {
        clients: parseInt(cMd[1].replace(/\s/g, ""), 10),
        kzt: parseInt(kMd[1].replace(/\s/g, ""), 10),
      };
    }
    return null;
  }

  function formatKztShort(n) {
    if (n >= 1e9) {
      return (
        (n / 1e9).toLocaleString("ru-KZ", { maximumFractionDigits: 1 }) +
        " млрд ₸"
      );
    }
    if (n >= 1e6) {
      return (
        (n / 1e6).toLocaleString("ru-KZ", { maximumFractionDigits: 1 }) +
        " млн ₸"
      );
    }
    return new Intl.NumberFormat("ru-KZ").format(Math.round(n)) + " ₸";
  }

  function apply(stats) {
    var fmt = new Intl.NumberFormat("ru-KZ");
    var kztText = formatKztShort(stats.kzt);

    document.querySelectorAll("[data-gsf-clients]").forEach(function (el) {
      el.setAttribute("data-count", String(stats.clients));
      if (el.hasAttribute("data-ticker-count")) {
        el.setAttribute("data-ticker-count", String(stats.clients));
      }
    });

    document.querySelectorAll("[data-gsf-kzt]").forEach(function (el) {
      el.setAttribute("data-count-kzt", String(stats.kzt));
      if (el.hasAttribute("data-ticker-kzt")) {
        el.setAttribute("data-ticker-kzt", String(stats.kzt));
      }
    });

    document.querySelectorAll("[data-ticker-count]").forEach(function (el) {
      el.textContent = fmt.format(stats.clients);
    });
    document.querySelectorAll("[data-ticker-kzt]").forEach(function (el) {
      el.textContent = kztText;
    });

    window.GSF_STATS = stats;
    document.dispatchEvent(
      new CustomEvent("gsf-stats-ready", { detail: stats })
    );
    return stats;
  }

  function fetchFromProxy(url) {
    var controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer =
      controller &&
      setTimeout(function () {
        controller.abort();
      }, 10000);
    return fetch(url, controller ? { signal: controller.signal } : {})
      .then(function (res) {
        if (timer) clearTimeout(timer);
        if (!res.ok) throw new Error("fetch");
        return res.text();
      })
      .catch(function (err) {
        if (timer) clearTimeout(timer);
        throw err;
      });
  }

  function load() {
    var chain = Promise.reject();
    PROXIES.forEach(function (proxyUrl) {
      chain = chain.catch(function () {
        return fetchFromProxy(proxyUrl).then(function (text) {
          var parsed = parseStatsText(text);
          if (!parsed || !parsed.clients || !parsed.kzt) throw new Error("parse");
          return parsed;
        });
      });
    });
    return chain.then(apply).catch(function () {
      return apply(FALLBACK);
    });
  }

  window.GSF_STATS_READY = load();
})();
