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

    def score_word_typing_difficulty(self,word)->int:
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
            if word[i] in self.pinkie_chars:
                temp=0.5
                if has_next_char and word[i+1] in self.pinkie_chars:
                    temp*=2.0
                    i+=1
                score+=temp
            elif word[i] in self.ring_fing_chars:
                temp=.25
                if has_next_char and word[i+1] in self.ring_fing_chars:
                    temp*=3.0
                    i+=1
                score+=temp
            #checking direct verticals and consecutive side switches
            has_next_char=i+1<len(word)
            if has_next_char:
                curr_word_left_ind = self.left_side.find(word[i])
                next_word_left_ind = self.left_side.find(word[i+1])
                curr_word_right_ind = self.right_side.find(word[i])
                next_word_right_ind = self.right_side.find(word[i+1])
                if (curr_word_left_ind==-1 and next_word_left_ind!=-1) or (curr_word_left_ind!=-1 and next_word_left_ind==-1):
                    side_switches+=1
                else:
                    if side_switches>5:
                        score+=(side_switches-5)*0.25
                    side_switches=0
                    if self.is_direct_vertical(curr_word_left_ind,next_word_left_ind, True):
                        score+=0.25
                    elif self.is_direct_vertical(curr_word_right_ind,next_word_right_ind, False):
                        score+=0.25
            #ensures extra increment is not done after the last while loop
            i+=1
        return score
    
    def is_direct_vertical(self,curr_char_keyboard_pos, nxt_char_keyboard_pos, is_left):
        """
        Determines whether keys are directly vertically above or below each other
        @precondition : the characters are on the same half (left or right) of the keyboard
        :param curr_char_keyboard_pos : index of the current character in the representation of the left half of the keyboard if is_left or right_side otherwise
        :param nxt_char_keyboard_pos : index of the next character in the representation of the left half of the keyboard if is_left or right_side otherwise
        :param is_left : boolean that indicates whether the char belongs to 
        """
        if (curr_char_keyboard_pos!=-1 and nxt_char_keyboard_pos!=-1):
            #standardize the rows
            row2_start = self.right_row2_start
            row3_start = self.right_row3_start
            if is_left:
                row2_start = self.left_row2_start
                row3_start = self.left_row3_start
            if curr_char_keyboard_pos>row3_start:
                curr_char_keyboard_pos-=row3_start
            elif curr_char_keyboard_pos>row2_start:
                curr_char_keyboard_pos-=row2_start
            if nxt_char_keyboard_pos>row3_start:
                nxt_char_keyboard_pos-=row3_start
            elif nxt_char_keyboard_pos>row2_start:
                nxt_char_keyboard_pos-=row2_start
            return True if abs(curr_char_keyboard_pos-nxt_char_keyboard_pos)<=2 else False
        else:
            return False

    def generate_text():
        """
        Generates the text that shall be typed by users for a game
        """
        pass