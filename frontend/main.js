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

    const phoneInput = document.getElementById("phone");
    if (phoneInput) {
      phoneInput.placeholder = lang === "es" ? "813-325-6717" : "813-325-6717";
    }

    const messageInput = document.getElementById("message");
    if (messageInput) {
      messageInput.placeholder =
        lang === "es"
          ? "¿Tienes alguna preferencia de fecha o consulta?"
          : "Do you have any preferred dates or inquiries?";
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.add("hidden");
    }
  }

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
  checkScroll();

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

      const nameVal = (document.getElementById("name")?.value || "").trim();
      const emailVal = (document.getElementById("email")?.value || "").trim();
      const phoneVal = (document.getElementById("phone")?.value || "").trim();
      const messageVal = (
        document.getElementById("message")?.value || ""
      ).trim();

      // Requires at least 2 alphabetic characters
      const nameAlphaCount = (nameVal.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/g) || [])
        .length;
      if (nameAlphaCount < 2) {
        alert(
          currentLang === "es"
            ? "Por favor, ingresa un nombre válido (mínimo 2 letras)."
            : "Please enter a valid name (at least 2 letters).",
        );
        return;
      }

      const isEmailValid = emailVal.includes("@") && emailVal.includes(".");
      const phoneDigitsCount = (phoneVal.match(/\d/g) || []).length;
      const isPhoneValid = phoneDigitsCount >= 10;

      if (!isEmailValid && !isPhoneValid) {
        alert(
          currentLang === "es"
            ? "Por favor, ingresa un correo o teléfono válido."
            : "Please enter a valid email address or phone number.",
        );
        return;
      }

      const msgAlphaCount = (messageVal.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/g) || [])
        .length;
      if (msgAlphaCount < 4) {
        alert(
          currentLang === "es"
            ? "Por favor, cuéntanos cómo podemos ayudarte."
            : "Please let us know how we can help you.",
        );
        return;
      }

      const formData = new FormData(contactForm);
      if (!formData.has("access_key")) {
        formData.append("access_key", "5ba50879-b283-4a7c-adcc-52bc6e9ca179");
      }

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          const json = await response.json();
          if (response.status === 200 && json.success) {
            const successMsg =
              currentLang === "es"
                ? "¡Gracias! Tu mensaje ha sido enviado."
                : "Thank you! Your message has been sent.";
            alert(successMsg);
            contactForm.reset();
          } else {
            alert(json.message || "An error occurred.");
          }
        })
        .catch(() => {
          alert(
            currentLang === "es"
              ? "Hubo un error al enviar el mensaje."
              : "An error occurred while sending the message.",
          );
        });
    });
  }
});
