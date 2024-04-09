function Menu() {
    return (
        <div id="menu-ctn">
            <h1>
                Choose Your Game Mode
            </h1>
            <div id="menu">
                <Link to="/practice" className="menu-item"><button>Practice</button></Link>
                <a className="menu-item"><button>Local</button></a>
                <a className="menu-item"><button>Robot</button></a>
                <a className="menu-item"><button>Online Match</button></a>
            </div>
        </div>
    );
}