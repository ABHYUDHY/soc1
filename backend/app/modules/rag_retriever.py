from __future__ import annotations

from app.modules.rag_knowledge_base import KNOWLEDGE_BASE


def retrieve_context(query: str, top_k: int = 3) -> list[str]:
    q = query.lower()
    scored = []
    for doc in KNOWLEDGE_BASE:
        score = sum(1 for token in q.split() if token in doc.content.lower() or token in doc.title.lower())
        scored.append((score, doc))
    ranked = [doc for score, doc in sorted(scored, key=lambda x: x[0], reverse=True) if score > 0]
    if not ranked:
        ranked = KNOWLEDGE_BASE[:top_k]
    return [f"{d.title}: {d.content}" for d in ranked[:top_k]]
