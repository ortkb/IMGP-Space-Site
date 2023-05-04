addEventListener("load", function(){ // on page load..
  document.getElementById("loader").style.display = "none";
});

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

// check when a swipe has been made
swiper.on( 'slideChange', function() {
  if ( swiper.activeIndex > swiper.previousIndex ) {
      console.log( 'left' );
  } else {
      console.log('right');
  }
});

// get on touch event to switch between spaceship and spaceship flying images 