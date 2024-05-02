function MakePlayerProgress(){
    return (
        <div class="grid-container">
            <div class="grid-item1">
                <img src="../static/pics/defaultUserIcon.jpg"/>
            </div>

            <div class="grid-item2">
                <div class="progressbar-container"> 
                    <div class="progressbar" id="hello">
                        <span class="progressbar-text" id="hello2">10%</span>
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

function makePlayerProgress(id){
    // Create the container
    var gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    gridContainer.id = id;

    // Create the first grid item and append an image
    var gridItem1 = document.createElement('div');
    gridItem1.className = 'grid-item1';
    var userIcon = document.createElement('img');
    userIcon.src = '../static/pics/defaultUserIcon.jpg';
    gridItem1.appendChild(userIcon);

    // Create the second grid item with a progress bar
    var gridItem2 = document.createElement('div');
    gridItem2.className = 'grid-item2';
    var progressbarContainer = document.createElement('div');
    progressbarContainer.className = 'progressbar-container';
    var progressbar = document.createElement('div');
    progressbar.className = 'progressbar';
    var progressbarText = document.createElement('span');
    progressbarText.className = 'progressbar-text';
    progressbarText.textContent = '50%';
    progressbar.appendChild(progressbarText);
    progressbarContainer.appendChild(progressbar);
    gridItem2.appendChild(progressbarContainer);

    // Create the third grid item and append an image
    var gridItem3 = document.createElement('div');
    gridItem3.className = 'grid-item3';

    //var checkmarkIcon = document.createElement('img');    controlled by updateTimer()
    //checkmarkIcon.src = '../static/pics/checkmark.png';
    //gridItem3.appendChild(checkmarkIcon);

    // Create the fourth grid item for user name and WPM display
    var gridItem4 = document.createElement('div');
    gridItem4.className = 'grid-item4';
    var usernameDisplay = document.createElement('p');
    usernameDisplay.className = 'usernameDisplay';
    usernameDisplay.textContent = id;
    var wpmProgressDisplay = document.createElement('p');
    wpmProgressDisplay.className = 'wpmProgressDisplay';
    wpmProgressDisplay.textContent = 'WPM: 89';
    gridItem4.appendChild(usernameDisplay);
    gridItem4.appendChild(wpmProgressDisplay);
    
    // Create the fifth grid item (empty)
    var gridItem5 = document.createElement('div');
    gridItem5.className = 'grid-item5';

    // Append all grid items to the container
    gridContainer.appendChild(gridItem1);
    gridContainer.appendChild(gridItem2);
    gridContainer.appendChild(gridItem3);
    gridContainer.appendChild(gridItem4);
    gridContainer.appendChild(gridItem5);

    return gridContainer;
    
}