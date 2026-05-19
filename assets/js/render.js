(function () {
  "use strict";

  var D = window.MAKAROV_DATA;
  if (!D) return;

  var fmt = new Intl.NumberFormat("ru-KZ");

  function formatMoney(amount, currency) {
    if (currency === "USD") {
      return "$" + fmt.format(amount);
    }
    if (amount >= 1e9) {
      return (amount / 1e9).toLocaleString("ru-KZ", { maximumFractionDigits: 2 }) + " млрд ₸";
    }
    if (amount >= 1e6) {
      return (amount / 1e6).toLocaleString("ru-KZ", { maximumFractionDigits: 1 }) + " млн ₸";
    }
    return fmt.format(amount) + " ₸";
  }

  function formatDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("ru-KZ", { day: "numeric", month: "long", year: "numeric" });
  }

  function initials(fio) {
    return fio
      .split(/\s+/)
      .map(function (p) {
        return p[0] || "";
      })
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var returnsGrid = document.getElementById("returns-grid");
  if (returnsGrid) {
    returnsGrid.innerHTML = D.returns
      .map(function (r) {
        return (
          '<article class="return-card">' +
          '<div class="return-card__head">' +
          '<span class="return-card__avatar" aria-hidden="true">' +
          escapeHtml(initials(r.fio)) +
          "</span>" +
          "<div>" +
          '<h3 class="return-card__fio">' +
          escapeHtml(r.fio) +
          "</h3>" +
          '<p class="return-card__city">' +
          escapeHtml(r.city) +
          "</p>" +
          "</div>" +
          "</div>" +
          '<p class="return-card__amount">' +
          escapeHtml(formatMoney(r.amount, r.currency)) +
          "</p>" +
          '<dl class="return-card__meta">' +
          "<div><dt>Дата возврата</dt><dd>" +
          escapeHtml(formatDate(r.date)) +
          "</dd></div>" +
          "<div><dt>Где потерял</dt><dd>" +
          escapeHtml(r.exchange) +
          "</dd></div>" +
          "</dl>" +
          "</article>"
        );
      })
      .join("");
  }

  var reviewsGrid = document.getElementById("reviews-grid");
  if (reviewsGrid) {
    reviewsGrid.innerHTML = D.reviews
      .map(function (r) {
        var stars = "⭐".repeat(r.stars || 5);
        return (
          '<article class="review-card">' +
          '<div class="review-card__thumb" aria-hidden="true">💬</div>' +
          "<h3>" +
          escapeHtml(r.name) +
          ", " +
          escapeHtml(r.city) +
          "</h3>" +
          "<p>«" +
          escapeHtml(r.text) +
          "»</p>" +
          '<p class="review-card__stars">' +
          stars +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  var teasersEl = document.getElementById("teasers-grid");
  if (teasersEl && D.teasers) {
    teasersEl.innerHTML = D.teasers
      .map(function (t) {
        return (
          '<article class="story">' +
          "<h3>📌 " +
          escapeHtml(t.title) +
          "</h3>" +
          '<p class="story__result">' +
          escapeHtml(t.text) +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  var totalEl = document.querySelector("[data-total-returned]");
  if (totalEl) {
    totalEl.textContent = formatMoney(D.totalReturnedKzt, "KZT");
  }

  var badgeEl = document.querySelector("[data-hero-total]");
  if (badgeEl) {
    badgeEl.textContent = "Вернул клиентам более " + formatMoney(D.totalReturnedKzt, "KZT");
  }
})();
