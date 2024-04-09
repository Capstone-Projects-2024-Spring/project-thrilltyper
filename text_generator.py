class Text_Generator:
    """
    Responsible for generating text for a game to use and also separating words into different difficulties (the latter is done outside of run time)
    """
    def getTxtList(self,file) -> list[str]:
        """
        Reads from wordList.txt to create an array of the words in it
        @return wordList : list of words contained in wordList.txt
        """
        txtListFile = open(file,"r")
        return txtListFile.read().split('\n')

    def generate_text():
        """
        Generates the text that shall be typed by users for a game
        """
        pass