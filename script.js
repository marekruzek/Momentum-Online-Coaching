const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (header && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Zavřít menu" : "Otevřít menu");
  });
}

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

    if (header && menuToggle) {
      header.classList.remove("is-menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Otevřít menu");
    }

    const openedMenuHeight = wasMenuOpen && navLinks ? navLinks.offsetHeight : 0;
    const headerHeight = header ? header.offsetHeight - openedMenuHeight : 0;
    const mobileStartSections = ["#coaching", "#results", "#faq"];
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const shouldAlignEyebrow =
      isMobile && mobileStartSections.includes(sectionId);
    const targetElement = shouldAlignEyebrow
      ? section.querySelector(".eyebrow") || section
      : section;
    const extraOffset = shouldAlignEyebrow ? 10 : 24;
    const targetPosition =
      window.scrollY + targetElement.getBoundingClientRect().top - headerHeight - extraOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo({
      top: Math.max(0, Math.min(targetPosition, maxScroll)),
      behavior: "smooth",
    });
  });
});

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
