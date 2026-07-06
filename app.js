import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ---------------------------------------------------------
// SUPABASE CLIENT (REAL)
// ---------------------------------------------------------
export const supabase = createClient(
  "https://hustalahrlhzmxvvpwbc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1c3RhbGFocmxoem14dnZwd2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMjIxNjQsImV4cCI6MjA5ODg5ODE2NH0.sagiwkUiw2MKdCsJM7tOncTxRjjQZ_n2K004PgOC3Ns"
);

// ---------------------------------------------------------
// HYBRID MODE FALLBACK DATA
// ---------------------------------------------------------
const DEMO_TABLES = [
  { id: 1, name: "Retro Collector" },
  { id: 2, name: "Tool Trader" },
  { id: 3, name: "Sneakerhead" }
];

const DEMO_ITEMS = [
  {
    id: 101,
    table_id: 1,
    title: "Vintage Diecast Lot",
    description: "Hot Wheels, Matchbox, 70s–90s era.",
    condition: "Good",
    wants: ["Tools", "Retro Jackets"],
    image_url: "./assets/banners/map.png"
  },
  {
    id: 102,
    table_id: 2,
    title: "Jordan 1 Mid",
    description: "Clean pair, size 10.",
    condition: "Excellent",
    wants: ["Diecast", "Electronics"],
    image_url: "./assets/banners/map.png"
  },
  {
    id: 103,
    table_id: 3,
    title: "Vintage Tools Set",
    description: "Rustic but functional.",
    condition: "Fair",
    wants: ["Sports Gear"],
    image_url: "./assets/banners/map.png"
  }
];

const DEMO_TRADES = [
  {
    id: 9001,
    item_id: 101,
    offered_item_id: 103,
    status: "pending"
  }
];

// ---------------------------------------------------------
// BOOTSTRAP: RUN EVERYTHING, LET EACH PAGE NO-OP IF ELEMENTS MISSING
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  wireGlobalNav();

  loadStalls();
  loadTables();
  loadMyTable();
  loadTradeOffer();
  loadTradeInbox();
  loadProfile();
});

// ---------------------------------------------------------
// GLOBAL NAV LOGGING
// ---------------------------------------------------------
function wireGlobalNav() {
  document.querySelectorAll(".sm76-nav-link").forEach(link => {
    link.addEventListener("click", () => {
      console.log("[SwapMeet76] Navigate:", link.href);
    });
  });
}

