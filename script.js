/* ==========================================================
   PROLAB Cyber Summit 2026 - script.js
   ========================================================== */

/* ----------------------------------------------------------
   EDITABLE EVENT SETTINGS
   Leave a URL as "" to keep its button disabled.
   ---------------------------------------------------------- */
const EVENT_CONFIG = {
  ctfApplicationUrl: "",            // CTF team application form (e.g. Google Form)
  ctfApplicationLabel: "CTF başvurusunu aç",
  summitApplicationUrl: "",         // summit participation application form
  summitApplicationLabel: "Zirve başvurusunu aç",
  ctfUrl: "",                       // e.g. the CTFd platform link
  ctfOpenLabel: "Yarışma platformuna git"
};

/* ----------------------------------------------------------
   ANALYTICS SETTINGS
   This is a static site, so it has no server to count visitors.
   Counting is done by GoatCounter (goatcounter.com, free for
   non-commercial use). Create an account, pick a site code, and
   paste it here: "prolab" becomes https://prolab.goatcounter.com
   While this is "", NOTHING is loaded or collected, even if the
   visitor accepts cookies.
   ---------------------------------------------------------- */
const ANALYTICS_CONFIG = {
  goatcounterCode: ""
};

const CONSENT_KEY = "prolab_consent";   // value: "accepted" or "rejected"
const CONSENT_DAYS = 180;

/* ---------- Disabled <-> active link state ---------- */
function activateLink(element, url, label) {
  if (!element || !url) return;
  element.href = url;
  element.target = "_blank";
  element.rel = "noopener noreferrer";
  element.textContent = label;
  element.classList.remove("btn-disabled");
  element.classList.add("btn-primary");
  element.removeAttribute("aria-disabled");
}

function initEventLinks() {
  activateLink(document.getElementById("ctfApplyLink"), EVENT_CONFIG.ctfApplicationUrl, EVENT_CONFIG.ctfApplicationLabel);
  activateLink(document.getElementById("summitApplyLink"), EVENT_CONFIG.summitApplicationUrl, EVENT_CONFIG.summitApplicationLabel);
  activateLink(document.getElementById("ctfLink"), EVENT_CONFIG.ctfUrl, EVENT_CONFIG.ctfOpenLabel);
}

/* ---------- Logo fallback: show a text wordmark if the image is missing ---------- */
function initLogoFallback() {
  document.querySelectorAll(".brand").forEach((brand) => {
    const img = brand.querySelector(".brand-logo");
    if (!img) return;
    const showWordmark = () => brand.classList.add("no-logo");
    if (img.complete && img.naturalWidth === 0) showWordmark();
    img.addEventListener("error", showWordmark);
  });
}

/* ---------- Mobile navigation ---------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function setOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  }

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* ---------- Program day tabs (arrow keys, Home, End supported) ---------- */
function initProgramTabs() {
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  if (tabs.length === 0) return;

  function selectTab(selected) {
    tabs.forEach((tab) => {
      const isActive = tab === selected;
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !isActive;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next = null;
      if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
      if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === "Home") next = tabs[0];
      if (event.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        event.preventDefault();
        selectTab(next);
        next.focus();
      }
    });
  });
}

/* ---------- Example CTF puzzle: show / hide answer ---------- */
function initPuzzle() {
  const button = document.getElementById("flagToggle");
  const answer = document.getElementById("flagAnswer");
  if (!button || !answer) return;

  button.addEventListener("click", () => {
    const willShow = answer.hidden;
    answer.hidden = !willShow;
    button.setAttribute("aria-expanded", String(willShow));
    button.textContent = willShow ? "Çözümü gizle" : "Çözümü göster";
  });
}

/* ==========================================================
   Background: falling 0/1 digits (canvas)
   - Digits near the pointer glow brighter and fall faster.
   - Capped at ~30 fps, paused when the tab is hidden.
   - With reduced motion: one static frame, no animation.
   ========================================================== */
