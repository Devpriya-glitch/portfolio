document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const links = document.querySelectorAll(".nav__link[href^='#']");
  const sections = document.querySelectorAll("main section[id]");
  const yearEl = document.getElementById("year");
  const toTopFloat = document.getElementById("toTopFloat");
  const toTopBar = document.getElementById("toTop");
  const cursorGlow = document.getElementById("cursorGlow");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    nav.classList.toggle("is-scrolled", scrolled);
    if (toTopFloat) toTopFloat.classList.toggle("is-visible", window.scrollY > 600);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  if (toTopFloat) toTopFloat.addEventListener("click", scrollToTop);
  if (toTopBar) toTopBar.addEventListener("click", scrollToTop);

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            links.forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spy.observe(s));
  }

  const revealEls = document.querySelectorAll("[data-reveal]");
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    revealEls.forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: (i % 4) * 0.06,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    gsap.utils.toArray(".bento__card, .p-card, .service-card, .process__step, .footer-col").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%" },
      });
    });
  } else if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-revealed"));
  }

  const counters = document.querySelectorAll(".stat__num");

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count) || 0;

    const duration = 2200; // slow animation
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);

      // Smooth & slow ease
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = eased * target;

      // 1.5 ko decimal ke saath show karega
      el.textContent = target % 1 !== 0
        ? current.toFixed(1)
        : Math.round(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window && counters.length) {
    const cIO = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    counters.forEach((c) => cIO.observe(c));
  }

  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".p-card[data-cat]");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((f) => f.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const cats = card.dataset.cat || "";
        const match = filter === "all" || cats.includes(filter);
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("pointermove", (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  }

  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.25}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0,0)";
    });
  });

  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      formNote.textContent = "This form isn't connected to an inbox yet — email me directly for now.";
      form.reset();
    });
  }
});