import os
from openai import AsyncOpenAI
from typing import List

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


async def generate_historical_chat(figure: str, message: str) -> str:
    if not os.getenv("OPENAI_API_KEY"):
        return f"As {figure}, I would say: This is a mock response since no OpenAI API key is configured."
    
    try:
        system = f"You are {figure}, a historical figure. Answer in-character with historical context."
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": message},
            ],
            max_tokens=300
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"As {figure}, I apologize but I cannot respond right now: {str(e)}"


async def generate_story(context: str) -> str:
    if not os.getenv("OPENAI_API_KEY"):
        return "This is a mock historical story since no OpenAI API key is configured."
    
    try:
        system = "You are a creative historical narrator. Produce an immersive short story based on context."
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": context}
            ],
            max_tokens=700
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"A historical story could not be generated: {str(e)}"
