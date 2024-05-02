function Multiplayer({userSession}) {
    const playerID = userSession ? userSession.userinfo.given_name : generatePlayerID();

    const [gameStatus, setGameStatus] = React.useState('Game not started');
    const [socket, setSocket] = React.useState(null);
    const[currentCharIndex, setCurrentCharIndex] = React.useState(0);
    const currentCharIndexRef = React.useRef(currentCharIndex); // Create a ref for currentCharIndex

    var playerList = [];
    var mySocketPlayerID;

    // var isMeAdded = false;

    
    React.useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = io(`${window.location.protocol}//${window.location.hostname}:${window.location.port}`);
        setSocket(newSocket);
        console.log("multiplayer: connected");

        newSocket.on('update players', updatedPlayers => {
            console.log("update player now")
            playerList = updatedPlayers;
                    
            console.log("socket update players: playerList = " + JSON.stringify(playerList));
            console.log("new player joined");
            updatePlayerProgressList();

        });

        newSocket.on('current player lists', players => {
            console.log("socket current player lists: Received updated player list");
            console.log(JSON.stringify(players));
            updatePlayerListProgressBar(players);
        });

        newSocket.on('your player id', data => {
            mySocketPlayerID = data.player_id;
            console.log("socket my player id: "+ mySocketPlayerID);
            addHostPlayerProgress();
        });

        newSocket.on('client disconnected', (data) => {
            console.log("a player has disconnected", data.player_id);
            removePlayerProgress(data.player_id);
        });

        newSocket.on('start game', (data) => {
            console.log(data.message);
            console.log("dataKey: " + data.textKey);
            
            //code for update text display, moved from start game
            // text = data.textKey;
            setText(data.textKey);
            // document.getElementById("text-display").innerHTML = text;
            words = text.split(" ");
            
            console.log("socket start game: playerProgressList = " + playerProgressList);
            startGame();
            intervalRef2.current = setInterval(broadcastCurrentChar, 500, newSocket);
        });

        newSocket.on('stop game', (data) => {
            console.log(data.message);
            stopGame();
            clearInterval(intervalRef2.current);
        });


        function broadcastCurrentChar(socket){
            console.log("broadcastCurrentChar: socket = "+socket);
            console.log("broadcastCurrentChar: currentCharIndex = "+ currentCharIndex);
            socket.emit('update char index', {
                player_id: socket.id,
                currentCharIndex: currentCharIndexRef.current
            });
            console.log(`Emitting currentCharIndex: ${currentCharIndexRef.current} for player ${mySocketPlayerID}`);
        }

        return () => newSocket.disconnect();
    }, []);

    const intervalRef2 = React.useRef(null);

    React.useEffect(() => {
        console.log("useEffect: currentCharIndex = "+currentCharIndex);
        currentCharIndexRef.current = currentCharIndex;
    }, [currentCharIndex]);

    // React.useEffect(() => {
    //     currentCharIndexRef.current = currentCharIndex; // Update ref whenever currentCharIndex changes
    // }, [currentCharIndex]);


    function addHostPlayerProgress(){
        const element = document.getElementById("host-player-progress");
        element.appendChild(makePlayerProgress(mySocketPlayerID));       
    }

    function updatePlayerProgressList(){
        playerList.forEach(item => {
            // Check if the element with this ID exists in the DOM and if the ID is not mySocketPlayerID
            if (!document.getElementById(item.id) && item.id !== mySocketPlayerID) {
                addPlayerProgress(item.id);
            }
        });
    }

    function updatePlayerListProgressBar(players){
        const textLength = text.length;  // Ensure `text` is defined in the outer scope or passed as a parameter

        console.log("updatePlayerListProgressBar: updating");
        players.forEach(player => {
            //need if condition because math calcualtion sometimes could not reach 100
            if(player.currentCharIndex <= text.length){ //if player has not completed game
                const newWidth = (player.currentCharIndex / textLength) * 100;  // Calculate the percentage of completion
                updatePlayerProgress(player.id, newWidth);
            }else{
                updatePlayerProgress(player.id, 100);
            }
            console.log(`updatePlayerListProgressBar for player ${player.id}: index = ${player.currentCharIndex}`);
        });
    }

    function updateHostPlayerProgress(newWidth){

        const progressBarContainer = document.getElementById("host-player-progress");
        const progressBar = progressBarContainer.querySelector(".progressbar");
        const progressBarText = progressBarContainer.querySelector(".progressbar-text");
        const progressBarIconContainer = progressBarContainer.querySelector(".grid-item3");

        progressBar.style.width = newWidth + "%";
        progressBarText.innerHTML = newWidth + "%";

        if(newWidth === 100){
            var checkmarkIcon = document.createElement('img');
            checkmarkIcon.src = '../static/pics/checkmark.png';
            progressBarIconContainer.appendChild(checkmarkIcon);
        }
        console.log("updatePlayerProgress: progressWidth = "+newWidth);
    }

    function generatePlayerID(){
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = 'guest';
        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }

        return randomString;
    }

    async function startGameMultiplayer(){
        console.log("startGameMultiplayer: socket = "+socket);
        let newText = await fetchRandomWordList();

        // text = newText;
        // document.getElementById("text-display").innerHTML = text;
        // words = text.split(" ");

        socket.emit('start game', { message: 'Host started the game', textKey: newText});

        //startGame(); do not start game because the host also calls startGame() on receiving the signal it sneds
    }

    function stopGameMultiplayer(){
        console.log("stopGameMultiplayer: "+intervalRef.current);   //DEBUG
        socket.emit('stop game', { message: 'Host stopped the game' });
        stopGame();
    }

    /*

        Divide Line for original code

    */
    function startGame(){
        /* code moved to startMultiplayer for synchornization 
        let newText = await fetchRandomWordList();
        text = newText;
        document.getElementById("text-display").innerHTML = text;
        words = text.split(" ");
        */
        setIsGameStarted(true);
        resetVariables();
        resetPlayerProgress();
        // resetPlayerProgress();
        startTimer();
        
        document.getElementById("input-box").disabled = false;
        console.log("start game");
    }



    function stopGame(){
        //resetVariables();
        setIsGameStarted(false);
        console.log("stop game interval: "+intervalRef.current);   //DEBUG
        document.getElementById("input-box").value = "";
        document.getElementById("input-box").disabled = true;
        stopTimer();
        console.log("stop game");
    }


    const[text, setText] = React.useState("Click start button to start!");
    // let text = "Click start button to start!";
    let words = text.split(" ");
    // let startTime;
    const [startTime, setStartTime] = React.useState(() => new Date().getTime()); // Initializes startTime on first render

    // let currentCharIndex = 0;   //only increment when user has typed correct letter


    // let currentWordIndex = 0;

    const[currentWordIndex, setCurrentWordIndex] = React.useState(0);

    let wrongCharCount = 0;
    // let userInputCorrectText = "";

    const[userInputCorrectText, setUserInputCorrectText] = React.useState("");

    const playerProgressList = [];

    const intervalRef = React.useRef(null);

    React.useEffect(() => {
        return () => {
          clearInterval(intervalRef.current);
          clearInterval(intervalRef2.current);
        };
    }, []);

    //updates typed display, wpm display, and accuracy display
    /*
    function updateStatusContainer(){
        
        console.log("updated Status Container: text"+text);
        console.log("updated status container: currentCharIndex = "+currentCharIndex);
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000;

        const typed = currentCharIndex + "/" + text.length;
        const wpm = Math.round((currentCharIndex/5 / elapsedTime) * 60);
        const accuracy = (text.length - wrongCharCount)/text.length*100;

        document.querySelector(".progress-display").innerHTML = "Typed: " + typed;
        document.querySelector(".wpm-display").innerHTML = "WPM: " + wpm;
        document.querySelector(".accuracy-display").innerHTML = "Accuracy:" + accuracy.toFixed(1) + "%"; 

        const progressBarContainer = document.getElementById("host-player-progress");
        const progressBarWPM = progressBarContainer.querySelector(".grid-item4");
        progressBarWPM.innerHTML = "WPM: " + wpm;
        
        console.log("update status container: text.length = "+text.length);
    }
    */

    const[wpmValue, setwpmValue] = React.useState(0);

    React.useEffect(() => {
        const updateStatusContainer = () => {
            const currentTime = new Date().getTime();
            const elapsedTime = (currentTime - startTime) / 1000;
    
            // const typed = `${currentCharIndex}/${text.length}`;
            const wpm = Math.round((currentCharIndex / 5 / elapsedTime) * 60);

            const value = currentCharIndex / 5 / elapsedTime * 60;

            console.log("updateStatusContainer: value = "+value);
            console.log("updateStatusContainer: currentTime = "+ startTime);

            if(elapsedTime != 0){
                setwpmValue(Math.round((currentCharIndex / 5 / elapsedTime) * 60));
            }
            const accuracy = ((text.length - wrongCharCount) / text.length * 100).toFixed(1);
    

        };
        /*
        <div class="progress-display">Typed: 0</div>
        <div class="wpm-display">WPM: 0</div>
        <div class="accuracy-display">Accuracy: 100%</div>
        */
    
        updateStatusContainer();  // Call the internal function
    }, [currentCharIndex, text, startTime, wrongCharCount]);  // Include all dependencies that affect the calculations
    
    
    

    function checkInput() {
        console.log("checkInput: tex.lengtht = "+text.length);
        console.log("checkInput: userInputCorrectText = "+ userInputCorrectText);
        console.log("checkInput: currentCharIndex = "+ currentCharIndex);

        var userInputText = document.getElementById("input-box").value;
        var userInputLastChar = userInputText[userInputText.length - 1];

        
        //updates text color
        var userInputFullText = userInputCorrectText + document.getElementById("input-box").value;
        updateText();
        

        //if typed word matches with text word and last letter is space, clear input box and add word to userInputCorrectText
        if (userInputText.substring(0, userInputText.length - 1) == words[currentWordIndex] && userInputLastChar == ' ') {
            // currentWordIndex++;
            setCurrentWordIndex(currentWordIndex+1)
            // userInputCorrectText += userInputText;  //saves correct text
            setUserInputCorrectText(userInputCorrectText + userInputText);
            document.getElementById("input-box").value = "";
        }

        if (userInputLastChar == text[currentCharIndex]) {
            // currentCharIndex++;
            setCurrentCharIndex(currentCharIndex+1);
            // console.log("updateText split1: currentCharIndex = " + currentCharIndex);
        }else{
            wrongCharCount++;
        }

        //update player progress bar
        // updatePlayerProgress(playerProgressList[0], Math.ceil(currentCharIndex/text.length*100));
        updateHostPlayerProgress(Math.floor(currentCharIndex/text.length*100));
        
        console.log("near checkInput: tex.lengtht = "+text.length);
        console.log("near checkInput: currentCharIndex = "+ currentCharIndex);

        //submit input if last letter is typed
        /*
        if (currentCharIndex >= text.length) {
            submitInput();
            console.log("checkInput: split one 1 executed = "+text);
            updateStatusContainer();
        }*/

        if(userInputFullText === text){
            submitInput();
            console.log("checkInput: split one 1 executed = "+text);
            updateHostPlayerProgress(Math.ceil(currentCharIndex/text.length*100));
        }
        
    }

    function submitInput(){
        stopGame();
        document.getElementById("result-display").innerHTML = "Congratulations! You completed the game!";
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
        if(!isGameStarted){ 
            return;
        }
        var str = text;
        var userInputFullText = userInputCorrectText + document.getElementById("input-box").value;
        console.log("updateText: userInputCorrectText" + userInputCorrectText);
        console.log("updateText: userInputFullText = "+userInputFullText);

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
        
        // return updateText;
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

    function resetVariables(){
        // currentWordIndex = 0;   //initializes value for play again
        setCurrentWordIndex(0);
        // currentCharIndex = 0;
        setCurrentCharIndex(0);
        // userInputCorrectText = "";
        setUserInputCorrectText("");
        document.getElementById("input-box").value = "";
        // document.getElementById("timer-display").innerHTML = "";
        document.getElementById("result-display").innerHTML = "";
    }


/*
    function startTimer(){
        //startTime = new Date().getTime();
        setStartTime(new Date().getTime());
        intervalRef.current = setInterval(updateTimer, 10);
    }
*/

    // rewrite timer
    function startTimer(){
        const start = new Date().getTime();
        setStartTime(start);  // Set the start time when timer starts
        intervalRef.current = setInterval(updateTimer, 10, start);  // Pass start time to ensure consistency
    }

    function stopTimer(){
        clearInterval(intervalRef.current);
    }

    const[elapsedTime, setElapsedTime] = React.useState(0);

    /*
    function updateTimer(){
        const currentTime = new Date().getTime();
        const elapsedTimeValue = (currentTime - startTime) / 1000;
        
        console.log("updateTimer: currentTime = "+currentTime);
        console.log("updateTimer: elapsedTime = "+elapsedTimeValue);
        setElapsedTime((currentTime - startTime) / 1000);

        // console.log("updateTimer: elapsedTime: " + elapsedTime);
        document.getElementById("timer-display").innerHTML = `${elapsedTime.toFixed(2)} s`;
        // updateStatusContainer();    //should placed somewhere else but put here for convenience
        console.log("update timer: executed");
    }
    */

    function updateTimer(start){
        const currentTime = new Date().getTime();
        const elapsedTimeValue = (currentTime - start) / 1000;
        
        //console.log("updateTimer: currentTime = " + currentTime);
        //console.log("updateTimer: elapsedTime = " + elapsedTimeValue);
        setElapsedTime(elapsedTimeValue);
    
        // Logging here is fine but avoid direct DOM manipulation
        //console.log("update timer: executed");
    }
    

    function addPlayerProgress(id){
        // const newProgressID = "player" + playerProgressList.length;
        // playerProgressList.push(newProgressID);
        const element = document.getElementById("player-progress-list-container");
        element.appendChild(makePlayerProgress(id));       
        console.log("addPlayerProgrss: id = " + id);
    }

    function removePlayerProgress(id){
        // const element = document.getElementById("player-progress-list-container");
        // if(playerProgressList.length > 1){
        //     const toRemove = document.getElementById(playerProgressList.pop());
        //     element.removeChild(toRemove);
        // }
        const element = document.getElementById("player-progress-list-container");
        const toRemove = document.getElementById(id); // Get the element by id directly
        if (toRemove && element.contains(toRemove)) { // Ensure the element exists and is a child before removing
            element.removeChild(toRemove); // Remove the specific element
            // Optionally update the playerProgressList to reflect this change
            const index = playerProgressList.indexOf(id);
            if (index > -1) {
                playerProgressList.splice(index, 1); // Remove the id from the list
            }
        }
    }
    
    function updatePlayerProgress(id, newWidth){
        console.log("updatePlayerProgress: id = "+id);
        const progressBarContainer = document.getElementById(id);
        const progressBar = progressBarContainer.querySelector(".progressbar");
        const progressBarText = progressBarContainer.querySelector(".progressbar-text");
        const progressBarIconContainer = progressBarContainer.querySelector(".grid-item3");

        progressBar.style.width = newWidth + "%";
        progressBarText.innerHTML = newWidth + "%";

        const hasIcon = (document.getElementById("check-icon") != null);
        if(newWidth === 100 && !hasIcon){
            var checkmarkIcon = document.createElement('img');
            checkmarkIcon.id = "check-icon";
            checkmarkIcon.src = '../static/pics/checkmark.png';
            progressBarIconContainer.appendChild(checkmarkIcon);
        }
        console.log("updatePlayerProgress: progressWidth = "+newWidth);
    }

    //clear host progress bar
    function resetPlayerProgress(){
        const progressBarContainer = document.getElementById("host-player-progress");
        const progressBar = progressBarContainer.querySelector(".progressbar");
        const progressBarText = progressBarContainer.querySelector(".progressbar-text");
        const progressBarIconContainer = progressBarContainer.querySelector(".grid-item3");

        progressBar.style.width = 0 + "%";
        progressBarText.innerHTML = "";
        progressBarIconContainer.innerHTML = "";

    }

    React.useEffect(() => { //force re-render to let updateText() have correct variable
        updateText();
    }, [userInputCorrectText]);  // Depend on both the text and the trigger

    const [isGameStarted, setIsGameStarted] = React.useState(false);    //only used once for updateText() in fillText to work properly

    function fillText(){
        // userInputCorrectText = text.substring(0, text.length-1);
        setUserInputCorrectText(text.substring(0, text.length-1));
        // currentCharIndex = text.length-1;
        setCurrentCharIndex(text.length-1);
        setTriggerUpdate(triggerUpdate => triggerUpdate+1);
        updateText();
        //console.log("text: " + text);
        //console.log("userInputCorrectText: " + userInputCorrectText);
    }

    // magic code added by gao from 3308
    if (socket == null) {
        return <div>Is Loading...</div>;
    }

    return (

        <div id="multiplayer-game-container">
            {/* original code
            <div id="multiplayer">
                <ChatRoom userSession={userSession}/>
                <ThrillTyperGame />
                <div className="sideComponent">

                </div>
            </div>
            */}

            {/* modified code without integration
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
            */}

            <div class="window-container" id="chat-window">
                <div id="multiplayer">
                    <ChatRoom userSession={userSession} socketArgument={socket} />
                </div>
            </div>

            <div class="window-container" id="timer-window">
                <div id="timer-display">Time {elapsedTime.toFixed(2)}s</div>
            </div>

            <div class="window-container" id="text-window">
                <div class="window-header">
                    <span class="header-title">Text Window</span>
                </div>
            
                <div class="stats-container">
                    <div class="progress-display">Typed: {currentCharIndex}/{text.length}</div>
                    <div class="wpm-display">WPM: {wpmValue}</div>
                    {/* <div class="accuracy-display">Accuracy: 100%</div> */}
                </div>
            
                <div class="text-display-container">
                    <div class="text-display" id="text-display">
                        {text}
                    </div>
                    <input type="text" class="input-bpx" id="input-box" onInput={checkInput} disabled/>
                </div>

                <div id="result-display"></div>
                <div id="button-holder">
                    <button onClick={startGameMultiplayer}>Start</button>
                    <button onClick={stopGameMultiplayer}>Stop</button>
                    <button onClick={fillText}>Fill Text</button>
                </div>
            </div>


            <div className="window-container" id="player-window">
                <div className="window-header">
                    <span className="header-title">Player Window</span>
                </div>
                
                <div id="host-player-progress">
                    {/*
                    <div class="grid-container" id="player0">
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
                        <div class="grid-item3"> {/* checkmark placeholder */}{/* </div> 
                        <div class="grid-item4">
                            WPM: 0
                        </div>
                        <div class="grid-item5"></div>  
                    </div>
                    */}  
                </div>
                

                <div id="player-progress-list-container">
                </div>
                <button onClick={addPlayerProgress}>Test Adding</button>
                <button onClick={() => removePlayerProgress()}>Test Removing</button>
            </div>

        </div>


    );
}