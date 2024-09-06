from random import randint
import requests
import os
from dotenv import load_dotenv
LEN_OF_LONGEST_WORD = 22
LEFT_SIDE = "qwert|asdfg|zxcv"
LEFT_ROW2_START = LEFT_SIDE.find('|')
LEFT_ROW3_START = LEFT_SIDE.find('|', LEFT_ROW2_START+1)
RIGHT_SIDE = "poiuy|lkjh|mnb"
RIGHT_ROW2_START = RIGHT_SIDE.find('|')
RIGHT_ROW3_START = RIGHT_SIDE.find('|', RIGHT_ROW2_START+1)
PINKIE_CHARS = "qaz"
SYS_PROMPT = "You are a word/sentence generator. You will be asked to generate sentences or words for typing games given a difficulty level in terms of typing, form parameter of sentences or words, and number to indicate the amount of words or sentences, or, instaed of those, a genre (will be None if no genre is inputted). The input will look like: 'Difficulty: <difficulty>, Form: <form>, Amount: <amount>, Genre: <genre>'. If generating words, making sure to generate a string of space separated words. Try not to repeat words if possible, but stick to difficulty levels asked for. Try to also make sentences unique as possible or follow each other logically."

load_dotenv()
llama_api_key = os.environ.get("LLAMA_API_KEY")
api_generation_history = []

