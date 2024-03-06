#test.py
from flask import FlaskClient

class Test_App():
    """
    Class for testing the App class
    """
    #Client that sends requests to endpoints of the application
    client = FlaskClient()
    
    def test_registration():
        """
        Test: That the user can register a username and password and can log in with the new credentials successfully
        Result: True if the username and password have been successfully stored
        """
        pass

    def test_invalid_login():
        """
        Test: When users enter invalid credentials and click log in, a message saying that either username or password was invalid should appear
        Result: True if the invalid credentials cause a str message to be returned saying the username or password was invalid
        """
        pass

    def test_continue_as_guest():
        """
        Test: When users click continue as guest, a response should be generated which redirects the user to the game page
        Result: True if the response indicates a redirection to the game page
        """
        pass
