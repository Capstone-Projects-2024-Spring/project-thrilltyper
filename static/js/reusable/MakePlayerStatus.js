function MakePlayerStatus(){
    return (
        <div class="grid-container">
            <div class="grid-item1">
                <img src="../static/pics/defaultUserIcon.jpg"/>
            </div>

            <div class="grid-item2">
                <div class="progressbar-container"> 
                    <div class="progressbar">
                        <span class="progressbar-text">10%</span>
                    </div>
                </div>
            </div>
            <div class="grid-item3">
                <img src="../static/pics/checkmark.png"/>
            </div>  
            <div class="grid-item4">
                WPM: 89
            </div>
            <div class="grid-item5"></div>  
        </div>  
    );
}