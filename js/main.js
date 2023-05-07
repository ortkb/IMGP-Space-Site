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


// Hammer

function SwipeDirectionListener(){
  let prevDirection = 0;
  let hammer = new Hammer(document.body);

  hammer.on('panmove', function(event) {
    if(prevDirection !== event.direction){
      if (event.direction == 2){
        spaceship.orientSpaceship("RIGHT");
      }
      else if (event.direction == 4){
        spaceship.orientSpaceship("LEFT");
      }
    }
    prevDirection = event.direction;
  });
}

const swipeDirectionListener = new SwipeDirectionListener();