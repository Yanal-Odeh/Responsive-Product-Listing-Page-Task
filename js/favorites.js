
$(function () {
  const FAV_KEY = 'favProducts';
  const FILTER_KEY = 'favFilter';
  const $products = $('.products');
  const $cards = $products.find('.card');
  const $viewBar = $('.viewProducts');
  const $favBtnUI = $viewBar.find('button').first();

  // Ensure each card has stable data-id
  $cards.each(function (i) {
    const $c = $(this);
    if (!$c.attr('data-id')) $c.attr('data-id', `p${i + 1}`);
  });

  // Load favorites
  const favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));

  // Apply fav visuals on load
  $cards.each(function () {
    const $card = $(this);
    applyFavState($card, favs.has(String($card.data('id'))));
  });

  refreshCardsVisibility();
  updateFavBtn();

  // Handlers
  $products.on('click', '.fav', function (e) {
    e.preventDefault();
    const $card = $(this).closest('.card');
    const id = String($card.data('id'));
    const nowFav = !favs.has(id);
    if (nowFav) favs.add(id);
    else favs.delete(id);

    localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
    applyFavState($card, nowFav);

    const onlyFav = localStorage.getItem(FILTER_KEY) === 'on';
    if (onlyFav) $card.toggleClass('d-none', !nowFav);

    updateFavBtn();

    if (onlyFav && favs.size === 0) {
      localStorage.setItem(FILTER_KEY, 'off');
      refreshCardsVisibility();
    }
  });

  $favBtnUI.on('click', function () {
    const nowOn = localStorage.getItem(FILTER_KEY) !== 'on';
    localStorage.setItem(FILTER_KEY, nowOn ? 'on' : 'off');
    refreshCardsVisibility();
    updateFavBtn();
  });

  // Helpers
  function applyFavState($card, isFav) {
    const $favBtn = $card.find('.fav');
    $favBtn.find('.icon-outline').toggleClass('d-none', isFav);
    $favBtn.find('.icon-filled').toggleClass('d-none', !isFav);
    $card.toggleClass('is-fav', isFav);
    $favBtn.attr('aria-pressed', isFav);
  }

  function refreshCardsVisibility() {
    const onlyFav = localStorage.getItem(FILTER_KEY) === 'on';
    const favSet = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
    $favBtnUI.toggleClass('active', onlyFav);
    $cards.each(function () {
      const id = String($(this).data('id'));
      const isFav = favSet.has(id);
      $(this).toggleClass('d-none', onlyFav && !isFav);
    });
  }

  function updateFavBtn() {
    const count = favs.size;
    const onlyFav = localStorage.getItem(FILTER_KEY) === 'on';
    $favBtnUI.toggleClass('d-none', count === 0);

    if (count === 0) {
      $favBtnUI.text('View Favorites Only');
      return;
    }

    if (onlyFav) {
      $favBtnUI.text('Show All');
    } else {
      $favBtnUI.text(`View Favorites Only (${count})`);
    }
  }
});
