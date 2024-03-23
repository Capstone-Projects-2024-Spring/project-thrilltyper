import os
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, render_template, request, url_for, session
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth

from player import player
STR_MAX_SIZE = 65535

class App:
    """
    This will serve as the Flask backend of the application which will contain the logic for each of the routes.
    _app : Flask application which creates and controls the url routes
    _db : database connection which allows for interaction with the SQL database
    """
    _app = Flask(__name__)
    _app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    db = SQLAlchemy(_app)

    # Explicitly load env
    load_dotenv()

    # Configuration of flask app
    appConf = {
    "OAUTH2_CLIENT_ID": os.environ.get("CLIENT_ID"),
    "OAUTH2_CLIENT_SECRET": os.environ.get("CLIENT_SECRET"),
    "OAUTH2_META_URL": "https://accounts.google.com/.well-known/openid-configuration",
    "FLASK_SECRET": os.environ.get("FLASK_SECRET"),
    "FLASK_PORT": 5000
    }
    _app.secret_key = appConf.get("FLASK_SECRET")

    oauth = OAuth(_app)
    # list of google scopes - https://developers.google.com/identity/protocols/oauth2/scopes
    oauth.register(
        "ttyper",
        client_id=appConf.get("OAUTH2_CLIENT_ID"),
        client_secret=appConf.get("OAUTH2_CLIENT_SECRET"),
        client_kwargs={
            "scope": "openid profile email",
            'code_challenge_method': 'S256'  # enable PKCE
        },
        server_metadata_url=f'{appConf.get("OAUTH2_META_URL")}',
    )

    def run(self,host: str | None = None,port: int | None = None, debug: bool | None = None, load_dotenv: bool = True,**options):
        """
        Calls Flask's run function with the specified parameters to run the backend for the web application.\n
        Preconditions: host is a valid IP address and port is a valid and open port\n
        Flask's descriptions of the parameters:
        :param host: the hostname to listen on. Set this to ``'0.0.0.0'`` to
            have the server available externally as well. Defaults to
            ``'127.0.0.1'`` or the host in the ``SERVER_NAME`` config variable
            if present.
        :param port: the port of the webserver. Defaults to ``5000`` or the
            port defined in the ``SERVER_NAME`` config variable if present.
        :param debug: if given, enable or disable debug mode. See
            :attr:`debug`.
        :param load_dotenv: Load the nearest :file:`.env` and :file:`.flaskenv`
            files to set environment variables. Will also change the working
            directory to the directory containing the first file found.
        :param options: the options to be forwarded to the underlying Werkzeug
            server. See :func:`werkzeug.serving.run_simple` for more
            information.
        """
        self._app.run()

    @_app.route('/')
    def log_in():
        """
        Handles the requests made to the welcome page where users can log in, register, or continue as guests 
        :postcondition: a new user will be registered with a message saying "Successfully registered" and the database will update with the new user
        info, a message with "Incorrect username or password", or the user will be redirected to /menu
        :return : a Response object that redirects the user to the menu page on success, otherwise a str message appears saying either the username or password was incorrect
        """

        # Query user to log in
        if session.get("user") is None:
            return render_template('index.html')
        
        # Show messages to user if logged
        return render_template('index.html', userSession=session.get("user"))

    @_app.route('/google-signin', methods=['GET','POST'])
    def google_login():
        """
        Handles the requests made to the website where users can log in to google
        :postcondition: a google user login successfully
        :return : a Response object that redirects the user to the callback method on success
        """
        return App.oauth.ttyper.authorize_redirect(redirect_uri=url_for("google_callback", _external=True))

    @_app.route('/google-logged')
    def google_callback():
        """
        Handles the returned redirect requests from google signin
        :postcondition: a new user will be registered with a message saying "Successfully registered" and the database will update with the new user
        info, the user will be redirected to /menu
        :postcondition: create the user session
        :return : a Response object that redirects the user to the menu page
        """
        try:
            # Obtain the access token from Google OAuth
            token = App.oauth.ttyper.authorize_access_token()
            
            # Check if the 'id_token' is present in the token
            if 'id_token' in token:
                # If the 'id_token' is present, indicating a successful login
                # Extract and store necessary user information in the session
                session["user"] = token
            else:
                # Handle the case where access is denied (user cancelled the login)
                return "Access denied: Google login was canceled or failed."
            # Redirect to the desired page after successful authentication
            return redirect("/")
        except Exception as e:
            # Handle other OAuth errors gracefully
            # return "OAuth Error: {}".format(str(e))
            return redirect("/")
        
    @_app.route('/authentication', methods=['POST'])
    def authenticate():
        # Temp account
        uname = "admin"
        upsw = "admin"
        try:
            username = request.form["username"]
            password = request.form["password"]
            if username == uname and password == upsw:
                d =  player(username)
                # Store the Player object in the session
                session['user'] = d.__json__()
                return redirect("/")
            else:
               return "Authentication Failed" 
        except Exception as e:
            return "Authentication Failed"

    
    @_app.route('/signup', methods=['GET', 'POST'])
    def signup():
        return render_template("index.html")

    @_app.route('/register', methods=['POST'])
    def register():
        """
        Created and logged a new user account
        :precondition: form contained valid input
        """
        # Get input
        username = request.form["username"]
        password = request.form["password"]
        # Validate input
        # Store database
        # Store session
        d =  player(username)
    
        # Store the Player object in the session
        session['user'] = d.__json__()
        p = session.get('player')

        print("hahahaha")
        print(username + " : " + password)
        return redirect("/")
    
       
    @_app.route('/logout', methods=['GET', 'POST'])
    def logout():
        """
        Log out user from the session
        :postcondition: session is None
        """
        # Pop out the user session
        session.pop("user", None)
        return redirect("/")

    @_app.route('/menu')
    def menu():
        """
        Handles the requests made to the menu page with the game mode selection and options/preferences button
        Postcondition: an integer from the range 0 to the number of game modes minus 1 will be selected and sent as part of the /game/<int:mode> request
        :return : a Response object that redirects the user to a game session of the game mode they selected
        """
        pass
    
    @_app.route('/game/<int:mode>')
    def game(mode:int):
        """
        Handles the requests made to the game based on the mode selected by the user on the menu page
        Precondition: mode shall be an int from the range 0 to the number of game modes minus 1
        :param mode : number representing the game mode selected by the user
        :return : string indicating the end of the game and the user's wpm and percent of words typed correct
        """
        pass

