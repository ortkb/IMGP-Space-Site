document.body.onkeyup = function(event) {
    if (event.keyCode == 49 || event.key == '1') { // Press '1' to scroll right
        window.scrollBy({
            top: 0,
            left: 100,
            behavior: "smooth",
          });
    }
}

const swiper = new Swiper('.swiper', {
    speed: 600,
    grabCursor: true, // Shows a 'grab' cursor for non-touchscreen devices.
    resistance: true,  // Resistance to spam?
    resistanceRatio: 50000, // Default: 0.85 - Set higher to lessen spam-swiping
    direction: 'horizontal',
    loop: false,
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });