#test.py
import pytest
from app import App
from app import Database, UserInfo, UserData, UserLetter
from datetime import datetime, timezone
import random
import string

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

def test_invalid_login(client):
    """
    Test: When users enter invalid credentials and click log in, a message saying that either username or password was invalid should appear
    Result: True if the invalid credentials cause a str message to be returned saying the username or password was invalid
    """
    username = "user1"
    password = "pswd3"
    req = client.post("/authentication",data={"username":username,"password":password})
    assert "Authentication Error" in req.data.decode()

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

#--------------------------------------------------------------------------------DB Tests-----------------------------------------------------------------------------
class Test_User_Data():
    def test_repr(self):
        """
        Test: That a string representation of a row's data is returned
        Result: True if a string with a row's data is returned
        """
        pass

class Test_User_Letter():
    def test_repr(self):
        """
        Test: That a string presentation of a row's data is returned
        Result: True if a string with a row's data is returned
        """
        pass

class Test_Database():

    @pytest.fixture
    def sample_user_info(self):
        #a string of date and time with a random 4 character as the randomly generated username to prevent fail/error when running pytest
        unique_suffix = datetime.now().strftime("%Y%m%d%H%M%S") + ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
        return{
            '_username': f'test_user_{unique_suffix}',
            '_password': 'test_password',
            '_email': f'test_user_{unique_suffix}@example.com',
            '_profile_photo': 'https://example.com/test_user.jpg',
            '_google_id': f'test_google_{unique_suffix}'
        }
    
    @pytest.fixture
    #cleanup the previous user data before next test, this can prevent duplicate data in db
    def cleanup(request, sample_user_info):
        app = App()
        with app._app.app_context():
            yield
            Database.delete(sample_user_info['_username'])

    def test_insert(self, sample_user_info, cleanup):
        """
        Test: That a new user record is correctly inserted into the database
        Input: User fields 
        Result: True if the user record is inserted into the database
        """
        app = App()
        with app._app.app_context():
            inserted_user_info = Database.insert(UserInfo, **sample_user_info)

            retrieved_user_info = Database.query(sample_user_info['_username'], 'UserInfo')

            assert inserted_user_info is not None
            assert retrieved_user_info is not None
            assert inserted_user_info == retrieved_user_info


    def test_update(self, sample_user_info, cleanup):
        """
        Test: That a user record is correctly updated in the database
        Input: A user’s name with or without other fields 
        Result: True if the user record is updated in the database
        """
        app = App()
        with app._app.app_context():
            #insert a sample user record
            Database.insert(UserInfo, **sample_user_info)

            #update the user record
            updated_record = {
                #randomly generates unique input for every column to prevent fail/error when encountering unique constraint
                '_username': sample_user_info['_username'], #this must be the same as the sample_user_info
                '_password': ''.join(random.choices(string.ascii_letters + string.digits, k=10)),
                '_email': f'updated_email_{random.randint(100,999)}@example.com',
                '_profile_photo': f'https://example.com/updated_profile_photo_{random.randint(100,999)}.jpg',
                '_google_id': f'updated_google_id_{random.randint(100,999)}'
            }

            Database.update(sample_user_info['_username'], 'UserInfo', **updated_record)

            #query the updated record obj, it is not a list so retrieved_record[xxx] is not referecing anything
            retrieved_record = Database.query(sample_user_info['_username'], 'UserInfo')

            assert retrieved_record._password == updated_record['_password']
            assert retrieved_record._email == updated_record['_email']
            assert retrieved_record._profile_photo == updated_record['_profile_photo']
            assert retrieved_record._google_id == updated_record['_google_id']

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
#--------------------------------------------------------------------------------Game Tests-----------------------------------------------------------------------------
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
#--------------------------------------------------------------------------------Player Tests-----------------------------------------------------------------------------

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

