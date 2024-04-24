function Multiplayer({userSession}) {
    return (
        <div id="multiplayer">
            <ChatRoom userSession={userSession}/>
            <ThrillTyperGame />
            {/* Temporary placeholder for leaderboard of the game */}
            <div className="sideComponent">

            </div>
        </div>
    );
}