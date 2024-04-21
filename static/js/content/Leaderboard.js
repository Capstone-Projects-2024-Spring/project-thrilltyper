function Leaderboard() {
    const [leaderboardData, setLeaderboardData] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/leaderboard/top_n_highest_wpm/30');
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
            <h1>Leaderboard</h1>
            <div id="leaderboard">
                <h2>Top 10 Highest WPM</h2>
                <table>
                    <tbody>
                        {leaderboardData.map((player, index) => (
                            <tr key={player.username}>
                                <td>
                                    <img src={player.profile_photo} alt="Profile" />
                                </td>
                                <td className="username">
                                    <strong>{player.username}</strong>
                                    {index === 0 && <span className="rank-icon"><img src="/static/pics/golden_apple_rank_one.png" alt="Rank 1" /></span>}
                                </td>
                                <td>
                                    {player.highest_wpm} WPM (Rank: {index + 1})
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
