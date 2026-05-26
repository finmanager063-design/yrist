(function () {
  "use strict";

  var fmt = new Intl.NumberFormat("ru-KZ");

  function formatKztDisplay(n) {
    if (n >= 1e9) {
      return (
        (n / 1e9).toLocaleString("ru-KZ", { maximumFractionDigits: 1 }) + " млрд ₸"
      );
    }
    if (n >= 1e6) {
      return (
        (n / 1e6).toLocaleString("ru-KZ", { maximumFractionDigits: 1 }) + " млн ₸"
      );
    }
    return fmt.format(Math.round(n)) + " ₸";
  }

  function animateKztEl(el, target, onDone) {
    if (!el || Number.isNaN(target)) return;
    var duration = 2000;
    var start = performance.now();
    function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatKztDisplay(target * eased);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.add("is-tick");
        setTimeout(function () {
          el.classList.remove("is-tick");
        }, 400);
        if (onDone) onDone();
      }
    }
    requestAnimationFrame(tick);
  }

  function animateCountEl(el, target) {
    if (!el || Number.isNaN(target)) return;
    var duration = 1600;
    var start = performance.now();
    function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = fmt.format(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function observeAnimate(el, run) {
    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      setTimeout(run, 200);
    }
  }

  document.querySelectorAll("[data-wallet-balance]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count-kzt"));
    observeAnimate(el, function () {
      animateKztEl(el, target);
    });
  });

  document.querySelectorAll("[data-platform-kzt]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count-kzt"));
    observeAnimate(el, function () {
      animateKztEl(el, target);
    });
  });

  document.querySelectorAll(".gs-banner__stats [data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    observeAnimate(el, function () {
      animateCountEl(el, target);
    });
  });

  document.querySelectorAll(".stat-card").forEach(function (card) {
    observeAnimate(card, function () {
      card.classList.add("stat-success");
    });
  });

  /* Banner carousel */
  var carousel = document.querySelector("[data-banner-carousel]");
  if (carousel) {
    var banners = carousel.querySelectorAll("[data-banner]");
    var dots = carousel.querySelectorAll("[data-banner-dots] button");
    var idx = 0;
    var timer;

    function showBanner(i) {
      idx = (i + banners.length) % banners.length;
      banners.forEach(function (b, n) {
        b.classList.toggle("promo-banner--active", n === idx);
        if (n !== idx) b.classList.remove("promo-banner--active");
      });
      dots.forEach(function (d, n) {
        d.classList.toggle("is-active", n === idx);
      });
    }

    function next() {
      showBanner(idx + 1);
    }

    dots.forEach(function (dot, n) {
      dot.addEventListener("click", function () {
        showBanner(n);
        clearInterval(timer);
        timer = setInterval(next, 6000);
      });
    });

    timer = setInterval(next, 6000);
  }

  /* Live transaction feed in wallet */
  var txEl = document.querySelector("[data-live-tx]");
  var txText = txEl && txEl.querySelector(".wallet-mock__tx-text");
  var txSamples = [
    "Зачисление · 4 250 000 ₸ · Алматы",
    "Возврат · 18 600 000 ₸ · Астана",
    "Статус: завершено · 890 000 ₸ · Шымкент",
    "Контур GSF · 316,9 млрд ₸ в работе",
    "Досудебное · 67 млн ₸ · Актобе",
    "Клиент +1 · регистрация на платформе",
  ];
  var txI = 0;

  if (txEl && txText) {
    setInterval(function () {
      txEl.classList.add("is-switching");
      setTimeout(function () {
        txI = (txI + 1) % txSamples.length;
        txText.textContent = txSamples[txI];
        txEl.classList.remove("is-switching");
        var icon = txEl.querySelector(".wallet-mock__tx-icon");
        if (icon) {
          icon.style.animation = "none";
          void icon.offsetWidth;
          icon.style.animation = "";
        }
      }, 400);
    }, 4500);
  }

  /* Success toasts */
  var stack = document.querySelector("[data-toast-stack]");
  var toastPool = [
    { title: "Возврат зачислен", sub: "+2 840 000 ₸ · клиент из Алматы" },
    { title: "Дело закрыто досудебно", sub: "87% · без суда · GlobalSafe Finance" },
    { title: "Новый кейс принят", sub: "Разбор за 24 ч · Сергей Макаров" },
    { title: "Контур активен", sub: "316,9 млрд ₸ · financegroup.store" },
    { title: "Претензия отправлена", sub: "Брокер GlobalTrade FX · ожидание ответа" },
  ];
  var toastIdx = 0;

  function pushToast() {
    if (!stack) return;
    var data = toastPool[toastIdx % toastPool.length];
    toastIdx += 1;

    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML =
      '<span class="toast__icon" aria-hidden="true">✓</span>' +
      '<div class="toast__body"><strong>' +
      data.title +
      "</strong><span>" +
      data.sub +
      "</span></div>";
    stack.appendChild(el);

    while (stack.children.length > 3) {
      var old = stack.firstChild;
      if (old) {
        old.classList.add("is-out");
        setTimeout(function (node) {
          if (node.parentNode) node.parentNode.removeChild(node);
        }, 400, old);
      }
    }

    setTimeout(function () {
      el.classList.add("is-out");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 400);
    }, 5000);
  }

  if (stack && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setTimeout(pushToast, 2500);
    setInterval(pushToast, 9000);
  }
})();
