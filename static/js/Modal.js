// create global object (named same as js file) so html page can access it.
var modal = {};

// This is an IIFE, an immediately executing (anonymous) function.
// It will adorn the public object with a couple of public methods.
(function () {
    console.log("ran modal")
    // create div for modal window and attach it to the <body> tag. 
    // The initial styling (set by "modalStyle" class rule in modal.css) 
    // makes the div initially invisible.
    var modalWindow = document.createElement("div");
    modalWindow.className = "modalStyle";
    var bList = document.getElementsByTagName("body");
    bList[0].appendChild(modalWindow);
    hide(modalWindow);

    function hide(ele) {
        ele.classList.add("fadeOut");
    }

    function show(ele) {
        ele.classList.remove("fadeOut");
    }

    // create public method that can be used by the HTML coder.
    modal.alert = function (message) {
        show(modalWindow);
        console.log("function modal.alert was called with message " + message);

        modalWindow.innerHTML = "";

        // add "X" button that can close the modal window
        var xButton = document.createElement("span");
        xButton.className = "x";
        xButton.innerHTML = "&times";
        xButton.onclick = function () {
            hide(this.parentNode);
        };
        modalWindow.appendChild(xButton);

        // add message area
        var messageArea = document.createElement("p");
        modalWindow.appendChild(messageArea);
        messageArea.innerHTML = message;

        show(modalWindow);
    };


    // a snackBar is like an alert window, but it closes by itself, if the user does not do so. 
    modal.snackBar = function (message, millisecs) {
        show(modalWindow);
        console.log("function modal.snackBar was called with message " + message);

        modalWindow.innerHTML = "";

        // add "X" button that can close the modal window
        var xButton = document.createElement("span");
        xButton.className = "x";
        xButton.innerHTML = "&times";
        xButton.onclick = function () {
            //hide(this.parentNode);
            hide(modalWindow);
        };
        modalWindow.appendChild(xButton);

        // add message area
        var messageArea = document.createElement("p");
        modalWindow.appendChild(messageArea);
        messageArea.innerHTML = message;

        show(modalWindow);
        
        setTimeout(closeSnack,millisecs);

        function closeSnack() {
            hide(modalWindow);
        }
    };

    // create public method that can be used...
    modal.confirm = function (message, okFunction) {

        console.log("function modal.confirm was called with message " + message);

        modalWindow.innerHTML = "";

        // add message area
        var messageArea = document.createElement("p");
        modalWindow.appendChild(messageArea);
        messageArea.innerHTML = message + "<br/><br/>";

        // add button area to hold the ok and cancel buttons
        buttonArea = document.createElement("div");
        buttonArea.className = "buttonArea";
        messageArea.appendChild(buttonArea);

        // add ok button into button area
        var okButton = document.createElement("INPUT");
        okButton.setAttribute("type", "button");
        okButton.setAttribute("value", "OK");
        okButton.className = "close";
        okButton.onclick = function () {
            //this.parentNode.parentNode.parentNode.style.visibility = "hidden"; // make modal window invisible
            hide(this.parentNode.parentNode.parentNode);
            okFunction();
        };
        buttonArea.appendChild(okButton);

        // add cancel button into button area
        var cancelButton = document.createElement("INPUT");
        cancelButton.setAttribute("type", "button");
        cancelButton.setAttribute("value", "Cancel");
        cancelButton.className = "close";
        cancelButton.onclick = function () {
            // button is in buttonArea (parent) is in messageArea (grandparent) is in modalWindow (great grandparent)
            //this.parentNode.parentNode.parentNode.style.visibility = "hidden"; // make modal window invisible
            hide(this.parentNode.parentNode.parentNode);
        };
        buttonArea.appendChild(cancelButton);

        show(modalWindow);
    };

}());  // the end of the IIFE
// the () invokes it... 
// the last ) wraps the whole function definition - see starting ( at top.  