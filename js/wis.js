//code for the popups on the planets 
/* code copied from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_popup 
    modified function name, changed to getElementsByClassName, added for loop
*/
function clickToShow(className) {
  var popups = document.getElementsByClassName(className);
  for (var eachPopup of popups) {
    eachPopup.classList.toggle("show");
  }
}