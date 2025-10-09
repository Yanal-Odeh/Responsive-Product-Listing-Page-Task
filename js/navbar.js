$(document).ready(function() {
  const $menuToggle = $('.mobile-menu-toggle');
  const $mobileMenu = $('.mobile-menu');
  
  // Toggle mobile menu
  $menuToggle.on('click', function(e) {
    e.stopPropagation();
    $(this).toggleClass('active');
    $mobileMenu.toggleClass('active');
  });
  
  
  // Close mobile menu when clicking on a link
  $('.mobile-menu a').on('click', function() {
    $menuToggle.removeClass('active');
    $mobileMenu.removeClass('active');
  });
  
  // Close mobile menu when clicking outside
  $(document).on('click', function(event) {
    if (!$(event.target).closest('.mobile-menu-toggle, .mobile-menu').length) {
      if ($mobileMenu.hasClass('active')) {
        $menuToggle.removeClass('active');
        $mobileMenu.removeClass('active');
      }
    }
  });
  
  // Prevent menu close when clicking inside mobile menu
  $mobileMenu.on('click', function(e) {
    e.stopPropagation();
  });
});