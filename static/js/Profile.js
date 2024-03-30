function Profile({userSession}) {
    return (
        <nav>
            <ul>
                {userSession == null ?
                    <div>
                        <li><a href="/signup"><button id="signUp">Create Account</button></a></li>
                        <li><a href="/login"><button id="logIn">Login in</button></a></li>
                    </div>
                    :
                    <li><a href="/logout"><button id="logOut">Logout</button></a></li>
                }
            </ul>
        </nav>
    );
}