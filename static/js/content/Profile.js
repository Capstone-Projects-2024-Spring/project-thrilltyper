function Profile({userSession}) {
    return (
        <nav>
            <ul>
                {userSession === null ?
                    <div>
                        <li><a href="/signup"><button className="signUp">Create Account</button></a></li>
                        <li><a href="/login"><button className="logIn">Login in</button></a></li>
                    </div>
                    :
                    <li><a href="/logout"><button className="logOut">Logout</button></a></li>
                }
            </ul>
        </nav>
    );
}