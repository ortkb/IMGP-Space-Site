document.body.onkeyup = function(event) {
    if (event.keyCode == 49 || event.key == '1') { // Press '1' to scroll right
        window.scrollBy({
            top: 0,
            left: 100,
            behavior: "smooth",
          });
    }
}