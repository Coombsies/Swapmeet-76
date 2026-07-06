import { createClient } from "https://esm.sh/@supabase/supabase-js";

// ---------------------------------------------------------
// SUPABASE CLIENT (REAL)
// ---------------------------------------------------------
export const supabase = createClient(
  "https://hustalahrlhzmxxvpwbc.supabase.co",
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
    image_url: "../assets/banners/map.png"
  },
  {
    id: 102,
    table_id: 2,
    title: "Jordan 1 Mid",
    description: "Clean pair, size 10.",
    condition: "Excellent",
    wants: ["Diecast", "Electronics"],
    image_url: "../assets/banners/map.png"
  },
  {
    id: 103,
    table_id: 3,
    title: "Vintage Tools Set",
    description: "Rustic but functional.",
    condition: "Fair",
    wants: ["Sports Gear"],
    image_url: "../assets/banners/map.png"
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

  // These will only do work if their target elements exist on the page.
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
// PAGE: STALLS (home/index)
// Needs: <div id="stallsGrid">
// ---------------------------------------------------------
async function loadStalls() {
  const grid = document.getElementById("stallsGrid");
  if (!grid) return;

  console.log("[SwapMeet76] Loading stalls…");

  let items = DEMO_ITEMS;

  try {
    const { data, error } = await supabase.from("items").select("*");
    if (!error && data?.length) items = data;
  } catch (e) {
    console.warn("[SwapMeet76] Supabase items failed, using demo.", e);
  }

  grid.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "sm76-card";
    card.style.cursor = "pointer";

    const wantsHtml = item.wants
      ? item.wants.map(w => `<span class="sm76-pill">${w}</span>`).join("")
      : "";

    card.innerHTML = `
      <img src="${item.image_url}" style="width:100%; border-radius:6px; margin-bottom:10px;">
      <h3>${item.title}</h3>
      <p style="color:#b3b3b3;">Condition: ${item.condition || "Unknown"}</p>
      <div>${wantsHtml}</div>
    `;

    card.onclick = () => {
      window.location.href = `trade.html?item=${item.id}`;
    };

    grid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: WALK THE AISLE (walkaisle.html)
// Needs: <div id="tablesGrid">
// ---------------------------------------------------------
async function loadTables() {
  const grid = document.getElementById("tablesGrid");
  if (!grid) return;

  console.log("[SwapMeet76] Loading tables…");

  let tables = DEMO_TABLES;

  try {
    const { data, error } = await supabase.from("swap_tables").select("*");
    if (!error && data?.length) tables = data;
  } catch (e) {
    console.warn("[SwapMeet76] Supabase tables failed, using demo.", e);
  }

  grid.innerHTML = "";

  tables.forEach(table => {
    const card = document.createElement("div");
    card.className = "sm76-card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <img src="../assets/banners/map.png"
           style="width:100%; border-radius:6px; margin-bottom:10px;">
      <h3 style="margin:0 0 6px;">${table.name}</h3>
      <p style="color:#b3b3b3; margin:0 0 10px;">
        Stall ID: ${table.id}
      </p>
      <span class="sm76-pill">View Items</span>
    `;

    card.onclick = () => {
      window.location.href = `mytable.html?table=${table.id}`;
    };

    grid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: MY TABLE (mytable.html)
// Needs: <div id="myItemsGrid">
// ---------------------------------------------------------
async function loadMyTable() {
  const grid = document.getElementById("myItemsGrid");
  if (!grid) return;

  console.log("[SwapMeet76] Loading My Table…");

  const params = new URLSearchParams(window.location.search);
  const tableId = params.get("table") || 1;

  let items = DEMO_ITEMS.filter(i => String(i.table_id) === String(tableId));

  try {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("table_id", tableId);

    if (!error && data?.length) items = data;
  } catch (e) {
    console.warn("[SwapMeet76] Supabase My Table failed, using demo.", e);
  }

  grid.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "sm76-card";

    card.innerHTML = `
      <img src="${item.image_url}" style="width:100%; border-radius:6px; margin-bottom:10px;">
      <h3>${item.title}</h3>
      <p style="color:#b3b3b3;">${item.description || ""}</p>
      <button class="sm76-btn sm76-btn-primary">Offer Trade</button>
    `;

    const btn = card.querySelector("button");
    btn.onclick = () => {
      window.location.href = `trade.html?item=${item.id}`;
    };

    grid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: TRADE OFFER (trade.html)
// Needs: <div id="itemView">, <div id="yourItemsGrid">
// ---------------------------------------------------------
async function loadTradeOffer() {
  const itemView = document.getElementById("itemView");
  const yourItemsGrid = document.getElementById("yourItemsGrid");
  if (!itemView || !yourItemsGrid) return;

  console.log("[SwapMeet76] Loading Trade Offer…");

  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("item");

  let item = DEMO_ITEMS.find(i => String(i.id) === String(itemId));

  try {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (!error && data) item = data;
  } catch (e) {
    console.warn("[SwapMeet76] Supabase trade item failed, using demo.", e);
  }

  if (!item) {
    itemView.innerHTML = "<p>Item not found.</p>";
    return;
  }

  itemView.innerHTML = `
    <img src="${item.image_url}" style="width:100%; border-radius:6px; margin-bottom:10px;">
    <h3>${item.title}</h3>
    <p>${item.description || ""}</p>
  `;

  // For now, "your items" = demo items from table 1
  let yourItems = DEMO_ITEMS.filter(i => i.table_id === 1);

  yourItemsGrid.innerHTML = "";

  yourItems.forEach(yItem => {
    const card = document.createElement("div");
    card.className = "sm76-card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <img src="${yItem.image_url}" style="width:100%; border-radius:6px; margin-bottom:10px;">
      <h3>${yItem.title}</h3>
      <p>${yItem.description || ""}</p>
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
        console.warn("[SwapMeet76] Supabase trade insert failed (demo only).", e);
      }

      alert("Trade offer sent!");
      window.location.href = "tradeinbox.html";
    };

    yourItemsGrid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: TRADE INBOX (tradeinbox.html)
// Needs: <div id="tradesGrid">
// ---------------------------------------------------------
async function loadTradeInbox() {
  const grid = document.getElementById("tradesGrid");
  if (!grid) return;

  console.log("[SwapMeet76] Loading Trade Inbox…");

  let trades = DEMO_TRADES;

  try {
    const { data, error } = await supabase.from("trades").select("*");
    if (!error && data?.length) trades = data;
  } catch (e) {
    console.warn("[SwapMeet76] Supabase trades failed, using demo.", e);
  }

  grid.innerHTML = "";

  trades.forEach(trade => {
    const requested =
      DEMO_ITEMS.find(i => i.id === trade.item_id) || DEMO_ITEMS[0];
    const offered =
      DEMO_ITEMS.find(i => i.id === trade.offered_item_id) || DEMO_ITEMS[1];

    const card = document.createElement("div");
    card.className = "sm76-card";

    card.innerHTML = `
      <h3>Trade Offer</h3>
      <p style="color:#b3b3b3;">Status: ${trade.status}</p>

      <h4>You Own:</h4>
      <img src="${requested.image_url}" style="width:100%; border-radius:6px; margin-bottom:10px;">
      <strong>${requested.title}</strong>

      <h4>They Offer:</h4>
      <img src="${offered.image_url}" style="width:100%; border-radius:6px; margin-bottom:10px;">
      <strong>${offered.title}</strong>

      <div style="margin-top: 15px;">
        <button class="sm76-btn sm76-btn-primary">Accept Trade</button>
        <button class="sm76-btn sm76-btn-outline">Decline Trade</button>
      </div>
    `;

    const [acceptBtn, declineBtn] = card.querySelectorAll("button");

    acceptBtn.onclick = async () => {
      try {
        await supabase
          .from("trades")
          .update({ status: "accepted" })
          .eq("id", trade.id);
      } catch (e) {
        console.warn("[SwapMeet76] Supabase accept failed (demo only).", e);
      }

      alert("Trade accepted!");
      loadTradeInbox();
    };

    declineBtn.onclick = async () => {
      try {
        await supabase
          .from("trades")
          .update({ status: "declined" })
          .eq("id", trade.id);
      } catch (e) {
        console.warn("[SwapMeet76] Supabase decline failed (demo only).", e);
      }

      alert("Trade declined.");
      loadTradeInbox();
    };

    grid.appendChild(card);
  });
}

// ---------------------------------------------------------
// PAGE: PROFILE (profile.html)
// ---------------------------------------------------------
function loadProfile() {
  const profileRoot = document.getElementById("profileRoot");
  if (!profileRoot) {
    console.log("[SwapMeet76] Profile: no root element, skipping.");
    return;
  }

  console.log("[SwapMeet76] Profile loaded.");
}
