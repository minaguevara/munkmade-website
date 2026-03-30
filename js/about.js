/* ═══════════════════════════════════════════════════════════
   ABOUT SECTION — about.js
═══════════════════════════════════════════════════════════ */

const aboutObserverTargets = document.querySelectorAll(
  ".about-topbar, .about-left, .about-center, .about-right",
);

let aboutAnimated = false;

const aboutObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });

    if (!aboutAnimated) {
      const anyVisible = [...aboutObserverTargets].some((el) =>
        el.classList.contains("visible"),
      );
      if (anyVisible) {
        aboutAnimated = true;
        animateSkillBars();
        animateProgressBars();
        animateCircles();
        animateCounters();
      }
    }
  },
  { threshold: 0.1 },
);

aboutObserverTargets.forEach((el) => aboutObserver.observe(el));

function animateSkillBars() {
  document.querySelectorAll(".skill-bar-fill").forEach((bar, idx) => {
    const level = parseInt(bar.dataset.level, 10) || 0;
    setTimeout(() => {
      bar.style.width = level + "%";
    }, idx * 120);
  });
}

function animateProgressBars() {
  const MAX_LVL = 20;
  document.querySelectorAll(".prog-bar-fill").forEach((bar, idx) => {
    const lvl = parseInt(bar.dataset.lvl, 10) || 0;
    setTimeout(() => {
      bar.style.width = (lvl / MAX_LVL) * 100 + "%";
    }, idx * 100);
  });
}

function animateCircles() {
  const CIRCUMFERENCE = 238.8;
  document.querySelectorAll(".circle-progress").forEach((circle, idx) => {
    const pct = parseInt(circle.dataset.pct, 10) || 0;
    setTimeout(
      () => {
        circle.style.strokeDashoffset =
          CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;
      },
      idx * 200 + 400,
    );
  });
}

function animateCounters() {
  document
    .querySelectorAll(".fun-stat-num, .circle-pct-num, .prog-lvl-num")
    .forEach((el, idx) => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const duration = 1600;
      const startTime = performance.now() + idx * 60;
      function step(now) {
        if (now < startTime) {
          requestAnimationFrame(step);
          return;
        }
        const eased =
          1 - Math.pow(1 - Math.min((now - startTime) / duration, 1), 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (eased < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
}

/* Show char image once src is added */
const charImg = document.getElementById("charImg");
const charPlaceholder = document.getElementById("charPlaceholder");

function checkCharImage() {
  if (
    charImg &&
    charImg.getAttribute("src") &&
    charImg.getAttribute("src").trim() !== ""
  ) {
    charImg.removeAttribute("style");
    if (charPlaceholder) charPlaceholder.style.display = "none";
  }
}

checkCharImage();
