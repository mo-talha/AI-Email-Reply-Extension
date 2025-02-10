**AI Email Reply Generator**
This Chrome extension empowers users to compose professional and engaging email replies with the assistance of artificial intelligence.

**Key Features:**

1. **Effortless Reply Generation:** Simply click the "AI Reply" button within the email compose box, and the extension will generate a suitable reply based on the email content.
2. **Customizable Tone:** Select the desired tone for your reply (Polite, Professional, Casual, Angry) to tailor the AI-generated response to your specific needs. By default the email tone is set to **Professional**.
3. **Gemini 1.5 Flash Integration:** Leverages the advanced language capabilities of the Gemini 1.5 Flash model to produce high-quality and contextually relevant replies. Can also integrate other models from deepseek, cluade, openAI etc either using
   the APIs or through locally installed models.
4. **Seamless Integration:** Integrates seamlessly into the email composition workflow, providing a convenient and user-friendly experience.

**Requirements**
- Check requirements.txt or pip install requirements.txt in PythonBackend folder.

**How it Works:**
**The extension folder:**

- The main file is the content.js file
- This file has the code which creates the extension, gets the email content from the compose box
  using mutation observer and DOM elements.
- It uses fetch method, sends a POST request to python API with email content and tone in the body.

**Python Backend Folder:**

- The Email Generator Service class has methods which process the email content, connect to gemini
  api and send a prompt to Flash 1.5 model to generate a reply.
- main.py has the controller class for POST API.
- email_request is a class which represents an email object, with email content from the compose box
  and the tone.
