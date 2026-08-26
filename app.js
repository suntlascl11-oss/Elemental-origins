// ELEMENTAL download portal configuration.
//
// When your final iOS TestFlight build exists, replace this value
// with the public TestFlight invitation URL for ELEMENTAL.
const ELEMENTAL_TESTFLIGHT_URL = "https://testflight.apple.com/";

const iosButton = document.querySelector("[data-ios-link]");

if (iosButton) {
  iosButton.href = ELEMENTAL_TESTFLIGHT_URL;
}

// Smoothly reveal download cards.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".download-card, .install-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(18px)";
  card.style.transition = "opacity 450ms ease, transform 450ms ease";
  observer.observe(card);
});
