import random

with open('easy_sentences.txt', 'r', encoding='latin-1') as file:
    easy_sentences = file.readlines()
easy_random_sentence = random.choice(easy_sentences).strip()

with open('medium_sentences.txt', 'r', encoding='latin-1') as file:
    medium_sentences = file.readlines()
medium_random_sentence = random.choice(medium_sentences).strip()

with open('hard_sentences.txt', 'r', encoding='latin-1') as file:
    hard_sentences = file.readlines()
hard_random_sentence = random.choice(hard_sentences).strip()


print(easy_random_sentence)
print(medium_random_sentence)
print(hard_random_sentence)
