import os
from groq import Groq
from dotenv import load_dotenv

class CaptionGenerator:
    def __init__(self):
        load_dotenv()
        self.client = Groq(api_key=os.getenv("GROQ"))

    def generate_caption(self, front_camera: str, back_camera: str):
        front_caption = self.client.chat.completions.create(
        model="llava-v1.5-7b-4096-preview",
        messages=[
            {
            "role": "user",
            "content": [
                {"type": "text", "text": "Generate a nonsensical random caption under 10 words."},
                {
                "type": "image_url",
                "image_url": {
                    # "url": f"{front_camera}",
                    "url": "https://t4.ftcdn.net/jpg/02/61/52/95/360_F_261529596_YZWJaMnYFSCM0FSCrxs71o6RrZ9MpP4D.jpg",
                },
                },
            ],
            }
        ],
        ).choices[0].message.content
        back_caption = self.client.chat.completions.create(
        model="llava-v1.5-7b-4096-preview",
        messages=[
            {
            "role": "user",
            "content": [
                {"type": "text", "text": "Generate a nonsensical random caption under 10 words."},
                {
                "type": "image_url",
                "image_url": {
                    # "url": f"{back_camera}",
                    "url": "https://t4.ftcdn.net/jpg/02/61/52/95/360_F_261529596_YZWJaMnYFSCM0FSCrxs71o6RrZ9MpP4D.jpg",
                },
                },
            ],
            }
        ],
        ).choices[0].message.content

        caption = self.client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
            "role": "user",
            "content": [
                {"type": "text", "text": "Generate short funny caption based on this context"},
                {"type": "text", "text": f"{front_caption}"},
                {"type": "text", "text": f"{back_caption}"},
            ],
            }
        ],
        ).choices[0].message.content

        return caption
