const swiper = new Swiper('.swiper', {
    speed: 600,
    parallax: true,
    /* grabCursor: true, // Shows a 'grab' cursor for non-touchscreen devices. */
    direction: 'horizontal',
    loop: false,

    // Progress bar
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
});

document.body.onkeyup = function(event) {
    if (event.keyCode == 49 || event.key == '1') { // Press '1' to scroll right
        window.scrollBy({
            top: 0,
            left: 100,
            behavior: "smooth",
          });
    }
}