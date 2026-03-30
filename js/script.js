/* ═══════════════════════════════════════════════════════════
   SCRIPT.JS — MUNKMADE Portfolio
═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   ELEMENT REFERENCES
───────────────────────────────────────── */
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");
const heroWrapper = document.getElementById("heroImageWrapper");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const mobileLinks = document.querySelectorAll(".mobile-link");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a");
const renderImg = document.querySelector(".hero-img.render");
const riggingImg = document.querySelector(".hero-img.rigging");
const placeholder = document.getElementById("heroPlaceholder");

/* ─────────────────────────────────────────
   CUSTOM CURSOR
   Dot snaps instantly; ring lags behind
───────────────────────────────────────── */
let mouseX = 0,
  mouseY = 0;
let ringX = 0,
  ringY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (cursor) {
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  }

  updateFlashlight(e);
});

/* Smoothly lagged ring follows cursor */
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  if (cursorRing) {
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
  }

  requestAnimationFrame(animateRing);
}
animateRing();

/* Expand cursor on interactive elements */
const hoverTargets = document.querySelectorAll(
  "a, button, .hero-image-wrapper",
);
hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () => {
    if (cursor) cursor.classList.add("hovering");
    if (cursorRing) cursorRing.classList.add("hovering");
  });
  el.addEventListener("mouseleave", () => {
    if (cursor) cursor.classList.remove("hovering");
    if (cursorRing) cursorRing.classList.remove("hovering");
  });
});

/* ─────────────────────────────────────────
   FLASHLIGHT v4 — Wobbly ring + matching clip-path
   Rigging sits on TOP and is clipped to the
   wobbly polygon. Render shows fully underneath.
   Canvas draws matching ring stroke on the edge.
───────────────────────────────────────── */

const FLASH_RADIUS = 150; /* reveal circle size in px */
const RING_POINTS = 120; /* smoothness — higher = smoother */

/* ── Canvas for the decorative ring stroke ── */
const flashCanvas = document.createElement("canvas");
flashCanvas.style.cssText =
  "position:absolute;inset:0;pointer-events:none;z-index:10;";
if (heroWrapper) heroWrapper.appendChild(flashCanvas);

function resizeFlashCanvas() {
  if (!heroWrapper) return;
  const rect = heroWrapper.getBoundingClientRect();
  flashCanvas.width = Math.round(rect.width);
  flashCanvas.height = Math.round(rect.height * 0.7);
}
resizeFlashCanvas();
window.addEventListener("resize", resizeFlashCanvas);

let flashActive = false;
let flashX = 0;
let flashY = 0;

/* ── Shared point generator ── */
function getWobblePoints(cx, cy, timestamp) {
  const t = timestamp * 0.0007;
  const pts = [];

  for (let i = 0; i <= RING_POINTS; i++) {
    const angle = (i / RING_POINTS) * Math.PI * 2;

    const warp =
      Math.sin(angle * 4 + t * 2.2) * 9 +
      Math.sin(angle * 9 - t * 3.5) * 5 +
      Math.sin(angle * 15 + t * 1.3) * 2;

    const r = FLASH_RADIUS + warp;
    pts.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    });
  }

  return pts;
}

/* ── Animation loop ── */
function drawFlashRing(timestamp) {
  const ctx = flashCanvas.getContext("2d");
  const w = flashCanvas.width;
  const h = flashCanvas.height;

  ctx.clearRect(0, 0, w, h);

  if (flashActive && riggingImg) {
    const pts = getWobblePoints(flashX, flashY, timestamp);

    /* 1. Clip the RIGGING image to the wobbly polygon */
    const clipStr = pts.map((p) => `${p.x}px ${p.y}px`).join(", ");
    riggingImg.style.clipPath = `polygon(${clipStr})`;
    riggingImg.style.webkitClipPath = `polygon(${clipStr})`;

    /* 2. Draw the matching ring stroke on canvas */
    ctx.beginPath();
    pts.forEach((p, i) =>
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y),
    );
    ctx.closePath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    /* Faint inner glow ring */
    ctx.beginPath();
    pts.forEach((p, i) => {
      const angle = (i / RING_POINTS) * Math.PI * 2;
      const warp =
        Math.sin(angle * 4 + timestamp * 0.0007 * 2.2) * 9 +
        Math.sin(angle * 9 - timestamp * 0.0007 * 3.5) * 5 +
        Math.sin(angle * 15 + timestamp * 0.0007 * 1.3) * 2;
      const r = FLASH_RADIUS + warp - 6;
      const ix = flashX + Math.cos(angle) * r;
      const iy = flashY + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(ix, iy) : ctx.lineTo(ix, iy);
    });
    ctx.closePath();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 4;
    ctx.stroke();
  } else if (riggingImg) {
    /* Collapse clip to nothing when not hovering */
    riggingImg.style.clipPath = "circle(0px at 0px 0px)";
    riggingImg.style.webkitClipPath = "circle(0px at 0px 0px)";
  }

  requestAnimationFrame(drawFlashRing);
}
requestAnimationFrame(drawFlashRing);
resetFlashlight(); /* hide rigging on load */

