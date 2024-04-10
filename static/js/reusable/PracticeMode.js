function ThrillTyperGame() {
    let text = "The quick brown fox jumps over the lazy dog.";
    fetch('/generate_text/?difficulty=easy&form=words&amount=30')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(txt => {
            text=txt;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    const words = text.split(" ");

    let currentCharIndex = 0;   //only increment when user has typed correct letter
    let currentWordIndex = 0;
    let startTime;
    let timerInterval;
    let userInputCorrectText = "";

    //update text color as user types text
    //green text if user typed correctly
    //red background text if user typed incorrectly
    /*
        The whole function logic is based on following assumption, we divide text into 3 sections
        correct text | incorrect text | untyped text
    */
    //if you don't get what is going on here, open a type racer game and type some wrong text
    function updateText() {
        var str = text
        var userInputFullText = userInputCorrectText + document.getElementById("input-box").value;

        var greenText = "";          //correct text
        var redText = "";           //incorrect text
        var uncoloredText = "";     //untyped text

        //green text
        //start index is fixed to 0
        //end index is number of matched letters, until the first incorrect letter
        var greenStartIndex = 0;
        var greenEndIndex = 0;
        var numMatchLetters = 0;
        for (var i = 0; i < userInputFullText.length; i++) {
            if (userInputFullText[i] == text[i]) {    //what if userInputFullText is longer than text? could not happend because submission
                numMatchLetters++;
            } else {
                break;
            }
        }

        greenEndIndex = numMatchLetters;
        greenText = text.substring(greenStartIndex, greenEndIndex);

        //red text
        //start index is the first unmatched letter, if it exists. It equals to greenEndIndex
        //end index is the last index of user input text
        var redStartIndex = greenEndIndex;
        var redEndIndex = greenEndIndex;
        if (numMatchLetters < userInputFullText.length) {    //if number of matched letters less than input letters means there are wrong input letters
            redEndIndex = userInputFullText.length > text.length ? text.length : userInputFullText.length;  //in case user input text is longer than text
        }

        redText = text.substring(redStartIndex, redEndIndex);

        //uncoloredText is the rest of the text starting from redEndIndex
        uncoloredText = str.substring(redEndIndex);

        /* debug
        console.log("updateText debugging");
        console.log("userInputFullText: " + userInputFullText);
        console.log("greenText: " + greenText);
        console.log("red text: " + redText);
        console.log("uncoloredText: " + uncoloredText + "\n");
        */

        var updatedText = `<span style="color: #9CCE52">${greenText}</span>` +
            `<span style="background: #F0A3A3">${redText}</span>` + uncoloredText;

        document.getElementById("text-display").innerHTML = updatedText;
    }


    function startTimer() {
        currentWordIndex = 0;   //initializes value for play again
        currentCharIndex = 0;
        userInputCorrectText = "";
        document.getElementById("input-box").value = "";
        document.getElementById("result").innerHTML = "";

        startTime = new Date().getTime();
        displayText();
        enableInput();

        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 10);
    }

    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000;
        document.getElementById("result").innerHTML = `Time elapsed: ${elapsedTime.toFixed(2)} seconds`;
    }

    function displayText() {
        document.getElementById("text-display").innerHTML = text;
    }


    function enableInput() {
        document.getElementById("input-box").disabled = false;
        document.getElementById("input-box").focus();
    }

    function checkInput() {
        var userInputText = document.getElementById("input-box").value;
        var userInputLastChar = userInputText[userInputText.length - 1];

        //updates text color
        updateText();

        //idk what this is 
        //if typed word matches with text word and last letter is space, clear input box and add word to userInputCorrectText
        if (userInputText.substring(0, userInputText.length - 1) == words[currentWordIndex] && userInputLastChar == ' ') {
            currentWordIndex++;
            userInputCorrectText += userInputText;  //saves correct text
            document.getElementById("input-box").value = "";
        }

        if (userInputLastChar == text[currentCharIndex]) { //works but logic is bad
            currentCharIndex++;
        }

        //submit input if last letter is typed
        if (currentCharIndex >= text.length) {
            submitInput();
        }
    }

    function submitInput() {
        clearInterval(timerInterval);
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        const wordsPerMinute = Math.round((text.split(" ").length / elapsedTime) * 60);
        document.getElementById("result").innerHTML = `Congratulations! You completed the game in ${elapsedTime.toFixed(2)} seconds. Your speed: ${wordsPerMinute} WPM.`;
        document.getElementById("input-box").value = "";
        document.getElementById("input-box").disabled = true;
    }

    return (
        <div id="game-container">
            <div>
                <h1>Thrill Typer Game</h1>
                <div id="text-display">{text}</div>
                <input type="text" id="input-box" onInput={checkInput} disabled />
                <div id="result"></div>
                <button onClick={startTimer}>Start</button>
            </div>
        </div>
    );
}