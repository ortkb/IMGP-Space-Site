// Removes loading screen once page has loaded.
addEventListener("load", function(){ // on page load..
  document.getElementById("loader").style.display = "none";
});




// ---- Spaceship ----




// ---- Swiper ----

// Initialises the Swiper
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

// check when a swipe has been made
swiper.on('slideChange', function() {

  console.log(swiper.activeIndex);

  if (swiper.activeIndex > swiper.previousIndex) {
      console.log('left');
      // If swipe
  } else {
      console.log('right');
  }
});

// While the user is swiping, finds whether the user is swiping left or right
swiper.on("touchMove", function(){
  console.log(swipeDirectionDetector.getSwipeDirection(swiper.touches.diff));
  // get on touch event to switch between spaceship and spaceship flying images 
})

// If scrolling to the left, returns '-1', if scrolling right (or not scrolling), returns '1'
class SwipeDirectionDetector { 
  prevSwipeDiff = 0;

  getSwipeDirection(newSwipeDiff){
    if(newSwipeDiff == undefined){
      console.error("'newSwipeDiff' parameter is not defined.");
    }
    let isScrollingLeft = this.prevSwipeDiff < newSwipeDiff;
    this.prevSwipeDiff = newSwipeDiff;
    return isScrollingLeft ? -1 : 1; 
  }
}

const swipeDirectionDetector = new SwipeDirectionDetector();