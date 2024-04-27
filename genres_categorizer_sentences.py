import openai
import os

# Load the OpenAI API key from environment variables for better security
openai.api_key = ''


def classify_content(content, content_type):
    genres = "Educational, Narratives, Scenic, Fiction, Culinary, Miscellaneous"
    # Craft a prompt that emphasizes genre fitting unless absolutely necessary to use Miscellaneous
    prompt = (f"Consider the word '{content}'. This word should be categorized into one of the following specific categories if possible: "
              f"Educational, Narratives, Scenic, Fiction, Culinary. Only categorize it as 'Miscellaneous' if it clearly has no relevance or connection "
              "to these categories whatsoever. Where would this word be most appropriately placed based on its most common usage or context?")
    response = openai.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=prompt,
        max_tokens=60,  # Appropriate token limit for focused responses
        temperature=0.5  # Lower temperature to encourage more predictable, conservative genre assignment
    )
    # Extract and sanitize the response
    genre = response.choices[0].text.strip().split(',')[0].strip()
    if genre not in genres.split(", "):
        genre = 'Miscellaneous'  # Default to Miscellaneous only if the response is not in the list
    return genre


def process_file(input_file, output_dirs, content_type):
    # Ensure output directories exist
    for dir_path in output_dirs.values():
        if not os.path.exists(dir_path):
            os.makedirs(dir_path, exist_ok=True)

    with open(input_file, 'r') as file:
        for line in file:
            genre = classify_content(line.strip(), content_type)
            # Decide the file name based on content type
            filename = f"{genre}{content_type.capitalize()}.txt"
            output_file = os.path.join(
                output_dirs.get(genre, output_dirs['Miscellaneous']), filename)  # Use 'Miscellaneous' as default

            with open(output_file, 'a') as f:
                f.write(line)


# Directories for output
output_dirs = {
    'Educational': 'Educational',
    'Narratives': 'Narratives',
    'Scenic': 'Scenic',
    'Fiction': 'Fiction',
    'Culinary': 'Culinary',
    'Miscellaneous': 'Miscellaneous'
}

# Example usage for sentences and words
process_file('words.txt', output_dirs, 'words')