class Database:
    """
    A class representing a database connection and operations.

    Attributes:
        _app (App): The Flask application instance associated with the database.
        _models (dict): A dictionary containing model classes representing database tables. Keys are model names, and values are the corresponding model classes.

    Methods:
        __init__(app: App, **models)
            Initializes a Database instance with the provided Flask application and model classes.
        insert(username: str, psw: str, wpm: int = None, accuracy: float = None, wins: int = None, losses: int = None, freq_mistyped_words: str = None)
            Inserts a new user record into the database.
        update(username: str, **kwargs)
            Updates a user record in the database.
        query(username: str)
            Queries a user record from the database.
    """
    
    def __init__(self,app:App, **models):
        """
        Initializes a Database instance with the provided Flask application and model classes.

        :param app: The Flask application instance associated with the database.
        :type app: App
        :param models: Keyword arguments representing model classes representing database tables. Keys are model names, and values are the corresponding model classes.
        :type models: dict

        :returns: None

        :precondition: App and App.db are fully configured
        :precondition: model(s) are fully configured and set-up
        """
        self._app = app
        self._models = models

    @staticmethod
    def insert(username: str, psw: str, wpm: int = None, accuracy: float = None,
               wins: int = None, losses: int = None,
               freq_mistyped_words: str = None):
        """
        Insert a new user record into the database.

        :param username: Unique identifier of the user.
        :type username: str
        :param psw: password of the user
        :type psw: String
        :param wpm: Words per minute. Defaults to None.
        :type wpm: int, optional
        :param accuracy: Percent of words typed correctly. Defaults to None.
        :type accuracy: float, optional
        :param wins: Number of multiplayer matches won. Defaults to None.
        :type wins: int, optional
        :param losses: Number of multiplayer matches lost. Defaults to None.
        :type losses: int, optional
        :param freq_mistyped_words: String of words/phrases frequently mistyped separated by the '|' character. Defaults to None.
        :type freq_mistyped_words: str, optional

        :precondition: `username` must not be empty.
        :precondition: `username` must be unique.
        :precondition: `psw` must not be empty.
        :precondition: If provided, `wpm`, `accuracy`, `wins`, `losses`, and `freq_mistyped_words` must be of the correct data types and within acceptable ranges.
        :postcondition: If successful, a new user record is inserted into the database with password hashed. 
        """
        pass

    @staticmethod
    def update(username: str, **kwargs):
        """
        Update a user record in the database.

        :param username: Unique identifier of the user to be updated.
        :type username: str
        :param **kwargs: Keyword arguments representing fields to be updated. Valid fields are '_pswd', '_wpm',
            '_accuracy', '_wins', '_losses', and '_freq_mistyped_words'.

        :precondition: `username` must exist in the database.
        :precondition: At least one field to update must be provided.
        :precondition: If provided, values for fields must be of the correct data types and within acceptable ranges.
        :postcondition: If successful, the user record is updated with the provided values.
        """
        pass

    @staticmethod
    def query(username: str):
        """
        Query a user record from the database.

        :param username: Unique identifier of the user to be queried.
        :type username: str

        :return: Returns the UserData object if found, else None.
        :rtype: UserData or None

        :precondition: `username` must be a valid user identifier.
        :postcondition: If a user with the provided username exists in the database, returns the corresponding UserData object; otherwise, returns None.
        """
        pass

    @staticmethod
    def delete(username: str):
        """
        Delete a user record from the database.

        :param username: Unique identifier of the user to be deleted.
        :type username: str

        :return: True if the user record is successfully deleted, False otherwise.
        :rtype: bool

        :precondition: `username` must be a valid user identifier.
        :postcondition: If a user with the provided username exists in the database, the corresponding user record is deleted.
        """
        pass

class UserData(App.db.Model):
    """
    Representation of user data stored in the database under the UserData table
    _username : unique identifier of a user
    _wpm : words per minute
    _accuracy : percent of words typed correctly
    _wins : number of multiplayer matches won
    _losses : number of multiplayer matches lost
    _freq_mistyped_words : string of words/phrases frequently mistyped separated by the '|' character
    """
    _username = App.db.Column(App.db.String(15),nullable=False,primary_key=True)
    _wpm = App.db.Column(App.db.SmallInteger)
    _accuracy = App.db.Column(App.db.Numeric)
    _wins = App.db.Column(App.db.Integer)
    _losses = App.db.Column(App.db.Integer)
    _freq_mistyped_words = App.db.Column(App.db.String(STR_MAX_SIZE))

    def repr():
        """
        Returns a string representation of the user data
        :return :
        """
        pass


if __name__=='__main__':
    app = App()
    app.run(host="localhost", debug=True)