/* ═══════════════════════════════════════════════════════════
   WORK SECTION — script.js additions
   Append this entire block to the bottom of your script.js
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   STAGGERED CARD ENTRANCE ON SCROLL
───────────────────────────────────────── */
const projCards = document.querySelectorAll('.proj-card');

const workObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger each card based on its position in the grid
      const idx = [...projCards].indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 90);
      workObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

projCards.forEach(card => workObserver.observe(card));

/* ─────────────────────────────────────────
   HIDE PLACEHOLDER WHEN IMAGE IS LOADED
   Works for images added via src attribute
───────────────────────────────────────── */
projCards.forEach(card => {
  const img = card.querySelector('.proj-img');
  const placeholder = card.querySelector('.proj-placeholder');
  if (!img || !placeholder) return;

  function checkProjImg() {
    if (img.getAttribute('src') && img.getAttribute('src').trim() !== '') {
      placeholder.style.display = 'none';
    }
  }

  checkProjImg();
  img.addEventListener('load', checkProjImg);
});