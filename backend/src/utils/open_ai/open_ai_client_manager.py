from openai import OpenAI, RateLimitError
from src.utils.env_helper import get_setting
from pathlib import Path
import os
from langchain_core.prompts import PromptTemplate


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

    def run_prompt_template(
        self, template: str, variables: dict, user_message: str, model: str = "gpt-4o"
    ):
        prompt_str: str = self.load_template(template_name=template)
        prompt_template = PromptTemplate.from_template(template=prompt_str)
        prompt_value = prompt_template.format(**variables)
        completion = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": prompt_value},
                {"role": "user", "content": user_message},
            ],
        )
        return completion.choices[0].message.content

    def load_template(self, template_name: str) -> str:
        root = os.getcwd()  # Project Root ([...]\HACC_2025\Stack-Attack\backend)
        prompt_location = f"{root}/prompts/{template_name}.txt"
        with open(prompt_location, "r", encoding="utf-8") as f:
            return f.read().strip()


open_ai_client_manager = Open_AI_Client_Manager()
open_ai_client_manager.load_template("s")
