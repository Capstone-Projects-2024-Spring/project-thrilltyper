/**
 * represents the cosmetics of a user profile
 * including functions of storing changing the cosmetics theme, cosmetics points, and spending cosmetics points 
 * @class
 */
class Cosmetics {
    /**
     * create an instance of cosmetics
     * @constructor
     * @param {String []} availableThemes Showing the array of available custometic themes for purchase
     */
    constructor(availableThemes) {

        this.availableThemes = availableThemes;
        this.availablePoints = 0; //initializing point

    }

    /**
     * changes the theme of the cosmetics to the desired choice
     * @param {String} theme - an input of selected theme
     * @returns {void} 
     */
    changeTheme(theme) {
        //implements changed theme for cosmetics
        //takes in one of the available theme of cosmetics

        //validates whether the theme exists or not
        if(!this.availableThemes.includes(theme)){
            throw new Error('Invalid theme');
        }

    }

    /**
     * a function for player earning points recorded into the user profile
     * @param {Number} earnedpoints - takes in a number of gained points
     * @returns {Number} Number - returns how much points is gained by the player
     */
    earnpoints(earnedpoints) {
        //implements points gaining function for themed cosmetics
        //adding the points to the cumulative total in the user profile

        //validation of earned points
        if(typeof earnedpoints != 'number' || earnedpoints < 0){
            throw new Error('Invalid points');
        }

        //adding earned points to available points
        this.availablePoints += earnedpoints;
        return this.availablePoints; //return amount of available points
    }

    /**
     * a function for deducting the spent points from the user profile
     * @param {Number} spendPoints - the amount of points that is going to be deducted from the user profile
     * @return {void} 
     */
    spendPoints(spendPoints) {
        //implementation of spending points for cosmetics
        //validates if there is enough points in the user profile statistics
        //rejects the transaction if there is not enought points

        //validation of amount of points
        if(this.availablePoints < spendPoints){
            throw new Error('Not enough points');
        }

        //deduct points when cosmetic theme is bought by user
        this.availablePoints -= spendPoints;
    }

}