function About() {
    return (
        <div className="aboutContainer">
            {/* About ThrillTyper Section */}
            <section id="about">
                <h1>About ThrillTyper</h1>
                <p>ThrillTyper is a web-based typing race game aimed at improving user's typing speed and typing accuracy. With a focus on providing an immersive typing experience, ThrillTyper offers various game modes and features tailored to meet the needs of typing enthusiasts at all skill levels.</p>
            </section>

            {/* Starring Features Section */}
            <section id="features">
                <h2>Starring Features</h2>
                <ul>
                    <li>Single Player mode: Self-practicing mode fits for players at all skill ranges. Randomly generated texts ensure each practice run is unique and diverse.</li>
                    <li>Robot mode: Competing with a Robot with predefined configurations of multiple ranges of speed. Players can determine the typing speed of the Robot before starting the game.</li>
                    <li>Multiplayer: Competing with others in real-time along with a chat room to communicate before starting or after finishing a game session.</li>
                    <li>Personalized Dashboard: Logged-in users can have analyzed in-game data displayed within the user dashboard, providing information not limited to word per minute, accuracy, total playing time, and many more.</li>
                    <li>Overall Leaderboard: ThrillTyper supports an overall leaderboard showing off and honoring the top fifty fastest typing players.</li>
                </ul>
            </section>

            {/* Contributors Section */}
            <section id="contributors">
                <h2>Contributors</h2>
                <div className="profiles">
                    {/* Each contributor in a separate container */}
                    <div className="contributor">
                        <img src="../static/pics/testing_photo.gif" alt="Profile Photo" />
                        <p>John Doe</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/profile2.jpg" alt="Profile Photo" />
                        <p>Jane Smith</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/profile3.jpg" alt="Profile Photo" />
                        <p>Michael Johnson</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/profile4.jpg" alt="Profile Photo" />
                        <p>Sarah Adams</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/profile5.jpg" alt="Profile Photo" />
                        <p>David Brown</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/profile6.jpg" alt="Profile Photo" />
                        <p>Emily Wilson</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/profile7.jpg" alt="Profile Photo" />
                        <p>Chris Lee</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/profile8.jpg" alt="Profile Photo" />
                        <p>Lisa Taylor</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
