function WindowGamePlay(){

    return(
        <div class="window-container" id="text-window">
        <div class="window-header">
            <span class="header-title">Text Window</span>
        </div>
    
        {/* <!-- Stats container --> */}
        <div class="stats-container">
            <div class="progress-display">Typed: 344/1766</div>
            <div class="wpm-display">WPM: 60</div>
            <div class="accuracy-display">Accuracy: 94%</div>
        </div>
    
        {/* <!-- Text display container --> */}
        <div class="text-display-container">
            <div class="text-display">
                I walk ten thousand miles, ten thousand miles to see you. And every gasp of breath I grabbed it just to find you. I climbed up every hill to get to you. I wandered ancient lands to hold just you.
            </div>
            <input type="text" class="input-box" oninput="checkInput()" disabled/>
        </div>
    </div>
    );


}