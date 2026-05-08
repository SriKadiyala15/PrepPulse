import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
_ENV_PATH = Path(__file__).with_name('.env')
load_dotenv(dotenv_path=_ENV_PATH, override=True, encoding='utf-8-sig')

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY not found in environment. Please set it in backend/.env")

genai.configure(api_key=api_key)
models=[m.name for m in genai.list_models() if getattr(m,"supported_generation_methods",None) and "generateContent" in m.supported_generation_methods]
print("\n".join(models))
