(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const counters = document.querySelectorAll("[data-count]");
  const animateCount = function (el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    if (Number.isNaN(target)) return;
    const duration = 1400;
    const start = performance.now();
    const tick = function (now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach(function (c) {
      obs.observe(c);
    });
  } else {
    counters.forEach(animateCount);
  }

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get("name");
      const contact = data.get("contact");
      const message = data.get("message");
      const subject = encodeURIComponent("Заявка с сайта — " + name);
      const body = encodeURIComponent(
        "Имя: " + name + "\nКонтакт: " + contact + "\n\n" + message
      );
      window.location.href =
        "mailto:sergey.makarov.law@gmail.com?subject=" + subject + "&body=" + body;
    });
  }
})();
