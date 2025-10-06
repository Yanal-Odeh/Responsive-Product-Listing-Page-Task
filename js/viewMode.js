
$(function () {
  const VIEW_KEY = 'viewMode';
  const $products = $('.products');
  const $viewBar = $('.viewProducts');

  // Restore saved view mode
  const savedView = localStorage.getItem(VIEW_KEY);
  if (savedView === 'list') {
    $products.addClass('is-list');
    $viewBar.find('.gridMode').addClass('d-none');
    $viewBar.find('.listMode').removeClass('d-none');
  }

  // Toggle handler
  $viewBar.on('click', '.gridMode, .listMode', function () {
    const isList = !$products.hasClass('is-list');
    $products.toggleClass('is-list', isList);
    $viewBar.find('.gridMode, .listMode').toggleClass('d-none');
    localStorage.setItem(VIEW_KEY, isList ? 'list' : 'grid');
  });
});
