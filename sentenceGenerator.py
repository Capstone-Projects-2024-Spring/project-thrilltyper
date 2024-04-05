import random

with open('easy_sentences.txt', 'r', encoding='utf-8') as file:
    sentences = file.readlines()
random_sentence = random.choice(sentences).strip()
print(random_sentence)
