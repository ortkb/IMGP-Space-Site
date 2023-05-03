let errorMessageTitle = document.getElementById("errormessage-title");
let errorMessageDescription = document.getElementById("errormessage-desc");
let errorMessageButton = document.getElementById("errormessage-button");

// Is screen width is a higher value then screen height?
let isLandscape = screen.width > screen.height;

//Sourced from "detect-device-type.md" from https://github.com/30-seconds/30-seconds-of-code 
const detectDeviceType = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop';
console.log(detectDeviceType()); // "Mobile" or "Desktop"

if (detectDeviceType() == "Desktop"){
    // if the device is not a mobile device..
    errorMessageDescription.innerText = "This site is designed for mobile and tablet devices. Please use the side buttons or click + drag to navigate the page.";
    // errorMessageButton = should be visible
    // user should be able to close this window if needed.
}

if (!isLandscape){
    // is device is a mobile device but is not landscape..
    errorMessageDescription.innerText = "Please change to horizontal orientation.";
    // errorMessageButton = not visible
    // users SHOULD NOT be able to close this window until horizontal
}