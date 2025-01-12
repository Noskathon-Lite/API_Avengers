import os
import time
import pdfplumber
import google.generativeai as genai

# Configure Gemini API
genai.configure(api_key="AIzaSyBNA5sSYFNQdAMEp_PuG8KxCh5pRqkxuPA")

def upload_to_gemini(path, mime_type=None):
    """Uploads the given file to Gemini."""
    try:
        file = genai.upload_file(path, mime_type=mime_type)
        print(f"Uploaded file '{file.display_name}' as: {file.uri}")
        return file
    except Exception as e:
        print(f"Error uploading file: {e}")
        raise

def wait_for_files_active(files):
    """Waits for the given files to be active."""
    print("Waiting for file processing...")
    for name in (file.name for file in files):
        while True:
            file = genai.get_file(name)
            if file.state.name == "PROCESSING":
                print(".", end="", flush=True)
                time.sleep(10)
            elif file.state.name == "ACTIVE":
                break
            else:
                raise Exception(f"File {file.name} failed to process")
    print("...all files ready")
    print()

def text_abstractor(filepath):
    """Extracts text from a PDF file."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File not found: {filepath}")
    try:
        with pdfplumber.open(filepath) as pdf:
            text = ''.join(page.extract_text() or '' for page in pdf.pages)
            if not text.strip():
                raise ValueError("PDF contains no text content.")
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        raise

def summary_text_with_gemini(text):
    """Generates a summary using Gemini."""
    generation_config = {
      "temperature": 1,
      "top_p": 0.95,
      "top_k": 40,
      "max_output_tokens": 8192,
      "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
      model_name="gemini-2.0-flash-exp",
      generation_config=generation_config,
      system_instruction="summarize the pdf into more than 20 points ",
    )

    chat_session = model.start_chat(
      history=[
      ]
    )

    response = chat_session.send_message(text)

    print(response.text)

# Main Execution
if __name__ == "__main__":
    path_file = "uploads/Searching-Algorithm.pdf"
    try:
        text = text_abstractor(path_file)
        summary_text_with_gemini(text)
    except Exception as e:
        print(f"An error occurred: {e}")
