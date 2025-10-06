$(document).ready(function () {
  $(".products").on("click", ".fav", function (e) {
    e.preventDefault();
    const $btn = $(this);
    $btn.find(".icon-outline, .icon-filled").toggleClass("d-none");
  });

  const FAV_KEY = "favProducts"; // ["p1","p2",...]
  const FILTER_KEY = "favFilter"; // "on" | "off"
  const VIEW_KEY = "viewMode"; // "grid" | "list"

  // Cache some roots
  const $products = $(".products");
  const $cards = $products.find(".card");
  const $viewBar = $(".viewProducts"); // contains grid/list icons + your button
  const $favBtnUI = $viewBar.find("button").first(); // your "View Favorites Only" button

  // ---------- INIT ----------
  // Ensure each card has a stable id (data-id). If missing, assign automatically.
  $cards.each(function (i) {
    const $c = $(this);
    if (!$c.attr("data-id")) $c.attr("data-id", `p${i + 1}`);
  });

  // Load favorites from storage
  const favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
  // Apply favorite visuals on load
  $cards.each(function () {
    const $card = $(this);
    const id = String($card.data("id"));
    applyFavState($card, favs.has(id));
  });

  // Restore view mode (grid/list)
  const savedView = localStorage.getItem(VIEW_KEY);
  if (savedView === "list") {
    $products.addClass("is-list");
    $viewBar.find(".gridMode").addClass("d-none");
    $viewBar.find(".listMode").removeClass("d-none");
  }

  // Restore favorites-only filter
  refreshCardsVisibility();

  // ---------- HANDLERS ----------

  // Toggle favorite (delegation: works for all cards)
  $products.on("click", ".fav", function (e) {
    e.preventDefault();
    const $card = $(this).closest(".card");
    const id = String($card.data("id"));
    const nowFav = !favs.has(id);

    // Update set + storage
    if (nowFav) favs.add(id);
    else favs.delete(id);
    localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));

    // Update visuals for this card
    applyFavState($card, nowFav);

    // If filter is ON, hide/show this card immediately
    if (localStorage.getItem(FILTER_KEY) === "on") {
      $card.toggleClass("d-none", !nowFav);
    }
  });

  // Favorites Only filter button (uses the first button inside .viewProducts)
  $favBtnUI.on("click", function () {
    const nowOn = localStorage.getItem(FILTER_KEY) !== "on"; // flip state
    localStorage.setItem(FILTER_KEY, nowOn ? "on" : "off");
    refreshCardsVisibility();
  });

  // Grid/List toggle via the two SVG icons at the top
  $viewBar.on("click", ".gridMode, .listMode", function () {
    const isList = !$products.hasClass("is-list"); // toggle
    $products.toggleClass("is-list", isList);

    // Swap icons
    $viewBar.find(".gridMode, .listMode").toggleClass("d-none");

    // Persist choice
    localStorage.setItem(VIEW_KEY, isList ? "list" : "grid");

    // Keep current filter effect (in case some cards are hidden)
    refreshCardsVisibility();
  });

  // ---------- HELPERS ----------

  function applyFavState($card, isFav) {
    const $favBtn = $card.find(".fav");
    // Swap heart icons
    $favBtn.find(".icon-outline").toggleClass("d-none", isFav);
    $favBtn.find(".icon-filled").toggleClass("d-none", !isFav);
    // Visual state + accessibility
    $card.toggleClass("is-fav", isFav);
    $favBtn.attr("aria-pressed", isFav);
  }

  function refreshCardsVisibility() {
    const onlyFav = localStorage.getItem(FILTER_KEY) === "on";
    const favSet = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));

    // Update button UI text/state
    $favBtnUI
      .toggleClass("active", onlyFav)
      .text(onlyFav ? "Show All" : "View Favorites Only");

    // Show/hide cards based on filter
    $cards.each(function () {
      const id = String($(this).data("id"));
      const isFav = favSet.has(id);
      $(this).toggleClass("d-none", onlyFav && !isFav);
    });
  }
});
