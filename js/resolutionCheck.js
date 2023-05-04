// There's a bug when switching from touchscreen input to a mousecursor input - the error message doesn't go back to the default "you should view this on mobile / tablet" message
// Not a huge issue as devices can't switch input methods on the fly - but it is noticeable when using chrome dev tools

const errorMessageTitle = document.getElementById("errormessage-title");
const errorMessageDescription = document.getElementById("errormessage-desc");
const errorMessageButton = document.getElementById("errormessage-button");

const defaultTitle = errorMessageTitle.innerText;
const defaultDescription = errorMessageDescription.innerText;

errorMessageButton.addEventListener("click", closeErrorMessage);

let isLandscape = screen.width > screen.height; // Is screen width a higher value then screen height?

if (detectDeviceType() == "Desktop"){
    // if the device is not a mobile device..
    writeErrorMessage("It's better on tablet / mobile!", "This site is designed for mobile and tablet devices. Please use the side buttons or click + drag to navigate the page.");
    // user should be able to close this window if needed.
} else  {
    // if device is detected as a mobile / tablet device..
    checkLandscapeOrientation();
}

if (screen.orientation){ // Check if screen orientation API is supported
    // Check whether the orientation is vertical or landscape, every time the orientation changes.
    screen.orientation.addEventListener("change", checkLandscapeOrientation);
} else{
    console.log("screen orientation API is not supported in this browser, sorry!");
}




/*
    //// Functions ////
*/

function checkLandscapeOrientation(){
    isLandscape = screen.width > screen.height;
    if (!isLandscape){  // is device is a mobile device but is not landscape..
        writeErrorMessage("", "Please change to horizontal orientation", false); // users SHOULD NOT be able to close this window until horizontal
    }else{ // if the device is landscape 
        errorMessageButton.style.display = "inline";
    }
}

function closeErrorMessage(){
    console.log("CLOSE");
    document.getElementById("errormessage-spread").style.display = "none";
}

function displayErrorMessage(){
    document.getElementById("errormessage-spread").style.display = "block";
}

// Changes the error message to either its original / default text, or a custom message.
function writeErrorMessage(titleText, descText, buttonDisplayBool = true){
    titleText !== "" ? errorMessageTitle.innerText = titleText : errorMessageTitle.innerText = defaultTitle;
    descText !== "" ?  errorMessageDescription.innerText = descText : errorMessageDescription.innerText = defaultDescription;
    buttonDisplayBool ? errorMessageButton.style.display = "inline" : errorMessageButton.style.display = "none";
}

// Sourced from "detect-device-type.md" from https://github.com/30-seconds/30-seconds-of-code
// Checks whether the current device matches any of the specified mobile / tablet devices
function detectDeviceType(){ 
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
}
// end of borrowed code