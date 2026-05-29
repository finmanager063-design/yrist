(function () {
  "use strict";

  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var fmt = new Intl.NumberFormat("ru-KZ");

  function animateCount(el, target, suffix) {
    var duration = 1600;
    var start = performance.now();
    function tick(now) {
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = Math.round(target * eased);
      el.textContent = fmt.format(val) + (suffix || "");
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function bindCountAnimation(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (Number.isNaN(target)) return;
    var run = function () {
      animateCount(el, target, "");
    };
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            run();
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
      );
      obs.observe(el);
      if (el.getBoundingClientRect().top < window.innerHeight) {
        setTimeout(run, 300);
      }
    } else {
      run();
    }
  }

  document.querySelectorAll("[data-count]:not([data-gsf-clients])").forEach(bindCountAnimation);

  function bindGsfCounts() {
    document.querySelectorAll("[data-gsf-clients]").forEach(bindCountAnimation);
  }

  if (window.GSF_STATS_READY) {
    window.GSF_STATS_READY.then(bindGsfCounts);
  } else {
    bindGsfCounts();
  }

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

  function bindKztAnimation(kztEl) {
    var kztTarget = parseFloat(kztEl.getAttribute("data-count-kzt"));
    if (Number.isNaN(kztTarget)) return;
    var runKzt = function () {
      var duration = 1800;
      var start = performance.now();
      function tick(now) {
        var t = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        kztEl.textContent = formatKztDisplay(kztTarget * eased);
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    if ("IntersectionObserver" in window) {
      var obsK = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          runKzt();
          obsK.disconnect();
        }
      }, { threshold: 0.15, rootMargin: "0px 0px -80px 0px" });
      obsK.observe(kztEl);
      if (kztEl.getBoundingClientRect().top < window.innerHeight) {
        setTimeout(runKzt, 350);
      }
    } else {
      runKzt();
    }
  }

  document
    .querySelectorAll(
      "[data-count-kzt]:not([data-wallet-balance]):not([data-platform-kzt]):not([data-gsf-kzt])"
    )
    .forEach(bindKztAnimation);

  function bindGsfKzt() {
    document.querySelectorAll("[data-gsf-kzt]").forEach(bindKztAnimation);
  }

  if (window.GSF_STATS_READY) {
    window.GSF_STATS_READY.then(bindGsfKzt);
  } else {
    bindGsfKzt();
  }

  document.querySelectorAll(".cases .person-card").forEach(function (card, index) {
    card.style.setProperty("--card-i", String(index));
  });
  document.querySelectorAll(".reviews .person-card").forEach(function (card, index) {
    card.style.setProperty("--card-i", String(index));
  });

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reducedMotion) {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    document
      .querySelectorAll(
        ".section, .stat-card, .story, .return-card, .case-card, .review-card, .process li, .guarantee-box"
      )
      .forEach(function (el) {
        el.classList.add("reveal");
        revealObs.observe(el);
      });
  }

  function pushUserToast(title, sub) {
    var stack = document.querySelector("[data-toast-stack]");
    if (!stack) return;
    var el = document.createElement("div");
    el.className = "toast";
    el.innerHTML =
      '<span class="toast__icon" aria-hidden="true">✓</span>' +
      '<div class="toast__body"><strong>' +
      title +
      "</strong><span>" +
      sub +
      "</span></div>";
    stack.appendChild(el);
    setTimeout(function () {
      el.classList.add("is-out");
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 400);
    }, 6000);
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var messenger = String(data.get("messenger") || "").trim();
      var message = String(data.get("message") || "").trim();
      var digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        pushUserToast("Проверьте телефон", "Укажите номер с кодом страны, например +7 775 …");
        form.querySelector('[name="phone"]').focus();
        return;
      }
      var lines = [
        "Здравствуйте! Хочу консультацию по возврату денег.",
        "",
        "Имя: " + name,
        "Телефон: " + phone,
      ];
      if (messenger) lines.push("Мессенджер: " + messenger);
      lines.push("", "Ситуация:", message);
      var waText = encodeURIComponent(lines.join("\n"));
      window.open("https://wa.me/77754194917?text=" + waText, "_blank", "noopener");
      pushUserToast("Откройте WhatsApp", "Отправьте сообщение — отвечу в течение 3 часов");
      form.reset();
    });
  }

  var stickyCta = document.querySelector("[data-sticky-cta]");
  var heroSection = document.getElementById("hero");
  var contactSection = document.getElementById("contact");
  if (stickyCta && heroSection && "IntersectionObserver" in window) {
    var showSticky = false;
    var inContact = false;
    function updateSticky() {
      stickyCta.hidden = !(showSticky && !inContact);
    }
    var heroObs = new IntersectionObserver(
      function (entries) {
        showSticky = !entries[0].isIntersecting;
        updateSticky();
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    heroObs.observe(heroSection);
    if (contactSection) {
      var contactObs = new IntersectionObserver(
        function (entries) {
          inContact = entries[0].isIntersecting;
          updateSticky();
        },
        { threshold: 0.15 }
      );
      contactObs.observe(contactSection);
    }
  }
})();
