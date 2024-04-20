
function Leaderboard(){
    const Leaderboard = () => {
    try{
        const [leaderboardData, setLeaderboardData] = React.useState("");
    
        React.useEffect(() => {
            const response = fetch('/leaderboard/top_n_highest_wpm/10')
                .then(response => response.json())
                .then(data => {
                    setLeaderboardData(data);
                })
                .catch(error => {
                    console.error('Error fetching leaderboard data:', error);
                });
        }, []);
    }catch(error){
        console.error('There was a problem with the fetch operation:', error);
    }

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
}