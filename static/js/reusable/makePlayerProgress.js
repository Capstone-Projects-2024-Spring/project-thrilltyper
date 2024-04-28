function makePlayerProgress(){
    // return (
        // <div class="grid-container">
        //     <div class="grid-item1">
        //         <img src="../static/pics/defaultUserIcon.jpg"/>
        //     </div>

        //     <div class="grid-item2">
        //         <div class="progressbar-container"> 
        //             <div class="progressbar" id="hello">
        //                 <span class="progressbar-text" id="hello2">10%</span>
        //             </div>
        //         </div>
        //     </div>
        //     <div class="grid-item3">
        //         <img src="../static/pics/checkmark.png"/>
        //     </div>  
        //     <div class="grid-item4">
        //         WPM: 89
        //     </div>
        //     <div class="grid-item5"></div>  
        // </div>  
    // );

      // Create the container
    var gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';

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
    progressbar.id = 'hello';
    var progressbarText = document.createElement('span');
    progressbarText.className = 'progressbar-text';
    progressbarText.id = 'hello2';
    progressbarText.textContent = '50%';
    progressbar.appendChild(progressbarText);
    progressbarContainer.appendChild(progressbar);
    gridItem2.appendChild(progressbarContainer);

    // Create the third grid item and append an image
    var gridItem3 = document.createElement('div');
    gridItem3.className = 'grid-item3';
    var checkmarkIcon = document.createElement('img');
    checkmarkIcon.src = '../static/pics/checkmark.png';
    gridItem3.appendChild(checkmarkIcon);

    // Create the fourth grid item for WPM
    var gridItem4 = document.createElement('div');
    gridItem4.className = 'grid-item4';
    gridItem4.textContent = 'WPM: 89';
    
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