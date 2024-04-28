function Menu({}) {
    const buttonStyle = {
        width: '500px', /* Increase button width */
        height: '300px', /* Increase button height */
        fontSize: '2rem', /* Increase font size */
        padding: '20px 15px', /* Increase padding */
        border: '2px solid #294E95', /* Change border color */
        borderRadius: '15px', /* Increase border radius */
        backgroundColor: 'white', /* White background */
        display: 'flex', /* Enable flexbox for positioning */
        flexDirection: 'column', /* Stack elements vertically */
        justifyContent: 'center', /* Center content vertically */
        alignItems: 'center', /* Center content horizontally */
        position: 'relative', /* Set position to relative for absolute positioning of image and text */
        overflow: 'hidden', /* Hide overflowing content */
        textDecoration: 'none', /* Remove underline */
        outline: 'none', /* Remove outline on focus */
        cursor: 'pointer', /* Set cursor to pointer on hover */
    };
    

    const textStyle = {
        fontFamily: 'Inter, sans-serif', /* Use Inter font */
        fontSize: '1.5rem', /* Set font size */
        textDecoration: 'none', /* Remove underline */
        color: '#294E95', /* Set text color */
        fontWeight: 'normal', /* Remove bold */
    };

    const buttonSpanStyle = {
        textDecoration: 'none !important', /* Remove underline */
    };

    return (
        <div id="menu-ctn">
            <h1 style={{ color: '#294E95', fontFamily: 'Arial, sans-serif', fontWeight: 'bold', width: 'calc(100% - 20px)', textAlign: 'center', padding: '1rem', borderBottom: '1px solid #294E95', maxWidth: '900px' }}>
                Choose Your Game Mode
            </h1>
            <div id="menu" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'auto auto', rowGap: '2rem', columnGap: '4rem', justifyContent: 'center', maxWidth: '900px' }}>
                <Link id="singlePlayerMode" to="/singlePlayer" className="menu-item">
                    <button style={buttonStyle}>
                        <img src="/static/pics/SinglePlayerMode.png" alt="Single Player Image" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
                        <span style={{ ...textStyle, ...buttonSpanStyle }}>Single Player</span>
                    </button>
                </Link>
                <Link id="robotMode" to="/robotOpponent" className="menu-item">
                    <button style={buttonStyle}>
                        <img src="/static/pics/RobotMode.png" alt="Robot Image" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
                        <span style={{ ...textStyle, ...buttonSpanStyle }}>Robot</span>
                    </button>
                </Link>
                <Link id="importTextMode" to="/importText" className="menu-item">
                    <button style={buttonStyle}>
                        <img src="/static/pics/LocalMatchMode.png" alt="Import Text Image" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
                        <span style={{ ...textStyle, ...buttonSpanStyle }}>Import Text Mode</span>
                    </button>
                </Link>
                <Link id="multiplayerMode" to="/multiplayer" className="menu-item">
                    <button style={buttonStyle}>
                        <img src="/static/pics/MultiplayerMode.png" alt="Multiplayer Image" style={{ width: '150px', height: 'auto', marginBottom: '20px' }} />
                        <span style={{ ...textStyle, ...buttonSpanStyle }}>Multiplayer</span>
                    </button>
                </Link>
            </div>
        </div>
    );
}
