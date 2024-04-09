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
        :return wordList : list of words contained in wordList.txt
        """
        txtListFile = open(file,"r")
        return txtListFile.read().split('\n')

    def score_word_typing_difficulty(word)->int:
        """
        Scores words according to their typing difficulty
        :param word
        : return score
        """
        score = 0
        i = 0
        side_switches = 0
        while i<len(word):
            temp = 0
            has_next_char = i+1<len(word)
            #checking edge chars
            if word[i] in pinkie_chars:
                temp=0.5
                if has_next_char and word[i+1] in pinkie_chars:
                    temp*=2.0
                    i+=1
                score+=temp
            elif word[i] in ring_fing_chars:
                temp=.25
                if has_next_char and word[i+1] in ring_fing_chars:
                    temp*=3.0
                    i+=1
                score+=temp
            #checking direct verticals and consecutive side switches
            has_next_char=i+1<len(word)
            if has_next_char:
                curr_word_left_ind = left_side.find(word[i])
                next_word_left_ind = left_side.find(word[i+1])
                curr_word_right_ind = right_side.find(word[i])
                next_word_right_ind = right_side.find(word[i+1])
                if (curr_word_left_ind==-1 and next_word_left_ind!=-1) or (curr_word_left_ind!=-1 and next_word_left_ind==-1):
                    side_switches+=1
                else:
                    if side_switches>5:
                        score+=(side_switches-5)*0.25
                    side_switches=0
                    if is_direct_vertical(curr_word_left_ind,next_word_left_ind, True):
                        score+=0.25
                    elif is_direct_vertical(curr_word_right_ind,next_word_right_ind, False):
                        score+=0.25
            #ensures extra increment is not done after the last while loop
            i+=1
        return score

    def generate_text():
        """
        Generates the text that shall be typed by users for a game
        """
        pass