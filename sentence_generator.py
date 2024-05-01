import openai
import string
import os
from dotenv import load_dotenv
#OpenAI Key
load_dotenv()
openai.api_key = os.getenv('CHAT_API_KEY')

if openai.api_key is None:
    raise ValueError("No OpenAI API key found. Set the CHAT_API_KEY environment variable.")


def main():
    sentences = generate_sentences("hard")
    
    print(sentences)

def is_valid_characters(sentence):
    allowed_characters = set(string.ascii_letters + string.punctuation + " ")
    return all(char in allowed_characters for char in sentence)

def is_similar(new_sentence, existing_sentences, first_three_words_set):
    #Remove punctuation and convert to lowercase for similarity checking
    translator = str.maketrans('', '', string.punctuation)
    normalized_sentence = new_sentence.translate(translator).lower()

    #Check for exact match in normalized sentences
    if any(normalized_sentence == sentence.translate(translator).lower() for sentence in existing_sentences):
        return True

    #Extract first three words and check against the set
    first_three_words = ' '.join(normalized_sentence.split()[:3])
    if first_three_words in first_three_words_set:
        return True

    return False

def generate_sentences(difficulty):
    difficulty_mapping = {"easy": 1, "medium": 2, "hard": 3}
    if difficulty not in difficulty_mapping:
        return "Invalid difficulty level"

    difficulty_index = difficulty_mapping[difficulty] - 1
    num_sentences = 10
    sentences = []
    unique_checks = set()
    first_three_words_set = set()

    prompt = "Create a sentence that has "
    if difficulty_index == 0:
        prompt += "short and simple words that have letters that are easy to type in sequence."
    elif difficulty_index == 1:
        prompt += "of medium length, with moderate vocabulary and one comma that have letters that are moderately difficult to type in sequence."
    elif difficulty_index == 2:
        prompt += "long and complex, using advanced vocabulary, including commas, semicolons, and at least one capitalized proper noun with words that have letters that are difficult to type in sequence."

    attempts = 0
    while len(sentences) < num_sentences and attempts < 50:
        try:
            response = openai.Completion.create(
                engine="gpt-3.5-turbo-instruct",
                prompt=prompt,
                temperature=1.0,
                max_tokens=100,
                top_p=1,
                frequency_penalty=2.0,
                presence_penalty=2.0
            )
            generated_sentence = response.choices[0].text.strip()
            if is_valid_characters(generated_sentence) and not is_similar(generated_sentence, unique_checks, first_three_words_set):
                unique_checks.add(generated_sentence)
                sentences.append(generated_sentence)
                first_three_words_set.add(' '.join(generated_sentence.lower().translate(str.maketrans('', '', string.punctuation)).split()[:3]))
        except Exception as e:
            print(f"An error occurred: {e}")
        attempts += 1

    return ' '.join(sentences) 
