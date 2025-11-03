from openai import AsyncOpenAI, RateLimitError
from src.utils.env_helper import get_setting
import os
from langchain_core.prompts import PromptTemplate


class Open_AI_Client_Manager:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=get_setting("OPEN_AI_KEY"))

    async def get_chat_model(self, user_message: str, model: str = "gpt-4o"):
        try:
            completion = await self.client.chat.completions.create(
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

    async def run_prompt_template(
        self,
        template: str,
        variables: dict,
        user_message: str | None = None,
        model: str = "gpt-4o",
    ):
        try:
            prompt_template = PromptTemplate.from_template(template=template)
            prompt_value = prompt_template.format(**variables)
            messages: list[dict] = [{"role": "system", "content": prompt_value}]
            if user_message is not None:
                messages.append({"role": "user", "content": user_message})
            completion = await self.client.chat.completions.create(
                model=model,
                messages=messages,
            )
            # print("=== RAW COMPLETION RESPONSE ===")
            # print(completion)
            if not completion or not getattr(completion, "choices", []):
                raise ValueError(f"Invalid completion response: {completion}")
            prompt_tokens = completion.usage.prompt_tokens
            completion_tokens = completion.usage.completion_tokens
            total_tokens = completion.usage.total_tokens

            print(f"Prompt tokens: {prompt_tokens}")
            print(f"Completion tokens: {completion_tokens}")
            print(f"Total tokens: {total_tokens}")
            return completion.choices[0].message.content

        except Exception as e:
            print(f"[OpenAI Client ERROR] run_prompt_template failed: {e}")
            raise

    async def run_streamed_prompt_template(
        self,
        message: str,
        template: str,
        variables: dict,
        model: str = "gpt-4o",
    ):
        try:
            # TODO: LOAD CHAT HISTORY (Maybe)
            prompt_template = PromptTemplate.from_template(template=template)
            prompt_value = prompt_template.format(**variables)
            messages: list[dict] = [{"role": "system", "content": prompt_value}]
            if message is not None:
                messages.append({"role": "user", "content": message})
            stream = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                stream=True
            )
            return stream
        except Exception as e:
            print(f"[OpenAI Client stream ERROR] run_streamed_prompt_template failed: {e}")
            raise

    async def run_embed(self, text: str):
        try:
            embedding = await self.client.embeddings.create(
                model="text-embedding-3-small",
                input=text,
                encoding_format="float",
                dimensions=1536,
            )

            usage = getattr(embedding, "usage", None)
            data = embedding.data[0]

            print(f"Embedding usage: {usage}")
            print(f"Embedding length: {len(data.embedding)}")

            return data.embedding

        except Exception as e:
            print(f"Embedding Error: {str(e)}")
            return None
        # Output sample:
        # {
        #   "object": "list",
        #   "data": [
        #     {
        #       "object": "embedding",
        #       "index": 0,
        #       "embedding": [
        #         -0.006929283495992422,
        #         -0.005336422007530928,
        #         -4.547132266452536e-05,
        #         -0.024047505110502243
        #       ],
        #     }
        #   ],
        #   "model": "text-embedding-3-small",
        #   "usage": {
        #     "prompt_tokens": 5,
        #     "total_tokens": 5
        #   }
        # }

    def load_template(self, template_name: str) -> str:
        root = os.getcwd()  # Project Root ([...]\HACC_2025\Stack-Attack\backend)
        prompt_location = f"{root}/src/prompts/{template_name}.txt"
        with open(prompt_location, "r", encoding="utf-8") as f:
            return f.read().strip()


open_ai_client_manager = Open_AI_Client_Manager()
