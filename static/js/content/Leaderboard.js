function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/leaderboard/top_n_highest_wpm/50');
                const data = await response.json();
                setLeaderboardData(data);
            } catch (error) {
                console.error('Error fetching leaderboard data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1 id="leaderboardTitle">Leaderboard</h1>
            <div id="leaderboard">
                <h2>Top 50 Highest WPM</h2>
                <table>
                    <thead>
                        <tr>
                            <th className="icon1">User Profile Photo</th>
                            <th className="icon2">User Name</th>
                            <th className="icon3">User WPM</th>
                            <th className="icon4">Accuracy</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((player, index) => (
                            <tr key={player.username} className={index === 0 ? 'rank-one' : index === 1 ? 'rank-two' : index === 2 ? 'rank-three' : ''}>
                                <td>
                                    <img src={player.profile_photo} alt="Profile" />
                                </td>
                                <td className="username">
                                    <strong>{player.username}</strong>
                                    {index === 0 && <span className="rank-icon"><img src="/static/pics/leaderboard_winner.png" alt="Rank 1" /></span>}
                                    {index === 1 && <span className="rank-icon"><img src="/static/pics/leaderboard_second.png" alt="Rank 2" /></span>}
                                    {index === 2 && <span className="rank-icon"><img src="/static/pics/leaderboard_third.png" alt="Rank 3" /></span>}
                                </td>
                                <td>
                                    {player.highest_wpm} WPM (Rank: {index + 1})
                                </td>
                                <td>
                                    {typeof player.accuracy === 'number' ? player.accuracy.toFixed(2) + '%' : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
