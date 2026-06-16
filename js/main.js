// ── main.js ────────────────────────────────────────────────────────
// All UI interactions. Firebase calls are done via dynamic import so
// the page still works even before Firebase is configured.
// ──────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // ── Copyright year ────────────────────────────────────────
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Mobile nav toggle ─────────────────────────────────────
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks  = document.querySelector(".nav-links");
  
  if (navToggle && navLinks) {
    // Toggle menu on button click
    navToggle.addEventListener("click", function(e) {
      e.stopPropagation();
      navLinks.classList.toggle("open");
    });
    
    // Close menu function
    function closeMenu() {
      navLinks.classList.remove("open");
    }
    
    // Close menu when a link is clicked - use setTimeout to ensure it happens after scroll
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", function() {
        // Small delay to ensure the click event completes
        setTimeout(closeMenu, 100);
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener("click", function(e) {
      if (navLinks.classList.contains("open")) {
        if (!navLinks.contains(e.target) && e.target !== navToggle && !navToggle.contains(e.target)) {
          closeMenu();
        }
      }
    });
  }

  // ── Set min booking date to today ─────────────────────────
  const dateInput = document.getElementById("bDate");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
  }

  // ── Star rating picker ────────────────────────────────────
  let selectedStars = 0;
  const starPicker = document.getElementById("starPicker");
  const starsInput = document.getElementById("rStars");

  if (starPicker) {
    const starBtns = starPicker.querySelectorAll("button");

    starBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedStars = parseInt(btn.dataset.star);
        if (starsInput) starsInput.value = selectedStars;
        starBtns.forEach((b, i) =>
          b.classList.toggle("lit", i < selectedStars)
        );
      });

      btn.addEventListener("mouseenter", () => {
        const hover = parseInt(btn.dataset.star);
        starBtns.forEach((b, i) => b.classList.toggle("lit", i < hover));
      });
    });

    starPicker.addEventListener("mouseleave", () => {
      starBtns.forEach((b, i) =>
        b.classList.toggle("lit", i < selectedStars)
      );
    });
  }

  // ── Helper: toggle button loading state ──────────────────
  function setLoading(btn, loading) {
    const text = btn.querySelector(".btn-text");
    const load = btn.querySelector(".btn-loading");
    btn.disabled = loading;
    text?.classList.toggle("hidden", loading);
    load?.classList.toggle("hidden", !loading);
  }

  // ── Helper: show/hide feedback ────────────────────────────
  function showMsg(id, show = true) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("hidden", !show);
  }

  // ── Booking form ──────────────────────────────────────────
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name    = document.getElementById("bName")?.value.trim();
      const phone   = document.getElementById("bPhone")?.value.trim();
      const service = document.getElementById("bService")?.value;
      const date    = document.getElementById("bDate")?.value;
      const message = document.getElementById("bNote")?.value.trim();

      // Basic validation
      if (!name || !phone || !service || !date) {
        alert("Please fill in all required fields.");
        return;
      }

      const btn = document.getElementById("bookingBtn");
      setLoading(btn, true);
      showMsg("bookingSuccess", false);
      showMsg("bookingError", false);

      try {
        // Dynamic import so page loads even without Firebase configured
        const { saveBooking } = await import("./firebase.js");
        await saveBooking({ name, phone, service, date, message });

        showMsg("bookingSuccess", true);
        bookingForm.reset();
      } catch (err) {
        console.error("Booking error:", err);
        showMsg("bookingError", true);
      } finally {
        setLoading(btn, false);
      }
    });
  }

  // ── Review form ───────────────────────────────────────────
  const reviewForm = document.getElementById("reviewForm");
  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name    = document.getElementById("rName")?.value.trim();
      const review  = document.getElementById("rText")?.value.trim();
      const service = document.getElementById("rService")?.value;
      const stars   = parseInt(document.getElementById("rStars")?.value || "0");

      if (!name || !review || stars < 1) {
        alert("Please fill in your name, review, and star rating.");
        return;
      }

      const btn = document.getElementById("reviewBtn");
      setLoading(btn, true);
      showMsg("reviewSuccess", false);
      showMsg("reviewError", false);

      try {
        const { saveReview } = await import("./firebase.js");
        await saveReview({ name, review, service, stars });

        // Optimistically add to grid (pending approval note)
        addReviewCard({ name, review, stars, pending: true });

        showMsg("reviewSuccess", true);
        reviewForm.reset();
        selectedStars = 0;
        document.querySelectorAll("#starPicker button").forEach(b => b.classList.remove("lit"));
      } catch (err) {
        console.error("Review error:", err);
        showMsg("reviewError", true);
      } finally {
        setLoading(btn, false);
      }
    });
  }

  // ── Add review card to grid ───────────────────────────────
  function addReviewCard({ name, review, stars, pending = false }) {
    const grid = document.getElementById("reviewsGrid");
    if (!grid) return;

    const card = document.createElement("div");
    card.className = "review-card";

    const starStr = "★".repeat(stars) + "☆".repeat(5 - stars);
    card.innerHTML = `
      <div class="review-stars">${starStr}</div>
      <p class="review-text">"${escapeHtml(review)}"</p>
      <div class="reviewer">${escapeHtml(name)}${pending ? ' <span style="font-size:11px;color:var(--text-muted);">(pending approval)</span>' : ''}</div>
    `;
    grid.prepend(card);
  }

  // ── Load Firebase reviews on page load ────────────────────
  async function loadFirebaseReviews() {
    try {
      const { loadReviews } = await import("./firebase.js");
      const reviews = await loadReviews();
      reviews.forEach(r => addReviewCard({ name: r.name, review: r.review, stars: r.stars }));
    } catch {
      // Silent — seeded reviews already show
    }
  }
  loadFirebaseReviews();

  // ── Smooth scroll for all anchor links ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        // Close mobile menu first
        const navLinks = document.querySelector(".nav-links");
        if (navLinks) {
          navLinks.classList.remove("open");
        }
        // Then scroll
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    });
  });

  // ── Utility: escape HTML for user content ─────────────────
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

});