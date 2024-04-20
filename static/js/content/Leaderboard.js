
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
                {leaderboardData.map(score => (
                    <p key={score.username}>{score.username}: {score.highest_wpm} WPM</p>
                ))}
            </div>
        </div>
    );
}

