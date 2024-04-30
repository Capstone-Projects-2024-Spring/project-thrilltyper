function Menu({}) {
    const buttonStyle = {
        width: '100%',
        height: 'auto',
        fontSize: '2rem',
        padding: '20px 15px',
        border: '2px solid #294E95',
        borderRadius: '15px',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        color: '#294E95',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'lighter',
        letterSpacing: '2px'
    };

    const linkStyle = {
        textDecoration: 'none',
        color: '#294E95',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'lighter',
        letterSpacing: '2px'
    };

    return (
        <div id="menu-ctn">
            <div id="title-container"> {/* Container for the h1 */}
                <h1>Choose Your Game Mode</h1> {/* Moved the h1 here */}
            </div>
            <div id="menu" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gridTemplateRows: 'auto auto', rowGap: '2rem', columnGap: '4rem', justifyContent: 'center', maxWidth: '900px' }}>
                <Link id="singlePlayerMode" to="/singlePlayer" className="menu-item" style={linkStyle}>
                    <button style={buttonStyle}>
                        <img src="/static/pics/SinglePlayerMode.png" alt="Single Player Image" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
                        Single Player
                    </button>
                </Link>
                <Link id="robotMode" to="/robotOpponent" className="menu-item" style={linkStyle}>
                    <button style={buttonStyle}>
                        <img src="/static/pics/RobotMode.png" alt="Robot Image" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
                        Robot
                    </button>
                </Link>
                <Link id="importTextMode" to="/importText" className="menu-item" style={linkStyle}>
                    <button style={buttonStyle}>
                        <img src="/static/pics/import_text_mode.png" alt="Import Text Image" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
                        Import Text Mode
                    </button>
                </Link>
                <Link id="multiplayerMode" to="/multiplayer" className="menu-item" style={linkStyle}>
                    <button style={buttonStyle}>
                        <img src="/static/pics/MultiplayerMode.png" alt="Multiplayer Image" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
                        Multiplayer
                    </button>
                </Link>
            </div>
        </div>
    );
}
