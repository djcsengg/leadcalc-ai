(function () {
  function initLeadCalc() {
    const containers = document.querySelectorAll("[data-calc]");
    containers.forEach(function (container) {
      if (container.getAttribute("data-leadcalc-initialized")) return;

      const slug = container.getAttribute("data-calc");
      if (!slug) return;

      // Extract script origin or default to current origin
      const currentScript = document.currentScript || document.querySelector('script[src*="embed.js"]');
      let origin = "";
      if (currentScript && currentScript.src) {
        const url = new URL(currentScript.src);
        origin = url.origin;
      } else {
        origin = window.location.origin;
      }

      const iframe = document.createElement("iframe");
      iframe.src = origin + "/embed/" + encodeURIComponent(slug);
      iframe.style.width = "100%";
      iframe.style.minHeight = "620px";
      iframe.style.border = "none";
      iframe.style.borderRadius = "16px";
      iframe.style.boxShadow = "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)";
      iframe.style.overflow = "hidden";
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("title", "LeadCalc AI Widget");

      // Auto-resize listener
      window.addEventListener("message", function (event) {
        if (event.origin !== origin) return;
        if (event.data && event.data.type === "leadcalc-resize" && event.data.slug === slug) {
          iframe.style.height = event.data.height + "px";
        }
      });

      container.innerHTML = "";
      container.appendChild(iframe);
      container.setAttribute("data-leadcalc-initialized", "true");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLeadCalc);
  } else {
    initLeadCalc();
  }
})();