class Text_Generator:
    """
    Responsible for generating text for a game to use and also separating words into different difficulties (the latter is done outside of run time)
    """

    def get_txt_list(file) -> list[str]:
        """
        Reads from wordList.txt to create an array of the words in it
        :return wordList : list of words contained in wordList.txt
        """
        txtListFile = open(file, "r")
        return txtListFile.read().split('\n')

    def get_avg_txt_len(lst):
        lenWordsLst = list(map(len, lst))
        return sum(lenWordsLst)/len(lenWordsLst)

    def score_word_typing_difficulty(self, word) -> int:
        """
        Scores words according to their typing difficulty
        :param word
        : return score
        """
        score = 0
        if len(word) <= 3:
            return 0
        i = 0
        side_switches = 0
        direc_verts = 0
        while i < len(word):
            has_next_char = i+1 < len(word)
            # checking edge chars
            if word[i] in PINKIE_CHARS:
                score += 0.25
                if has_next_char and word[i+1] == word[i]:
                    i += 1
            # checking direct verticals and consecutive side switches
            has_next_char = i+1 < len(word)
            if has_next_char:
                curr_word_left_ind = LEFT_SIDE.find(word[i])
                next_word_left_ind = LEFT_SIDE.find(word[i+1])
                curr_word_right_ind = RIGHT_SIDE.find(word[i])
                next_word_right_ind = RIGHT_SIDE.find(word[i+1])
                if (curr_word_left_ind == -1 and next_word_left_ind != -1) or (curr_word_left_ind != -1 and next_word_left_ind == -1):
                    side_switches += 1
                else:
                    if side_switches > 5:
                        score += (side_switches-5)*0.25
                    side_switches = 0
                    if self.is_direct_vertical(curr_word_left_ind, next_word_left_ind, True):
                        direc_verts += 1
                    elif self.is_direct_vertical(curr_word_right_ind, next_word_right_ind, False):
                        direc_verts += 1
            i += 1
        if direc_verts > 2:
            score += (direc_verts-3)*0.25
        if side_switches > 5:
            score += (side_switches-5)*0.25
        return score/(LEN_OF_LONGEST_WORD+1-len(word))*100

    def is_direct_vertical(self, curr_char_keyboard_pos, nxt_char_keyboard_pos, is_left):
        """
        Determines whether keys are directly vertically above or below each other
        @precondition : the characters are on the same half (left or right) of the keyboard
        :param curr_char_keyboard_pos : index of the current character in the representation of the left half of the keyboard if is_left or RIGHT_SIDE otherwise
        :param nxt_char_keyboard_pos : index of the next character in the representation of the left half of the keyboard if is_left or RIGHT_SIDE otherwise
        :param is_left : boolean that indicates whether the char belongs to 
        """
        if (curr_char_keyboard_pos != -1 and nxt_char_keyboard_pos != -1):
            # standardize the rows
            row2_start = RIGHT_ROW2_START
            row3_start = RIGHT_ROW3_START
            if is_left:
                row2_start = LEFT_ROW2_START
                row3_start = LEFT_ROW3_START
            if curr_char_keyboard_pos > row3_start:
                curr_char_keyboard_pos -= row3_start
            elif curr_char_keyboard_pos > row2_start:
                curr_char_keyboard_pos -= row2_start
            if nxt_char_keyboard_pos > row3_start:
                nxt_char_keyboard_pos -= row3_start
            elif nxt_char_keyboard_pos > row2_start:
                nxt_char_keyboard_pos -= row2_start
            return True if abs(curr_char_keyboard_pos-nxt_char_keyboard_pos) <= 2 else False
        else:
            return False

    def sort_words_by_difficulty(self, word_lst: list[str]):
        """
        Uses the scoring function to score each of the words in the given word list and then split them off to different files based on their difficulty
        :param word_lst
        """
        easy = ""
        easy_count = 0
        medium = ""
        med_count = 0
        hard = ""
        hard_count = 0
        num_words = 0
        total = 0
        for word in word_lst:
            score = self.score_word_typing_difficulty(word)
            num_words += 1
            total += score
            if score <= 1.5:
                easy += word+'\n'
                easy_count += 1
            elif score < 3.2:
                medium += word+'\n'
                med_count += 1
            else:
                hard += word+'\n'
                hard_count += 1
        print(f"Average: {total/num_words}")
        print(easy_count)
        print(med_count)
        print(hard_count)
        with open("easy_words.txt", "w") as easy_words:
            easy_words.write(easy.strip('\n'))
        with open("medium_words.txt", "w") as medium_words:
            medium_words.write(medium.strip('\n'))
        with open("hard_words.txt", "w") as hard_words:
            hard_words.write(hard.strip('\n'))

    def generate_text(difficulty: str, form: str, amount: int, genre: str = None):
        """
        Generates the text that shall be typed by users for a game.
        If 'genre' is specified, it modifies the file selection process,
        otherwise, the file is selected based on 'difficulty' and 'form'.
        :param difficulty
        :param form : either "sentences" or "words"
        :param amount : number of sentences or words
        :param genre
        """
        file_name = ""
        try:
            if llama_api_key:
                try:
                    api_generation_history.append({"role":"user","content":f"Difficulty: {difficulty}, Form: {form}, Amount: {amount}, Genre: {genre}"})
                    payload = {
                        "model": "meta-llama/llama-3.1-8b-instruct:free",
                        "messages": api_generation_history,
                        "top_p": 1,
                        "temperature": 1,
                        "repetition_penalty": 1,
                        "response_format": { "type": "string" },
                    }
                    headers = {
                        "Authorization": f"Bearer {llama_api_key}",
                        "Content-Type": "application/json"
                    }
                    response = requests.post("https://openrouter.ai/api/v1/chat/completions",json=payload,headers=headers)
                    if response.status_code == 200:
                        api_response = response.json()
                        response_message = api_response["choices"][0]["message"]["content"]
                        api_generation_history.append({"role": "generator", "content": response_message})
                        return response_message
                    else:
                        print(response)
                except Exception as e:
                    print(e)
            # Determine the file name based on whether 'genre' is provided
            if genre:
                file_name = f"{genre}{form}.txt"
            elif difficulty:
                file_name = f"{difficulty}_{form}.txt"
            else:
                return "Difficulty must be specified if genre is not provided."

            with open(file_name, 'r') as file:
                txt_lst = file.readlines()
                # Ensure 'amount' does not exceed number of lines available
                amount = min(int(amount), len(txt_lst))
                otpt = ""
                for i in range(amount):
                    rand_ind = randint(0, len(txt_lst)-1)
                    # Using strip to remove newline characters
                    otpt += txt_lst.pop(rand_ind).strip() + ' '
                return otpt.strip()  # Remove the last space"""
        except Exception as e:
            return f"Error: {e}"
