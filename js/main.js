// Removes loading screen once page has loaded.
addEventListener("load", function(){ // on page load..
  document.getElementById("loader").style.display = "none";
});




// ---- Spaceship ----

class Spaceship{
  isValid = true;

  constructor(spaceshipElement){
    this.spaceship = spaceshipElement;

    if (this.spaceship == null || this.spaceship == undefined){
      console.warn("No element with 'spaceship' ID found.");
      this.isValid = false; // If no spaceship element is found, this Spaceship instance is invalid
    }
  }

  orientSpaceship(_swipeDirection){
    if (this.isValid){
      let isSpaceshipFlipped = this.spaceship.classList.contains("flipped");
      if (_swipeDirection < 0 && !isSpaceshipFlipped){ // If Spaceship is facing left (and doesn't already have the 'flipped' class), flip the image.
        this.spaceship.classList.add("flipped");
      }
      else if (_swipeDirection > 0 && isSpaceshipFlipped) { // If Spaceship is facing right (and is flipped), return the image to normal.
        this.spaceship.classList.remove("flipped");
      }
    }
  }
}

const spaceship = new Spaceship(document.getElementById("spaceship") ?? null);


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
  if (swipeDirectionDetector.hasDirectionChanged(swiper.touches.diff)){
    console.log("change in direction!");
    spaceship.orientSpaceship(swipeDirectionDetector.getSwipeDirection(swiper.touches.diff));
  }
  // get on touch event to switch between spaceship and spaceship flying images 
})

// If scrolling to the left, returns '-1', if scrolling right (or not scrolling), returns '1'
class SwipeDirectionDetector { 
  prevSwipeDiff = 0;
  prevSwipeDirection = 0;

  getSwipeDirection(newSwipeDiff){
    if(newSwipeDiff == undefined){
      console.error("'newSwipeDiff' parameter is not defined.");
    }
    if(this.prevSwipeDiff == newSwipeDiff){
      return 0; // If the direction is the same, (e.g. swiping vertically), then return 0
    }
    let isScrollingLeft = this.prevSwipeDiff < newSwipeDiff;
    this.prevSwipeDiff = newSwipeDiff;
    return isScrollingLeft ? -1 : 1; 
  }

  hasDirectionChanged(newSwipeDiff){
    let currentDirection = this.getSwipeDirection(newSwipeDiff)
    if (currentDirection == 0){
      return false; // If the current direction is neither left or right, return false (the direction has not changed)
    }
    let hasChanged = currentDirection !== this.prevSwipeDirection;
    this.prevSwipeDirection = currentDirection;

    return hasChanged;
  }

}

const swipeDirectionDetector = new SwipeDirectionDetector();