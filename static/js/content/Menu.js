function Menu({}) {
    return (
        <div id="menu-ctn">
            <h1>
                Choose Your Game Mode
            </h1>
            <div id="menu">
                <Link id="singlePlayerMode" to="/singlePlayer" className="menu-item"><button>Single Player</button></Link>
                <Link id="robotMode" to="/robotOpponent" className="menu-item"><button>Robot</button></Link>
                <Link id="importTextMode" to="/importText" className="menu-item"><button>Import Text Mode</button></Link>
                <Link id="multiplayerMode" to="/multiplayer" className="menu-item"><button>Multiplayer</button></Link>
            </div>
        </div>
    );
}