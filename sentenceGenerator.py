
import random

def get_random_sentence(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        sentences = file.readlines()
    random_sentence = random.choice(sentences).strip()
    return random_sentence

# Get random sentences from each file
easy_random_sentence = get_random_sentence('easy_sentences.txt')
medium_random_sentence = get_random_sentence('medium_sentences.txt')
hard_random_sentence = get_random_sentence('hard_sentences.txt')

print("Easy Sentence:", easy_random_sentence)
print("Medium Sentence:", medium_random_sentence)
print("Hard Sentence:", hard_random_sentence)
