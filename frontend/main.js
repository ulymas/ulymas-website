document.addEventListener("DOMContentLoaded", () => {
  let currentLang = "es";
  const LANG_STORAGE_KEY = "ulysses_lang_pref";

  const modal = document.getElementById("language-modal");
  const selectEs = document.getElementById("select-es");
  const selectEn = document.getElementById("select-en");
  const langToggleCheckbox = document.getElementById("lang-toggle-checkbox");
  const navBrand = document.querySelector(".nav-brand-glass");
  const heroSection = document.getElementById("hero");
  const contactForm = document.getElementById("contact-form");
  const bgVideos = document.querySelectorAll(".bg-video");

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Save their preference to the browser
    localStorage.setItem(LANG_STORAGE_KEY, lang);

    if (langToggleCheckbox) {
      langToggleCheckbox.checked = lang === "en";
    }

    const translatableElements =
      document.querySelectorAll("[data-es][data-en]");
    translatableElements.forEach((el) => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        el.textContent = text;
      }
    });

    const nameInput = document.getElementById("name");
    if (nameInput) {
      nameInput.placeholder = lang === "es" ? "Tu nombre" : "Your name";
    }

    const emailInput = document.getElementById("email");
    if (emailInput) {
      emailInput.placeholder =
        lang === "es" ? "tu@email.com" : "your@email.com";
    }

    const messageInput = document.getElementById("message");
    if (messageInput) {
      messageInput.placeholder =
        lang === "es"
          ? "¿Tienes alguna preferencia de fecha o consulta?"
          : "Do you have any date preference or inquiry?";
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  // --- LOCAL STORAGE CHECK ---
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
  if (savedLang) {
    setLanguage(savedLang);
    closeModal();
  }

  if (selectEs) {
    selectEs.addEventListener("click", () => {
      setLanguage("es");
      closeModal();
    });
  }

  if (selectEn) {
    selectEn.addEventListener("click", () => {
      setLanguage("en");
      closeModal();
    });
  }

  if (langToggleCheckbox) {
    langToggleCheckbox.addEventListener("change", (e) => {
      setLanguage(e.target.checked ? "en" : "es");
    });
  }

  bgVideos.forEach((video) => {
    video.play().catch(() => {});
  });

  function checkScroll() {
    if (heroSection && navBrand) {
      const heroHeight = heroSection.offsetHeight;
      const scrollPosition = window.scrollY;

      if (scrollPosition >= heroHeight * 0.7) {
        navBrand.classList.remove("hidden");
      } else {
        navBrand.classList.add("hidden");
      }
    }
  }

  window.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll(); // Initial check on load in case page is refreshed while scrolled down

  const observerOptions = {
    root: null,
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.add("scroll-reveal");
    observer.observe(section);
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const successMsg =
        currentLang === "es"
          ? "¡Gracias! Tu mensaje ha sido enviado."
          : "Thank you! Your message has been sent.";
      alert(successMsg);
      contactForm.reset();
    });
  }
});