// ---------------------------------------------------------
// PAGE: STALLS
// ---------------------------------------------------------
async function loadStalls() {
  const grid = document.getElementById("stallsGrid");
  if (!grid) return;

  let items = DEMO_ITEMS;

  try {
    const { data } = await supabase.from("items").select("*");
    if (data?.length) items = data;
  } catch (e) {
    console.warn("Supabase failed, using demo items.");
  }

  grid.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "sm76-card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <img src="${item.image_url}" style="width:100%; border-radius:6px;">
      <h3>${item.title}</h3>
      <p style="color:#b3b3b3;">Condition: ${item.condition}</p>
      <div>${item.wants.map(w => `<span class="sm76-pill">${w}</span>`).join("")}</div>
    `;

    card.onclick = () => {
      window.location.href = `trade.html?item=${item.id}`;
    };

    grid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: WALK THE AISLE
// ---------------------------------------------------------
async function loadTables() {
  const grid = document.getElementById("tablesGrid");
  if (!grid) return;

  let tables = DEMO_TABLES;

  try {
    const { data } = await supabase.from("swap_tables").select("*");
    if (data?.length) tables = data;
  } catch (e) {
    console.warn("Supabase failed, using demo tables.");
  }

  grid.innerHTML = "";

  tables.forEach(table => {
    const card = document.createElement("div");
    card.className = "sm76-card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <img src="./assets/banners/map.png" style="width:100%; border-radius:6px;">
      <h3>${table.name}</h3>
      <p style="color:#b3b3b3;">Stall ID: ${table.id}</p>
      <span class="sm76-pill">View Items</span>
    `;

    card.onclick = () => {
      window.location.href = `mytable.html?table=${table.id}`;
    };

    grid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: MY TABLE
// ---------------------------------------------------------
async function loadMyTable() {
  const grid = document.getElementById("myItemsGrid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const tableId = params.get("table") || 1;

  let items = DEMO_ITEMS.filter(i => i.table_id == tableId);

  try {
    const { data } = await supabase.from("items").select("*").eq("table_id", tableId);
    if (data?.length) items = data;
  } catch (e) {
    console.warn("Supabase failed, using demo items.");
  }

  grid.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "sm76-card";

    card.innerHTML = `
      <img src="${item.image_url}" style="width:100%; border-radius:6px;">
      <h3>${item.title}</h3>
      <p style="color:#b3b3b3;">${item.description}</p>
      <button class="sm76-btn sm76-btn-primary">Offer Trade</button>
    `;

    card.querySelector("button").onclick = () => {
      window.location.href = `trade.html?item=${item.id}`;
    };

    grid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: TRADE OFFER
// ---------------------------------------------------------
async function loadTradeOffer() {
  const itemView = document.getElementById("itemView");
  const yourItemsGrid = document.getElementById("yourItemsGrid");
  if (!itemView || !yourItemsGrid) return;

  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("item");

  let item = DEMO_ITEMS.find(i => i.id == itemId);

  try {
    const { data } = await supabase.from("items").select("*").eq("id", itemId).single();
    if (data) item = data;
  } catch (e) {
    console.warn("Supabase failed, using demo item.");
  }

  itemView.innerHTML = `
    <img src="${item.image_url}" style="width:100%; border-radius:6px;">
    <h3>${item.title}</h3>
    <p>${item.description}</p>
  `;

  let yourItems = DEMO_ITEMS.filter(i => i.table_id == 1);

  yourItemsGrid.innerHTML = "";

  yourItems.forEach(yItem => {
    const card = document.createElement("div");
    card.className = "sm76-card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <img src="${yItem.image_url}" style="width:100%; border-radius:6px;">
      <h3>${yItem.title}</h3>
      <p>${yItem.description}</p>
    `;

    card.onclick = async () => {
      try {
        await supabase.from("trades").insert([
          {
            item_id: item.id,
            offered_item_id: yItem.id,
            status: "pending"
          }
        ]);
      } catch (e) {
        console.warn("Supabase failed, demo only.");
      }

      alert("Trade offer sent!");
      window.location.href = "tradeinbox.html";
    };

    yourItemsGrid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: TRADE INBOX
// ---------------------------------------------------------
async function loadTradeInbox() {
  const grid = document.getElementById("tradesGrid");
  if (!grid) return;

  let trades = DEMO_TRADES;

  try {
    const { data } = await supabase.from("trades").select("*");
    if (data?.length) trades = data;
  } catch (e) {
    console.warn("Supabase failed, using demo trades.");
  }

  grid.innerHTML = "";

  trades.forEach(trade => {
    const requested = DEMO_ITEMS.find(i => i.id == trade.item_id);
    const offered = DEMO_ITEMS.find(i => i.id == trade.offered_item_id);

    const card = document.createElement("div");
    card.className = "sm76-card";

    card.innerHTML = `
      <h3>Trade Offer</h3>
      <p>Status: ${trade.status}</p>

      <h4>You Own:</h4>
      <img src="${requested.image_url}" style="width:100%; border-radius:6px;">
      <strong>${requested.title}</strong>

      <h4>They Offer:</h4>
      <img src="${offered.image_url}" style="width:100%; border-radius:6px;">
      <strong>${offered.title}</strong>

      <button class="sm76-btn sm76-btn-primary">Accept</button>
      <button class="sm76-btn sm76-btn-outline">Decline</button>
    `;

    const [acceptBtn, declineBtn] = card.querySelectorAll("button");

    acceptBtn.onclick = async () => {
      try {
        await supabase.from("trades").update({ status: "accepted" }).eq("id", trade.id);
      } catch (e) {
        console.warn("Supabase failed, demo only.");
      }

      alert("Trade accepted!");
      loadTradeInbox();
    };

    declineBtn.onclick = async () => {
      try {
        await supabase.from("trades").update({ status: "declined" }).eq("id", trade.id);
      } catch (e) {
        console.warn("Supabase failed, demo only.");
      }

      alert("Trade declined.");
      loadTradeInbox();
    };

    grid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: PROFILE
// ---------------------------------------------------------
function loadProfile() {
  const root = document.getElementById("profileRoot");
  if (!root) return;

  console.log("[SwapMeet76] Profile loaded.");
}
