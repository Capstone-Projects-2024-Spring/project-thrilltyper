function WindowPlayerProgress(){
    const [playerList, setPlayerList] = React.useState([]);

    const addPlayer = () => {
        setPlayerList(prevList => [...prevList, MakePlayerProgress()]);
    }

    return (
        <div className="window-container" id="player-window">
            <div className="window-header">
                <span className="header-title">Player Window</span>
            </div>
            <div id="host-player-progress">
                {/* Host player progress elements if any */}
            </div>
            <div id="player-progress-list-container">
                {playerList}
            </div>
            <button onClick={addPlayer}>Test</button>
        </div>
    );
    /*
    const[playerList, setPlayerList] = React.useState("");

    const addPlayer = () =>{
        playerList = makePlayerProgress();
    }

    function addPlayerProgress(){
        console.log("Hello World");
    }

    function removePlayerProgress(){

    }

    function updatePlayerProgress(percent){

    }


    return (
        <div class="window-container" id="player-window">
            <div class="window-header">
                <span class="header-title">Player Window</span>
            </div>
            <div id="host-player-progress">

            </div>
            <div id="player-progress-list-container">{playerList}</div>
            <button onClick={addPlayer}>Test</button>
        </div>
    );
    */


}