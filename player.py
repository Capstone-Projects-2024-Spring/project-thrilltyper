class player():
    """
    Represents a player in an active game session of ThrillTyper.

    This class stores details about the player, including their username, score, typing accuracy,
    words per minute, and frequently mistyped words. It also provides methods to update the player's
    performance metrics.

    :param username: The username of the player.
    :type username: str
    :param score: The score of the player in the current game.
    :type score: int
    :param accuracy: The typing accuracy of the player.
    :type accuracy: float
    :param wpm: The words per minute typing speed of the player.
    :type wpm: int
    :param freq_mistyped_words: The frequently mistyped words by the player.
    :type freq_mistyped_words: str
    """
    
    def __init__(self, username, profile_photo):
        """
        Initialize a new player with default performance metrics.

        :param username: The username of the player.
        :type username: str
        :param score: The score of the player in the current game.
        :type score: int
        :param accuracy: The typing accuracy of the player.
        :type accuracy: float
        :param wpm: The words per minute typing speed of the player.
        :type wpm: int
        :param freq_mistyped_words: The frequently mistyped words by the player.
        :type freq_mistyped_words: str
        """
        self.username = username
        self.profile_photo = profile_photo
        self.score = 0
        self.accuracy = 0.0
        self.wpm = 0
        self.freq_mistyped_words = ''
    
    def update_wpm(self, new_wpm):
        """
        Update the words per minute (wpm) for the player.

        :param new_wpm: The new words per minute to set for the player.
        :type new_wpm: int
        :return: None
        """
        self.wpm = new_wpm
    
    def update_accuracy(self, new_accuracy):
        """
        Update the typing accuracy for the player.

        :param new_accuracy: The new typing accuracy to set for the player.
        :type new_accuracy: float
        :return: None
        """
        self.accuracy = new_accuracy
    
    def update_freq_mistyped(self, new_freq_mistyped_words):
        """
        Update the frequently mistyped words for the player.

        :param new_freq_mistyped_words: The new list of frequently mistyped words for the player.
        :type new_freq_mistyped_words: str
        :return: None
        """
        self.freq_mistyped_words = new_freq_mistyped_words # will adjust later to concatenate mistyped words with delimiter
    
    def update_score(self, additional_points):
        """
        Update the score for the player by adding additional points.

        :param additional_points: The number of points to add to the player's score.
        :type additional_points: int
        :return: None
        """
        self.score += additional_points

    def __json__(self):
        """
        Return JSON serializable format of the instance
        :return: dict of the instance
        """
        return {"userinfo": {"given_name" : self.username}}