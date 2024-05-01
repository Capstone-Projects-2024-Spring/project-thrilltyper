function HomePage(){


    return(
        <div id="homePageContent">
            <img id="moon" src="../static/pics/moon.png"/>
            
            {/* background star animation */ }
            <div class="galaxy">
                <div class="stars1"></div>
                <div class="stars2"></div>
                <div class="stars3"></div>
            </div>

            <div id="homePageTitle">
                Hello World ! <span class="cursor"></span>
                <br/>
                <br/>
                <a href id="homePageButton"><span>Start Here</span></a>

                {/* cloud */}
                <div id="clouds3" class="clouds"></div>
                <div id="clouds1" class="clouds"></div>
                <div id="clouds2" class="clouds"></div>
            </div>
        </div>
    );
}