function Menu({}) {
    const buttonStyle = {
        width: '500px',
        height: '300px',
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
        textDecoration: 'none', // Remove underline from text
        color: '#294E95', // Set text color to #294E95
        fontFamily: 'Inter, sans-serif', // Apply Inter font
        fontWeight: 'lighter', // Set font weight to lighter
        letterSpacing: '2px' // Increase letter spacing
    };

    const linkStyle = {
        textDecoration: 'none', // Remove underline from <a> elements
        color: '#294E95', // Set text color to #294E95
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'lighter', // Set font weight to lighter
        letterSpacing: '2px' // Increase letter spacing
    };

    return (
        <div id="menu-ctn">
            <h1 style={{ color: '#294E95', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', width: 'calc(100% - 20px)', textAlign: 'center', padding: '1rem', borderBottom: '1px solid #294E95', maxWidth: '900px' }}>
                Choose Your Game Mode
            </h1>
            <div id="menu" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'auto auto', rowGap: '2rem', columnGap: '4rem', justifyContent: 'center', maxWidth: '900px' }}>
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
