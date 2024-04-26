import openai
import string

#OpenAI Key
openai.api_key = os.getenv('CHAT_API_KEY')

if openai.api_key is None:
    raise ValueError("No OpenAI API key found. Set the CHAT_API_KEY environment variable.")


def main():
    sentences = generate_sentences()
    
    #File names for each difficulty level
    file_names = ['easy_sentences.txt', 'medium_sentences.txt', 'hard_sentences.txt']
    
    #Write sentences to their respective files
    for i, difficulty_level in enumerate(sentences):
        with open(file_names[i], 'w') as file:
            for sentence in difficulty_level:
                file.write(sentence + '\n')

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

def generate_sentences():
    sentences_per_difficulty = 10
    sentences = [[], [], []]
    unique_checks = set()  #Using a set to track unique sentences
    first_three_words_set = set()  #Set to track first three words of each sentence

    for i in range(sentences_per_difficulty):
        for difficulty in range(1, 4):
            prompt = "Create a sentence that has "
            if difficulty == 1:
                prompt += "short and simple words that have letters that are easy to type in sequence."
            elif difficulty == 2:
                prompt += "of medium length, with moderate vocabulary and one comma that have letters that are moderately difficult to type in sequence."
            elif difficulty == 3:
                prompt += "long and complex, using advanced vocabulary, including commas, semicolons, and at least one capitalized proper noun with words that have letters that are difficult to type in sequence."
            
            attempts = 0
            while attempts < 5:
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
                    
                    #Check if the sentence is valid based on characters and if it is similar
                    if is_valid_characters(generated_sentence) and not is_similar(generated_sentence, unique_checks, first_three_words_set):
                        unique_checks.add(generated_sentence)
                        sentences[difficulty - 1].append(generated_sentence)
                        first_three_words_set.add(' '.join(generated_sentence.lower().translate(str.maketrans('', '', string.punctuation)).split()[:3]))
                        break
                except Exception as e:
                    print(f"An error occurred: {e}")
                attempts += 1

    return sentences  

if __name__ == "__main__":
    main()