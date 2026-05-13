(function ($) {
$(window).load(function() {
$('.featured-area').owlCarousel({
  autoplay: false,
  smartSpeed: 2000,
  loop: true,
  items: 1,
  dots: false,
  slideSpeed: 15000,
  autoplayHoverPause: true,
  nav: false,
  margin: 0,
  animateIn: 'fadeIn',
  animateOut: 'fadeOut',
  navText: [
  "<i class='fa fa-angle-up'></i>",
  "<i class='fa fa-angle-down'></i>"
  ]
}); 
});
})(jQuery);