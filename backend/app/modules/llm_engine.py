from __future__ import annotations

import httpx


class LLMEngine:
    def __init__(self, model: str = "mistral:7b", endpoint: str = "http://ollama:11434/api/generate") -> None:
        self.model = model
        self.endpoint = endpoint

    async def analyze(self, prompt: str) -> str:
        payload = {"model": self.model, "prompt": prompt, "stream": False}
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(self.endpoint, json=payload)
                response.raise_for_status()
                return response.json().get("response", "No response")
        except Exception:
            return "Fallback analysis: potential intrusion requiring analyst review and host containment."
