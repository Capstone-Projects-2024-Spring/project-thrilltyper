#test.py
import pytest
from app import App
from app import Database, UserInfo, UserData, UserLetter
from text_generator import Text_Generator
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
    Result: True if the invalid credentials cause a redirect to the login page
    """
    username = "user1"
    password = "pswd3"
    response = client.post("/authentication",data={"username":username,"password":password})
    assert response.location=="login"

def test_valid_login(client):
    """
    Test: When users enter valid credentials that they registered with and click log in, they should be redirected to the menu 
    Result: True if the redirect location is "/"
    """
    username = "uname"
    password = "pswrd"
    client.post("/register",data={"username":username,"password":password})
    response = client.post("/authentication",data={"username":username,"password":password})
    print(response.status_code)
    assert "/" is response.location

def test_continue_as_guest(client):
    """
    Test: When users click the play tab, the user should be redirected to the game menu page
    Result: True if request for the game menu page is successful
    """
    assert client.post("/#/menu").status_code==200

def test_google_login(client):
    """
    Test: When users tries to log in through Google and is successful, the user should be redirected to the google callback page 
    Result: True if the returned response location indicates a redirection to the google callback page
    """
    assert "google-logged" in client.post("/google-signin").location

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
    

    def test_data_table(self, sample_user_info, cleanup):
        """
        Test: That a string representation of a row's data is returned
        Result: True if a string with a row's data is returned
        """
        app = App()
        with app._app.app_context():
            Database.insert(UserInfo, **sample_user_info)
            
            #randomly generated user data info
            random_user_data = {
                '_username': sample_user_info['_username'],
                '_email': sample_user_info['_email'],
                '_wpm': random.randint(50, 100),
                '_accuracy': round(random.uniform(80, 100), 2),
                '_wins': random.randint(0, 100),
                '_losses': random.randint(0, 100),
                '_freq_mistyped_words': '|'.join(random.choices(["word1", "word2", "word3", "word4", "word5"], k=3)),
                '_total_playing_time': random.randint(0, 1000),
                '_play_date': datetime.now()
            }

            Database.insert(UserData, **random_user_data)
            #retrieve the user data with the username
            user_data = Database.query(sample_user_info['_username'], 'UserData')
            # Assert individual attributes of user_data object
            assert user_data._username == sample_user_info['_username']
            assert user_data._email == sample_user_info['_email']
            assert user_data._wpm == random_user_data['_wpm']
            assert float(user_data._accuracy) == random_user_data['_accuracy']
            assert user_data._wins == random_user_data['_wins']
            assert user_data._losses == random_user_data['_losses']
        
        
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

    def test_query(self, sample_user_info, cleanup):
        """
        Test: That the correct user record is retrieved from the database
        Input: A username with the corresponding table name
        Result: True if the correct user record is retrieved from the database
        """
        app = App()
        with app._app.app_context():
            Database.insert(UserInfo, **sample_user_info)

            retrieved_record = Database.query(sample_user_info['_username'], 'UserInfo')

            assert retrieved_record is not None
            assert retrieved_record._username == sample_user_info['_username']
            assert retrieved_record._email == sample_user_info['_email']
            assert retrieved_record._password == sample_user_info['_password']

    def test_delete(self, sample_user_info, cleanup):
        """
        Test: That a user record is correctly deleted from the database
        Input: A username with the table name
        Result: True if the user record is deleted from the database
        """
        app = App()
        with app._app.app_context():
            Database.insert(UserInfo, **sample_user_info)
            #query the data and check if insertion is successful before deleting
            retrieved_record_before = Database.query(sample_user_info['_username'], 'UserInfo')
            assert retrieved_record_before is not None

            delete_record = Database.delete(sample_user_info['_username'])
            #query data after deletion to ensure successful delete
            retrieved_record_after = Database.query(sample_user_info['_username'], 'UserInfo')
            assert retrieved_record_after is None
            #check the return value of Database.delete, it is suppose to return true if delete succeed
            assert delete_record is True
    
    def test_get_top_n_letters(self, sample_user_info):
        """
        Test: That the method correctly retrieves the top-N letters stored in the database for a specific user
        Input: A username andd the value for N
        Result: True is the method returns the correct list of letters in the correrct order
        """
        app = App()
        with app._app.app_context():
            #first there should be a parent table/row for the UserLetter, UserLetter is a child of UserInfo table
            Database.insert(UserInfo, **sample_user_info)

            #initiate a row of UserLetter
            user_letter_data = {
                '_username': sample_user_info['_username'],
                '_a': 5,
                '_b': 10,
                '_c': 3,
                '_x': 20,
                '_y': 8,
                '_z': 50
            }
            #insertion to UserLetter table
            Database.insert(UserLetter, **user_letter_data)

            #call the test method
            top_n_letters = Database.get_top_n_letters(sample_user_info['_username'], 5)

            #make sure the correct number of letters is returned
            assert len(top_n_letters) == 5

            #the top_n_letters is a list since this method returns a list
            expected_letters = ['z', 'x', 'b', 'y', 'a'] #c is not returned or included in the list since this is the top 5
            assert top_n_letters == expected_letters


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

#--------------------------------------------------------------------------Text_Generator Tests-----------------------------------------------------------------------------

class Test_Text_Generator():
    tg = Text_Generator()
    def test_get_txt_lst(self):
        """
        Test: Ensure that a file can be read from successfully
        Result: True if a list is returned
        """
        assert type(self.tg.get_txt_list("words.txt"))==list