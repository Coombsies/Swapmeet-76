import { createClient } from "https://esm.sh/@supabase/supabase-js";

// SINGLE Supabase client — the only one
export const supabase = createClient(
  "https://hustalahrlhzmxxvpwbc.supabase.co",
  "YOUR_PUBLIC_ANON_KEY"
);

// ---------------------------
// Your functions go BELOW this
// ---------------------------

export async function createSwapTable(name) {
  const { data, error } = await supabase
    .from("swap_tables")
    .insert([{ name }]);

  if (error) throw error;
  return data[0];
}

export async function addItem(tableId, title, description, imageUrl) {
  const { data, error } = await supabase
    .from("items")
    .insert([{ 
      table_id: tableId,
      title,
      description,
      image_url: imageUrl
    }]);

  if (error) throw error;
  return data[0];
}

// SwapMeet ’76 - Barter-only front-end glue
// Lightweight routing + basic interactions for static pages

document.addEventListener("DOMContentLoaded", () => {
  wireGlobalNav();
  wireHeroButtons();
  wireTradeModal();
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

function formatTradeSummary(offeredItems, requestedItem) {
  return {
    title: "Trade Offer",
    offeredCount: offeredItems.length,
    requestedTitle: requestedItem.title || "Requested Item",
    text: `${offeredItems.length} item(s) on your table for "${requestedItem.title}". Pure swap. No cash.`
  };
}

function logSwapEvent(type, payload = {}) {
  console.log(`[SwapMeet76:${type}]`, payload);
}

// ---------------------------------------------------------
// TRADE MODAL LOGIC
// ---------------------------------------------------------

function wireTradeModal() {
  const tradeModal = document.getElementById("tradeModal");
  const closeModal = document.getElementById("closeModal");
  const modalItemName = document.getElementById("modalItemName");
  const modalItemCondition = document.getElementById("modalItemCondition");
  const modalWants = document.getElementById("modalWants");
  const modalYourItems = document.getElementById("modalYourItems");

  if (!tradeModal) {
    console.log("[SwapMeet76] No modal found on this page.");
    return;
  }

  const yourItems = [
    { name: "Hot Wheels RLC Camaro", condition: "Excellent" },
    { name: "Vintage Fishing Lures", condition: "Good" },
    { name: "Retro Tool Set", condition: "Fair" }
  ];

  document.querySelectorAll(".sm76-card").forEach(card => {
    card.addEventListener("click", () => {
      const itemName = card.querySelector("h3")?.innerText || "Item";
      const itemCondition = card.querySelector("p")?.innerText || "Condition: Unknown";

      modalItemName.innerText = itemName;
      modalItemCondition.innerText = itemCondition;

      modalWants.innerHTML = "";
      card.querySelectorAll(".sm76-pill").forEach(pill => {
        modalWants.innerHTML += `<span class="sm76-pill">${pill.innerText}</span>`;
      });

      modalYourItems.innerHTML = "";
      yourItems.forEach(item => {
        modalYourItems.innerHTML += `
          <div class="sm76-card" style="margin-bottom:10px; cursor:pointer;">
            <strong>${item.name}</strong>
            <p style="color:#b3b3b3;">Condition: ${item.condition}</p>
          </div>
        `;
      });

      tradeModal.style.display = "block";
    });
  });

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      tradeModal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === tradeModal) {
      tradeModal.style.display = "none";
    }
  });
}
