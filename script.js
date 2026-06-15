document.querySelectorAll(".navbar a").forEach((link) => {
  link.addEventListener("click", (event) => {
    const sectionId = link.getAttribute("href");
    const section = document.querySelector(sectionId);

    if (!section) {
      return;
    }

    event.preventDefault();
    section.scrollIntoView({
      behavior: "smooth",
    });
  });
});
