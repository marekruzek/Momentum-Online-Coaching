const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const updateViewportHeight = () => {
  document.documentElement.style.setProperty("--app-height", `${window.innerHeight}px`);
};

updateViewportHeight();
window.addEventListener("resize", updateViewportHeight, { passive: true });
window.addEventListener("orientationchange", () => {
  updateViewportHeight();
  window.setTimeout(updateViewportHeight, 250);
});

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const getSectionCenterScrollTop = (section) => {
  const sectionRect = section.getBoundingClientRect();
  const sectionCenter = window.scrollY + sectionRect.top + sectionRect.height / 2;

  return sectionCenter - window.innerHeight / 2;
};

const getScrollBehavior = () => prefersReducedMotion.matches ? "auto" : "smooth";

const closeMenu = () => {
  if (!header || !menuToggle) {
    return;
  }

  header.classList.remove("is-menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Otevřít menu");
};

if (header && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Zavřít menu" : "Otevřít menu");
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 701px)").matches) {
    closeMenu();
  }
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.getAttribute("href");

    if (!sectionId || !sectionId.startsWith("#")) {
      return;
    }

    const section = document.querySelector(sectionId);

    if (!section) {
      return;
    }

    event.preventDefault();

    const wasMenuOpen = header ? header.classList.contains("is-menu-open") : false;

    closeMenu();

    const openedMenuHeight = wasMenuOpen && navLinks ? navLinks.offsetHeight : 0;
    const headerHeight = header ? header.offsetHeight - openedMenuHeight : 0;
    const compactStartSections = ["#about", "#coaching", "#results", "#faq", "#contact"];
    const isCompactNav = window.matchMedia("(max-width: 700px)").matches;
    const isDesktopNavTopic =
      link.closest(".nav-links") &&
      !isCompactNav &&
      sectionId !== "#contact";
    const shouldCenterTopic =
      Boolean(isDesktopNavTopic);
    const shouldAlignEyebrow =
      isCompactNav &&
      link.closest(".nav-links") &&
      compactStartSections.includes(sectionId);

    if (shouldCenterTopic) {
      const targetPosition = getSectionCenterScrollTop(section);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      window.scrollTo({
        top: Math.max(0, Math.min(targetPosition, maxScroll)),
        behavior: getScrollBehavior(),
      });

      return;
    }

    const targetElement = shouldAlignEyebrow
        ? section.querySelector(".eyebrow") || section
        : section;
    const revealOffset = sectionId === "#about" && !section.classList.contains("is-visible") ? 48 : 0;
    const extraOffset = shouldAlignEyebrow ? 10 + revealOffset : 24;
    const targetRect = targetElement.getBoundingClientRect();
    const targetPosition = window.scrollY + targetRect.top - headerHeight - extraOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = Math.max(0, Math.min(targetPosition, maxScroll));

    window.scrollTo({
      top: scrollTop,
      behavior: getScrollBehavior(),
    });
  });
});

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      formStatus.textContent = "Vyplň prosím všechna povinná pole ve správném formátu.";
      contactForm.reportValidity();
      return;
    }

    formStatus.textContent =
      "Toto je ukázkový formulář pro portfolio. Zpráva se zatím nikam neodesílá.";
  });

  contactForm.addEventListener("input", () => {
    formStatus.textContent = "";
  });
}

const revealSections = document.querySelectorAll(".reveal-section");
const revealFromRightItems = document.querySelectorAll(".reveal-from-right");
const faqSection = document.querySelector("#faq");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.22,
    }
  );

  revealSections.forEach((section) => {
    revealObserver.observe(section);
  });

  if (faqSection && revealFromRightItems.length) {
    const faqRevealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealFromRightItems.forEach((item) => {
            item.classList.add("is-visible");
            item.addEventListener(
              "animationend",
              () => {
                item.classList.add("is-animation-done");
              },
              { once: true }
            );
          });
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.22,
      }
    );

    faqRevealObserver.observe(faqSection);
  }
} else {
  revealSections.forEach((section) => {
    section.classList.add("is-visible");
  });

  revealFromRightItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}
