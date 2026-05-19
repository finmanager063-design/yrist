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

  document.querySelectorAll("[data-count]").forEach(function (el) {
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
  });

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

  var kztEl = document.querySelector("[data-count-kzt]");
  if (kztEl) {
    var kztTarget = parseFloat(kztEl.getAttribute("data-count-kzt"));
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

  document.querySelectorAll(".case-card__photo[data-initials]").forEach(function (el) {
    var init = el.getAttribute("data-initials");
    if (init) {
      el.textContent = init;
      el.style.fontSize = "28px";
      el.style.fontWeight = "800";
      el.style.color = "var(--gold)";
    }
  });

  if ("IntersectionObserver" in window) {
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
        ".section, .stat-card, .story, .return-card, .review-card, .process li, .guarantee-box"
      )
      .forEach(function (el) {
        el.classList.add("reveal");
        revealObs.observe(el);
      });
  }

  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = data.get("name") || "";
      var phone = data.get("phone") || "";
      var messenger = data.get("messenger") || "";
      var message = data.get("message") || "";
      var body = encodeURIComponent(
        "Имя: " + name + "\nТелефон: " + phone + "\nМессенджер: " + messenger + "\n\nСитуация:\n" + message
      );
      var subject = encodeURIComponent("Заявка с сайта — возврат денег");
      var mailto =
        "mailto:finmanager063@gmail.com?subject=" + subject + "&body=" + body;
      var waText = encodeURIComponent(
        "Здравствуйте, " +
          name +
          ". Хочу консультацию по возврату денег. " +
          message +
          " Тел: " +
          phone
      );
      if (window.confirm("Открыть WhatsApp для быстрой отправки? (Отмена — отправка на email)")) {
        window.open("https://wa.me/77754194917?text=" + waText, "_blank");
      } else {
        window.location.href = mailto;
      }
    });
  }
})();
