function Multiplayer({userSession}) {
    let text = "Click start button to start!";
    let words = text.split(" ");
    let startTime;

    let currentCharIndex = 0;   //only increment when user has typed correct letter
    let currentWordIndex = 0;
    let userInputCorrectText = "";

    const intervalRef = React.useRef(null);

    //updates typed display, wpm display, and accuracy display
    function updateStatusContainer(){

    }

    function checkInput() {
        console.log("checkInput: text = "+text);
        var userInputText = document.getElementById("input-box").value;
        var userInputLastChar = userInputText[userInputText.length - 1];

        console.log("executed");
        
        //updates text color
        updateText();

        

        //if typed word matches with text word and last letter is space, clear input box and add word to userInputCorrectText
        if (userInputText.substring(0, userInputText.length - 1) == words[currentWordIndex] && userInputLastChar == ' ') {
            currentWordIndex++;
            userInputCorrectText += userInputText;  //saves correct text
            document.getElementById("input-box").value = "";
        }

        if (userInputLastChar == text[currentCharIndex]) {
            currentCharIndex++;
        }

        //update player progress bar
        updatePlayerProgress(playerProgressList[0], Math.ceil(currentCharIndex/text.length*100));
       
        //submit input if last letter is typed
        if (currentCharIndex >= text.length) {
            submitInput();
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

        var updatedText = `<span style="color: #9CCE52">${greenText}</span>` +
            `<span style="background: #F0A3A3">${redText}</span>` + uncoloredText;

        document.getElementById("text-display").innerHTML = updatedText;
        
    }


    function resetVariables(){
        currentWordIndex = 0;   //initializes value for play again
        currentCharIndex = 0;
        userInputCorrectText = "";
        document.getElementById("input-box").value = "";
        document.getElementById("timer-display").innerHTML = "";

        // startTime = new Date().getTime();
        

        //stopTimerInterval();
        //startTimerInterval();
    }

    async function startGame(){
        let newText = await fetchRandomWordList();
        text = newText;
        document.getElementById("text-display").innerHTML = text;
        words = text.split(" ");
        resetVariables();
        document.getElementById("input-box").disabled = false;
        startTimer();
        console.log("start game");
    }

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

    function stopGame(){
        resetVariables();
        document.getElementById("input-box").disabled = true;
        stopTimer();
        document.getElementById("text-display").innerHTML = "Click start button to start!";
        console.log("stop game");
    }

    function startTimer(){
        startTime = new Date().getTime();
        intervalRef.current = setInterval(updateTimer, 10);
    }

    function stopTimer(){
        clearInterval(intervalRef.current);
    }

    function updateTimer(){
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000;
        document.getElementById("timer-display").innerHTML = `${elapsedTime.toFixed(2)} seconds`;
    }


    const playerProgressList = ["player1"];

    function addPlayerProgress(){
        const newProgressID = "player" + (playerProgressList.length + 1);
        playerProgressList.push(newProgressID);
        const element = document.getElementById("player-progress-list-container");
        element.appendChild(makePlayerProgress(newProgressID));       
        console.log("addPlayerProgrss: playerProgressList = " + playerProgressList);
    }

    function removePlayerProgress(){
        const element = document.getElementById("player-progress-list-container");
        const toRemove = document.getElementById(playerProgressList.pop());
        element.removeChild(toRemove);
    }
    
    function updatePlayerProgress(id, newWidth){
        const progressBarContainer = document.getElementById(id);
        const progressBar = progressBarContainer.querySelector(".progressbar");
        const progressBarText = progressBarContainer.querySelector(".progressbar-text");
        const progressBarIconContainer = progressBarContainer.querySelector(".grid-item3")

        progressBar.style.width = newWidth + "%";
        progressBarText.innerHTML = newWidth + "%";

        if(newWidth === 100){
            var checkmarkIcon = document.createElement('img');
            checkmarkIcon.src = '../static/pics/checkmark.png';
            progressBarIconContainer.appendChild(checkmarkIcon);
        }
        console.log("updatePlayerProgress: progressWidth = "+newWidth);
    }



    return (




        <div id="multiplayer-game-container">
            {/*
            <div id="multiplayer">
                <ChatRoom userSession={userSession}/>
                <ThrillTyperGame />
                <div className="sideComponent">

                </div>
            </div>
            */}

            <div class="window-container" id="chat-window">
                <div class="window-header">
                    <span class="header-title">Chat Window</span>
                </div>
                <div class="chat-interface">
                    Billy: Hi
                </div>
                <div class="chat-input">
                    Enter Message Here
                </div>
            </div>

            <div class="window-container" id="timer-window">
                <div id="timer-display"></div>
            </div>

            <div class="window-container" id="text-window">
                <div class="window-header">
                    <span class="header-title">Text Window</span>
                </div>
            
                <div class="stats-container">
                    <div class="progress-display">Typed: 344/1766</div>
                    <div class="wpm-display">WPM: 60</div>
                    <div class="accuracy-display">Accuracy: 94%</div>
                </div>
            
                <div class="text-display-container">
                    <div class="text-display" id="text-display">
                        {text}
                    </div>
                    <input type="text" class="input-bpx" id="input-box" onInput={checkInput} disabled/>
                </div>

                <div id="result-display"></div>
                <button onClick={startGame}>Start</button>
                <button onClick={stopGame}>Reset</button>
            </div>


            <div className="window-container" id="player-window">
                <div className="window-header">
                    <span className="header-title">Player Window</span>
                </div>
                <div id="host-player-progress">
                    <div class="grid-container" id="player1">
                        <div class="grid-item1">
                            <img src="../static/pics/defaultUserIcon.jpg"/>
                        </div>

                        <div class="grid-item2">
                            <div class="progressbar-container"> 
                                <div class="progressbar">
                                    <span class="progressbar-text"></span>
                                </div>
                            </div>
                        </div>
                        <div class="grid-item3">
                            {/* checkmark placeholder */}
                        </div>  
                        <div class="grid-item4">
                            WPM: 89
                        </div>
                        <div class="grid-item5"></div>  
                    </div>  
                </div>
                <div id="player-progress-list-container">
                </div>
                <button onClick={addPlayerProgress}>Test Adding</button>
                <button onClick={() => removePlayerProgress()}>Test Removing</button>
            </div>

        </div>


    );
}