import requests
from .email_request import EmailRequest
# from EmailRequest import EmailRequest


class EmailGeneratorService:
    gemini_api_key = "AIzaSyDYqps0MVGueOodKZKl2AwbpX39KjB63KU"
    gemini_api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_api_key}"

    def generate_email_reply(self, email_request: EmailRequest) -> str:
        prompt = self.build_prompt(email_request)
        requestBody = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }

        headers = {
            "Content-Type": "application/json"
        }

        response = requests.post(
            url=self.gemini_api_url, json=requestBody, headers=headers)

        if response.status_code == 200:
            data = response.json()
            llm_response = data["candidates"][0]["content"]["parts"][0]["text"]

            # print(llm_response)

            return llm_response
        else:
            # Handle errors appropriately
            print(f"Error: {response.status_code} - {response.text}")
            return None

    def build_prompt(self, email_request: EmailRequest) -> str:
        prompt = "Generate an email reply for the following email content. Please don't generate a subject line "
        # print(email_request)
        if (email_request.tone):
            tone = email_request.tone
            prompt += f" Use a {tone} tone."
        prompt += f"\n Original email: \n {email_request.email_content}"
        return prompt


if __name__ == "__main__":
    email_request = EmailRequest(
        email_content="Hey there this is John from Google India, it was great meeting at the cloud event.", tone="formal")
    EmailGeneratorService().generate_email_reply(email_request=email_request)
