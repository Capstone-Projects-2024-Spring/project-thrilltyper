class Text_Generator:
    """
    Responsible for generating text for a game to use and also separating words into different difficulties (the latter is done outside of run time)
    """
    left_side = "qwert|asdfg|zxcv"
    left_row2_start = left_side.find('|')
    left_row3_start = left_side.find('|',left_row2_start+1)
    right_side = "poiuy|lkjh|mnb"
    right_row2_start = right_side.find('|')
    right_row3_start = right_side.find('|',right_row2_start+1)
    pinkie_chars = "qaz"
    ring_fing_chars = "wsxopl"
    
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