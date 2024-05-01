function ThrillTyperGame() {
    const date = new Date();
    let text = "Click start button to start!";
    let words = text.split(" ");
    var inputGiven = false;


    let currentCharIndex = 0;   //only increment when user has typed correct letter
    let currentWordIndex = 0;
    let startTime;
    //let timerInterval;
    let userInputCorrectText = "";
    let correctCharsTyped = 0; // Track correct characters typed
    let totalCharsTyped = 0; // Track total characters typed

    const intervalRef = React.useRef(null);


    function startTimerInterval(){
        intervalRef.current = setInterval(updateTimer, 10);
    }

    function stopTimerInterval(){
        clearInterval(intervalRef.current);
    }

    React.useEffect(() => {
        return () => {
          clearInterval(intervalRef.current);
        };
    }, []);

    async function fetchRandomWordList() {
        let newText = "";
        try {
            const response = await fetch('/generate_text/?difficulty=easy&form=words&amount=30');

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            newText = await response.text();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
        return newText;
    }

    async function postUserMetrics(wpm, accuracy, elapsedTime){
        try{
            const postData = {"wpm":wpm,"accuracy":accuracy,"mode":"Single Player","elapsedTime":elapsedTime/60,"date":date.toISOString()}
            const response = await fetch('/update_db',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)});
            if(!response.ok){
                throw new Error('Network response was not ok');
            }
        }
        catch(error){
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    //update text color as user types text
    //green text if user typed correctly
    //red background text if user typed incorrectly
    /*
        The whole function logic is based on following assumption, we divide text into 3 sections
        correct text | incorrect text | untyped text
    */
    //if you don't get what is going on here, open a type racer game and type some wrong text
    function updateText() {
        var str = text;
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


    async function startTimer() {
        currentWordIndex = 0;   //initializes value for play again
        currentCharIndex = 0;
        userInputCorrectText = "";
        document.getElementById("input-box").value = "";
        document.getElementById("result").innerHTML = "";

        startTime = new Date().getTime();
        if(!inputGiven){
            text = await fetchRandomWordList();
        }

        words = text.split(" ");

        displayText();
        enableInput();

        //clearInterval(timerInterval);
        //timerInterval = setInterval(updateTimer, 10);

        stopTimerInterval();
        startTimerInterval();
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
            correctCharsTyped++;
        }
        totalCharsTyped++;

        //submit input if last letter is typed
        if (currentCharIndex >= text.length) {
            submitInput();
        }
    }

    function submitInput() {
        //clearInterval(timerInterval);
        stopTimerInterval();
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        console.log(elapsedTime);
        console.log(correctCharsTyped);
        const wordsPerMinute = Math.round((correctCharsTyped / 5.0) / (elapsedTime / 60.0));
        const accuracy =  (correctCharsTyped / totalCharsTyped) * 100;
        document.getElementById("result").innerHTML = `Congratulations! You completed the game in ${elapsedTime.toFixed(2)} seconds. Your speed: ${wordsPerMinute} WPM. Your accuracy: ${accuracy.toFixed(2)}%`;
        document.getElementById("input-box").value = "";
        document.getElementById("input-box").disabled = true;
        postUserMetrics(wordsPerMinute,accuracy,elapsedTime);
    }

    function stopTimer(){
        stopTimerInterval();
        document.getElementById("input-box").disabled = false;
        document.getElementById("input-box").value = "";
        userInputCorrectText = "";
        currentCharIndex = 0;
        document.getElementById("result").innerHTML = "";
        currentWordIndex = 0;   //initializes value for play again
        updateText();
        document.getElementById("text-display").innerHTML = "Click start button to start!";
        inputGiven=false;
    }

    async function fetchUserInput() {
        let newText = "";
        try {
            newText = prompt("Please enter your words:", "");
            if (newText == null || newText == "") {
                console.log("User cancelled the prompt.");
                inputGiven=false;
            }
            else{
                text = newText;
                inputGiven=true;
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    function fillText(){
        userInputCorrectText = text.substring(0, text.length-1);
        currentCharIndex = text.length-1;
        updateText();
        //console.log("text: " + text);
        //console.log("userInputCorrectText: " + userInputCorrectText);
    }


    
    function changeBackground(season) {
        const body = document.body;
        switch(season) {
            case 'spring':
                body.style.backgroundImage = "url('/static/pics/spring.jpg')";
                break;

            case 'winter':
                body.style.backgroundImage = "url('/static/pics/winter.jpg')";
                break;
            case 'summer':
                body.style.backgroundImage = "url('/static/pics/summer.jpg')";
                break;
            case 'autumn':
                body.style.backgroundImage = "url('/static/pics/autumn.jpg')";
                break;
            default:
                body.style.backgroundImage = "none";
        }
    }



    var percentage = 10;
    function updateProgressBar(){
        percentage += 10;
        document.getElementById("hello").style.width = percentage + "%";
        document.getElementById("hello2").innerHTML = percentage + "%";
    }

    function insertPlayerStatus(){
        document.getElementById("holder").appendChild(makePlayerStatus());
        document.getElementById("holder").appendChild(makePlayerStatus());
    }
return (
    <div id="game-container">
        <h1>Thrill Typer Game</h1>
        <div id="text-display">{text}</div>

        <input type="text" id="input-box" onInput={checkInput} disabled />
        <div id="result"></div>
        <div id="holder"></div>
        <div className="button-container">
            <button onClick={startTimer}>Start</button>
            <button onClick={fetchUserInput}>Input Custom Text (Optional)</button>
            <button onClick={stopTimer}>Reset</button>
            <button onClick={fillText}>Fill Text</button>
            
            {/* Dropdown menu */}
            <div className="dropdown">
                <button className="dropbtn">Cosmetic</button>
                <div className="dropdown-content">
                    <button onClick={() => changeBackground('spring')}>Spring</button>
                    <button onClick={() => changeBackground('summer')}>Summer</button>
                    <button onClick={() => changeBackground('autumn')}>Autumn</button>
                    <button onClick={() => changeBackground('winter')}>Winter</button>
                </div>
            </div>

            <button onClick={updateProgressBar}>Update Progress Bar</button>
            <button onClick={insertPlayerStatus}>Insert Player Status</button>
        </div>
    </div>
);

    
}