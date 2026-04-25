const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll(".panel");
const slider = document.getElementById("section-slider");
const revealItems = document.querySelectorAll(".reveal");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const yearEl = document.getElementById("year");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const prevSectionBtn = document.getElementById("prev-section");
const nextSectionBtn = document.getElementById("next-section");
const profileImage = document.getElementById("profile-image");
const profilePhoto = document.querySelector(".profile-photo");
const profileCard = document.querySelector(".profile-card");

let activeSectionIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (profileImage && profilePhoto) {
  const showProfilePhoto = () => {
    profilePhoto.classList.add("is-loaded");
    profileCard?.classList.add("has-photo");
  };

  profileImage.addEventListener("error", () => {
    profilePhoto.classList.remove("is-loaded");
    profileCard?.classList.remove("has-photo");
  });

  profileImage.addEventListener("load", showProfilePhoto);

  if (profileImage.complete && profileImage.naturalWidth > 0) {
    showProfilePhoto();
  }
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const updateSectionButtons = () => {
  if (prevSectionBtn) {
    prevSectionBtn.disabled = activeSectionIndex <= 0;
  }

  if (nextSectionBtn) {
    nextSectionBtn.disabled = activeSectionIndex >= sections.length - 1;
  }
};

const updateActiveLink = () => {
  navItems.forEach((link) => {
    const targetId = link.getAttribute("href");
    link.classList.toggle("is-active", targetId === `#${sections[activeSectionIndex].id}`);
  });
};

const updateSlider = () => {
  if (slider) {
    slider.style.transform = `translateX(-${activeSectionIndex * 100}%)`;
  }

  sections.forEach((section, index) => {
    section.classList.toggle("is-active", index === activeSectionIndex);
  });

  updateActiveLink();
  updateSectionButtons();
};

const scrollToSection = (index) => {
  if (index < 0 || index >= sections.length) {
    return;
  }

  activeSectionIndex = index;
  updateSlider();
};

navItems.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#")) {
      return;
    }

    const nextIndex = Array.from(sections).findIndex((section) => `#${section.id}` === href);

    if (nextIndex === -1) {
      return;
    }

    event.preventDefault();
    scrollToSection(nextIndex);
  });
});

revealItems.forEach((item) => item.classList.add("is-visible"));

if (prevSectionBtn) {
  prevSectionBtn.addEventListener("click", () => {
    scrollToSection(activeSectionIndex - 1);
  });
}

if (nextSectionBtn) {
  nextSectionBtn.addEventListener("click", () => {
    scrollToSection(activeSectionIndex + 1);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    projectCards.forEach((card) => {
      const categories = card.dataset.category || "";
      const shouldShow = filter === "all" || categories.includes(filter);
      card.hidden = !shouldShow;
    });
  });
});

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in all fields before sending.";
      return;
    }

    formStatus.textContent = "Thanks for reaching out. Your message is ready to send.";
    contactForm.reset();
  });
}

window.addEventListener("load", updateSlider);

document.addEventListener(
  "touchstart",
  (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      scrollToSection(activeSectionIndex + 1);
    } else {
      scrollToSection(activeSectionIndex - 1);
    }
  },
  { passive: true }
);
