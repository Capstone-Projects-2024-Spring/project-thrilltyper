#permanent import
import os
import uuid
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, render_template, request, url_for, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import validates #for validation of data in tables
from sqlalchemy import Column, or_ #used for reference to tables' column name
from player import player
import string
from text_generator import Text_Generator

#temporary imports, which will be deleted later
import random
#STR_MAX_SIZE = 65535

class App:
    """
    This will serve as the Flask backend of the application which will contain the logic for each of the routes.
    _app : Flask application which creates and controls the url routes
    _db : database connection which allows for interaction with the SQL database
    """
    _app = Flask(__name__)
    # Use cors to faciliates api requests/responses time
    # Particularly to retrieve userinfo from google servers
    CORS(_app)
    _app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ThrillTyper.db"
    db = SQLAlchemy(_app)

    # Explicitly load env
    load_dotenv()
    _api_key = os.environ.get("API_KEY")

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
            "code_challenge_method": "S256"  # enable PKCE
        },
        server_metadata_url=f"{appConf.get('OAUTH2_META_URL')}",
    )

    def run(self,host: str | None = None,port: int | None = None, debug: bool | None = None, load_dotenv: bool = True,**options):
        """
        Calls Flask's run function with the specified parameters to run the backend for the web application.\n
        Preconditions: host is a valid IP address and port is a valid and open port\n
        Flask"s descriptions of the parameters:
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
        self._app.run(host,port,debug,load_dotenv)

    @_app.route("/login", methods=["GET", "POST"])
    def login():
        """
        Handles the requests made to the login page where users can log in
        :return : a str html page that redirects the user to the login page
        """
        error = session.pop("error", None)
        if request.method == "POST":
            # Authenticate the user Close Session when done
            pass
        return render_template("login.html", error=error)
    
    @_app.route("/",methods=["POST","GET"])
    def home():
        """
        Handles the requests made to the home page.
        :return : a str html page that redirects the user to the home page
        """
        return render_template("base.html", userSession=session.get("user"))

    @_app.route("/google-signin", methods=["GET","POST"])
    def google_login():
        """
        Handles the requests made to the website where users can log in to google
        :postcondition: a google user login successfully
        :return : a str html page that redirects the user to the callback method on success
        """
        return App.oauth.ttyper.authorize_redirect(redirect_uri=url_for("google_callback", _external=True))

    @_app.route("/google-logged")
    def google_callback():
        """
        Handles the returned redirect requests from google signin
        :postcondition: a new user will be registered with a message saying "Successfully registered" and the database will update with the new user
        info, the user will be redirected to home page
        :postcondition: create the user session
        :return : a str rendering that redirects the user to the home page
        """
        try:
            # Obtain the access token from Google OAuth
            token = App.oauth.ttyper.authorize_access_token()
            
            # Check if the "id_token" is present in the token
            if "id_token" in token:
                # If the "id_token" is present, indicating a successful login
                # Extract and store necessary user information in the session
                uname = token["userinfo"]["email"]
                picture = token["userinfo"]["picture"]

                # Instantiate a player object to store in user session
                playerObj = player(username=uname, avatar=picture)
                # Establish user session, use the json format of the website
                session["user"] = playerObj.__json__()

                # Insert user info into the database if doesn"t exists yet
                if Database.query(uname, "UserInfo") is None:
                    Database.insert(UserInfo, _username=uname, _password=token["access_token"], _email=uname, _profile_photo=picture)
                    Database.insert(UserData, _username=uname,_email=uname,_accuracy=0,_wins=0,_losses=0,_freq_mistyped_words=0,_total_playing_time=0,_top_wpm=0,_num_races=0,_user_in_game_picture=picture)
                    user_letter_data = {
                    "_username": uname,
                    "_email": uname,
                    **{f"_{letter}": 0 for letter in string.ascii_lowercase},
                    "_comma": 0,
                    "_period": 0,
                    "_exclamation": 0,
                    "_question": 0,
                    "_hyphen": 0,
                    "_semicolon": 0,
                    "_single_quote": 0,
                    "_double_quote": 0,
                    }
                    Database.insert(UserLetter,**user_letter_data)
            else:
                # Handle the case where access is denied (user cancelled the login)
                return "Access denied: Google login was canceled or failed."
            
            # Redirect to the desired page after successful authentication
            return redirect("/")
        except Exception as e:
            # For if user cancels the login
            return redirect("/login")
        
    @_app.route("/authentication", methods=["POST"])
    def authenticate():
        """
        Endpoint called to authenticate users attempting to login. Session is created on successful login.
        :pre-condition: The request form will have a username and password field
        """
        try:
            # Retrieves data from the requests
            # The keys must exist
            username = request.form["username"]
            password = request.form["password"]

            # Retrieve data from database
            # Exist if returned value of query is not None
            user = Database.query(username, "UserInfo")

            # Performs validation 
            if user is not None and user._password == password:
                Database.update(user._username,"UserData",_last_login_time=datetime.now(timezone.utc))
                # Gets avatar
                playerObj = player(username, user._profile_photo)
                # Stores the Player object in the session
                session["user"] = playerObj.__json__()
                # Redirects to a desired page when authentication success
                return redirect("/")
            else:
               # Raises an error for wrong match
               raise ValueError("Invalid username or password")
        except Exception as e:
            # Handles errors
            error = f"{e}"
            session["error"] = error
            return redirect("login")
    
    @_app.route("/signup", methods=["GET", "POST"])
    def signup():
        """
        A route path for signup page layout
        :return: str html page for signup layout 
        """
        error = session.pop("error", None)
        return render_template("signup.html", error=error)

    @_app.route("/register", methods=["POST"])
    def register():
        """
        Creates and logs a new user account
        :precondition: form contained valid input
        :postcondition: new user info will be inserted into the database on success
        """
        # Gets input
        username = request.form["username"]
        password = request.form["password"]
        email = request.form["email"]
        # Validates contraints
        if Database.query(username, "UserInfo"):
            session["error"] = "Username already used "
            return redirect("/signup")
        # Stores into database
        avatar = url_for("static", filename="pics/anonymous.png")
        Database.insert(UserInfo, _username=username, _password=password, _profile_photo=url_for("static", filename="pics/anonymous.png"))
        Database.insert(UserData, _username=username,_email=email,_accuracy=0,_wins=0,_losses=0,_freq_mistyped_words=0,_total_playing_time=0,_top_wpm=0,_num_races=0,_user_in_game_picture=url_for("static", filename="pics/anonymous.png"),_last_login_time=datetime.now(timezone.utc))
        user_letter_data = {
        "_username": username,
        "_email": email,
        **{f"_{letter}": 0 for letter in string.ascii_lowercase},
        "_comma": 0,
        "_period": 0,
        "_exclamation": 0,
        "_question": 0,
        "_hyphen": 0,
        "_semicolon": 0,
        "_single_quote": 0,
        "_double_quote": 0,
        }
        Database.insert(UserLetter,**user_letter_data)
        # Store session
        playerObj =  player(username, avatar)
    
        # Stores the Player object in the session
        session["user"] = playerObj.__json__()

        # Redirects to the result page
        return redirect("/")
    
       
    @_app.route("/logout", methods=["GET", "POST"])
    def logout():
        """
        Log out user from the session
        :postcondition: session is None
        """
        # Pop out the user session
        session.pop("user", None)
        return redirect("/")
    
    @_app.route("/generate_text/",methods=["GET"])
    def generate_text():
        """
        Sends back text for the requestor to use
        :param difficulty
        :param form : Specifies the form of text generated. Values: 'sentences' or 'word_list'
        """
        difficulty = request.args.get("difficulty")
        if not difficulty:
            difficulty=""
        return Text_Generator.generate_text(difficulty,request.args.get("form"),request.args.get("amount"))

    @_app.route("/get_avg_txt_len/",methods=["GET"])
    def get_avg_txt_len():
        """
        Handles requests to get the average length of a word/sentence from a list
        :param difficulty
        :param form : Specifies the form of text generated. Values: 'sentences' or 'words'
        """
        difficulty = request.args.get("difficulty")
        if not difficulty:
            difficulty=""
        else:
            difficulty+="_"
        return str(Text_Generator.get_avg_txt_len(Text_Generator.get_txt_list(difficulty+request.args.get("form")+".txt")))

    def get_test_client(self):
        return self._app.test_client()
    
    @_app.route('/user/<username>')
    def get_user_data(username):
        userData = Database.query(str(username), "UserData")
        if userData is None:
            return jsonify({'error': 'User not found'}), 404
        else:
            return jsonify({
                "username": userData._username,
                "highestWPM" : userData._top_wpm,
                "wins": userData._wins,
                "losses": userData._losses,
                "accuracy" : userData._accuracy,
                "frequentMisTypedWord" : userData._freq_mistyped_words,
                "totalTime" : userData._total_playing_time,
                "frequentMisTypedWord" : userData._freq_mistyped_words
            })
        
    @_app.route('/leaderboard/top_n_highest_wpm/<int:n>', methods=['GET'])
    def get_top_n_highest_wpm_leaderboard(n):
        """
        Retrieve UserData table highest_wpm and converting to json format and send to frontend
        :param n: an input of the top n number for leaderboard
        :type n: int
        :returns: json format leaderboard info 
        """
        try:
            #retrieve highest wpm from UserData
            top_scores = UserData.query.order_by(UserData._top_wpm.desc()).limit(n).all()

            #extracting username and highest wpm from query result
            leaderboard_info = [{
                'username': scores._username,
                'highest_wpm': scores._top_wpm
            } for scores in top_scores]
            return jsonify(leaderboard_info)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @_app.route("/update_db",methods=["POST"])
    def update_db():
        """
        Endpoint called to update user stats post-game
        """
        #TODO: need to secure data transfer and verify origin
        if request.is_json:
            usr_session = session.get("user")
            if usr_session:
                usr = usr_session["userinfo"]["given_name"]
                user_data = Database.query(usr, "UserData")
                game_data = request.json
                num_races = int(user_data._num_races)
                Database.update(usr,"UserData",_accuracy=(game_data["accuracy"]+float(user_data._accuracy)*num_races)/(num_races+1),_num_races=num_races+1,_total_playing_time=user_data._total_playing_time+game_data["elapsedTime"])
            return "Successful"
        return "Not successful"

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

    #temporary auto populate and inserting method for anyone want to test the database
    #which will be deleted later
    @staticmethod
    def populate_sample_date(num_rows):
        """
        no need for documentation
        """
        try:
            current_datetime =datetime.now(timezone.utc)
            for i in range(1, num_rows + 1):

                sample_google_id = "".join(random.choices(string.ascii_letters + string.digits, k=10)) #set length of id to ten
                user_info_data = {
                    "_username": f"user{i}",
                    "_password": f"password{i}",
                    "_email": f"user{i}@gmail.com",
                    "_profile_photo":  f'./static/pics/anonymous.png',
                    "_google_id": sample_google_id
                }

                user_data_data = {
                    "_username": f"user{i}",
                    "_email": f"user{i}@gmail.com",
                    "_top_wpm": 10+i,
                    "_accuracy": 80 + (i*0.5),
                    "_wins": 10+i,
                    "_losses": 1+i,
                    "_freq_mistyped_words": f"word{i}|mistake{i}",
                    "_total_playing_time": 3600*i
                }

                user_letter_data = {
                    "_username": f"user{i}",
                    "_email": f"user{i}@gmail.com",
                    **{f"_{letter}": random.randint(0,100) for letter in string.ascii_lowercase},
                    "_comma": random.randint(0,100),
                    "_period": random.randint(0,100),
                    "_exclamation": random.randint(0,100),
                    "_question": random.randint(0,100),
                    "_hyphen": random.randint(0,100),
                    "_semicolon": random.randint(0,100),
                    "_single_quote": random.randint(0,100),
                    "_double_quote": random.randint(0,100),
                }

                user_race_data = {
                    "_username": f"user{i}",
                    "_email": f"user{i}@gmail.com",
                    "_average_wpm": random.randint(40,100),
                    "_selected_mode": random.choice(["Practice", "Robot Opponent", "MultiPlayer"]),
                    "_time_limit": random.choice([None, 30, 60, 90]),
                    "_date_played": current_datetime - timedelta(days=i)
                }

                Database.insert(UserInfo, **user_info_data)
                Database.insert(UserData, **user_data_data)
                Database.insert(UserLetter, **user_letter_data)
                Database.insert(UserRace, **user_race_data)
            print(f"{num_rows} sample users added successfully")
        except Exception as e:
            print(f"Error while populating sample rows: {e}")

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
        valid_columns = db_table.__table__.columns.keys() #retrieve all columns" name in the table
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
    def update(username: str, db_table_name: str, **kwargs):
        """
        Update a user record in the database.

        :param username: Unique identifier of the user to be updated.
        :type username: str
        :param db_table_name : the input class table name
        :type db_table_name : str
        :param **kwargs: Keyword arguments representing fields to be updated. Valid fields are "_pswd", "_wpm",
            "_accuracy", "_wins", "_losses", and "_freq_mistyped_words".

        :precondition: `username` must exist in the database.
        :precondition: At least one field to update must be provided.
        :precondition: If provided, values for fields must be of the correct data types and within acceptable ranges.
        :postcondition: If successful, the user record is updated with the provided values.
        """
        try:
            #first validate the table name given in string
            valid_table_list = ["UserInfo","UserData","UserLetter","UserRace"]
            if db_table_name not in valid_table_list:
                raise ValueError(f"Invalid table name: {db_table_name}")
            
            #get the table class obj by given table name in string
            table_obj = globals().get(db_table_name)
            if table_obj is None:
                raise ValueError(f"Table Class Object not found for table name: {db_table_name}")
            
            #query for user information
            user_information = table_obj.query.filter_by(_username=username).first()
            if user_information is None:
                raise ValueError(f"User '{username}' does not exist in the Database")
            

            #after user information is query, perform a check of if user is trying to update their _username
            #check if the updating username is unique in the database
            new_username = kwargs.get("_username") #get the value based on the key
            if new_username and new_username != username: #unique
                existing_user = table_obj.query.filter_by(_username=new_username).first()
                if existing_user:
                    raise ValueError(f"Username '{new_username}' already exists in the Database")
            #does the same check for email address
            new_email = kwargs.get("_email")
            if new_email and new_email != user_information._email:
                existing_email = table_obj.query.filter_by(_email=new_email).first()
                if existing_email:
                    raise ValueError(f"Email '{new_email}' already exists in the Database")
            
            #validates and update the provided fields
            #key is the column name, value is the updating data
            for key, value in kwargs.items():
                #ensuring the fields/columns exist in the according table
                if hasattr(table_obj, key): #table_obj is referring to the table class object
                    setattr(user_information, key, value)
                else:
                    raise AttributeError(f"Attribute '{key}' does not exist in the '{db_table_name}' table")
                

            #if new_username and new_username != username:
                #Database.update_username(username, new_username)

            #commit the updated values and fields
            App.db.session.commit()
            print(f"User '{username}' record updated successfully in table '{db_table_name}'")
        except Exception as e:
            App.db.session.rollback()
            print(f"Error in updating user '{username}' in table '{db_table_name}' : {e}")


    @staticmethod
    def query(identifier: str, db_table_class: str): 
        #changes made: being able to query by  either _username or _email using or_ operator provided by sqlalchemy
        """
        Query a user record from the database using either username or email address.

        :param identifier: A unique identifier of the user to be queried.
        :type identifier: str

        :param db_table_class: the name of the table class
        :type db_table_class: str

        :return: Returns the User table object if found, else None.
        :rtype: User Data table object or None

        :precondition: `identifier` must be a valid user identifier/column in the data table.
        :postcondition: If a user with the provided username/email exists in the database, returns the corresponding User Data object; otherwise, returns None.
        """
        try:
            #a list of valid table names
            valid_table_list = ["UserInfo","UserData","UserLetter","UserRace"]
            #validates if the given string is in the list
            if db_table_class in valid_table_list:
                #find the table class object by the given string
                table_name_obj = globals().get(db_table_class)
                #retriving data by sqlalchemy"s query and filter
                retrieved_data = table_name_obj.query.filter(or_(table_name_obj._username == identifier, table_name_obj._email == identifier)).first()
                #filter_by takes kwargs, not positional arguments
                #if user does not exist, return nothing
                if retrieved_data is None:
                    print(f"Invalid username/email entered: {identifier}")
                    return None
                #user information object returned
                return retrieved_data
            else:
                raise ValueError(f"Invalid table name: {db_table_class}") #handles invalid table name string
        except Exception as e:
            
            print(f"Error in querying user information from {db_table_class}: {e}")
            return None


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
        
        try:

            #the first index/result filtered by the username
            delete_user = UserInfo.query.filter_by(_username=username).first()
            #print("the user is: ", delete_user)
            if delete_user:
                #if username exists delete it and return True
                App.db.session.delete(delete_user)
                App.db.session.commit()
                return True
            #else username does not exist
            else:
                return False
        except Exception as e:
            #roll back transaction if error occurred
            App.db.session.rollback()
            return False
        
    @staticmethod    
    def get_top_n_letters(username: str, n: int):
        """
        Return a (sorted in DESC)list of letters according to the Top-N largest corresponding values(mistyped letter times) in UserLetter Table

        :param username: the Username of the user
        :type username: str
        :param n: the selected number of Top-N largest letter to retrieve, max is 26
        :type n: int

        :return: List containing the Top-N letters in DESC order
        :rtype: list
        """
        try: 
            #validate if user exist in UserInfo
            user_info = UserInfo.query.filter_by(_username=username).first()
            if not user_info:
                print(f"User '{username}' does not exist")
                return []    
            #validate n
            max_n = 26 + 8 #eight punctuations added
            if n < 1 or n > max_n:
                print("Invalid value for 'n', Only 26 Letters and 8 Punctuations")
                return []
            #query using username the user letter data
            user_letter_data = UserLetter.query.filter_by(_username=username).first()
            #return empty list if user letter data is None
            if not user_letter_data:
                print(f"No Data Found For User '{username}'")
                return []
            #a dictionary with letters as keys and mistyped letter times as the number value
            #loop through each letter in the alaphbets
            letter_number_dict = {}
            for letter in string.ascii_lowercase:
                column_name = f"_{letter}"
                letter_number_dict[letter] = getattr(user_letter_data, column_name)

            #added punctuations
            #list of added punctuations
            punctuation_marks = [",", ".", "!", "?", "-", ";", "'", '"']
            punct_names = {
                ",": "_comma",
                ".": "_period",
                "!": "_exclamation",
                "?": "_question",
                "-": "_hyphen",
                ";": "_semicolon",
                "'": "_single_quote",
                '"': "_double_quote"
            }

            for mark in punctuation_marks:
                get_punct = punct_names.get(mark)
                if get_punct:
                    letter_number_dict[mark] = getattr(user_letter_data, get_punct)
            
            #sort the dict by top-n values in desc order, returning a list
            sorted_values = sorted(letter_number_dict, key=letter_number_dict.get, reverse=True)[:n] #n here is not inclusive
            #since there is a _ as the first index, it needs to be removed, starting each string with [1:] 
            #rm_underscore = [letter[1:] for letter in sorted_values]
            return sorted_values
        except Exception as e:
            print(f"Error while retrieving top {n} largest values for corresponding letters for user '{username}' : {e}")
            return []

#these two tables/classes are not limited to parent/child relationship
#they"re bidirectional, you can retrieve the relative data of the other table by calling either table
#UserData table will have the foreign key
#responsible for storing user"s personal information
class UserInfo(App.db.Model):

    """
    Representation of user personal information stored in the database under UserInfo table
    _username : primary key of the table, unique identifier of a user
    _password : can not be null, password of a user"s account
    _email : the unique email address of the user 
    _profile_photo : the url representation of the user"s profile photo in email
    _registered_date : record of the date and time in UTC when user registered 
    _google_id : identification for third party user(sign in via email)
    """
    _username =App.db.Column(App.db.String(30), primary_key=True) #primary_key makes username not null and unique
    _password =App.db.Column(App.db.String(30)) #password can be null for login with email
    _email = App.db.Column(App.db.String(60), unique=True) #this will be kept nullable for now, if required later, this will be changed, along with the other tables
    _profile_photo = App.db.Column(App.db.String(255))
    #record the time the user account is created
    _registered_date = App.db.Column(App.db.DateTime, default=App.db.func.current_timestamp()) #still in UTC timezone
    _google_id = App.db.Column(App.db.String(100)) 

    #user_info_ref/user_data_ref are accessors to navigate the relationship between UserData and UserInfo objects
    #uselist set to False meaning one-to-one relationship between the two table
    #one instance of the user_info is related to one and only one user_data instance (1:1))
    user_data_ref = App.db.relationship("UserData", backref=App.db.backref("user_info_ref_data", uselist=False), cascade="all, delete-orphan", single_parent=True)
    #cascade = "all, delete-orphan" when userinfo/data row is deleted, the parent/child row will also be deleted in one-to-one relationship
    #since cascade default to be many-to-one relationship(1 userinfo - Many userdata rows), single_parent flag need to set to be True(ensures 1:1)

    #another backref relationship for UserLetter class (for delete)
    user_letter_ref = App.db.relationship("UserLetter", backref=App.db.backref("user_info_ref_letter", uselist=False), cascade="all, delete-orphan", single_parent=True)

class UserData(App.db.Model):
    """
    Representation of user(for user dashboard) in game data stored in the database under the UserData table
    _username : non-nullable and unique identifier of a user, act as the primary key and foreign key referencing UserInfo table
    _email : unique email address of user
    _top_wpm : words per minute
    _accuracy : percent of words typed correctly
    _wins : number of multiplayer matches won
    _losses : number of multiplayer matches lost
    _freq_mistyped_words : string of words/phrases frequently mistyped separated by the "|" character
    _total_playing_time : record the total number of time the user is playing the game
    _user_in_game_picture : the in game picture representing an user
    _last_login_time : records the last login time of an user
    _num_races : records the total number of races played by user
    """
    #_user_data_id = App.db.Column(App.db.Integer, primary_key=True) #should not be manually inserted
    _username = App.db.Column(App.db.String(30),App.db.ForeignKey("user_info._username"), primary_key=True) #foreign key referencing UserInfo table
    _email = App.db.Column(App.db.String(60), unique=True)
    #this "user_info" from the above line is mentioning the table name of UserInfo
    #this underscore and the lower case is automated by the system
    #Ask Wenjie if we should add back wpm
    _accuracy = App.db.Column(App.db.Numeric)
    _wins = App.db.Column(App.db.Integer, default=0)
    _losses = App.db.Column(App.db.Integer, default=0)
    _freq_mistyped_words = App.db.Column(App.db.Text)
    _total_playing_time = App.db.Column(App.db.Integer, default=0)

    #newly added
    _top_wpm = App.db.Column(App.db.SmallInteger, default=0)
    _user_in_game_picture = App.db.Column(App.db.String(100)) #should be different from login profile photo
    _last_login_time = App.db.Column(App.db.DateTime) #need configuration later to log user's lastest login time
    _num_races = App.db.Column(App.db.Integer, default=0)

    #validation of whether the username exists in table "user_info" when adding to user_data table
    #this ensures data integrity, sqlalchemy will automatically call this method whenever data is trying to be inserted
    #when inserting/update a row into user_data
    #try/except should be used to catch ValueError exception to avoid crash of system
    #mainly used for update/query/delete method, insert cannot be checked by this validation
    @validates("_username")
    def validate_username(self, key, _username):

        try:
            #selects the first result filtered using username by sqlalchemy 
            user_info = UserInfo.query.filter_by(_username=_username).first()
            if user_info is None: # user_info is None if user does not exist
                raise ValueError(f"User '{_username}' does not exist")
        except ValueError as e: #handled within the method
            print(f"Error: {e}")
            return None
        return _username


class UserLetter(App.db.Model):
    """
    Representing the database table of user"s in game data 
    the number of times a player mistyped a certain letter
    _username : non-nullable identifier, acts as the primary key and foreign key(UserInfo) UserLetter table
    _email : unique email address of user
    _a - _z : 26 columns representing the 26 letters in the alphabets 
    _punctuation : punctuations are stored in English words
    """

    #_user_letter_id = App.db.Column(App.db.Integer, primary_key=True)
    _username = App.db.Column(App.db.String(30), App.db.ForeignKey("user_info._username"), primary_key=True) #onupdate="CASCADE"
    _email = App.db.Column(App.db.String(60), unique=True)
    _a = App.db.Column(App.db.Integer, default=0)
    _b = App.db.Column(App.db.Integer, default=0)
    _c = App.db.Column(App.db.Integer, default=0)
    _d = App.db.Column(App.db.Integer, default=0)
    _e = App.db.Column(App.db.Integer, default=0)
    _f = App.db.Column(App.db.Integer, default=0)
    _g = App.db.Column(App.db.Integer, default=0)
    _h = App.db.Column(App.db.Integer, default=0)
    _i = App.db.Column(App.db.Integer, default=0)
    _j = App.db.Column(App.db.Integer, default=0)
    _k = App.db.Column(App.db.Integer, default=0)
    _l = App.db.Column(App.db.Integer, default=0)
    _m = App.db.Column(App.db.Integer, default=0)
    _n = App.db.Column(App.db.Integer, default=0)
    _o = App.db.Column(App.db.Integer, default=0)
    _p = App.db.Column(App.db.Integer, default=0)
    _q = App.db.Column(App.db.Integer, default=0)
    _r = App.db.Column(App.db.Integer, default=0)
    _s = App.db.Column(App.db.Integer, default=0)
    _t = App.db.Column(App.db.Integer, default=0)
    _u = App.db.Column(App.db.Integer, default=0)
    _v = App.db.Column(App.db.Integer, default=0)
    _w = App.db.Column(App.db.Integer, default=0)
    _x = App.db.Column(App.db.Integer, default=0)
    _y = App.db.Column(App.db.Integer, default=0)
    _z = App.db.Column(App.db.Integer, default=0)
    _comma = App.db.Column(App.db.Integer, default=0) # ,
    _period = App.db.Column(App.db.Integer, default=0) # .
    _exclamation = App.db.Column(App.db.Integer, default=0) # !
    _question = App.db.Column(App.db.Integer, default=0) # ?
    _hyphen = App.db.Column(App.db.Integer, default=0) # -
    _semicolon = App.db.Column(App.db.Integer, default=0) # ;
    _single_quote = App.db.Column(App.db.Integer, default=0) # '
    _double_quote = App.db.Column(App.db.Integer, default=0) # "


    #auto checks(by sqlalchemy) whether user exist in the user info table whenever data is inserting/updating
    @validates("_username")
    def validate_username(self, key, _username):
        try:
            user_info_uname = UserInfo.query.filter_by(_username=_username).first()
            if user_info_uname is None:
                raise ValueError(f"User '{_username}' does not exist")
        except ValueError as e:
            print(f"Error: {e}")
            return None
        return _username
    

class UserRace(App.db.Model):
    """
    Representing the instance of a race initiated by user
    Relative in game data will be recorded
    _username : acts as the primary and foreign key of the table, rooted from UserInfo
    _email : unique and nullable attribute of user's email address
    _average_wpm : the average of words per min in an instance of a race
    _selected_mode : the selected mode of a typing race/practice
    _time_limit : optional recording of time limit of a certain game mode
    _date_played : the date/time the race/practice is initiated
    """
    _username = App.db.Column(App.db.String(30), App.db.ForeignKey("user_info._username"), primary_key=True)
    #email is in every table for query purposes
    _email = App.db.Column(App.db.String(60), unique=True)
    #different from highest wpm, this is a record of per game/race
    _average_wpm = App.db.Column(App.db.Integer, default=0)
    #representing the mode selected by user at that game/race instance
    _selected_mode = App.db.Column(App.db.String(20))
    #optional input when user selected a mode with time limit
    _time_limit = App.db.Column(App.db.Float)
    #records the date user played that race
    _date_played = App.db.Column(App.db.DateTime)

    #regular check of user info username when entering data in UserRace
    @validates("_username")
    def validate_username(self, key, _username):
        try:
            user_info_uname = UserInfo.query.filter_by(_username=_username).first()
            if user_info_uname is None:
                raise ValueError(f"User '{_username}' does not exist")
        except ValueError as e:
            print(f"Error: {e}")
            return None
        return _username


if __name__=="__main__":
    app = App()

    #creates database tables and used for testing purposes(insert/update/query/delete)
    with app._app.app_context():

        #app.db.drop_all()

        app.db.create_all()

        #sample insert
        #there is limitation and constraints in the Columns
        #for example, do not repeat the same number in the num_row as it might have repeated _username and _email (which is suppose to be unique)
        #if you want to re-populate with the same num_rows, you must run app.db.dropall() before this method
        #after testing, you can repeat the number, but preferrably not to do that
        #Database.populate_sample_date(1000)

        #this method returns a list represention of top-n largest mistyped letters
        # top_n_letters = Database.get_top_n_letters("user35", 6)
        # print(top_n_letters)

    app.run(host="localhost", debug=True)