function initMatrix() {
  const canvas = document.getElementById("matrix");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const FONT_SIZE = 18;
  const POINTER_RADIUS = 140;
  const FRAME_MS = 33;
  const BG = "rgba(10, 18, 36, ";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0, height = 0, drops = [], speeds = [];
  const pointer = { x: -9999, y: -9999 };
  let lastFrame = 0, rafId = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = BG + "1)";
    ctx.fillRect(0, 0, width, height);
    const columns = Math.ceil(width / FONT_SIZE);
    drops = Array.from({ length: columns }, () => Math.random() * (height / FONT_SIZE));
    speeds = Array.from({ length: columns }, () => 0.35 + Math.random() * 0.5);
    ctx.font = FONT_SIZE + 'px "IBM Plex Mono", ui-monospace, Consolas, monospace';
    if (reduceMotion) drawStaticFrame();
  }

  function randomBit() { return Math.random() < 0.5 ? "0" : "1"; }

  function drawStaticFrame() {
    ctx.fillStyle = BG + "1)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "rgba(45, 212, 207, 0.18)";
    for (let i = 0; i < drops.length; i++) {
      for (let y = 0; y < height; y += FONT_SIZE * 3) {
        if (Math.random() < 0.5) ctx.fillText(randomBit(), i * FONT_SIZE, y + Math.random() * FONT_SIZE);
      }
    }
  }

  function drawFrame(now) {
    rafId = requestAnimationFrame(drawFrame);
    if (now - lastFrame < FRAME_MS) return;
    lastFrame = now;

    ctx.fillStyle = BG + "0.1)"; // fading overlay creates the trails
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < drops.length; i++) {
      const x = i * FONT_SIZE;
      const y = drops[i] * FONT_SIZE;
      const near = Math.hypot(x - pointer.x, y - pointer.y) < POINTER_RADIUS;

      ctx.fillStyle = near ? "rgba(94, 234, 212, 0.95)" : "rgba(45, 212, 207, 0.3)";
      ctx.fillText(randomBit(), x, y);

      drops[i] += near ? speeds[i] * 3 : speeds[i];
      if (y > height && Math.random() > 0.975) drops[i] = 0;
    }
  }

  function start() { if (!rafId && !reduceMotion) rafId = requestAnimationFrame(drawFrame); }
  function stop() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", () => { pointer.x = pointer.y = -9999; });
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));

  resize();
  start();
}

/* ==========================================================
   Cookie consent + analytics
   ========================================================== */
function readConsent() {
  const match = document.cookie.match(new RegExp("(?:^|; )" + CONSENT_KEY + "=([^;]*)"));
  if (match) return decodeURIComponent(match[1]);
  try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
}

function saveConsent(value) {
  const maxAge = CONSENT_DAYS * 24 * 60 * 60;
  document.cookie = CONSENT_KEY + "=" + value + "; max-age=" + maxAge + "; path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
  try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* storage may be blocked */ }
}

let analyticsLoaded = false;

function loadAnalytics() {
  if (analyticsLoaded || !ANALYTICS_CONFIG.goatcounterCode) return;
  analyticsLoaded = true;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = "https://" + ANALYTICS_CONFIG.goatcounterCode + ".goatcounter.com/count";
  document.head.appendChild(script);
}

/* Records one interaction, only if the visitor accepted and analytics is loaded. */
function trackEvent(name) {
  if (readConsent() !== "accepted") return;
  if (window.goatcounter && typeof window.goatcounter.count === "function") {
    window.goatcounter.count({ path: "etkilesim/" + name, title: name, event: true });
  }
}

function initTracking() {
  // Clicks on anything marked with data-track="event-name"
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-track]");
    if (target && target.tagName !== "DETAILS") trackEvent(target.dataset.track);
  });
  // FAQ items: record only when opened
  document.querySelectorAll("details[data-track]").forEach((item) => {
    item.addEventListener("toggle", () => { if (item.open) trackEvent(item.dataset.track); });
  });
}

function initConsent() {
  const banner = document.getElementById("cookieBanner");
  const dialog = document.getElementById("policyDialog");
  if (!banner || !dialog) return;

  function showBanner() { banner.hidden = false; }
  function hideBanner() { banner.hidden = true; }

  function choose(value) {
    saveConsent(value);
    hideBanner();
    if (value === "accepted") loadAnalytics();
  }

  document.getElementById("cookieAccept").addEventListener("click", () => choose("accepted"));
  document.getElementById("cookieReject").addEventListener("click", () => choose("rejected"));

  document.querySelectorAll("[data-open-policy]").forEach((btn) => btn.addEventListener("click", () => dialog.showModal()));
  document.querySelectorAll("[data-open-consent]").forEach((btn) => btn.addEventListener("click", showBanner));
  document.getElementById("policyClose").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); }); // click on backdrop

  const saved = readConsent();
  if (saved === "accepted") loadAnalytics();
  else if (saved !== "rejected") showBanner();
}

document.addEventListener("DOMContentLoaded", () => {
  initEventLinks();
  initLogoFallback();
  initMobileNav();
  initProgramTabs();
  initPuzzle();
  initMatrix();
  initConsent();
  initTracking();
});