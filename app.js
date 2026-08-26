(() => {
  const cfg = window.ELEMENTAL_CONFIG || {};
  const ios = document.getElementById("iosDownload");

  if (ios && cfg.testFlightUrl) {
    ios.href = cfg.testFlightUrl;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".download-card, .install-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(16px)";
    card.style.transition = "opacity 450ms ease, transform 450ms ease";
    observer.observe(card);
  });
})();
