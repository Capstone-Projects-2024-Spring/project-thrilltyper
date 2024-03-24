import os
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, render_template, request, url_for, session
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth
from datetime import datetime
from sqlalchemy.orm import validates #for validation of data in tables
from sqlalchemy import Column #used for reference to tables' column name

from player import player
#STR_MAX_SIZE = 65535

class App:
    """
    This will serve as the Flask backend of the application which will contain the logic for each of the routes.
    _app : Flask application which creates and controls the url routes
    _db : database connection which allows for interaction with the SQL database
    """
    _app = Flask(__name__)
    _app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ThrillTyper.db'
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
        self._app.run(host, port)

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
    def insert(db_table, **kwargs):
        """
        Insert a new user record into the database.

        :param db_table: The SQLalchemy model class representing a database table
        :type db_table: SQlalchemy model class
        :param kwargs: this is the keyword arguments that represents field names and the corresponding value
        :type kwargs: dict

        :precondition: All required fields for the model class must be provided in kwargs (for example: non-nullable fields must be provided)
        :precondition: If provided, `wpm`, `accuracy`, `wins`, `losses`, and `freq_mistyped_words` must be of the correct data types and within acceptable ranges.
        :postcondition: If successful, a new user record is inserted into the database with password hashed. 
        """
        
        #check the provided key arguments based on valid column names 
        #raise ValueError if invalid column names are found
        valid_columns = db_table.__table__.columns.keys() #retrieve all columns' name in the table
        #this is the required columns that must have a value entered (nullable=False)
        required_columns = set(Column.name for Column in db_table.__table__.columns if not Column.nullable)
        #invliad columns are the set of argument keys minus the set of valid columns and non-required columns
        #this required column is need to find all non-required columns
        #this is needed to prevent crash when a valid column is not present in the insert, and viewed as an invliad column
        invalid_columns = set(kwargs.keys()) - set(valid_columns) - (set(valid_columns) - required_columns)
        if invalid_columns:
            raise ValueError(f"Invalid column(s) provided: {','.join(invalid_columns)}") #list of the invalid columns
        
        #instance of the model with specified column names in parameter
        new_row = db_table(**kwargs)

        try:
            App.db.session.add(new_row) #add the new row to database table
            App.db.session.commit() #commit the transaction/changes
            return new_row
        except Exception as e:
            App.db.session.rollback() #rollback the change made
            raise e 



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

#these two tables/classes are not limited to parent/child relationship
#they're bidirectional, you can retrieve the relative data of the other table by calling either table
#UserData table will have the foreign key
#responsible for storing user's personal information
class UserInfo(App.db.Model):

    """
    Representation of user personal information stored in the database under UserInfo table
    _username : primary key of the table, unique identifier of a user
    _password : can not be null, password of a user's account
    _email : the unique email address of the user 
    _profile_photo : the url representation of the user's profile photo in email
    _registered_date : record of the date and time in UTC when user registered
    """
    _username =App.db.Column(App.db.String(30), primary_key=True) #primary_key makes username not null and unique
    _password =App.db.Column(App.db.String(30), nullable=False)
    _email = App.db.Column(App.db.String(60), unique=True)
    _profile_photo = App.db.Column(App.db.String(255))
    #record the time the user account is created
    _registered_date = App.db.Column(App.db.DateTime, default=App.db.func.current_timestamp()) #still in UTC timezone

class UserData(App.db.Model):
    """
    Representation of user in game data stored in the database under the UserData table
    _user_data_id : the primary key of the table, auto increment by sqlalchemy
    _username : non-nullable and unique identifier of a user, act as the foreign key referencing UserInfo table
    _wpm : words per minute
    _accuracy : percent of words typed correctly
    _wins : number of multiplayer matches won
    _losses : number of multiplayer matches lost
    _freq_mistyped_words : string of words/phrases frequently mistyped separated by the '|' character
    _total_playing_time : record the total number of time the user is playing the game
    """
    _user_data_id = App.db.Column(App.db.Integer, primary_key=True) #should not be manually inserted
    _username = App.db.Column(App.db.String(30),App.db.ForeignKey('user_info._username'), nullable=False) #foreign key referencing UserInfo table
    #this 'user_info' from the above line is mentioning the table name of UserInfo
    #this underscore and the lower case is automated by the system
    _wpm = App.db.Column(App.db.SmallInteger)
    _accuracy = App.db.Column(App.db.Numeric)
    _wins = App.db.Column(App.db.Integer, default=0)
    _losses = App.db.Column(App.db.Integer, default=0)
    _freq_mistyped_words = App.db.Column(App.db.Text)
    _total_playing_time = App.db.Column(App.db.Integer, default=0)

    #user_info_ref/user_data_ref are accessors to navigate the relationship between UserData and UserInfo objects
    #uselist set to False meaning one-to-one relationship between the two table
    #one instance of the user_info is related to one and only one user_data instance (1:1))
    user_info_ref = App.db.relationship('UserInfo', backref=App.db.backref('user_data_ref', uselist=False))


    #validation of whether the username exists in table 'user_info' when adding to user_data table
    #this ensures data integrity, sqlalchemy will automatically call this method whenever data is trying to be inserted
    #when inserting/update a row into user_data
    #try/except should be used to catch ValueError exception to avoid crash of system
    #mainly used for update/query/delete method, insert cannot be checked by this validation
    @validates('_username')
    def validate_username(self, key, _username):
        #selects the first result filtered using username by sqlalchemy 
        user_info = UserInfo.query.filter_by(_username=_username).first()
        if user_info is None: # user_info is None if user does not exist
            raise ValueError(f"User '{_username}' does not exist")
        return _username

    def repr(self):
        """
        Returns a string representation of the user data
        :return :
        """
        return f"<UserData(username={self._username}, wpm={self._wpm}, accuracy={self._accuracy}, " \
               f"wins={self._wins}, losses={self._losses}, freq_mistyped_words={self._freq_mistyped_words}, " \
               f"total_playing_time={self._total_playing_time})>"


if __name__=='__main__':
    app = App()
    
    #creates database tables and used for testing purposes(insert/update/query/delete)
    with app._app.app_context():

        app.db.create_all()
        #sample insert
        #this line is for testing
        try:
            user_info_data = {
                '_username': 'he_john',
                '_password': '123456789',
                '_email': 'hejohn456@gmail.com'
            }

            user_data_data = {
                '_username': 'he_john', #username must kept the same for integrity
                #if _username is not the same, it will not pass the @validates(_username) method, and an exception will be raised
                '_wpm': 70,
                '_accuracy': '100.0',
                #'you_good': '60' if this line is ran, the program will crash since it is not a existing column
            }

            #insertion in the respective table
            user_info_instance = Database.insert(UserInfo, **user_info_data)
            user_data_instance = Database.insert(UserData, **user_data_data)

            print('Data Insertion Successfully!')
        except Exception as e:
            print(f'Error in Inserting Data: {e}')
            raise


    app.run(host="localhost", debug=True)