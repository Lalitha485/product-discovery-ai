import json
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

load_dotenv()

app = FastAPI(title="Product Discovery API")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("products.json") as f:
    products = json.load(f)

class Query(BaseModel):
    query: str

@app.get("/api/products")
def get_products(category: str = None):
    if category:
        return [p for p in products if p["category"].lower() == category.lower()]
    return products

@app.post("/api/ask")
def ask_ai(query: Query):
    prompt = f"""
You are a product recommendation assistant.

Product Catalog:
{products}

User Query:
"{query.query}"

Return ONLY valid JSON:
{{
  "productIds": ["id1", "id2"],
  "summary": "short explanation"
}}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )

        content = response.choices[0].message.content
        return json.loads(content)

    except Exception:
        raise HTTPException(
            status_code=502,
            detail="AI service temporarily unavailable"
        )
