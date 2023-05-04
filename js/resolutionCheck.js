let errorMessageTitle = document.getElementById("errormessage-title");
let errorMessageDescription = document.getElementById("errormessage-desc");
let errorMessageButton = document.getElementById("errormessage-button");


let isLandscape = screen.width > screen.height; // Is screen width a higher value then screen height?

if (detectDeviceType() == "Desktop"){
    // if the device is not a mobile device..
    writeErrorMessage("It's better on a tablet / mobile!", "This site is deigned for mobile and tablet devices. Please use the side buttons or click + drag to navigate the page.");
    
    /*
    errorMessageTitle.innerText = "It's better on a tablet / mobile!"
    errorMessageDescription.innerText = "This site is deigned for mobile and tablet devices. Please use the side buttons or click + drag to navigate the page.";
    errorMessageButton.style.display = "block";
    */
    // user should be able to close this window if needed.
}

function checkLandscapeOrientation(){
    if (!isLandscape){  // is device is a mobile device but is not landscape..
        writeErrorMessage("", "Please change to horizontal orientation", false); // users SHOULD NOT be able to close this window until horizontal
        /*
        errorMessageDescription.innerText = "Please change to horizontal orientation.";
        errorMessageButton.style.display = "none";  
        */
    }else{
        // if the device is at landscape 
        errorMessageButton.style.display = "inline";
    }
}

// Sourced from "detect-device-type.md" from https://github.com/30-seconds/30-seconds-of-code
function detectDeviceType(){
    // Checks whether the current device matches any of the specified mobile / tablet devices
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
}

if (screen.orientation){
    screen.orientation.addEventListener("change", function(){
        checkLandscapeOrientation();
    });
} else{
    console.log("screen orientation API is not supported in this browser, sorry!");
}

function writeErrorMessage(titleText, descText, buttonDisplayBool = true){
    if(titleText !== "") {errorMessageTitle.innerText = title;}
    if(descText !== "") {errorMessageDescription.innerText = title;}
    buttonDisplayBool ? errorMessageButton.style.display = "inline" : errorMessageButton.style.display = "none";
}


window.addEventListener("orientationchange", function() {
    alert(window.orientation);
  }, false);