function RobotOpponent() {
    const date = new Date();
    let text = "Choose difficulty and click to start.";
    let words = text.split(" ");
    let avgEasyWordTxtLen;
    getAvgTxtLen("easy","words").then(avgLen=>{avgEasyWordTxtLen=avgLen});
    let avgMedWordTxtLen;
    getAvgTxtLen("medium","words").then(avgLen=>{avgMedWordTxtLen=avgLen});
    let avgHardWordTxtLen;
    getAvgTxtLen("hard","words").then(avgLen=>{avgHardWordTxtLen=avgLen});

    let currentCharIndex = 0;   //only increment when user has typed correct letter
    let currentWordIndex = 0;
    let startTime;
    let timerInterval;
    let userInputCorrectText = "";


    let correctCharsTyped = 0; // Track correct characters typed
    let totalCharsTyped = 0; // Track total characters typed

    async function getAvgTxtLen(difficulty,form){
        let avgTxtLen;
        try {
            const response = await fetch('/get_avg_txt_len/?difficulty='+difficulty+'&form='+form);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const avgTxtLenResponseStr = await response.text();
            avgTxtLen = parseFloat(avgTxtLenResponseStr)
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
        return avgTxtLen;
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

    function robotType(msPerChar) {
        // Simulate robot typing with random errors
        let robotTypedText = '';
        let currentIndex = 0;
        const robotInterval = setInterval(() => {
            if (currentIndex < text.length && currentCharIndex<text.length) {
                robotTypedText += text[currentIndex]; // Simulate typing the next character
                currentIndex++;
                document.getElementById("robot-text-display").innerHTML = robotTypedText;
            } else if(currentIndex>=text.length) {
                clearInterval(robotInterval); // Stop typing when the text is completed
                document.getElementById("input-box").disabled = true;
                robotInput();
            }else if(currentCharIndex>=text.length-1){
                clearInterval(robotInterval);
            }
        }, msPerChar);
    }

    function getRobotMsPerChar(difficulty){
        switch(difficulty){
            case "Easy":
                return 1000/(Math.random() * (15.0/4 - 1.25) + 1.25);
            case "Medium":
                return 1000/(Math.random() * (85.0/12 - 23.0/6) + 23.0/6);
            case "Hard":
                return 1000/(Math.random() * (10 - 43.0/6) + 43.0/6);
        }
    }
    function getNumWords(difficulty,msPerChar){
        let avgWordLen;
        switch(difficulty){
            case "Easy":
                avgWordLen=avgEasyWordTxtLen;
                break;
            case "Medium":
                avgWordLen=avgMedWordTxtLen;
                break;
            case "Hard":
                avgWordLen=avgHardWordTxtLen;
                break;
        }
        return Math.floor((60/(msPerChar*avgWordLen/1000)));
    }

    async function fetchRandomWordList(difficulty,numWords) {
        let newText = "";
        try {
            const response = await fetch('/generate_text/?difficulty='+difficulty+'&form=words&amount='+numWords);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            newText = await response.text();
            text=newText
            document.getElementById("text-display").innerHTML = text;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    async function postUserMetrics(wpm, accuracy, elapsedTime){
        try{
            const postData = {"wpm":wpm,"accuracy":accuracy,"mode":"Robot Opponent","elapsedTime":elapsedTime/60,"date":date.toISOString()}
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

    function startGame(){
        var difficulty = getDifficulty();
        var robotMsPerChar = getRobotMsPerChar(difficulty);
        var numWords = getNumWords(difficulty,robotMsPerChar);
        fetchRandomWordList(difficulty,numWords);
        startTimer();
        robotType(robotMsPerChar);
    }

    function getDifficulty(){
        var radioBtns = document.getElementsByName('difficulty');
        for (var i = 0; i < radioBtns.length; i++) {
            if (radioBtns[i].checked) {
                return radioBtns[i].value;
            }
        }
        return null;
    }

    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000;
        document.getElementById("result").innerHTML = `Time elapsed: ${elapsedTime.toFixed(2)} seconds`;
    }

    function displayText() {
        document.getElementById("text-display").innerHTML = text;
    }

    function displayhtml() {
        // jimmy1
        // Calculate words per minute and accuracy

        const elapsedTime = (new Date().getTime() - startTime) / 1000;
        const wordsPerMinute = Math.round((currentCharIndex / 5 / elapsedTime) * 60);
        const accuracy = (correctCharsTyped / totalCharsTyped) * 100;


        // Display WPM and accuracy
        const statsDisplay = `Speed: ${wordsPerMinute} WPM | Accuracy: ${accuracy.toFixed(2)}%`;
        document.getElementById("stats").innerHTML = statsDisplay;

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
        // Call displayhtml function to update WPM and accuracy
        displayhtml();

        //idk what this is 
        //if typed word matches with text word and last letter is space, clear input box and add word to userInputCorrectText
        if (userInputText.substring(0, userInputText.length - 1) == words[currentWordIndex] && userInputLastChar == ' ') {
            currentWordIndex++;
            userInputCorrectText += userInputText;  //saves correct text
            document.getElementById("input-box").value = "";
        }

        if (userInputLastChar == text[currentCharIndex]) { //works but logic is bad
            currentCharIndex++;
            correctCharsTyped++; // Increment correct characters typed
        }
        totalCharsTyped++; // Increment total characters


        //submit input if last letter is typed
        if (currentCharIndex >= text.length) {
            submitInput();

        }
        updateTypingProgress(currentCharIndex, text.length); // Update progress

    }
    function updateProgress(percentage) {
        const progressText = document.getElementById("progressText");
        const progressCircle = document.getElementById("progressCircle");

        const circumference = 2 * Math.PI * 52; // Circle circumference
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset =
            circumference - (percentage / 100) * circumference;

        progressText.textContent = `${Math.round(percentage)}%`;
    }

    // This function is expected to be called from another file
    function updateTypingProgress(currentLetters, totalLetters) {
        const percentage = (currentLetters / totalLetters) * 100;
        updateProgress(percentage);
    }

    // Example external call
    // Assume this is how the other file updates the progress
    // updateTypingProgress(50, 100); // You can test this by manually calling it from the console or another script

    function submitInput() {
        clearInterval(timerInterval);
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        const wordsPerMinute = Math.round((currentCharIndex/5 / elapsedTime) * 60);
        const accuracy = (correctCharsTyped / totalCharsTyped) * 100; // Calculate accuracy
        document.getElementById("result").innerHTML = `Congratulations! You completed the game in ${elapsedTime.toFixed(2)} seconds. Your speed: ${wordsPerMinute} WPM. Accuracy: ${accuracy.toFixed(2)}%`;
        document.getElementById("input-box").value = "";
        document.getElementById("input-box").disabled = true;
        postUserMetrics(wordsPerMinute,accuracy,elapsedTime);
    }


    function robotInput() {
        clearInterval(timerInterval); // Stop the timer
        const endTime = new Date().getTime();
        const elapsedTime = (endTime - startTime) / 1000;
        const wordsPerMinute = Math.round((document.getElementById("robot-text-display").textContent.length/5 / elapsedTime) * 60);
        document.getElementById("result").innerHTML = `Sadly, Robot finished the game first in ${elapsedTime.toFixed(2)} seconds. Robot speed: ${wordsPerMinute} WPM.`;
        document.getElementById("input-box").value = "";
        document.getElementById("input-box").disabled = true;
        postUserMetrics(Math.round((currentCharIndex/5 / elapsedTime) * 60),(correctCharsTyped / totalCharsTyped) * 100, elapsedTime);
    }

    React.useEffect(() => {
        const inputBox = document.getElementById("input-box");
        const startBtn = document.getElementById("startBtn");

        // Attach event listener for input event to input box
        inputBox.addEventListener("input", checkInput);

        // Attach event listener for click event to start button
        startBtn.addEventListener("click", startGame);

        // Cleanup function to remove event listeners when component unmounts
        return () => {
            inputBox.removeEventListener("input", checkInput);
            startBtn.removeEventListener("click", startGame);
        };
    }, []);


    return (
        <div id="game-container">
            <h1>Robot</h1>
            <div id="text-display">{text}</div>
            <div id="robot-text-display"></div>
            <input type="text" id="input-box" disabled />
            <div id="result"></div>
            <div id="stats"></div>
            <button id="startBtn">Start</button>
            <input type="radio" id="easyBtn" value="Easy" name="difficulty" defaultChecked></input>
            <label for="easyBtn">Easy</label>
            <input type="radio" id="medBtn" value="Medium" name="difficulty"></input>
            <label for="medBtn">Medium</label>
            <input type="radio" id="hardBtn" value="Hard" name="difficulty"></input>
            <label for="hardBtn">Hard</label>
            <svg id="progressCircle" width="100" height="100">
                <circle cx="50" cy="50" r="52" fill="none" stroke="#ccc" stroke-width="4"></circle>
            </svg>
            <div id="progressText"></div>
        </div>
    );
}