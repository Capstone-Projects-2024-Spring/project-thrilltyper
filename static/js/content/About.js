
  function About() {
    // Style for the footer
    const footerStyle = {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        color: '#666', 
        fontSize: '14px',
    };
    
  
    return (
      <div>
        <div className="aboutContainer">
          {/* Left image */}
          <div className="left-image">
            <img src="../static/pics/about_background.png" alt="Left Image" />
          </div>
  
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
  
          {/* Update Log Section */}
          <section id="updateLog">
            <h2>Update Log</h2>
            <div className="updateEntry">
              <div className="updateLabel">March 2024</div>
              <div className="updateDescription">
                <p>Single player practice game mode is now available.</p>
                <p>User login feature is now available for users login via username/password or email authentication.</p>
                <p>Robot Opponent mode under single player is now available with a fixed wpm set.</p>
                <p>Text for single player practice mode is now randomly generated, ensuring each run of the typing is unique.</p>
              </div>
            </div>
            <div className="updateEntry">
              <div className="updateLabel">April 2024</div>
              <div className="updateDescription">
                <p>Overall leaderboard is now available for both guests and authenticated users, showing the top 50 ranked fastest typers recorded on the website.</p>
                <p>Multiplayer chat rooms are now available for guest and authenticated users to chat.</p>
                <p>Import text mode under single player is now available for users to enter self-determined text content for practice mode.</p>
              </div>
            </div>
          </section>
  
        {/* Contributors Section */}
        <section id="contributors">
          <h2>Contributors</h2>
          <div className="profiles">
                    {/* Each contributor in a separate container */}
                    <div className="contributor">
                        <img src="../static/pics/contributors/finn.gif" alt="Profile Photo" />
                        <p>Ereizas</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/contributors/oggy.gif" alt="Profile Photo" />
                        <p>Icycoldveins</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/contributors/unicorn.gif" alt="Profile Photo" />
                        <p>Bochi</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/contributors/disappointed.gif" alt="Profile Photo" />
                        <p>Dem0nMaxwell</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/contributors/frankensteins-monster.gif" alt="Profile Photo" />
                        <p>JasonC136</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/contributors/redragon.gif" alt="Profile Photo" />
                        <p>Demonlaplace</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/contributors/loch-ness-monster.gif" alt="Profile Photo" />
                        <p>Jimmy70111</p>
                    </div>

                    <div className="contributor">
                        <img src="../static/pics/contributors/puzzled.gif" alt="Profile Photo" />
                        <p>Tuk04440</p>
                    </div>
            </div>
          </section>
  
          {/* Right image */}
          <div className="right-image">
            <img src="../static/pics/about_background.png" alt="Right Image" />
          </div>
        </div>
  
        {/* Footer section */}
        <footer style={footerStyle}>
          <p>Icons by <a href="https://icons8.com/" target="_blank" rel="noopener noreferrer">Icons8</a></p>
        </footer>
      </div>
    );
  }
  