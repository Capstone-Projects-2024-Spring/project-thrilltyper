function Profile({userSession}) {
    return (
        <nav>
            <ul>
                {userSession === null ?
                    <div>
                        {/* <li><a href="/signup"><button className="signUp">Create Account</button></a></li>
                        <li><a href="/login"><button className="logIn">Login in</button></a></li> */}
                        <li><a href="/signup" className="href-button" id="signUpButton">Sign Up</a></li>
                        <li><a href="/login" className="href-button" id="logInButton">Log In</a></li>
                    </div>
                    :
                    <div>
                        { /* <li><a href="/logout"><button className="logOut">Logout</button></a></li> */}
                        <li><a href="/logout" className="logOut" id="logOutButton"></a>Logout</li> 
                    </div>
                }
            </ul>
        </nav>
    );
}