/* ═══════════════════════════════════════════════════════════
   CONTACT SECTION — script.js additions
   Append this entire block to the bottom of your script.js
═══════════════════════════════════════════════════════════ */

/* ─── Auto year in footer ─── */
const contactYear = document.getElementById("contactYear");
if (contactYear) contactYear.textContent = new Date().getFullYear();

/* ─── Scroll-triggered entrance animations ─── */
const contactAnimEls = document.querySelectorAll(
  ".contact-tag, .ch-line, .contact-sub, .contact-cta, " +
    ".contact-email-display, .contact-divider, .contact-socials",
);

const contactObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        contactObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

contactAnimEls.forEach((el) => contactObserver.observe(el));
