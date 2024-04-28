function Multiplayer({userSession}) {
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

            <WindowChat></WindowChat>
            <WindowGamePlay></WindowGamePlay>
            <WindowPlayerProgress></WindowPlayerProgress>
        </div>


    );
}