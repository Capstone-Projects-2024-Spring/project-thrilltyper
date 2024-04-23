function Dashboard({ userSession }) {
    const [userData, setUserData] = React.useState("");
    const [error, setError] = React.useState("");

    React.useEffect(() => {
        console.log(userSession, typeof (userSession), userSession ? true : false);

        // Redirects to login page if not logged in
        if (!userSession) {
            window.location.href = '/login';
        }
        // Requests data from the web server
        fetch(`/user/${userSession.userinfo.given_name}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not success');
                }
                return response.json();
            })
            .then(data => {
                setUserData(data);
                console.log(data)
            })
            .catch(error => {
                setError(error);
            });
    }, [userSession]);

    return (
        <div id="dashboard">
            <div id="userSetting">
                {userSession ?
                    <div id="userProfile">
                        <img className="avatar" src={userSession.avatar} alt="profile photo" referrerPolicy="no-referrer" />
                        <h1>{userSession.userinfo.given_name}</h1>
                        <a href="/logout"><button className="logOut">Logout</button></a>
                    </div>
                    :
                    <p>{error}</p>

                }
            </div>
            {userData &&
                <div id="userData" >
                    {/* Winnings & Losses */}
                    <section className="dashItem userOverview">
                        <p className="center flexEven">
                            Total Playing Time: {userData.totalTime} minutes
                        </p>
                        <p className="center flexEven">
                            Common Error: {userData.frequentMisTypedWord}
                        </p>
                    </section>
                    {/* Specific Data, i.e. WPM and Accuracy */}
                    <section className="dashItem statistic">
                        <p className="center flexEven">
                            Accuracy: {Number(userData.accuracy).toFixed(2)}%
                        </p>
                        <p className="center flexEven">
                            Highest Speed: {userData.highestWPM} WPM
                        </p>
                        <p className="center flexEven">
                            Wins: {userData.wins} games
                        </p>
                        <p className="center flexEven">
                            Losses: {userData.losses} games
                        </p>
                    </section>
                </div>
            }
        </div>
    );
}
