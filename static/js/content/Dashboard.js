function Dashboard({ userSession }) {
    const [userData, setUserData] = React.useState("")
    const [error, setError] = React.useState("")
    const [raceData, setRaceData] = React.useState([])

    React.useEffect(() => {
        console.log(userSession, typeof (userSession), userSession ? true : false)

        // Redirects to login page if not logged in
        if (!userSession) {
            window.location.href = '/login';
        }
        // Requests data from the web server
        fetch(`/user/${userSession.userinfo.given_name}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not success')
                }
                return response.json()
            })
            .then(data => {
                setUserData(data)
                console.log(data)
            })
            .catch(error => {
                setError(error)
            })

        fetch(`/raceData/${userSession.userinfo.given_name}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not success')
                }
                return response.json();
            })
            .then(data => {
                setRaceData(data);
                console.log("race data:", data)
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
            {userData ?
                <div id="userData" >
                    {/* Winnings & Losses */}
                    <section className="dashItem userOverview">
                        <p className="center flexEven">
                            Total Playing Time: {Math.floor(userData.totalTime)} minutes
                        </p>
                        <p className="center flexEven">
                            Highest WPM: {userData.highestWPM} WPM
                        </p>
                        <p className="center flexEven">
                            Accuracy: {Number(userData.accuracy).toFixed(2)}%
                        </p>
                    </section>
                    {/* Specific Data, i.e. WPM and Accuracy */}
                    <section className="dashItem statistic">
                        {/* <p className="center flexEven">
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
                        </p> */}
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        Mode
                                    </th>
                                    <th>
                                        WPM
                                    </th>
                                    <th>
                                        Date Played
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {raceData.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.selected_mode}</td>
                                        <td>{record.average_wpm}</td>
                                        <td>{record.date_played}</td>
                                    </tr>
                                )
                                )}
                            </tbody>
                        </table>
                    </section>
                </div>
                :
                <div id="dataError">
                    <b>No data</b>
                </div>
            }
        </div>
    );
}
