from openai import OpenAI, RateLimitError
from src.utils.env_helper import get_setting


class Open_AI_Client_Manager:
    def __init__(self):
        self.client = OpenAI(api_key=get_setting("OPEN_AI_KEY"))

    def get_chat_model(self, user_message: str, model: str = "gpt-4o"):
        try:
            completion = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_message},
                ],
            )
            return completion.choices[0].message.content
        except RateLimitError as e:
            return f"OpenAI rate limit or quota exceeded: {e}"  # TODO: THIS IS THE EXPECTED ERROR TILL I CREATE A PAID ACCOUNT!
        except Exception as e:
            return f"Unexpected error: {e}"


open_ai_client_manager = Open_AI_Client_Manager()
