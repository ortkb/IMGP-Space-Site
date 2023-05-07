// Fades out loading screen once page has loaded.
addEventListener("load", function(){ // on page load..
  const loadScreen = document.getElementById("loader");
  loadScreen.classList.add("anim-fade-out");
  loadScreen.addEventListener("animationend", function() {
    loadScreen.style.display = "none";
  });
  // loader.style.display = "none"; // Clear load screen immediately on load.
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
      if (_swipeDirection == "LEFT" && !isSpaceshipFlipped){ // If Spaceship is facing left (and doesn't already have the 'flipped' class), flip the image so it faces left.
        this.spaceship.classList.add("flipped");
      }
      else if (_swipeDirection == "RIGHT" && isSpaceshipFlipped) { // If Spaceship is facing right (and is flipped), return the image to normal.
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

  // console.log(swiper.activeIndex);

  if (swiper.activeIndex > swiper.previousIndex) {
      //console.log('left');
      // If swipe
  } else {
      //console.log('right');
  }
});

// While the user is swiping, finds whether the user is swiping left or right

/*
swiper.on("touchMove", function(){
  if (swipeDirectionDetector.hasDirectionChanged(swiper.touches.diff)){
    console.log("change in direction!");
    //spaceship.orientSpaceship(swipeDirectionDetector.getCurrentSwipeDirection(swiper.touches.diff));
  }
  // get on touch event to switch between spaceship and spaceship flying images 
})

*/

// Hammer





// If scrolling to the left, returns '-1', if scrolling right (or not scrolling), returns '1'
class SwipeDirectionListener { 
  prevSwipeDirection = 0;

  constructor(){
    this.hammertime = new Hammer(document.body);

    this.hammertime.on('panmove', function(event) {
      if(this.prevDirection !== event.direction){
        if (event.direction == 2){
          spaceship.orientSpaceship("RIGHT");
        }
        else if (event.direction == 4){
          spaceship.orientSpaceship("LEFT");
        }
      }

      this.prevDirection = event.direction;
    });
  }

  /*
  getNewSwipeDirection(newSwipeDiff){
    //console.log(newSwipeDiff);
    if(newSwipeDiff == undefined){
      console.error("'newSwipeDiff' parameter is not defined.");
    }
    if(this.prevSwipeDiff == newSwipeDiff || newSwipeDiff == 0){
      return 0; // If the direction is the same, (e.g. swiping vertically), then return 0
    }
    let isScrollingLeft = this.prevSwipeDiff < newSwipeDiff;
    this.prevSwipeDiff = newSwipeDiff;
    return isScrollingLeft ? -1 : 1; 
  }
  

  getCurrentSwipeDirection(){
    return this.prevSwipeDirection;
  }

  hasDirectionChanged(newSwipeDiff){
    let currentDirection = this.getNewSwipeDirection(newSwipeDiff)
    if (currentDirection == 0){
      return false; // If the current direction is neither left or right, return false (the direction has not changed)
    }
    let hasChanged = currentDirection !== this.prevSwipeDirection;
    this.prevSwipeDirection = currentDirection;

    return hasChanged;
  }

  */

}

const swipeDirectionListener = new SwipeDirectionListener();