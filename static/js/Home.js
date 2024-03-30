function Home({ userSession }) {
    const Link = ReactRouterDOM.Link;
    const Route = ReactRouterDOM.Route;

    return (
        <ReactRouterDOM.HashRouter>
            <header id="main">
                <div id="brand">
                    <Link to="/">
                        <img className="brand-logo" src="./static/pics/anonymous.png" alt="Thrill Typer" />
                    </Link>
                    <Link to="/"><h1 className="brand-title">Thrill Typer</h1></Link>
                </div>

                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/">Play</Link>
                    <Link to="/">Leaderboards</Link>
                    <Link to="/">About</Link>
                </nav>
                <Profile userSession={userSession} />
            </header>
            <div id="content">

            </div>

        </ReactRouterDOM.HashRouter>
    );
}