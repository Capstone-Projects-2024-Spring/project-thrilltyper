#test.py
import pytest
from app import App
from app import Database

#Client that sends requests to endpoints of the application
@pytest.fixture
def client():
    app = App()
    with app.get_test_client() as client:
        yield client

#--------------------------------------------------------------------------------App Tests-----------------------------------------------------------------------------
def test_registration(client):
    """
    Test: That the user can register a username and password
    Result: True if the username and password have been successfully stored in the database
    """
    username = "uname"
    password = "pswrd"
    client.post("/register",data={"username":username,"password":password})
    assert Database.query(username,"UserInfo")

def test_invalid_login():
    """
    Test: When users enter invalid credentials and click log in, a message saying that either username or password was invalid should appear
    Result: True if the invalid credentials cause a str message to be returned saying the username or password was invalid
    """
    pass

def test_continue_as_guest():
    """
    Test: When users click continue as guest, the user should be redirected to the game page
    Result: True if the returned response indicates a redirection to the menu page
    """
    pass

def test_google_login():
    """
    Test: When users tries to log in through Google and is successful, the user should be redirected to the google callback page 
    Result: True if the returned response indicates a redirection to the google callback page
    """
    pass

def test_google_callback():
    """
    Test: That returned redirect requests are handled successfully, and ultimately a response that indicates redirection to the menu page is returned
    Result: True if the returned response indicates a redirection to the menu page
    """
    pass

def test_menu_selection():
    """
    Test: That the user is redirected to the page with the selected game mode
    Result: True if the number corresponding to the selected game mode appears in the returned redirect response
    """
    pass

def test_game_results():
    """
    Test: That text for the game results appears on the screen
    Result: True if a string with game results is returned
    """
    pass

class Test_User_Data():
    def test_repr(self):
        """
        Test: That a string representation of a row's data is returned
        Result: True if a string with a row's data is returned
        """
        pass

class Test_Database():
    def test_insert(self):
        """
        Test: That a new user record is correctly inserted into the database
        Input: User fields 
        Result: True if the user record is inserted into the database
        """
        pass

    def test_update(self):
        """
        Test: That a user record is correctly updated in the database
        Input: A user’s name with or without other fields 
        Result: True if the user record is updated in the database
        """
        pass

    def test_query(self):
        """
        Test: That the correct user record is retrieved from the database
        Input: A username 
        Result: True if the correct user record is retrieved from the database
        """
        pass

    def test_delete(self):
        """
        Test: That a user record is correctly deleted from the database
        Input: A username 
        Result: True if the user record is deleted from the database
        """
        pass

class Test_Game():
    '''
    Class for testing the game_session class
    '''

    def test_initialization(self):
        """
        Test: A new session is initialized with players. It contains relevant information of a game
        Result: True if the returned session is not None and have unique ID 
        """
        pass

    def test_start(self):
        """
        Test: Ensure that the race starts successfully
        Result: True if the race is initialized and components are set up properly
        """
        pass

    def test_tie(self):
        """
        Test: Ensure that no winner is returned when no player has won the race
        Result: True if the returned list is empty
        """
        pass

    def test_winner(self):
        """
        Test: Ensure that the correct winner is returned when a single player wins the race
        Result: True if the returned list contains the ID of the winning player only
        """
        pass

    def test_race_end(self):
        """
        Test: Ensure that the race is ended and necessary cleanup actions are performed
        Result: True if all cleanup actions are successfully executed
        """
        pass
    
    def test_add_player(self):
        """
        Test: Ensure that a player is added to the game session successfully
        Result: True if the player is added and can be retrieved from the game session
        """
        pass

    def test_remove_player(self):
        """
        Test: Ensure that a player is removed from the game session successfully
        Result: True if the player is removed and cannot be retrieved from the game session
        """
        pass

class Test_Player():
    '''
    Class for testing the player class
    '''

    def test_initialization(self):
        """
        Test: A new player metric structure is created which holds key metrics of the player through the duration of the match
        Result: True if the returned player metric structure is not None and has a unique id
        """
        pass

    def test_update_wpm(self):
        """
        Test: Ensure that the real time words per minute is properly updated
        Result: True if words per minute metric updates accordingly during the lifespan of the match
        """
        pass

    def test_update_accuracy(self):
        """
        Test: Ensure that real time accuracy is accurately updated
        Result: True if accuracy metric matches up with current accuracy metric on game
        """
        pass

    def test_update_freq_mistyped(self):
        """
        Test: Ensure that the list of frequently mistyped words is properly updated with the new list
        Result: True if new list matches up with the current version of the list that stores frequently mistyped words
        """
        pass

    def test_update_score(self):
         """
        Test: Ensure that the updated score matches up with the current score
        Result: True if current score and updated score match
        """
         pass

