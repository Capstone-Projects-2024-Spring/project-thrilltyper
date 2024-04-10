function Menu() {
    return (
        <div id="menu-ctn">
            <h1>
                Choose Your Game Mode
            </h1>
            <div id="menu">
                <Link to="/practice" className="menu-item"><button>Practice</button></Link>
                <Link to="/robotOpponent" className="menu-item"><button>Robot</button></Link>
                <a className="menu-item"><button>Local</button></a>
                <a className="menu-item"><button>Online Match</button></a>
            </div>
        </div>
    );
}