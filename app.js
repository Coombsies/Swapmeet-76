// SwapMeet ’76 - Barter-only front-end glue
// Lightweight routing + basic interactions for static pages

document.addEventListener("DOMContentLoaded", () => {
  wireGlobalNav();
  wireHeroButtons();
});

// Attach simple logging / hooks for future expansion
function wireGlobalNav() {
  const navLinks = document.querySelectorAll(".sm76-nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      console.log("[SwapMeet76] Navigate:", link.getAttribute("href"));
    });
  });
}

function wireHeroButtons() {
  const primary = document.querySelector(".sm76-btn-primary");
  const outline = document.querySelector(".sm76-btn-outline");

  if (primary) {
    primary.addEventListener("click", () => {
      console.log("[SwapMeet76] Entering stalls view (home.html)");
    });
  }

  if (outline) {
    outline.addEventListener("click", () => {
      console.log("[SwapMeet76] Going to My Table (mytable.html)");
    });
  }
}

// Example: shared barter-only helpers you can reuse in pages

export function formatTradeSummary(offeredItems, requestedItem) {
  return {
    title: "Trade Offer",
    offeredCount: offeredItems.length,
    requestedTitle: requestedItem.title || "Requested Item",
    text: `${offeredItems.length} item(s) on your table for "${requestedItem.title}". Pure swap. No cash.`
  };
}

export function logSwapEvent(type, payload = {}) {
  console.log(`[SwapMeet76:${type}]`, payload);
}