/* ── Update position on mousemove ── */
function updateFlashlight(e) {
  if (!heroWrapper || !riggingImg) return;

  const rect = heroWrapper.getBoundingClientRect();

  const overHero =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top + 76 &&
    e.clientY <= rect.top + rect.height * 0.7;

  if (!overHero) {
    resetFlashlight();
    return;
  }

  flashX = e.clientX - rect.left;
  flashY = e.clientY - rect.top;
  flashActive = true;
}

function resetFlashlight() {
  flashActive = false;
  if (!riggingImg) return;
  riggingImg.style.clipPath = "circle(0px at 0px 0px)";
  riggingImg.style.webkitClipPath = "circle(0px at 0px 0px)";
}

/* ── Hide/restore cursor when entering/leaving hero ── */
/* if (heroWrapper) {
  heroWrapper.addEventListener("mouseenter", () => {
    if (cursor) cursor.style.opacity = "0";
    if (cursorRing) cursorRing.style.opacity = "0";
  });

  heroWrapper.addEventListener("mouseleave", () => {
    if (cursor) cursor.style.opacity = "1";
    if (cursorRing) cursorRing.style.opacity = "1";
    resetFlashlight();
  });
} */

function updateFlashlight(e) {
  if (!heroWrapper || !riggingImg) return;

  const rect = heroWrapper.getBoundingClientRect();

  const overHero =
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top + 76 &&
    e.clientY <= rect.top + rect.height * 0.7;

  // Hide cursor only when over the image, show it in the cream area below
  if (cursor) cursor.style.opacity = overHero ? "0" : "1";
  if (cursorRing) cursorRing.style.opacity = overHero ? "0" : "1";

  if (!overHero) {
    resetFlashlight();
    return;
  }

  flashX = e.clientX - rect.left;
  flashY = e.clientY - rect.top;
  flashActive = true;
}

/* ─────────────────────────────────────────
   MOBILE TOUCH — tap to reveal rigging
───────────────────────────────────────── */
let touchActive = false;

if (heroWrapper) {
  heroWrapper.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      touchActive = !touchActive;
      heroWrapper.classList.toggle("touched", touchActive);
    },
    { passive: false },
  );
}

/* ─────────────────────────────────────────
   HAMBURGER / MOBILE NAV
───────────────────────────────────────── */
if (hamburger && mobileNav) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
}

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

/* ─────────────────────────────────────────
   NAV ACTIVE STATE ON SCROLL
───────────────────────────────────────── */
function updateActiveNav() {
  const scrollY = window.scrollY + window.innerHeight / 3;

  sections.forEach((section) => {
    if (
      scrollY >= section.offsetTop &&
      scrollY < section.offsetTop + section.offsetHeight
    ) {
      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${section.id}`,
        );
      });
    }
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });

/* ─────────────────────────────────────────
   SMOOTH SCROLL WITH HEADER OFFSET
   Accounts for the fixed 76px cream bar
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = 76;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top: targetTop, behavior: "smooth" });
  });
});

/* ─────────────────────────────────────────
   HIDE PLACEHOLDER ONCE IMAGES ARE ADDED
───────────────────────────────────────── */
function checkImages() {
  if (!renderImg || !placeholder) return;

  const renderSrc = renderImg.getAttribute("src");
  if (renderSrc && renderSrc.trim() !== "") {
    renderImg.removeAttribute("style");
    if (riggingImg) riggingImg.removeAttribute("style");
    placeholder.style.display = "none";
    /* Re-hide rigging after placeholder removal */
    resetFlashlight();
  }
}

checkImages();
